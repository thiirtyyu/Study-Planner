import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  LayoutDashboard, 
  Sparkles, 
  Presentation, 
  Flame, 
  Crown,
  LogOut,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { UserSession, quickSwitchUser, getAllUsers } from '../utils/authStore';

interface NavbarProps {
  currentTab: 'dashboard' | 'summarizer' | 'groupwork' | 'pitch';
  setCurrentTab: (tab: 'dashboard' | 'summarizer' | 'groupwork' | 'pitch') => void;
  onOpenPricing: () => void;
  daysToFinal: number;
  session: UserSession;
  onLogout: () => void;
  onSessionChange: (newSession: UserSession) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenPricing,
  daysToFinal,
  session,
  onLogout,
  onSessionChange,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const allUsers = getAllUsers();

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleSwitchToUser = (targetEmail: string) => {
    const newSession = quickSwitchUser(targetEmail);
    if (newSession) {
      onSessionChange(newSession);
      setShowUserMenu(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                  UniSync <span className="text-brand-600">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                  Campus v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ระบบสรุปเลกเชอร์ 15 นาที & จัดการงานกลุ่มด้วยอีเมล ไร้ความขัดแย้ง
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-200/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ภาพรวม</span>
            </button>

            <button
              onClick={() => setCurrentTab('summarizer')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'summarizer'
                  ? 'bg-white text-brand-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>สรุปสไลด์</span>
            </button>

            <button
              onClick={() => setCurrentTab('groupwork')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'groupwork'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-200/60'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>งานกลุ่ม & รหัสแชร์</span>
            </button>

            <button
              onClick={() => setCurrentTab('pitch')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'pitch'
                  ? 'bg-brand-600 text-white shadow-sm font-semibold'
                  : 'text-amber-800 bg-amber-50/80 hover:bg-amber-100/80'
              }`}
            >
              <Presentation className="w-4 h-4 text-amber-500" />
              <span>AI Pitch Deck</span>
            </button>
          </nav>

          {/* Right: Countdown + Pricing + User */}
          <div className="flex items-center space-x-3">
            {/* Countdown Pill */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200/70 rounded-full text-xs font-semibold text-amber-900">
              <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>อีก {daysToFinal} วัน สอบไฟนอล</span>
            </div>

            {/* Pricing Button */}
            <button
              onClick={onOpenPricing}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-brand-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Pro 99฿/ด.</span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 pl-2 border-l border-stone-200 hover:bg-stone-50 rounded-xl px-2.5 py-1.5 transition-colors border border-transparent hover:border-stone-200"
              >
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  {getInitials(session.displayName)}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-semibold text-slate-800 leading-tight flex items-center">
                    <span>{session.displayName}</span>
                    <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
                  </p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                    {session.email}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl border border-stone-200 shadow-lg py-2.5 z-50 animate-in fade-in slide-in-from-top-1">
                  
                  {/* Current User Info */}
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">กำลังเข้าสู่ระบบเป็น</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{session.displayName}</p>
                    <p className="text-xs text-slate-500 font-mono truncate">{session.email}</p>
                    {session.faculty && (
                      <p className="text-[11px] text-brand-700 mt-0.5">ปี {session.year} • {session.faculty}</p>
                    )}
                  </div>

                  {/* Quick Switch Account Section */}
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>สลับบัญชีเพื่อน (ทดสอบในเครื่องเดียว):</span>
                    </p>
                    <div className="space-y-1">
                      {allUsers
                        .filter(u => u.email.toLowerCase() !== session.email.toLowerCase())
                        .map(u => (
                          <button
                            key={u.email}
                            onClick={() => handleSwitchToUser(u.email)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-stone-100 transition-colors flex items-center justify-between"
                          >
                            <span className="font-semibold text-slate-800">{u.displayName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{u.email.split('@')[0]}</span>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-stone-200 text-xs">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`py-1 px-2 font-medium ${currentTab === 'dashboard' ? 'text-brand-600 font-bold' : 'text-slate-600'}`}
          >
            ภาพรวม
          </button>
          <button
            onClick={() => setCurrentTab('summarizer')}
            className={`py-1 px-2 font-medium ${currentTab === 'summarizer' ? 'text-brand-600 font-bold' : 'text-slate-600'}`}
          >
            สรุปสไลด์
          </button>
          <button
            onClick={() => setCurrentTab('groupwork')}
            className={`py-1 px-2 font-medium ${currentTab === 'groupwork' ? 'text-brand-600 font-bold' : 'text-slate-600'}`}
          >
            งานกลุ่ม & รหัส
          </button>
          <button
            onClick={() => setCurrentTab('pitch')}
            className={`py-1 px-2 font-medium ${currentTab === 'pitch' ? 'text-amber-700 font-bold' : 'text-slate-600'}`}
          >
            Pitch
          </button>
        </div>
      </div>
    </header>
  );
};
