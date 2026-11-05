import { GroupProject, GroupMember, GroupTask } from '../types';
import { UserSession } from './authStore';

const GROUPS_STORAGE_KEY = 'unisync_study_groups';
const ACTIVE_GROUP_ID_KEY = 'unisync_active_group_id';

// Default initial project for CS302 with invite code SYNC-3020
const DEFAULT_INITIAL_GROUPS: GroupProject[] = [
  {
    id: 'proj-1',
    code: 'SYNC-3020',
    title: 'โครงงานสถาปัตยกรรมระบบ UniHub (CS302 Final)',
    subjectCode: 'CS302',
    subjectName: 'สถาปัตยกรรมซอฟต์แวร์และคลาวด์คอมพิวติง',
    description: 'โปรเจกต์กลุ่มออกแบบระบบ Microservices และทำสไลด์นำเสนอช่วงสัปดาห์สอบไฟนอล',
    deadline: '10 พ.ย. 2026 (เหลืออีก 5 วัน)',
    daysRemaining: 5,
    overallProgress: 40,
    createdByEmail: 'karn@student.ku.th',
    createdByName: 'กานต์ ว.',
    createdAt: '2026-11-01T10:00:00.000Z',
    members: [
      {
        id: 'mem-karn',
        email: 'karn@student.ku.th',
        name: 'กานต์ ว. (หัวหน้า)',
        role: 'Project Lead & Architecture',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        faculty: 'วิศวกรรมศาสตร์',
        year: '3',
        assignedTasksCount: 2,
        workloadPercentage: 40,
        lineStatus: 'online'
      },
      {
        id: 'mem-belle',
        email: 'belle@student.ku.th',
        name: 'เบลล์ ช.',
        role: 'UI/UX & Frontend',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        faculty: 'บริหารธุรกิจ',
        year: '3',
        assignedTasksCount: 1,
        workloadPercentage: 30,
        lineStatus: 'online'
      },
      {
        id: 'mem-pete',
        email: 'pete@student.ku.th',
        name: 'พีท ภ.',
        role: 'Database Schema & API',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        faculty: 'วิทยาการคอมพิวเตอร์',
        year: '3',
        assignedTasksCount: 1,
        workloadPercentage: 30,
        lineStatus: 'busy'
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'ออกแบบแผนผัง System Architecture (Microservices + Event-Driven)',
        description: 'วาดไดอะแกรมระบุ Database per Service และลำดับการรับส่ง Event ของระบบ',
        assignedTo: 'mem-karn',
        assignedToEmail: 'karn@student.ku.th',
        assignedToName: 'กานต์ ว. (หัวหน้า)',
        dueDate: 'พรุ่งนี้ 20:00 น.',
        daysLeft: 1,
        status: 'review',
        priority: 'high',
        estimatedHours: 6
      },
      {
        id: 'task-2',
        title: 'ออกแบบโครงสร้างฐานข้อมูล ER-Diagram และ API Spec',
        description: 'กำหนดตาราง Users, Enrollments, Summaries และ Quizzes ให้รองรับการสเกล',
        assignedTo: 'mem-pete',
        assignedToEmail: 'pete@student.ku.th',
        assignedToName: 'พีท ภ.',
        dueDate: 'อีก 2 วัน 18:00 น.',
        daysLeft: 2,
        status: 'in_progress',
        priority: 'high',
        estimatedHours: 5,
        lastReminderSent: 'เมื่อวานนี้ 19:30 น.',
        reminderCount: 1
      },
      {
        id: 'task-3',
        title: 'พัฒนาหน้าจอ Interactive UI ตาม Design System',
        description: 'เขียนโค้ด React สำหรับหน้าสรุปเนื้อหาและหน้าบอร์ดแบ่งงานกลุ่มให้เสร็จสมบูรณ์',
        assignedTo: 'mem-belle',
        assignedToEmail: 'belle@student.ku.th',
        assignedToName: 'เบลล์ ช.',
        dueDate: 'อีก 3 วัน 12:00 น.',
        daysLeft: 3,
        status: 'in_progress',
        priority: 'medium',
        estimatedHours: 8
      },
      {
        id: 'task-4',
        title: 'จัดทำสไลด์นำเสนอ Final 15 หน้า และซ้อมพรีเซนต์',
        description: 'รวมข้อสรุปปัญหา Insight ทางออก และผลกระทบเชิงบวกที่วัดผลได้เข้าสู่ Template',
        assignedTo: 'mem-karn',
        assignedToEmail: 'karn@student.ku.th',
        assignedToName: 'กานต์ ว. (หัวหน้า)',
        dueDate: 'อีก 4 วัน 23:59 น.',
        daysLeft: 4,
        status: 'todo',
        priority: 'high',
        estimatedHours: 5
      }
    ]
  }
];

function recalculateMetrics(group: GroupProject): GroupProject {
  const tasks = group.tasks || [];
  const members = group.members || [];
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Calculate workload per member based on total estimated hours
  const totalHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 3), 0);

  const updatedMembers = members.map(m => {
    const memberTasks = tasks.filter(t => t.assignedTo === m.id || (m.email && t.assignedToEmail === m.email));
    const memberHours = memberTasks.reduce((sum, t) => sum + (t.estimatedHours || 3), 0);
    const percentage = totalHours > 0 ? Math.round((memberHours / totalHours) * 100) : Math.round(100 / Math.max(1, members.length));

    return {
      ...m,
      assignedTasksCount: memberTasks.length,
      workloadPercentage: percentage
    };
  });

  return {
    ...group,
    members: updatedMembers,
    overallProgress: progress
  };
}

export function getAllGroups(): GroupProject[] {
  try {
    const raw = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_GROUPS));
      return DEFAULT_INITIAL_GROUPS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_GROUPS));
      return DEFAULT_INITIAL_GROUPS;
    }
    return parsed.map(recalculateMetrics);
  } catch {
    return DEFAULT_INITIAL_GROUPS;
  }
}

function saveGroups(groups: GroupProject[]): void {
  const calculated = groups.map(recalculateMetrics);
  localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(calculated));
  // Notify other tabs or components
  window.dispatchEvent(new Event('unisync_groups_updated'));
}

export function getActiveGroupId(): string {
  const groups = getAllGroups();
  const savedId = localStorage.getItem(ACTIVE_GROUP_ID_KEY);
  if (savedId && groups.some(g => g.id === savedId)) {
    return savedId;
  }
  return groups[0]?.id || 'proj-1';
}

export function setActiveGroupId(id: string): void {
  localStorage.setItem(ACTIVE_GROUP_ID_KEY, id);
  window.dispatchEvent(new Event('unisync_groups_updated'));
}

export function getGroupByCode(code: string): GroupProject | null {
  const groups = getAllGroups();
  const cleanCode = code.trim().toUpperCase().replace(/[\s-]/g, '');
  return groups.find(g => g.code.replace(/[\s-]/g, '').toUpperCase() === cleanCode) || null;
}

/**
 * Creates a brand new group with an auto-generated invite code like SYNC-4821
 */
export function createNewGroup(
  data: {
    title: string;
    subjectCode: string;
    description?: string;
    deadline?: string;
  },
  creator: UserSession
): GroupProject {
  const groups = getAllGroups();
  
  // Generate a memorable 4-digit code e.g. SYNC-8421
  let code = '';
  let isUnique = false;
  while (!isUnique) {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    code = `SYNC-${randNum}`;
    if (!groups.some(g => g.code === code)) {
      isUnique = true;
    }
  }

  const creatorMember: GroupMember = {
    id: `mem-${Date.now()}`,
    email: creator.email,
    name: creator.displayName,
    role: 'ผู้สร้างกลุ่ม (Leader)',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(creator.displayName)}&backgroundColor=2563eb`,
    faculty: creator.faculty,
    year: creator.year,
    assignedTasksCount: 0,
    workloadPercentage: 100,
    lineStatus: 'online',
    joinedAt: new Date().toISOString()
  };

  const newGroup: GroupProject = {
    id: `proj-${Date.now()}`,
    code: code,
    title: data.title.trim(),
    subjectCode: data.subjectCode.trim().toUpperCase() || 'GEN101',
    description: data.description?.trim() || 'งานกลุ่มที่สร้างเพื่อจัดสรรงานและติดตามเดดไลน์',
    deadline: data.deadline?.trim() || 'อีก 7 วัน (20:00 น.)',
    daysRemaining: 7,
    overallProgress: 0,
    createdByEmail: creator.email,
    createdByName: creator.displayName,
    createdAt: new Date().toISOString(),
    members: [creatorMember],
    tasks: []
  };

  groups.unshift(newGroup);
  saveGroups(groups);
  setActiveGroupId(newGroup.id);

  return newGroup;
}

/**
 * Joins an existing group using an invite code
 */
export function joinGroupByCode(
  code: string,
  user: UserSession
): { ok: boolean; group?: GroupProject; error?: string; alreadyMember?: boolean } {
  const groups = getAllGroups();
  const cleanCode = code.trim().toUpperCase().replace(/[\s-]/g, '');

  const groupIndex = groups.findIndex(
    g => g.code.replace(/[\s-]/g, '').toUpperCase() === cleanCode
  );

  if (groupIndex === -1) {
    return {
      ok: false,
      error: `ไม่พบกลุ่มสำหรับรหัส "${code}" กรุณาตรวจสอบรหัสชวนเพื่อนอีกครั้ง (เช่น SYNC-3020)`
    };
  }

  const group = groups[groupIndex];

  // Check if user is already a member
  const existingMember = group.members.find(
    m => m.email.toLowerCase() === user.email.toLowerCase()
  );

  if (existingMember) {
    setActiveGroupId(group.id);
    return { ok: true, group, alreadyMember: true };
  }

  // Add new member
  const newMember: GroupMember = {
    id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: user.email,
    name: user.displayName,
    role: 'สมาชิกกลุ่ม',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName)}&backgroundColor=059669`,
    faculty: user.faculty,
    year: user.year,
    assignedTasksCount: 0,
    workloadPercentage: 0,
    lineStatus: 'online',
    joinedAt: new Date().toISOString()
  };

  group.members.push(newMember);
  groups[groupIndex] = recalculateMetrics(group);
  saveGroups(groups);
  setActiveGroupId(group.id);

  return { ok: true, group: groups[groupIndex], alreadyMember: false };
}

/**
 * Adds a new task to a specific group
 */
export function addTaskToGroup(
  groupId: string,
  taskData: Omit<GroupTask, 'id'>
): GroupProject | null {
  const groups = getAllGroups();
  const group = groups.find(g => g.id === groupId);
  if (!group) return null;

  // Find assignee name and email
  const assignee = group.members.find(m => m.id === taskData.assignedTo);

  const newTask: GroupTask = {
    ...taskData,
    id: `task-${Date.now()}`,
    assignedToEmail: assignee?.email || '',
    assignedToName: assignee?.name || 'สมาชิกกลุ่ม'
  };

  group.tasks.unshift(newTask);
  saveGroups(groups);
  return group;
}

/**
 * Updates task status in a specific group
 */
export function updateTaskStatusInGroup(
  groupId: string,
  taskId: string,
  newStatus: GroupTask['status']
): GroupProject | null {
  const groups = getAllGroups();
  const group = groups.find(g => g.id === groupId);
  if (!group) return null;

  group.tasks = group.tasks.map(t => 
    t.id === taskId ? { ...t, status: newStatus } : t
  );

  saveGroups(groups);
  return group;
}

/**
 * Records that an email reminder was sent for a task
 */
export function recordTaskReminder(
  groupId: string,
  taskId: string
): GroupProject | null {
  const groups = getAllGroups();
  const group = groups.find(g => g.id === groupId);
  if (!group) return null;

  const nowString = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

  group.tasks = group.tasks.map(t => {
    if (t.id === taskId) {
      return {
        ...t,
        lastReminderSent: nowString,
        reminderCount: (t.reminderCount || 0) + 1
      };
    }
    return t;
  });

  saveGroups(groups);
  return group;
}

/**
 * Deletes a task from a group
 */
export function deleteTaskFromGroup(
  groupId: string,
  taskId: string
): GroupProject | null {
  const groups = getAllGroups();
  const group = groups.find(g => g.id === groupId);
  if (!group) return null;

  group.tasks = group.tasks.filter(t => t.id !== taskId);
  saveGroups(groups);
  return group;
}
