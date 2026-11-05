import React from 'react';
import { Subject, GroupProject } from '../types';
import { 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Play, 
  FileText, 
  Flame, 
  Timer, 
  ChevronRight,
  ShieldCheck,
  Mail,
  KeyRound
} from 'lucide-react';

interface StudentDashboardProps {
  subjects: Subject[];
  groupProject: GroupProject;
  onSelectSubject: (subjectId: string) => void;
  onNavigateToGroup: () => void;
  onNavigateToSummarizer: () => void;
  onTriggerQuickNudge: (memberName: string, taskTitle: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  subjects,
  groupProject,
  onSelectSubject,
  onNavigateToGroup,
  onNavigateToSummarizer,
  onTriggerQuickNudge,
}) => {
  const totalSlides = subjects.reduce((sum, s) => sum + s.slidePages, 0);
  const summarizedCount = subjects.filter(s => s.isSummarized).length;

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* 🔴 Top Scenario Alert Banner */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-300/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs shrink-0 mt-0.5">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  สัปดาห์สอบไฟนอล
                </span>
                <span className="text-xs text-amber-900 font-medium">
                  • เหลือเวลาอีก 5 วันก่อนสอบ
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                สไลด์เรียนรวม 4 วิชา ({totalSlides} หน้า) และโปรเจกต์กลุ่มวิชาบังคับ ({groupProject.title})
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                สรุปประเด็นเน้นๆ อ่านจบใน 15 นาที พร้อมข้อสอบจำลอง และระบบส่งอีเมลเตือนเพื่อนร่วมทีมโดยไม่ต้องเกรงใจ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
            <button
              onClick={onNavigateToSummarizer}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>เริ่มสรุปเนื้อหาทันที</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Key Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="paper-surface p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">เวลาอ่านหนังสือ</span>
            <Timer className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">-50%</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              ประหยัดได้ 18 ชม.
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            สรุปย่อยจบใน 15 นาทีต่อบท
          </p>
        </div>

        {/* Metric 2 */}
        <div className="paper-surface p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">สไลด์ที่พร้อมอ่าน</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {summarizedCount} / {subjects.length} วิชา
            </span>
            <span className="text-xs text-slate-500">
              ({Math.round((summarizedCount / subjects.length) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-brand-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(summarizedCount / subjects.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="paper-surface p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">ส่งงานกลุ่มตรงเวลา</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">&gt; 90%</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              ตามแผนงาน
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            กระจายภาระงานเท่าเทียม ตรวจสอบได้
          </p>
        </div>

        {/* Metric 4 */}
        <div className="paper-surface p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">แจ้งเตือนทางอีเมล</span>
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">1-Click</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              ส่งตรงเข้า Gmail
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            ส่งอีเมลสุภาพ เพื่อนไม่เคือง
          </p>
        </div>

      </div>

      {/* 📚 4 Subjects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              วิชาที่ต้องเตรียมสอบใน 5 วันนี้ (4 วิชา • {totalSlides} หน้า)
            </h3>
            <p className="text-xs text-slate-500">
              คลิกที่วิชาเพื่อเปิดชีทสรุป 15 นาที, ฟังเสียงติวเตอร์ หรือทำข้อสอบจำลอง
            </p>
          </div>
          <button
            onClick={onNavigateToSummarizer}
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>เปิดห้องอ่านหนังสือ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => onSelectSubject(subject.id)}
              className="paper-surface p-5 rounded-2xl hover:border-brand-300 hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.code}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {subject.faculty}
                    </span>
                  </div>
                  
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    subject.daysRemaining <= 5 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-stone-100 text-slate-600'
                  }`}>
                    สอบในอีก {subject.daysRemaining} วัน
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 mt-3 group-hover:text-brand-600 transition-colors line-clamp-1">
                  {subject.name}
                </h4>

                <div className="flex items-center space-x-4 text-xs text-slate-500 mt-3">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{subject.slidePages} หน้าสไลด์</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>สอบ: {subject.examDate}</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {subject.isSummarized ? (
                    <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ชีทสรุป 15 นาทีพร้อม
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Sparkles className="w-3.5 h-3.5 mr-1" /> รอประมวลผล
                    </span>
                  )}

                  {subject.hasAudio && (
                    <span className="inline-flex items-center text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      <Play className="w-3 h-3 mr-1 fill-purple-600" /> พากย์เสียง AI
                    </span>
                  )}
                </div>

                <div className="text-brand-600 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 👥 Urgent Group Project Card */}
      <div className="paper-surface rounded-2xl p-6 border-l-4 border-l-amber-500">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-md">
                โปรเจกต์กลุ่มที่กำลังดำเนินการ
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-md flex items-center space-x-1">
                <KeyRound className="w-3 h-3 text-emerald-600" />
                <span>รหัสกลุ่ม: {groupProject.code}</span>
              </span>
              <span className="text-xs text-rose-600 font-semibold flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> ส่งใน {groupProject.daysRemaining} วัน
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {groupProject.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              วิชา {groupProject.subjectCode} • กำหนดส่ง {groupProject.deadline}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToGroup}
              className="px-4 py-2 bg-stone-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>เปิดกระดานจัดการงานกลุ่ม</span>
            </button>
          </div>
        </div>

        {/* Members Workload Status */}
        <div className="pt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-3">
            <span>สมาชิกในกลุ่ม ({groupProject.members.length} คน)</span>
            <span>ความคืบหน้ารวม {groupProject.overallProgress}%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {groupProject.members.map((member) => {
              const memberTasks = groupProject.tasks.filter(
                t => t.assignedTo === member.id || (member.email && t.assignedToEmail === member.email)
              );
              const pendingTask = memberTasks.find(t => t.status !== 'done');

              return (
                <div key={member.id} className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <img 
                        src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`} 
                        alt={member.name} 
                        className="w-9 h-9 rounded-full object-cover border border-white shadow-xs"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{member.email}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>รับผิดชอบ {member.assignedTasksCount} งาน</span>
                        <span className="font-semibold">{member.workloadPercentage}%</span>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-600 h-full rounded-full" 
                          style={{ width: `${Math.min(100, member.workloadPercentage * 2.5)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Task Status & Nudge Action */}
                  <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                    {pendingTask ? (
                      <>
                        <span className="text-[10px] text-amber-700 font-medium truncate max-w-[120px]" title={pendingTask.title}>
                          ⏳ {pendingTask.title}
                        </span>
                        <button
                          onClick={() => onTriggerQuickNudge(member.name, pendingTask.title)}
                          className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded transition-colors shrink-0 flex items-center space-x-1"
                          title={`ส่งอีเมลแจ้งเตือนถึง ${member.email}`}
                        >
                          <Mail className="w-2.5 h-2.5 inline" />
                          <span>ส่งเมลเตือน</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> เสร็จเรียบร้อย
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
