import React, { useState } from 'react';
import { GroupProject, GroupTask, GroupMember } from '../types';
import { UserSession } from '../utils/authStore';
import { 
  openInGmailWeb, 
  openInMailto, 
  copyEmailToClipboard, 
  buildReminderEmailSubject, 
  buildReminderEmailBody,
  EmailReminderData
} from '../utils/emailService';
import { 
  Users, 
  Sparkles, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Share2, 
  Copy,
  Check, 
  Mail, 
  ExternalLink, 
  ShieldCheck, 
  KeyRound, 
  FolderPlus, 
  UserPlus, 
  Layers,
  ChevronDown
} from 'lucide-react';

interface GroupWorkAllocatorProps {
  project: GroupProject;
  allGroups: GroupProject[];
  currentSession: UserSession;
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: (data: { title: string; subjectCode: string; description?: string; deadline?: string }) => void;
  onJoinGroup: (code: string) => { ok: boolean; error?: string; alreadyMember?: boolean };
  onUpdateTaskStatus: (taskId: string, newStatus: GroupTask['status']) => void;
  onAddTask: (task: Omit<GroupTask, 'id'>) => void;
  onRecordReminder: (taskId: string) => void;
  activeNudgeTarget: { memberName: string; taskTitle: string } | null;
  onClearNudgeTarget: () => void;
}

export const GroupWorkAllocator: React.FC<GroupWorkAllocatorProps> = ({
  project,
  allGroups,
  currentSession,
  onSelectGroup,
  onCreateGroup,
  onJoinGroup,
  onUpdateTaskStatus,
  onAddTask,
  onRecordReminder,
  activeNudgeTarget,
  onClearNudgeTarget,
}) => {
  // Modals
  const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState<boolean>(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [showCodeShareModal, setShowCodeShareModal] = useState<boolean>(false);

  // Form states for New Group
  const [newGroupTitle, setNewGroupTitle] = useState<string>('');
  const [newGroupSubject, setNewGroupSubject] = useState<string>('CS302');
  const [newGroupDeadline, setNewGroupDeadline] = useState<string>('อีก 7 วัน (20:00 น.)');
  const [newGroupDesc, setNewGroupDesc] = useState<string>('');

  // Form state for Join Group
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [joinError, setJoinError] = useState<string>('');

  // Form states for New Task
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDesc, setNewTaskDesc] = useState<string>('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState<string>(project.members[0]?.id || '');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('อีก 3 วัน 18:00 น.');
  const [newTaskHours, setNewTaskHours] = useState<number>(4);
  const [newTaskPriority, setNewTaskPriority] = useState<GroupTask['priority']>('medium');

  // Nudge / Email Modal State
  const [selectedTaskForNudge, setSelectedTaskForNudge] = useState<GroupTask | null>(() => {
    if (activeNudgeTarget) {
      return project.tasks.find(t => t.title.includes(activeNudgeTarget.taskTitle)) || project.tasks[0] || null;
    }
    return null;
  });

  const [nudgeTone, setNudgeTone] = useState<'gentle' | 'formal' | 'urgent'>('gentle');
  const [customEmailNote, setCustomEmailNote] = useState<string>('');
  const [isCopiedCode, setIsCopiedCode] = useState<boolean>(false);
  const [isCopiedEmail, setIsCopiedEmail] = useState<boolean>(false);
  const [reminderSentFeedback, setReminderSentFeedback] = useState<string | null>(null);

  // Kanban Columns
  const columns: { key: GroupTask['status']; label: string; color: string; count: number }[] = [
    { key: 'todo', label: 'ยังไม่เริ่ม (To Do)', color: 'bg-stone-100 text-stone-700', count: project.tasks.filter(t => t.status === 'todo').length },
    { key: 'in_progress', label: 'กำลังทำ (In Progress)', color: 'bg-amber-100 text-amber-800', count: project.tasks.filter(t => t.status === 'in_progress').length },
    { key: 'review', label: 'รอตรวจร่วม (Review)', color: 'bg-purple-100 text-purple-800', count: project.tasks.filter(t => t.status === 'review').length },
    { key: 'done', label: 'เสร็จสมบูรณ์ (Done)', color: 'bg-emerald-100 text-emerald-800', count: project.tasks.filter(t => t.status === 'done').length },
  ];

  // Helper to find member by id or email
  const getAssignee = (assignedId: string, assignedEmail?: string): GroupMember => {
    if (assignedEmail) {
      const byEmail = project.members.find(m => m.email.toLowerCase() === assignedEmail.toLowerCase());
      if (byEmail) return byEmail;
    }
    const byId = project.members.find(m => m.id === assignedId);
    if (byId) return byId;

    return {
      id: assignedId,
      email: assignedEmail || 'student@university.ac.th',
      name: 'สมาชิกกลุ่ม',
      role: 'สมาชิก',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assignedTasksCount: 0,
      workloadPercentage: 0
    };
  };

  // Helper to generate current email reminder data
  const buildCurrentEmailData = (task: GroupTask): EmailReminderData => {
    const assignee = getAssignee(task.assignedTo, task.assignedToEmail);
    return {
      toEmail: assignee.email,
      toName: assignee.name,
      taskTitle: task.title,
      dueDate: task.dueDate,
      projectName: project.title,
      subjectCode: project.subjectCode,
      senderName: currentSession.displayName,
      senderEmail: currentSession.email,
      tone: nudgeTone,
      customNote: customEmailNote.trim()
    };
  };

  // Actions
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(project.code);
      setIsCopiedCode(true);
      setTimeout(() => setIsCopiedCode(false), 2500);
    } catch {
      alert(`รหัสกลุ่มคือ: ${project.code}`);
    }
  };

  const handleCopyInviteMessage = async () => {
    const text = `เพื่อนๆ เข้าร่วมกลุ่มโปรเจกต์ "${project.title}" ใน UniSync AI กัน! กรอกรหัสเข้าร่วมกลุ่ม: ${project.code}`;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopiedCode(true);
      setTimeout(() => setIsCopiedCode(false), 2500);
    } catch {
      alert(text);
    }
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;

    onCreateGroup({
      title: newGroupTitle.trim(),
      subjectCode: newGroupSubject.trim(),
      deadline: newGroupDeadline.trim(),
      description: newGroupDesc.trim()
    });

    setNewGroupTitle('');
    setShowCreateGroupModal(false);
    setShowCodeShareModal(true);
  };

  const handleJoinGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');

    if (!joinCodeInput.trim()) {
      setJoinError('กรุณากรอกรหัสกลุ่ม');
      return;
    }

    const result = onJoinGroup(joinCodeInput.trim());
    if (!result.ok) {
      setJoinError(result.error || 'ไม่พบกลุ่มสำหรับรหัสนี้');
      return;
    }

    setJoinCodeInput('');
    setShowJoinGroupModal(false);
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assignee = project.members.find(m => m.id === newTaskAssigneeId) || project.members[0];

    onAddTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'งานสำหรับโปรเจกต์ไฟนอล',
      assignedTo: assignee.id,
      assignedToEmail: assignee.email,
      assignedToName: assignee.name,
      dueDate: newTaskDueDate.trim(),
      daysLeft: 3,
      status: 'todo',
      priority: newTaskPriority,
      estimatedHours: newTaskHours
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowNewTaskModal(false);
  };

  // Reminder Actions
  const handleOpenGmail = (task: GroupTask) => {
    const data = buildCurrentEmailData(task);
    openInGmailWeb(data);
    onRecordReminder(task.id);
    setReminderSentFeedback(`เปิดหน้าต่างส่งอีเมล Gmail ไปยัง ${data.toEmail} เรียบร้อยแล้ว!`);
  };

  const handleOpenMailto = (task: GroupTask) => {
    const data = buildCurrentEmailData(task);
    openInMailto(data);
    onRecordReminder(task.id);
    setReminderSentFeedback(`เปิดโปรแกรมรับส่งอีเมลไปยัง ${data.toEmail} เรียบร้อยแล้ว!`);
  };

  const handleCopyEmailText = async (task: GroupTask) => {
    const data = buildCurrentEmailData(task);
    const ok = await copyEmailToClipboard(data);
    if (ok) {
      setIsCopiedEmail(true);
      setTimeout(() => setIsCopiedEmail(false), 2500);
      onRecordReminder(task.id);
      setReminderSentFeedback('คัดลอกข้อความอีเมลลงคลิปบอร์ดแล้ว!');
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      
      {/* 🧭 Top Group Bar: Group Switcher & Invite Code */}
      <div className="paper-surface rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Group Identity & Switcher */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                วิชา {project.subjectCode}
              </span>

              {/* Group Invite Code Pill */}
              <div className="flex items-center space-x-1.5 px-3 py-0.5 bg-emerald-50 border border-emerald-300 rounded-full text-xs font-bold text-emerald-800">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                <span>รหัสกลุ่ม:</span>
                <span className="tracking-wider font-mono text-emerald-950 font-extrabold">{project.code}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="ml-1 p-0.5 hover:text-emerald-950 transition-colors"
                  title="คัดลอกรหัสชวนเพื่อน"
                >
                  {isCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <span className="text-xs text-rose-600 font-semibold flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> เหลือเวลา {project.daysRemaining} วันส่งงาน
              </span>
            </div>

            {/* Title & Group Switcher Dropdown */}
            <div className="flex items-center space-x-3 mt-1.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {project.title}
              </h1>

              {/* Switch groups if multiple exist */}
              {allGroups.length > 1 && (
                <div className="relative">
                  <select
                    value={project.id}
                    onChange={(e) => onSelectGroup(e.target.value)}
                    className="text-xs bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 cursor-pointer focus:outline-none"
                  >
                    {allGroups.map(g => (
                      <option key={g.id} value={g.id}>
                        สลับกลุ่ม: {g.title} ({g.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              {project.description || 'ระบบจัดสรรภาระงานและส่งอีเมลแจ้งเตือนงานกลุ่มอัตโนมัติ สุภาพ ไร้ความขัดแย้ง'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Share Code Button */}
            <button
              onClick={() => setShowCodeShareModal(true)}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 transition-all flex items-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>แชร์รหัสให้เพื่อน</span>
            </button>

            {/* Join Group Button */}
            <button
              onClick={() => { setShowJoinGroupModal(true); setJoinError(''); }}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl border border-stone-200 transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>เข้าร่วมกลุ่มด้วยรหัส</span>
            </button>

            {/* Create Group Button */}
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl border border-stone-200 transition-all flex items-center space-x-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5 text-brand-600" />
              <span>+ สร้างกลุ่มใหม่</span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มงานใหม่</span>
            </button>
          </div>

        </div>

        {/* 👥 Real Members Workload Distribution */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-800 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>สมาชิกในกลุ่มนี้ ({project.members.length} คน) • สัดส่วนงานที่ได้รับมอบหมาย</span>
            </span>
            <span className="text-slate-500 font-semibold">
              ความคืบหน้ารวม: <span className="text-brand-600 font-bold">{project.overallProgress}%</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {project.members.map((member) => {
              const isCurrentUser = member.email.toLowerCase() === currentSession.email.toLowerCase();

              return (
                <div 
                  key={member.id} 
                  className={`border rounded-xl p-3 flex items-center justify-between transition-all ${
                    isCurrentUser ? 'bg-brand-50/40 border-brand-200' : 'bg-stone-50 border-stone-200/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-stone-200"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {member.name} {isCurrentUser && <span className="text-[10px] text-brand-600 font-normal">(ฉัน)</span>}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate flex items-center space-x-1">
                        <Mail className="w-2.5 h-2.5 text-slate-400 shrink-0 inline" />
                        <span>{member.email}</span>
                      </p>
                      <p className="text-[10px] text-brand-700 font-medium">
                        {member.assignedTasksCount} งาน ({member.workloadPercentage}%)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🚀 Feature Banner: Email Nudge Bot */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5 shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-950">
              ระบบส่งอีเมลเตือนงานเพื่อนอัตโนมัติ (Polite Email Nudge)
            </h3>
            <p className="text-xs text-blue-800/80 mt-0.5 max-w-2xl leading-relaxed">
              เกรงใจที่จะทวงงานเพื่อนตรงๆ หรือกลัวเพื่อนลืม? คลิกปุ่ม "ส่งเมลเตือน" ที่การ์ดงาน ระบบจะสร้างร่างอีเมลสุภาพพร้อมส่งถึงเพื่อนที่รับผิดชอบงานนั้นทันทีทาง Gmail หรือโปรแกรมเมลเครื่อง
            </p>
          </div>
        </div>

        <div className="text-xs text-blue-900 font-semibold bg-white/80 border border-blue-200 rounded-xl px-3 py-2 shrink-0">
          ✨ เพื่อนจะได้รับเมลแจ้งเตือนพร้อมรายละเอียดงานทันที
        </div>
      </div>

      {/* 📋 Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = project.tasks.filter(t => t.status === col.key);

          return (
            <div key={col.key} className="flex flex-col bg-stone-100/70 border border-stone-200/60 rounded-2xl p-3.5 min-h-[460px]">
              
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {colTasks.length} งาน
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border border-dashed border-stone-300 rounded-xl flex items-center justify-center text-xs text-slate-400">
                    ไม่มีรายการในสถานะนี้
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = getAssignee(task.assignedTo, task.assignedToEmail);
                    const isAssigneeMe = assignee.email.toLowerCase() === currentSession.email.toLowerCase();

                    return (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs hover:border-brand-300 hover:shadow-card transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              task.priority === 'high' 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-stone-100 text-slate-600'
                            }`}>
                              {task.priority === 'high' ? '⚡ ด่วน' : 'ปกติ'}
                            </span>

                            <span className="text-[11px] text-slate-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              ~{task.estimatedHours} ชม.
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-2.5 leading-snug">
                            {task.title}
                          </h4>

                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>

                          <p className="text-[11px] text-slate-400 mt-2 flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-slate-400" />
                            กำหนดส่ง: <span className="font-semibold text-slate-700 ml-1">{task.dueDate}</span>
                          </p>

                          {/* Reminder History Badge */}
                          {task.lastReminderSent && (
                            <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center space-x-1">
                              <Mail className="w-2.5 h-2.5 text-emerald-600" />
                              <span>เตือนทางอีเมลล่าสุด: {task.lastReminderSent} ({task.reminderCount || 1} ครั้ง)</span>
                            </div>
                          )}
                        </div>

                        {/* Assignee & Footer */}
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2 min-w-0 pr-2">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                                {assignee.name} {isAssigneeMe && '(ฉัน)'}
                              </p>
                              <p className="text-[9px] text-slate-400 truncate">{assignee.email}</p>
                            </div>
                          </div>

                          {/* Trigger Email Reminder Button (If not done and not me) */}
                          {task.status !== 'done' && !isAssigneeMe && (
                            <button
                              onClick={() => {
                                setSelectedTaskForNudge(task);
                                setReminderSentFeedback(null);
                              }}
                              className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 text-[11px] font-bold flex items-center space-x-1 shrink-0"
                              title={`ส่งอีเมลแจ้งเตือนถึง ${assignee.email}`}
                            >
                              <Mail className="w-3 h-3 text-blue-600" />
                              <span>ส่งเมลเตือน</span>
                            </button>
                          )}
                        </div>

                        {/* Status Change Selector */}
                        <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                          <span>ย้ายสถานะ:</span>
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as GroupTask['status'])}
                            className="text-[11px] bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          >
                            <option value="todo">ยังไม่เริ่ม (To Do)</option>
                            <option value="in_progress">กำลังทำ (In Progress)</option>
                            <option value="review">รอตรวจ (Review)</option>
                            <option value="done">เสร็จสมบูรณ์ (Done ✅)</option>
                          </select>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ✉️ EMAIL REMINDER MODAL */}
      {selectedTaskForNudge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-elevated border border-stone-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    ส่งอีเมลแจ้งเตือนเพื่อนร่วมทีม
                  </h3>
                  <p className="text-xs text-slate-500">
                    เตือนความจำอย่างสุภาพ พร้อมระบุรายละเอียดงานและกำหนดส่ง
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTaskForNudge(null);
                  onClearNudgeTarget();
                  setReminderSentFeedback(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕ ปิด
              </button>
            </div>

            {/* Target Friend & Task Info */}
            <div className="mt-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">งานที่ติดตาม:</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedTaskForNudge.title}</p>
                <p className="text-[11px] text-slate-500">กำหนดส่ง: {selectedTaskForNudge.dueDate}</p>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ส่งถึงผู้รับผิดชอบ:</span>
                <p className="text-xs font-bold text-blue-700 mt-0.5">
                  {getAssignee(selectedTaskForNudge.assignedTo, selectedTaskForNudge.assignedToEmail).name}
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  {getAssignee(selectedTaskForNudge.assignedTo, selectedTaskForNudge.assignedToEmail).email}
                </p>
              </div>
            </div>

            {/* Select Tone */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                เลือกสไตล์ข้อความ (Tone of Voice):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNudgeTone('gentle')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    nudgeTone === 'gentle'
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-1 ring-blue-600'
                      : 'border-stone-200 text-slate-700 hover:bg-stone-50'
                  }`}
                >
                  <p className="font-bold">🌸 สุภาพ เป็นกันเอง</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">ไม่กดดัน มีน้ำใจ</p>
                </button>

                <button
                  type="button"
                  onClick={() => setNudgeTone('formal')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    nudgeTone === 'formal'
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-1 ring-blue-600'
                      : 'border-stone-200 text-slate-700 hover:bg-stone-50'
                  }`}
                >
                  <p className="font-bold">⚡ กระชับ ทางการ</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">รายงานสถานะชัดเจน</p>
                </button>

                <button
                  type="button"
                  onClick={() => setNudgeTone('urgent')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    nudgeTone === 'urgent'
                      ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold ring-1 ring-rose-600'
                      : 'border-stone-200 text-slate-700 hover:bg-stone-50'
                  }`}
                >
                  <p className="font-bold text-rose-700">⏳ ด่วนก่อนเดดไลน์</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">ใกล้ส่งแล้ว 24 ชม.</p>
                </button>
              </div>
            </div>

            {/* Custom note option */}
            <div className="mt-3">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ข้อความเพิ่มเติม (ไม่บังคับ):
              </label>
              <input
                type="text"
                placeholder="เช่น ไฟล์ดราฟต์อยู่ใน Google Drive โฟลเดอร์กลางนะ..."
                value={customEmailNote}
                onChange={(e) => setCustomEmailNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Live Email Preview Box */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ตัวอย่างอีเมลจริงที่จะถูกส่ง:
              </label>
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line max-h-48 overflow-y-auto">
                <p className="font-bold text-slate-900 pb-1 border-b border-stone-200 mb-2">
                  เรื่อง: {buildReminderEmailSubject(buildCurrentEmailData(selectedTaskForNudge))}
                </p>
                {buildReminderEmailBody(buildCurrentEmailData(selectedTaskForNudge))}
              </div>
            </div>

            {/* Feedback notification if clicked */}
            {reminderSentFeedback && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{reminderSentFeedback}</span>
              </div>
            )}

            {/* Action Buttons: 1-Click Gmail, Mailto, Copy */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => handleCopyEmailText(selectedTaskForNudge)}
                className="w-full sm:w-auto px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                {isCopiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedEmail ? 'คัดลอกข้อความแล้ว' : 'คัดลอกข้อความ'}</span>
              </button>

              <div className="w-full sm:w-auto flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenMailto(selectedTaskForNudge)}
                  className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                  title="เปิดในโปรแกรม Outlook / Windows Mail"
                >
                  เปิดในโปรแกรมเมลเครื่อง
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenGmail(selectedTaskForNudge)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>เปิดส่งใน Gmail ทันที</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ➕ MODAL 1: CREATE NEW GROUP */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateGroupSubmit} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-stone-200">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                <FolderPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">สร้างกลุ่มโปรเจกต์ใหม่</h3>
                <p className="text-xs text-slate-500">ระบบจะสร้างรหัสชวนเพื่อน (Code) ให้อัตโนมัติ</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อโปรเจกต์ / ชื่องานกลุ่ม:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น โครงงานสถาปัตยกรรม CS302 หรือ รายงานการตลาด"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    รหัสวิชา:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น CS302"
                    value={newGroupSubject}
                    onChange={(e) => setNewGroupSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    กำหนดส่งงาน:
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น อีก 5 วัน 20:00 น."
                    value={newGroupDeadline}
                    onChange={(e) => setNewGroupDeadline(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  คำอธิบายหรือเป้าหมายกลุ่ม:
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น แบ่งงานทำสไลด์และรายงานให้เสร็จก่อนสอบไฟนอล"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900">
                👤 คุณจะถูกตั้งเป็น <strong>หัวหน้ากลุ่ม</strong> ด้วยบัญชี <strong>{currentSession.displayName} ({currentSession.email})</strong>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateGroupModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                สร้างกลุ่มและรับรหัส
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🔗 MODAL 2: JOIN GROUP BY CODE */}
      {showJoinGroupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleJoinGroupSubmit} className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-elevated border border-stone-200">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">เข้าร่วมกลุ่มด้วยรหัส</h3>
                <p className="text-xs text-slate-500">กรอกรหัสที่ได้รับจากเพื่อน เช่น SYNC-3020</p>
              </div>
            </div>

            {joinError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{joinError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                รหัสกลุ่ม (Group Code):
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="เช่น SYNC-3020"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="w-full text-center text-lg font-mono font-bold tracking-widest p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                ระบบจะเพิ่มชื่อคุณ ({currentSession.displayName}) เข้าเป็นสมาชิกในกลุ่มทันที
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowJoinGroupModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                เข้าร่วมกลุ่มทันที
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🎉 MODAL 3: CODE SHARE POPUP */}
      {showCodeShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-elevated border border-stone-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-slate-900 text-lg">
              รหัสชวนเพื่อนเข้ากลุ่ม
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              แชร์รหัสนี้ให้เพื่อน เพื่อนจะสามารถเข้ามาร่วมดูงานและรับแจ้งเตือนได้ทันที
            </p>

            <div className="my-5 p-4 bg-stone-50 border border-dashed border-stone-300 rounded-2xl">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                รหัสกลุ่มของคุณ:
              </p>
              <p className="text-2xl font-mono font-extrabold text-brand-600 tracking-wider">
                {project.code}
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCopyInviteMessage}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
              >
                {isCopiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopiedCode ? 'คัดลอกข้อความชวนเพื่อนแล้ว!' : 'คัดลอกข้อความพร้อมรหัสส่งในแชท'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCodeShareModal(false)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                เสร็จสิ้น / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ MODAL 4: ADD TASK */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateTaskSubmit} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-stone-200">
            <h3 className="font-bold text-slate-900 text-base mb-4">
              เพิ่มงานใหม่ในกลุ่ม "{project.title}"
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่องานที่ต้องทำ:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ทำสไลด์บทที่ 3 หรือ สรุปประเด็นข้อสอบ"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  รายละเอียดงาน:
                </label>
                <textarea
                  rows={2}
                  placeholder="ระบุสิ่งที่ต้องส่ง เช่น ไฟล์ PDF สรุป 5 หน้า..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  มอบหมายให้สมาชิกคนไหน (จากที่เข้าร่วมกลุ่มแล้ว):
                </label>
                <select
                  value={newTaskAssigneeId}
                  onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600 bg-white"
                >
                  {project.members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    กำหนดส่ง:
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น อีก 3 วัน 18:00 น."
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    เวลาทำงาน (ชม.):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newTaskHours}
                    onChange={(e) => setNewTaskHours(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ระดับความสำคัญ:
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setNewTaskPriority('medium')}
                    className={`flex-1 py-1.5 text-xs rounded-lg border font-semibold ${
                      newTaskPriority === 'medium' ? 'bg-stone-200 text-slate-800 border-stone-400' : 'border-stone-200 text-slate-500'
                    }`}
                  >
                    ปกติ
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTaskPriority('high')}
                    className={`flex-1 py-1.5 text-xs rounded-lg border font-semibold ${
                      newTaskPriority === 'high' ? 'bg-rose-50 text-rose-700 border-rose-300' : 'border-stone-200 text-slate-500'
                    }`}
                  >
                    ⚡ ด่วนมาก
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                บันทึกงาน
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
