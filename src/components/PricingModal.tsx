import React from 'react';
import { Crown, Check, Sparkles, Building2, ShieldCheck } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-elevated border border-stone-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                โมเดลราคาที่เป็นมิตรกับนักศึกษา
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              แพ็กเกจ UniSync AI (Freemium & Campus)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 text-base"
          >
            ✕
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          
          {/* Freemium Plan */}
          <div className="rounded-2xl border border-stone-200 p-5 flex flex-col justify-between bg-stone-50/50">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Basic Free
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">0฿</span>
                <span className="text-xs text-slate-500">/ ตลอดชีพ</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                เหมาะสำหรับการใช้งานทั่วไปตลอดทั้งเทอม
              </p>

              <ul className="space-y-2.5 mt-5 text-xs text-slate-700">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>สรุปสไลด์ PDF 3 วิชาต่อเดือน</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>แบบฝึกหัดเก็งข้อสอบ 5 ข้อต่อวิชา</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>กระดานงานกลุ่ม 1 โปรเจกต์</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-400">
                  <span className="w-4 text-center">✕</span>
                  <span>เสียงติวเตอร์บรรยายสรุป AI</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-slate-700 hover:bg-white transition-colors"
            >
              กำลังใช้งานแพ็กเกจนี้
            </button>
          </div>

          {/* Pro Student Plan (99 บาท/เดือน ช่วงสอบ) */}
          <div className="rounded-2xl border-2 border-brand-600 p-5 flex flex-col justify-between bg-white relative shadow-card">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-[11px] font-bold shadow-xs flex items-center space-x-1">
              <Crown className="w-3 h-3 text-amber-300" />
              <span>สุดคุ้มช่วงสอบไฟนอล</span>
            </span>

            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Pro Exam Pass
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">99฿</span>
                <span className="text-xs text-slate-500">/ เดือน (ยกเลิกได้ทุกเมื่อ)</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                ปลดล็อกทุกฟีเจอร์สำหรับช่วงสอบ 5-10 วันฉุกเฉิน
              </p>

              <ul className="space-y-2.5 mt-5 text-xs text-slate-700">
                <li className="flex items-center space-x-2 font-medium">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>สรุปสไลด์ 300+ หน้าไม่จำกัดวิชา</span>
                </li>
                <li className="flex items-center space-x-2 font-medium">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>เสียงติวเตอร์บรรยายสรุป AI ฟังได้ทุกที่</span>
                </li>
                <li className="flex items-center space-x-2 font-medium">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>ข้อสอบจำลองพร้อมตรวจและอ้างอิงสไลด์</span>
                </li>
                <li className="flex items-center space-x-2 font-medium">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>บอททวงงานกลุ่มสุภาพทาง LINE ไม่จำกัด</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                alert('จำลองการชำระเงิน 99 บาท สำเร็จ! คุณได้รับการอัปเกรดเป็น Pro Exam Pass เรียบร้อยแล้ว');
                onClose();
              }}
              className="w-full mt-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>อัปเกรด Pro 99฿ ทันที</span>
            </button>
          </div>

        </div>

        {/* Campus License Footer */}
        <div className="mt-6 p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-start space-x-3 text-xs text-slate-600">
          <Building2 className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900">Campus License สำหรับคณะและมหาวิทยาลัย: </span>
            สถาบันการศึกษาสามารถจัดซื้อสิทธิ์เหมาจ่ายให้นักศึกษาทุกคนในคณะใช้งานได้ฟรี เพื่อยกระดับคะแนนเฉลี่ยและลดอัตราการพ้นสภาพนักศึกษา
          </div>
        </div>

      </div>
    </div>
  );
};
