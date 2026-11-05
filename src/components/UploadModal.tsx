import React, { useState } from 'react';
import { 
  FileUp, 
  Sparkles, 
  FileText, 
  Key, 
  CheckCircle2, 
  Users, 
  Loader2,
  BookOpen,
  ArrowRight,
  ClipboardPaste,
  HelpCircle
} from 'lucide-react';
import { extractTextFromFile } from '../utils/fileExtractor';
import { processFileToSummary } from '../utils/aiSummarizer';
import { LectureMaterial, Subject } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSubject: Subject, newMaterial: LectureMaterial) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [directText, setDirectText] = useState<string>('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [subjectCode, setSubjectCode] = useState<string>('NEW101');
  const [subjectName, setSubjectName] = useState<string>('');
  
  // Optional Gemini API Key
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('unisync_gemini_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!subjectName) {
        setSubjectName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('unisync_gemini_key', key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    let rawText = '';
    let pageCount = 1;

    try {
      setIsProcessing(true);

      if (inputMode === 'file') {
        if (!selectedFile) {
          throw new Error('กรุณาเลือกไฟล์ PDF หรือไฟล์ Text ก่อนครับ');
        }
        setProcessingStatus(`กำลังอ่านข้อมูลจากไฟล์ ${selectedFile.name}...`);
        const extracted = await extractTextFromFile(selectedFile);
        rawText = extracted.text;
        pageCount = extracted.pageCount;
      } else {
        if (!directText.trim()) {
          throw new Error('กรุณาวางเนื้อหาหรือข้อความที่ต้องการสรุป');
        }
        rawText = directText;
        pageCount = Math.max(1, Math.ceil(directText.length / 1000));
      }

      setProcessingStatus('กำลังวิเคราะห์และสกัดประเด็นสำคัญ (AI Summarization)...');
      
      const titleName = subjectName.trim() || (selectedFile ? selectedFile.name : 'บทเรียนใหม่');
      const code = subjectCode.trim() || 'GEN101';

      // Process real summary & mock quiz
      const generatedMaterial = await processFileToSummary(
        rawText,
        titleName,
        code,
        apiKey
      );

      setProcessingStatus('กำลังจัดเตรียมเสียงพากย์และแนวข้อสอบ...');

      const newSubject: Subject = {
        id: `sub-${Date.now()}`,
        code: code,
        name: titleName,
        faculty: 'วิชาทั่วไป / ภาควิชา',
        slidePages: pageCount,
        examDate: 'เร็วๆ นี้',
        daysRemaining: 6,
        category: 'วิศวกรรม/ไอที',
        color: '#2563EB',
        hasAudio: true,
        isSummarized: true,
        scoreTarget: 'เป้าหมาย A'
      };

      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(newSubject, generatedMaterial);
        onClose();
      }, 500);

    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการประมวลผลไฟล์');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-elevated border border-stone-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                โยนไฟล์เพื่อสรุปและพากย์เสียงจริง
              </h3>
              <p className="text-xs text-slate-500">
                อ่านไฟล์ PDF, TXT, MD สกัดประเด็นและสร้างข้อสอบจริง
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
              ✕
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Input Method Toggle */}
          <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setInputMode('file')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                inputMode === 'file' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              📁 อัปโหลดไฟล์ (PDF / TXT / MD)
            </button>
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                inputMode === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ✍️ วางข้อความโดยตรง (Paste Text)
            </button>
          </div>

          {/* Subject Meta Inputs */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">รหัสวิชา:</label>
              <input
                type="text"
                placeholder="เช่น CS302"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">ชื่อวิชา / หัวข้อ:</label>
              <input
                type="text"
                placeholder="เช่น การเงินธุรกิจ หรือ สรุปบทที่ 4"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </div>
          </div>

          {/* Mode 1: File Upload */}
          {inputMode === 'file' ? (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                เลือกไฟล์จากคอมพิวเตอร์ของคุณ:
              </label>
              <div className="border-2 border-dashed border-stone-300 hover:border-brand-500 bg-stone-50/60 rounded-2xl p-6 text-center transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.csv,.json"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {selectedFile ? (
                  <div className="space-y-1">
                    <FileText className="w-8 h-8 text-brand-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-500">
                      ขนาด: {(selectedFile.size / 1024).toFixed(1)} KB • คลิกเพื่อเปลี่ยนไฟล์
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <FileUp className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">คลิกที่นี่ หรือ ลากไฟล์ PDF / TXT มาวาง</p>
                    <p className="text-[10px] text-slate-400">รองรับสไลด์เรียน PDF ภาษาไทยและอังกฤษ</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Mode 2: Direct Text Paste */
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                วางเนื้อหาสไลด์หรือเลกเชอร์ที่ต้องการสรุป:
              </label>
              <textarea
                rows={6}
                placeholder="คัดลอกข้อความจากสไลด์ หรือบทความเรียนมาวางที่นี่ได้เลย..."
                value={directText}
                onChange={(e) => setDirectText(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-600 font-sans"
              />
            </div>
          )}

          {/* Optional Gemini API Key Drawer */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>{apiKey ? '✓ ใส่ Gemini API Key แล้ว (คลิกเพื่อแก้ไข)' : '+ ใส่ Gemini API Key เพื่อความฉลาดระดับคลาวด์ (ไม่ใส่ก็ได้)'}</span>
            </button>

            {showApiKeyInput && (
              <div className="mt-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <input
                  type="password"
                  placeholder="AIzaSy... (Gemini API Key)"
                  value={apiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  * หากไม่ใส่ ระบบจะใช้ Smart NLP Engine ในเครื่องประมวลผลให้ฟรีทันทีโดยอัตโนมัติ
                </p>
              </div>
            )}
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 flex items-center space-x-3 text-xs text-brand-900 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin text-brand-600 shrink-0" />
              <div>
                <p className="font-bold">ระบบกำลังประมวลผลจริง...</p>
                <p className="text-[11px] text-brand-700">{processingStatus}</p>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
            {!isProcessing && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-stone-100 rounded-xl"
              >
                ยกเลิก
              </button>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
            >
              <span>{isProcessing ? 'กำลังอ่านและสรุป...' : 'สรุปและสร้างข้อสอบทันที'}</span>
              {!isProcessing && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
