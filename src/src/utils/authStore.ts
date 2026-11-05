/**
 * Persistent Auth Store using localStorage
 * Manages user registration, login, auto-session, and quick-switching for testing
 */

export interface UserAccount {
  email: string;
  displayName: string;
  faculty: string;
  year: string;
  password: string;
  createdAt: string;
}

export interface UserSession {
  email: string;
  displayName: string;
  faculty: string;
  year: string;
  isLoggedIn: boolean;
  rememberMe?: boolean;
}

const USERS_KEY = 'unisync_users';
const SESSION_KEY = 'unisync_session';
const LAST_EMAIL_KEY = 'unisync_last_email';

// Default Demo Accounts for testing collaboration between friends
const DEFAULT_USERS: UserAccount[] = [
  {
    email: 'karn@student.ku.th',
    displayName: 'กานต์ ว.',
    faculty: 'วิศวกรรมศาสตร์ / ไอที',
    year: '3',
    password: '1234',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    email: 'belle@student.ku.th',
    displayName: 'เบลล์ ช.',
    faculty: 'บริหารธุรกิจ / การตลาด',
    year: '3',
    password: '1234',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    email: 'pete@student.ku.th',
    displayName: 'พีท ภ.',
    faculty: 'วิทยาการคอมพิวเตอร์',
    year: '3',
    password: '1234',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      // Seed default demo users
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return parsed;
  } catch {
    return DEFAULT_USERS;
  }
}

export function registerUser(data: {
  email: string;
  displayName: string;
  faculty: string;
  year: string;
  password: string;
}): { ok: boolean; error?: string } {
  const users = getAllUsers();
  const trimmedEmail = data.email.trim().toLowerCase();

  if (users.find(u => u.email.toLowerCase() === trimmedEmail)) {
    return { ok: false, error: 'อีเมลนี้ถูกลงทะเบียนแล้ว กรุณาเข้าสู่ระบบ' };
  }
  if (!trimmedEmail.includes('@')) {
    return { ok: false, error: 'กรุณากรอกอีเมลให้ถูกต้อง (เช่น name@university.ac.th)' };
  }
  if (data.password.length < 3) {
    return { ok: false, error: 'รหัสผ่านต้องมีอย่างน้อย 3 ตัวอักษร' };
  }

  const newUser: UserAccount = {
    ...data,
    email: trimmedEmail,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(LAST_EMAIL_KEY, trimmedEmail);
  return { ok: true };
}

export function loginUser(
  email: string, 
  password: string, 
  rememberMe: boolean = true
): { ok: boolean; session?: UserSession; error?: string } {
  const users = getAllUsers();
  const trimmedEmail = email.trim().toLowerCase();

  const found = users.find(
    u => u.email.toLowerCase() === trimmedEmail && u.password === password
  );

  if (!found) {
    return { ok: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง (ลองตรวจสอบตัวพิมพ์เล็ก-ใหญ่)' };
  }

  const session: UserSession = {
    email: found.email,
    displayName: found.displayName,
    faculty: found.faculty,
    year: found.year,
    isLoggedIn: true,
    rememberMe: rememberMe
  };

  // Persist session to localStorage so browser remembers
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(LAST_EMAIL_KEY, trimmedEmail);

  return { ok: true, session };
}

export function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as UserSession;
    return s && s.isLoggedIn ? s : null;
  } catch {
    return null;
  }
}

export function getLastEmail(): string {
  return localStorage.getItem(LAST_EMAIL_KEY) || 'karn@student.ku.th';
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Quick switch user - extremely helpful when testing collaboration
 * (e.g., test creating group as User A, then switch to User B to join by code)
 */
export function quickSwitchUser(targetEmail: string): UserSession | null {
  const users = getAllUsers();
  const found = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
  if (!found) return null;

  const session: UserSession = {
    email: found.email,
    displayName: found.displayName,
    faculty: found.faculty,
    year: found.year,
    isLoggedIn: true,
    rememberMe: true
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(LAST_EMAIL_KEY, found.email);
  return session;
}
