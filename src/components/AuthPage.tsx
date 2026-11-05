import React, { useState } from 'react';
import { BookOpen, Mail, Lock, User, GraduationCap, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { registerUser, loginUser, getLastEmail, quickSwitchUser, UserSession } from '../utils/authStore';

interface AuthPageProps {
  onLogin: (session: UserSession) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState(() => getLastEmail());
  const [password, setPassword] = useState('1234');
  const [displayName, setDisplayName] = useState('');
  const [faculty, setFaculty] = useState('วิศวกรรมศาสตร์');
  const [year, setYear] = useState('3');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'register') {
      if (!displayName.trim()) {
        setError('กรุณากรอกชื่อ-นามสกุลที่ใช้แสดง');
        return;
      }
      const result = registerUser({
        email,
        displayName: displayName.trim(),
        faculty: faculty.trim(),
        year,
        password
      });

      if (!result.ok) {
        setError(result.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
        return;
      }

      // Auto login after registration
      const loginResult = loginUser(email, password, rememberMe);
      if (loginResult.ok && loginResult.session) {
        setSuccessMsg('ลงทะเบียนสำเร็จ! กำลังเข้าสู่ระบบ...');
        setTimeout(() => {
          onLogin(loginResult.session!);
        }, 400);
      }
    } else {
      const result = loginUser(email, password, rememberMe);
      if (!result.ok) {
        setError(result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        return;
      }
      if (result.session) {
        onLogin(result.session);
      }
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setError('');
    const session = quickSwitchUser(demoEmail);
    if (session) {
      onLogin(session);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        {/* Brand Logo */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-lg mx-auto mb-3">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            UniSync <span className="text-brand-600">AI</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ระบบสรุปเลกเชอร์ 15 นาที & จัดการงานกลุ่มด้วยอีเมล ไร้ความขัดแย้ง
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="mt-6 bg-white py-8 px-6 shadow-sm border border-stone-200/80 rounded-3xl sm:px-8">

          {/* Toggle Login / Register */}
          <div className="flex rounded-xl bg-stone-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              เข้าสู่ระบบ (Sign In)
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ลงทะเบียนใหม่ (Register)
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Display Name (Only in Register mode) */}
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อ-นามสกุล / ชื่อเล่นที่เพื่อนรู้จัก
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น กานต์ ว. หรือ พลอย วิศวะ"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                อีเมล (ใช้สำหรับรับแจ้งเตือนงานกลุ่ม)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="yourname@university.ac.th หรือ gmail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="รหัสผ่านเข้าใช้งาน"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Faculty & Year (Only in Register mode) */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    คณะ / สาขา
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น วิศวะ / บริหาร"
                    value={faculty}
                    onChange={e => setFaculty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    ชั้นปี
                  </label>
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="1">ปี 1</option>
                    <option value="2">ปี 2</option>
                    <option value="3">ปี 3</option>
                    <option value="4">ปี 4</option>
                    <option value="5">ปี 5+</option>
                  </select>
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300"
                />
                <span className="text-xs text-slate-600 font-medium">
                  จดจำการเข้าสู่ระบบในอุปกรณ์นี้
                </span>
              </label>

              {mode === 'login' && (
                <span className="text-[11px] text-slate-400">
                  รหัสผ่านเริ่มต้น: 1234
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-3 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>{mode === 'login' ? 'เข้าสู่ระบบและเริ่มใช้งาน' : 'ลงทะเบียนและสร้างบัญชี'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Quick Demo Login (Perfect for testing group collaboration) */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>หรือคลิกเข้าใช้งานด่วนด้วยบัญชีตัวอย่าง:</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('karn@student.ku.th')}
                className="p-2 rounded-xl border border-stone-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-center"
              >
                <p className="text-xs font-bold text-slate-800">กานต์ ว.</p>
                <p className="text-[10px] text-slate-500">หัวหน้ากลุ่ม</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('belle@student.ku.th')}
                className="p-2 rounded-xl border border-stone-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-center"
              >
                <p className="text-xs font-bold text-slate-800">เบลล์ ช.</p>
                <p className="text-[10px] text-slate-500">สมาชิกทีม</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('pete@student.ku.th')}
                className="p-2 rounded-xl border border-stone-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-center"
              >
                <p className="text-xs font-bold text-slate-800">พีท ภ.</p>
                <p className="text-[10px] text-slate-500">สมาชิกทีม</p>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              💡 ช่วยให้คุณทดสอบสร้างกลุ่มด้วยบัญชีหนึ่ง แล้วสลับไปอีกบัญชีเพื่อกดรหัสเข้าร่วมได้ทันที
            </p>
          </div>

        </div>

        {/* Security / Persistence note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span>ข้อมูลการล็อกอินและงานกลุ่มจะถูกจดจำไว้ตลอดจนกว่าจะกดออกจากระบบ</span>
          </p>
        </div>

      </div>
    </div>
  );
};
