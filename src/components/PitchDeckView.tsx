import React, { useState } from 'react';
import { PITCH_REQUIREMENT_DATA } from '../data/mockData';
import { 
  FileText, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  Clock,
  Sparkles,
  Users,
  Building2,
  FileSearch
} from 'lucide-react';

export const PitchDeckView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'all' | '1' | '2' | '3' | '4'>('all');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Pitch Header */}
      <div className="paper-surface rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-white via-white to-brand-50/50 border border-stone-200">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-200">
              AI Pitch Requirement Summary
            </span>
            <span className="text-xs text-slate-500">
              เอกสารข้อเสนอโครงการ & แผนธุรกิจเพื่อการนำเสนอ
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            UniSync AI: แพลตฟอร์มผู้ช่วยเรียนและบริหารงานกลุ่มอัตโนมัติ
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            แก้ปัญหา "อ่านหนังสือไม่ทันช่วงสอบ" และ "ความขัดแย้งในการตามงานกลุ่ม" ของนักศึกษามหาวิทยาลัย ด้วยขุมพลัง LLM, Speech AI และตัวกลางเตือนเดดไลน์อัตโนมัติ
          </p>

          {/* Quick Filter Buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'ดูทั้งหมด (Full Pitch)' },
              { id: '1', label: '1. Problem & Insight' },
              { id: '2', label: '2. AI Solution' },
              { id: '3', label: '3. Use Case & Flow' },
              { id: '4', label: '4. Impact & Feasibility' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔴 SECTION 1: PROBLEM & INSIGHT */}
      {(activeSection === 'all' || activeSection === '1') && (
        <div className="paper-surface rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Problem & Insight (ปัญหาและข้อมูลเชิงลึก)
              </h2>
              <p className="text-xs text-slate-500">ที่มาของปัญหา พฤติกรรม และสมมติฐานที่ต้องพิสูจน์</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Target User */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 text-brand-700">
                <Target className="w-4 h-4" />
                <span>ผู้ใช้และเป้าหมาย (Target User)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                {PITCH_REQUIREMENT_DATA.problemAndInsight.targetUser}
              </p>
            </div>

            {/* Current Situation */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 text-amber-700">
                <Clock className="w-4 h-4" />
                <span>สถานการณ์และวิธีปัจจุบัน</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                {PITCH_REQUIREMENT_DATA.problemAndInsight.currentSituation}
              </p>
            </div>

            {/* Core Problem */}
            <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200">
              <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>ปัญหาหลัก (Problem Statement)</span>
              </h3>
              <p className="text-xs sm:text-sm text-rose-950 mt-2 leading-relaxed">
                {PITCH_REQUIREMENT_DATA.problemAndInsight.problem}
              </p>
            </div>

            {/* Evidence */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 text-slate-700">
                <FileSearch className="w-4 h-4 text-slate-600" />
                <span>หลักฐานยืนยัน (Evidence)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                {PITCH_REQUIREMENT_DATA.problemAndInsight.evidence}
              </p>
            </div>
          </div>

          {/* Insight & Hypothesis Highlight */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300">
            <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Insight สำคัญ / สมมติฐานหลัก</span>
            </h3>
            <p className="text-sm font-semibold text-slate-900 mt-2 leading-relaxed">
              "{PITCH_REQUIREMENT_DATA.problemAndInsight.insightHypothesis}"
            </p>
          </div>

          {/* Validation Next Step */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start space-x-3">
            <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-blue-950">
              <span className="font-bold">สิ่งที่ต้องตรวจสอบต่อ (Next Validation): </span>
              {PITCH_REQUIREMENT_DATA.problemAndInsight.nextValidation}
            </div>
          </div>
        </div>
      )}

      {/* 🔵 SECTION 2: AI SOLUTION */}
      {(activeSection === 'all' || activeSection === '2') && (
        <div className="paper-surface rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                AI Solution (เทคโนโลยี AI ที่นำมาประยุกต์ใช้)
              </h2>
              <p className="text-xs text-slate-500">ประเภทของโมเดลและการบูรณาการ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">1. LLM (Large Language Model)</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                วิเคราะห์สไลด์ PDF สกัดใจความสำคัญ จุดออกสอบบ่อย สร้างแบบฝึกหัดเก็งข้อสอบจำลอง และช่วยแตก Task งานกลุ่ม
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">2. Speech AI</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                แปลงเสียงอัดในห้องเรียนยาว 2 ชั่วโมง ให้เป็นข้อความ (STT) และสังเคราะห์เป็นเสียงติวเตอร์สรุปสั้น 3 นาที (TTS)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">3. Recommendation Systems</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                คำนวณการกระจายชั่วโมงภาระงานให้สมาชิกแต่ละคนอย่างเป็นธรรม (Fair Balancer) และแนะนำช่วงเวลาส่ง Nudge ที่เหมาะสม
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🟡 SECTION 3: USE CASE & SCENARIO */}
      {(activeSection === 'all' || activeSection === '3') && (
        <div className="paper-surface rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Use Case / Scenario (สถานการณ์ตัวอย่าง & ลำดับการใช้งาน)
              </h2>
              <p className="text-xs text-slate-500">สถานการณ์วิกฤตสัปดาห์สอบไฟนอล</p>
            </div>
          </div>

          {/* Crisis Scenario Box */}
          <div className="p-5 rounded-2xl bg-stone-900 text-white">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              สถานการณ์จำลอง (Scenario Context)
            </span>
            <p className="text-sm sm:text-base font-medium mt-1 leading-relaxed text-slate-100">
              "{PITCH_REQUIREMENT_DATA.useCaseScenario.scenario}"
            </p>
          </div>

          {/* User Flow Stepper */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              ขั้นตอน / การใช้งาน (User Flow 6 ขั้นตอน)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { step: '01', title: 'เปิด UniSync AI', desc: 'เข้าเว็บและล็อกอินด้วยอีเมลมหาวิทยาลัย' },
                { step: '02', title: 'อัปโหลดสไลด์ / โจทย์', desc: 'อัปโหลด PDF, ไฟล์เสียง หรือโจทย์โปรเจกต์' },
                { step: '03', title: 'เลือกโหมดการทำงาน', desc: 'สรุปเนื้อหา + ข้อสอบ หรือ จัดสรรงานกลุ่มอัตโนมัติ' },
                { step: '04', title: 'AI ประมวลผลผลลัพธ์', desc: 'สร้างชีทสรุป 15 นาที หรือตารางแบ่งงานยุติธรรม' },
                { step: '05', title: 'แชร์ & ตั้งเตือน', desc: 'ส่งแชร์ลิงก์ให้เพื่อน หรือตั้งบอททวงงานอัตโนมัติ' },
                { step: '06', title: 'สอบทัน & ส่งงานครบ', desc: 'เตรียมตัวทัน ไม่เหนื่อยตามงาน ไม่เสียเพื่อน' },
              ].map(item => (
                <div key={item.step} className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 flex items-start space-x-3">
                  <span className="font-mono text-sm font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ผลลัพธ์ที่ได้รับจริง (Outcome)</span>
            </h4>
            <p className="text-xs sm:text-sm text-emerald-950 mt-1.5 leading-relaxed">
              {PITCH_REQUIREMENT_DATA.useCaseScenario.outcome}
            </p>
          </div>
        </div>
      )}

      {/* 🟢 SECTION 4: IMPACT & FEASIBILITY & BUSINESS MODEL */}
      {(activeSection === 'all' || activeSection === '4') && (
        <div className="paper-surface rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Impact, Feasibility & Revenue (ผลกระทบ ความเป็นไปได้ และโมเดลรายได้)
              </h2>
              <p className="text-xs text-slate-500">ตัวชี้วัดความสำเร็จ แผนรับมือความเสี่ยง และโมเดลธุรกิจ</p>
            </div>
          </div>

          {/* Impact 3 Metrics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Impact - ผลกระทบเชิงบวกที่วัดผลได้ (เป้าหมายทดสอบ 3 ด้าน)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PITCH_REQUIREMENT_DATA.impactAndFeasibility.impact.metrics.map((m, idx) => (
                <div key={idx} className="bg-stone-50 border border-stone-200/80 rounded-xl p-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                    {m}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Feasibility & Risk Mitigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                ทรัพยากรที่ใช้ (Resources)
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {PITCH_REQUIREMENT_DATA.impactAndFeasibility.feasibility.resources}
              </p>
            </div>

            <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                ความเสี่ยง & การป้องกัน (Risk & Solution)
              </h4>
              <p className="text-xs text-amber-950 leading-relaxed mb-2">
                <strong>ความเสี่ยง:</strong> {PITCH_REQUIREMENT_DATA.impactAndFeasibility.feasibility.risks}
              </p>
              <p className="text-xs text-emerald-900 font-medium">
                <strong>แนวทางแก้ไข:</strong> {PITCH_REQUIREMENT_DATA.impactAndFeasibility.feasibility.solutions}
              </p>
            </div>
          </div>

          {/* Value & Revenue Model */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-brand-50 border border-emerald-200">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>Value & Revenue - โมเดลความคุ้มค่าและรายได้</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="bg-white/80 p-3.5 rounded-xl border border-stone-200/80">
                <span className="text-[11px] font-bold text-slate-500 uppercase">ผู้ได้รับคุณค่า</span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1">
                  {PITCH_REQUIREMENT_DATA.impactAndFeasibility.valueAndRevenue.valueTarget}
                </p>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-stone-200/80">
                <span className="text-[11px] font-bold text-emerald-700 uppercase">โมเดลรายได้ (Freemium & Campus)</span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1">
                  {PITCH_REQUIREMENT_DATA.impactAndFeasibility.valueAndRevenue.pricingModel}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
