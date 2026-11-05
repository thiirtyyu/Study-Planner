import React, { useState, useEffect } from 'react';
import { Subject, LectureMaterial } from '../types';
import { 
  FileUp, 
  Sparkles, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  Share2, 
  Clock, 
  FileText,
  Printer,
  GraduationCap
} from 'lucide-react';
import { speechEngine } from '../utils/speechEngine';

interface LectureSummarizerProps {
  subjects: Subject[];
  materials: Record<string, LectureMaterial>;
  selectedSubjectId: string;
  onSelectSubject: (id: string) => void;
  onOpenUploadModal: () => void;
}

export const LectureSummarizer: React.FC<LectureSummarizerProps> = ({
  subjects,
  materials,
  selectedSubjectId,
  onSelectSubject,
  onOpenUploadModal,
}) => {
  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const material = materials[selectedSubjectId] || materials['sub-1'] || Object.values(materials)[0];

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'sheet' | 'audio' | 'quiz'>('sheet');
  
  // Real Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1);
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Stop speech when unmounting or changing subject
  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, [selectedSubjectId]);

  // Handle Real Audio Playback (Web Speech API)
  const handleTogglePlayAudio = () => {
    if (isPlayingAudio) {
      if (isAudioPaused) {
        speechEngine.resume();
        setIsAudioPaused(false);
      } else {
        speechEngine.pause();
        setIsAudioPaused(true);
      }
    } else {
      setIsPlayingAudio(true);
      setIsAudioPaused(false);
      speechEngine.speak(
        material.audioScript,
        audioPlaybackSpeed,
        () => {
          setIsPlayingAudio(false);
          setIsAudioPaused(false);
        }
      );
    }
  };

  const handleStopAudio = () => {
    speechEngine.stop();
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
  };

  const handleSpeedChange = (speed: number) => {
    setAudioPlaybackSpeed(speed);
    if (isPlayingAudio && !isAudioPaused) {
      // Re-trigger speech with new speed
      speechEngine.speak(
        material.audioScript,
        speed,
        () => {
          setIsPlayingAudio(false);
          setIsAudioPaused(false);
        }
      );
    }
  };

  // Handle quiz answer
  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    material.mockQuiz.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  const handleCopySummary = () => {
    const textToCopy = `${material.title}\n\n` +
      material.summarySections.map(s => 
        `## ${s.title}\n` + s.keyPoints.map(p => `- ${p}`).join('\n')
      ).join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const handleDownloadTxt = () => {
    const textContent = `${material.title}\n` +
      `วิชา: ${material.subjectCode} (${material.subjectName})\n` +
      `==========================================\n\n` +
      material.summarySections.map(s => 
        `[${s.title}]\n` +
        s.keyPoints.map(p => `• ${p}`).join('\n') +
        (s.examTraps && s.examTraps.length > 0 ? `\n\nจุดระวังข้อสอบหลอก:\n` + s.examTraps.map(t => `! ${t}`).join('\n') : '') +
        (s.formulaOrDefinition ? `\n\nสูตร/นิยาม: ${s.formulaOrDefinition}` : '')
      ).join('\n\n------------------------------------------\n\n') +
      `\n\n[บทบรรยายเสียงสรุป]\n${material.audioScript}`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${material.subjectCode}_Summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header & Subject Picker Bar */}
      <div className="paper-surface rounded-2xl p-5 sm:p-6 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                Real Summarizer & Speech AI
              </span>
              <span className="text-xs text-slate-500">
                สกัดประเด็นจริง & พากย์เสียงพูดออกลำโพงจริง
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              ห้องสรุปเนื้อหา 15 นาที & ข้อสอบจำลอง
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center space-x-2"
            >
              <FileUp className="w-4 h-4" />
              <span>โยนไฟล์สไลด์ PDF ใหม่</span>
            </button>
          </div>
        </div>

        {/* Subjects Switcher Tabs */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            เลือกวิชา:
          </span>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => {
                handleStopAudio();
                onSelectSubject(s.id);
                setUserAnswers({});
                setQuizSubmitted(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                s.id === selectedSubjectId
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
              <span>{s.code}</span>
              <span className="text-[10px] opacity-75 font-normal">({s.slidePages} หน้า)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Subject Info Card */}
      <div className="paper-surface rounded-2xl p-5 border-l-4" style={{ borderLeftColor: currentSubject.color }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: currentSubject.color }}>
                {currentSubject.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentSubject.faculty}
              </span>
              <span className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                สอบ {currentSubject.examDate}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-2">
              {material.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ย่อยจากสไลด์ต้นฉบับ {material.totalSlides} หน้า • ใช้เวลาอ่านทบทวนเฉลี่ย 15 นาที • พากย์เสียงจริงได้ทันที
            </p>
          </div>

          {/* Sub Navigation Pills */}
          <div className="flex items-center space-x-1.5 bg-stone-100 p-1.5 rounded-xl shrink-0 self-start sm:self-center print:hidden">
            <button
              onClick={() => setActiveSubTab('sheet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSubTab === 'sheet'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>ชีทสรุป 15 นาที</span>
            </button>

            <button
              onClick={() => setActiveSubTab('audio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSubTab === 'audio'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>เสียงติวเตอร์ AI (พากย์จริง)</span>
              {isPlayingAudio && <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>}
            </button>

            <button
              onClick={() => setActiveSubTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSubTab === 'quiz'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>ข้อสอบจำลอง ({material.mockQuiz.length} ข้อ)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📖 TAB 1: 15-MINUTE CHEAT SHEET */}
      {activeSubTab === 'sheet' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 print:hidden">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700">รูปแบบการสรุป:</span>
              <span className="bg-white border border-stone-200 px-2 py-1 rounded-md text-slate-800">
                ⚡ สรุปเน้นคีย์เวิร์ด + ระวังจุดหลอก
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopySummary}
                className="flex items-center space-x-1 px-3 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-slate-700 font-medium transition-colors"
              >
                {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNote ? 'คัดลอกแล้ว!' : 'คัดลอกสรุป'}</span>
              </button>

              <button 
                onClick={handleDownloadTxt}
                className="flex items-center space-x-1 px-3 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-slate-700 font-medium transition-colors"
                title="ดาวน์โหลดเป็นไฟล์ Text"
              >
                <Download className="w-3.5 h-3.5" />
                <span>โหลด .txt</span>
              </button>

              <button 
                onClick={handlePrintSheet}
                className="flex items-center space-x-1 px-3 py-1 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-800 rounded-lg font-semibold transition-colors"
                title="พิมพ์หรือบันทึกเป็น PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>พิมพ์ / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Section Cards */}
          <div className="space-y-4">
            {material.summarySections.map((sec) => (
              <div key={sec.id} className="paper-surface rounded-2xl p-6 transition-all hover:border-brand-200">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {sec.title}
                  </h3>
                  <span className="flex items-center space-x-1 text-xs font-semibold text-slate-500 bg-stone-100 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    <span>ใช้เวลาอ่าน ~{sec.timeToReadMinutes} นาที</span>
                  </span>
                </div>

                {/* Key Points */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    ประเด็นหลักที่ต้องจำได้
                  </h4>
                  <ul className="space-y-2">
                    {sec.keyPoints.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start space-x-2 text-sm text-slate-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 shrink-0"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Definition or Formula Box */}
                {sec.formulaOrDefinition && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed border border-slate-800 flex items-start space-x-2">
                    <span className="text-amber-400 font-bold shrink-0">💡 นิยาม / สูตร:</span>
                    <span>{sec.formulaOrDefinition}</span>
                  </div>
                )}

                {/* Exam Traps Box */}
                {sec.examTraps && sec.examTraps.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-300/80">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>จุดระวังอาจารย์ออกข้อสอบหลอก (Exam Trap!)</span>
                    </div>
                    <ul className="space-y-1.5">
                      {sec.examTraps.map((trap, tIdx) => (
                        <li key={tIdx} className="text-xs text-amber-950 flex items-start space-x-2 leading-relaxed">
                          <span className="text-amber-600 font-bold shrink-0">⚠️</span>
                          <span>{trap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Audio Quick Bar Banner */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-950">
                  {isPlayingAudio ? 'กำลังพากย์เสียงสรุปออกลำโพง...' : 'อยากฟังติวสรุปแทนการอ่าน?'}
                </p>
                <p className="text-[11px] text-purple-700">
                  ระบบสังเคราะห์เสียงพูดภาษาไทยจาก Web Speech API ฟังได้ทันที
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveSubTab('audio');
                if (!isPlayingAudio) handleTogglePlayAudio();
              }}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all whitespace-nowrap flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isPlayingAudio ? 'ดูแผงควบคุมเสียง' : 'กดฟังเสียงพากย์จริงทันที'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 🎧 TAB 2: REAL AUDIO PLAYER */}
      {activeSubTab === 'audio' && (
        <div className="paper-surface rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                  Real Web Speech Engine
                </span>
                <span className="text-xs text-slate-500">
                  สังเคราะห์เสียงพูดออกลำโพงคอมพิวเตอร์จริง
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                UniSync Audio Recap: ติวเตอร์เสียง AI สรุปบทเรียนนี้
              </h3>
            </div>

            {/* Speed buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 hidden sm:inline">ความเร็ว:</span>
              {[0.8, 1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    audioPlaybackSpeed === speed
                      ? 'bg-purple-600 text-white'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Player Box */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-300 font-medium">
                  {isPlayingAudio 
                    ? (isAudioPaused ? '⏸ หยุดพักชั่วคราว' : '🔊 กำลังพูดออกลำโพงจริง...') 
                    : 'พร้อมพากย์เสียง'}
                </p>
                <h4 className="text-base font-bold text-white mt-1">{material.title}</h4>
              </div>
              <span className="text-xs text-purple-400 font-mono">
                Speed {audioPlaybackSpeed}x
              </span>
            </div>

            {/* Simulated Animated Waveform */}
            <div className="h-14 my-6 bg-slate-800/80 rounded-xl px-4 flex items-center justify-center space-x-1.5 overflow-hidden">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isPlayingAudio && !isAudioPaused
                      ? 'wave-bar bg-gradient-to-t from-purple-500 to-brand-400' 
                      : 'bg-slate-700 h-2'
                  }`}
                  style={{
                    height: (isPlayingAudio && !isAudioPaused) ? undefined : `${(i % 5 + 2) * 4}px`
                  }}
                />
              ))}
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center space-x-6">
              {isPlayingAudio && (
                <button 
                  onClick={handleStopAudio}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-full transition-colors"
                  title="หยุดพูด"
                >
                  <Square className="w-5 h-5 fill-rose-400" />
                </button>
              )}

              <button
                onClick={handleTogglePlayAudio}
                className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-all transform hover:scale-105"
              >
                {isPlayingAudio && !isAudioPaused ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white ml-0.5" />
                )}
              </button>

              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <Volume2 className="w-5 h-5" />
                <span>Web Speech</span>
              </div>
            </div>
          </div>

          {/* Transcript / Audio Script */}
          <div className="border border-stone-200 rounded-xl p-5 bg-stone-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                บทบรรยายเสียงสรุป (Audio Script ที่กำลังพูด)
              </h4>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(material.audioScript);
                  alert('คัดลอกบทบรรยายเรียบร้อย!');
                }}
                className="text-[11px] text-brand-600 hover:underline"
              >
                คัดลอกข้อความ
              </button>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-stone-200">
              "{material.audioScript}"
            </p>
          </div>
        </div>
      )}

      {/* 🎯 TAB 3: INTERACTIVE MOCK EXAM */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6">
          <div className="paper-surface rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  AI Mock Examination
                </span>
                <span className="text-xs text-slate-500">
                  เก็งแนวข้อสอบไฟนอล ({material.mockQuiz.length} ข้อ)
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                แบบฝึกหัดทดสอบความเข้าใจจริงก่อนเข้าห้องสอบ
              </h3>
            </div>

            {quizSubmitted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-right">
                <p className="text-xs text-emerald-700 font-semibold">คะแนนของคุณ</p>
                <p className="text-xl font-bold text-emerald-900">
                  {calculateScore()} / {material.mockQuiz.length} คะแนน
                </p>
              </div>
            )}
          </div>

          {/* Quiz Questions List */}
          <div className="space-y-5">
            {material.mockQuiz.map((q, qIndex) => {
              const selectedAnswer = userAnswers[q.id];

              return (
                <div key={q.id} className="paper-surface rounded-2xl p-6 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        ระดับ: {q.difficulty}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                      {q.sourceSlide}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-slate-900 mt-2 mb-4 leading-relaxed">
                    {q.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedAnswer === optIndex;
                      const isCorrect = optIndex === q.correctAnswerIndex;
                      
                      let optionClasses = 'border-stone-200 bg-white hover:bg-stone-50 text-slate-800';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          optionClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                        } else if (isSelected && !isCorrect) {
                          optionClasses = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
                        } else {
                          optionClasses = 'border-stone-200 bg-stone-50/50 text-slate-400 opacity-60';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-brand-600 bg-brand-50 text-brand-950 font-semibold ring-2 ring-brand-600/30';
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectAnswer(q.id, optIndex)}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start space-x-3 ${optionClasses}`}
                        >
                          <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-brand-600 text-white' : 'bg-stone-100 text-slate-600'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                          
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {quizSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {quizSubmitted && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                        <HelpCircle className="w-4 h-4 text-brand-600" />
                        <span>คำอธิบายเฉลยและจุดอ้างอิง:</span>
                      </div>
                      <p className="text-slate-700 pl-5">{q.explanation}</p>
                      <p className="text-slate-500 font-mono text-[11px] pl-5">
                        📍 ที่มา: {q.sourceSlide}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Reset Button */}
          <div className="paper-surface rounded-2xl p-5 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              ตอบแล้ว {Object.keys(userAnswers).length} จาก {material.mockQuiz.length} ข้อ
            </span>

            <div className="flex items-center space-x-3">
              {quizSubmitted ? (
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="px-4 py-2 border border-stone-300 text-slate-700 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors"
                >
                  ทำใหม่อีกครั้ง
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (Object.keys(userAnswers).length < material.mockQuiz.length) {
                      if (!confirm('คุณยังตอบไม่ครบทุกข้อ ต้องการตรวจคำตอบเลยใช่หรือไม่?')) return;
                    }
                    setQuizSubmitted(true);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all"
                >
                  ตรวจคำตอบและดูเฉลย
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
