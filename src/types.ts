export interface Subject {
  id: string;
  code: string;
  name: string;
  faculty: string;
  slidePages: number;
  examDate: string;
  daysRemaining: number;
  category: 'วิศวกรรม/ไอที' | 'บริหาร/การตลาด' | 'วิทยาศาสตร์' | 'นิติศาสตร์';
  color: string;
  hasAudio: boolean;
  isSummarized: boolean;
  scoreTarget: string;
}

export interface SummarySection {
  id: string;
  title: string;
  timeToReadMinutes: number;
  keyPoints: string[];
  examTraps: string[];
  formulaOrDefinition?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceSlide: string;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ยาก (เก็งข้อสอบ)';
}

export interface LectureMaterial {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  totalSlides: number;
  audioDurationMinutes: number;
  summarySections: SummarySection[];
  mockQuiz: QuizQuestion[];
  audioScript: string;
}

export interface GroupMember {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  faculty?: string;
  year?: string;
  assignedTasksCount: number;
  workloadPercentage: number;
  lineStatus?: 'online' | 'busy' | 'away';
  joinedAt?: string;
}

export interface GroupTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // member id
  assignedToEmail?: string;
  assignedToName?: string;
  dueDate: string;
  daysLeft: number;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  lastReminderSent?: string;
  reminderCount?: number;
}

export interface GroupProject {
  id: string;
  code: string; // Invite Code (e.g. SYNC-4821)
  title: string;
  subjectCode: string;
  subjectName?: string;
  description?: string;
  deadline: string;
  daysRemaining: number;
  createdByEmail?: string;
  createdByName?: string;
  createdAt?: string;
  members: GroupMember[];
  tasks: GroupTask[];
  overallProgress: number;
}

export interface NudgeTemplate {
  id: string;
  name: string;
  tone: 'gentle' | 'friendly' | 'urgent';
  previewText: string;
}
