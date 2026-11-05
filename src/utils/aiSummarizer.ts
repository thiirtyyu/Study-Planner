import { LectureMaterial, SummarySection, QuizQuestion } from '../types';

/**
 * Improved Summarization Engine
 * - Better Thai text analysis
 * - More robust sentence extraction
 * - Generates natural audio scripts
 */

export async function processFileToSummary(
  rawText: string,
  fileName: string,
  subjectCode: string = 'GEN101',
  geminiApiKey?: string
): Promise<LectureMaterial> {
  // Try Gemini API if key provided
  if (geminiApiKey && geminiApiKey.trim().length > 10) {
    try {
      const result = await summarizeWithGemini(rawText, fileName, subjectCode, geminiApiKey.trim());
      if (result) return result;
    } catch (err) {
      console.warn('Gemini API failed, using local engine:', err);
    }
  }

  // Built-in extractive summarizer (always works, no API needed)
  return localSummarize(rawText, fileName, subjectCode);
}

// -------------------------------------------------------------------
// Local Extractive Summarizer (works offline, no cost)
// -------------------------------------------------------------------

function localSummarize(rawText: string, fileName: string, subjectCode: string): LectureMaterial {
  const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

  // Break into meaningful sentences
  const sentences = extractSentences(rawText);
  const pageCount = Math.max(1, Math.ceil(rawText.length / 1200));

  // Score and rank sentences by importance
  const scored = scoreSentences(sentences);
  const topSentences = scored.slice(0, 12); // top 12 important sentences

  // Group into 2-3 sections
  const sections = buildSections(topSentences, cleanName);

  // Build natural audio script from the summary
  const audioScript = buildAudioScript(sections, cleanName);

  // Generate quiz questions from the content
  const quiz = buildQuiz(topSentences, cleanName);

  return {
    id: `mat-${Date.now()}`,
    subjectCode,
    subjectName: cleanName,
    title: `สรุปเตรียมสอบ: ${cleanName}`,
    totalSlides: pageCount,
    audioDurationMinutes: Math.max(2, Math.round(audioScript.length / 300)),
    audioScript,
    summarySections: sections,
    mockQuiz: quiz,
  };
}

/**
 * Extract meaningful sentences from raw text
 */
function extractSentences(raw: string): string[] {
  // Split on common sentence boundaries
  const lines = raw
    .split(/[\n\r]+/)
    .map(l => l.trim())
    .filter(l => l.length > 15);

  // Further split long lines on periods, question marks, etc.
  const allSentences: string[] = [];
  for (const line of lines) {
    if (line.length > 200) {
      // Split long lines
      const parts = line.split(/(?<=[.!?])\s+/);
      for (const p of parts) {
        if (p.trim().length > 15) allSentences.push(p.trim());
      }
    } else {
      allSentences.push(line);
    }
  }

  // Remove duplicates and very short fragments
  const unique = [...new Set(allSentences)].filter(s => {
    if (s.length < 15) return false;
    // Remove lines that are just numbers or page markers
    if (/^\[?หน้า\s*\d+\]?$/.test(s)) return false;
    if (/^\d+[\s./]*\d*$/.test(s)) return false;
    return true;
  });

  return unique;
}

/**
 * Score sentences by keyword importance
 */
function scoreSentences(sentences: string[]): string[] {
  const importantPatterns = [
    { pattern: /คือ|หมายถึง|นิยาม|defined as/i, weight: 3 },
    { pattern: /สำคัญ|หลัก|essential|important/i, weight: 3 },
    { pattern: /ประเภท|ชนิด|แบ่ง|categories|types/i, weight: 2 },
    { pattern: /ข้อแตกต่าง|เปรียบเทียบ|compare|difference/i, weight: 3 },
    { pattern: /ขั้นตอน|กระบวนการ|process|steps/i, weight: 2 },
    { pattern: /ผลกระทบ|ส่งผล|ทำให้|result|effect/i, weight: 2 },
    { pattern: /ปัจจัย|เงื่อนไข|factor|condition/i, weight: 2 },
    { pattern: /ทฤษฎี|กฎ|สูตร|theory|formula|law/i, weight: 3 },
    { pattern: /ตัวอย่าง|เช่น|example|such as/i, weight: 1 },
    { pattern: /ข้อดี|ข้อเสีย|advantage|disadvantage/i, weight: 2 },
    { pattern: /สรุป|โดยสรุป|conclusion|summary/i, weight: 3 },
    { pattern: /ระบบ|โครงสร้าง|system|structure/i, weight: 1 },
  ];

  const scored = sentences.map(s => {
    let score = 0;
    for (const { pattern, weight } of importantPatterns) {
      if (pattern.test(s)) score += weight;
    }
    // Bonus for medium-length sentences (not too short, not too long)
    if (s.length >= 30 && s.length <= 200) score += 1;
    return { text: s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.text);
}

/**
 * Organize top sentences into logical summary sections
 */
function buildSections(topSentences: string[], subjectName: string): SummarySection[] {
  const sections: SummarySection[] = [];

  // Section 1: Core definitions and concepts (first 4 sentences)
  const s1Points = topSentences.slice(0, 4);
  if (s1Points.length > 0) {
    sections.push({
      id: `sec-${Date.now()}-1`,
      title: `1. นิยามและแนวคิดหลักของ ${subjectName}`,
      timeToReadMinutes: Math.max(2, Math.ceil(s1Points.join('').length / 400)),
      keyPoints: s1Points,
      examTraps: [
        `ระวังอย่าจำสลับระหว่างนิยามหลักและข้อยกเว้นที่ปรากฏใน ${subjectName}`,
      ],
      formulaOrDefinition: s1Points[0]?.slice(0, 120) || undefined,
    });
  }

  // Section 2: Details and analysis (next 4 sentences)
  const s2Points = topSentences.slice(4, 8);
  if (s2Points.length > 0) {
    sections.push({
      id: `sec-${Date.now()}-2`,
      title: '2. รายละเอียดเชิงลึกและการวิเคราะห์',
      timeToReadMinutes: Math.max(2, Math.ceil(s2Points.join('').length / 400)),
      keyPoints: s2Points,
      examTraps: [
        'ข้อสอบมักถามเปรียบเทียบความแตกต่างระหว่างแนวคิดหลักสองแนวคิดขึ้นไป',
      ],
    });
  }

  // Section 3: Applications and conclusions (remaining)
  const s3Points = topSentences.slice(8, 12);
  if (s3Points.length > 0) {
    sections.push({
      id: `sec-${Date.now()}-3`,
      title: '3. การประยุกต์ใช้และสรุปท้ายบท',
      timeToReadMinutes: Math.max(2, Math.ceil(s3Points.join('').length / 400)),
      keyPoints: s3Points,
      examTraps: [
        'อย่าลืมอ่านตัวอย่างและกรณีศึกษา เพราะอาจารย์มักยกมาเป็นโจทย์ข้อสอบ',
      ],
    });
  }

  // Fallback if no sentences were extracted
  if (sections.length === 0) {
    sections.push({
      id: `sec-fallback`,
      title: `1. สรุปเนื้อหา ${subjectName}`,
      timeToReadMinutes: 5,
      keyPoints: [
        `เอกสารนี้ครอบคลุมเนื้อหาหลักของ ${subjectName}`,
        'ไม่สามารถสกัดข้อความโดยอัตโนมัติได้ครบถ้วน อาจเป็นเพราะไฟล์เป็นรูปภาพสแกน',
        'แนะนำ: คัดลอกข้อความจากสไลด์มาวางในช่อง "วางข้อความโดยตรง" เพื่อผลลัพธ์ที่ดีที่สุด',
      ],
      examTraps: ['ลองอัปโหลดไฟล์ .txt หรือ .md หากไฟล์ PDF เป็นรูปภาพสแกน'],
    });
  }

  return sections;
}

/**
 * Build a natural-sounding audio script for Text-to-Speech
 */
function buildAudioScript(sections: SummarySection[], subjectName: string): string {
  const parts: string[] = [];

  parts.push(`สวัสดีครับ. ยินดีต้อนรับสู่ UniSync Audio Recap.`);
  parts.push(`สรุปบทเรียนเรื่อง ${subjectName} ครับ.`);

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    parts.push(`หัวข้อที่ ${i + 1}. ${sec.title.replace(/^\d+\.\s*/, '')}.`);

    for (let j = 0; j < Math.min(sec.keyPoints.length, 3); j++) {
      const point = sec.keyPoints[j];
      // Truncate very long points for speech
      const short = point.length > 120 ? point.slice(0, 120) + '.' : point;
      parts.push(`ประเด็นที่ ${j + 1}. ${short}`);
    }

    if (sec.examTraps && sec.examTraps.length > 0) {
      parts.push(`จุดระวังข้อสอบ. ${sec.examTraps[0].slice(0, 100)}.`);
    }
  }

  parts.push(`สรุปจบแล้วครับ. แนะนำให้ลองทำแบบฝึกหัดเก็งข้อสอบเพื่อทดสอบความเข้าใจครับ.`);

  return parts.join('\n');
}

/**
 * Generate quiz questions from extracted content
 */
function buildQuiz(topSentences: string[], subjectName: string): QuizQuestion[] {
  const quiz: QuizQuestion[] = [];

  if (topSentences.length >= 2) {
    quiz.push({
      id: `q-${Date.now()}-1`,
      question: `จากเนื้อหาในบทเรียน "${subjectName}" ข้อใดสรุปประเด็นสำคัญได้ถูกต้องที่สุด?`,
      options: [
        topSentences[0].slice(0, 100),
        'ไม่มีความเกี่ยวข้องกับหลักการหรือทฤษฎีใดๆ ทั้งสิ้น',
        'สามารถข้ามขั้นตอนการตรวจสอบทั้งหมดได้โดยไม่มีผลกระทบ',
        'เป็นเพียงข้อมูลเบื้องต้นที่ไม่ออกสอบ',
      ],
      correctAnswerIndex: 0,
      explanation: `ตัวเลือกแรกสรุปตรงตามเนื้อหาในเอกสารต้นฉบับมากที่สุด`,
      sourceSlide: `สกัดจากไฟล์เอกสาร ${subjectName}`,
      difficulty: 'ปานกลาง',
    });
  }

  if (topSentences.length >= 4) {
    quiz.push({
      id: `q-${Date.now()}-2`,
      question: `ข้อใดเป็นรายละเอียดเชิงลึกที่ถูกต้องตามบทเรียนนี้?`,
      options: [
        'ไม่มีรายละเอียดเพิ่มเติมนอกเหนือจากนิยาม',
        topSentences[3].slice(0, 100),
        'ทุกรายละเอียดในบทเรียนนี้ล้าสมัยแล้ว',
        'ไม่จำเป็นต้องทำความเข้าใจรายละเอียดเชิงลึก',
      ],
      correctAnswerIndex: 1,
      explanation: `ตัวเลือกที่สองตรงกับเนื้อหาที่ปรากฏในเอกสารบทเรียน`,
      sourceSlide: `สกัดจากส่วนรายละเอียดของเอกสาร`,
      difficulty: 'ง่าย',
    });
  }

  // Always add at least one general question
  if (quiz.length === 0) {
    quiz.push({
      id: `q-fallback`,
      question: `ข้อใดอธิบายหัวใจสำคัญของ "${subjectName}" ได้ถูกต้อง?`,
      options: [
        `เนื้อหาครอบคลุมหลักการและทฤษฎีพื้นฐานของ ${subjectName}`,
        'ไม่มีหลักการหรือทฤษฎีที่เกี่ยวข้อง',
        'เป็นเพียงบทนำที่ไม่มีเนื้อหาสำคัญ',
        'ไม่สามารถสรุปเป็นหลักการได้',
      ],
      correctAnswerIndex: 0,
      explanation: `บทเรียนนี้มีเนื้อหาหลักการพื้นฐานที่สำคัญสำหรับการสอบ`,
      sourceSlide: `เอกสาร ${subjectName}`,
      difficulty: 'ง่าย',
    });
  }

  return quiz;
}

// -------------------------------------------------------------------
// Gemini Cloud Summarizer (optional, needs API key)
// -------------------------------------------------------------------

async function summarizeWithGemini(
  rawText: string,
  fileName: string,
  subjectCode: string,
  apiKey: string
): Promise<LectureMaterial | null> {
  const prompt = `คุณคือ UniSync AI ติวเตอร์สรุปบทเรียนมหาวิทยาลัย
วิเคราะห์เนื้อหาต่อไปนี้แล้วสรุปเป็น JSON

เนื้อหา (${fileName}):
${rawText.slice(0, 12000)}

ตอบกลับเฉพาะ JSON ตามรูปแบบนี้ (ไม่ต้องใส่ code block):
{
  "title": "สรุปเตรียมสอบ: ชื่อหัวข้อ",
  "audioScript": "สวัสดีครับ. ยินดีต้อนรับสู่ UniSync Audio Recap. (บรรยายสรุปสั้นๆ ประมาณ 5-8 ประโยค ใส่จุดหยุดด้วยจุด. เพื่อจังหวะธรรมชาติ)",
  "summarySections": [
    {
      "id": "sec-1",
      "title": "1. หัวข้อย่อย",
      "timeToReadMinutes": 4,
      "keyPoints": ["ประเด็น 1", "ประเด็น 2", "ประเด็น 3"],
      "examTraps": ["จุดระวังข้อสอบหลอก"],
      "formulaOrDefinition": "สูตร/นิยามสำคัญ (ถ้ามี)"
    }
  ],
  "mockQuiz": [
    {
      "id": "q1",
      "question": "คำถามข้อสอบ",
      "options": ["ตัวเลือก ก", "ตัวเลือก ข (ถูก)", "ตัวเลือก ค", "ตัวเลือก ง"],
      "correctAnswerIndex": 1,
      "explanation": "คำอธิบายเฉลย",
      "sourceSlide": "อ้างอิง",
      "difficulty": "ปานกลาง"
    }
  ]
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  const cleanName = fileName.replace(/\.[^/.]+$/, '');

  return {
    id: `mat-${Date.now()}`,
    subjectCode,
    subjectName: cleanName,
    title: parsed.title || `สรุปบทเรียน: ${cleanName}`,
    totalSlides: Math.max(1, Math.ceil(rawText.length / 1200)),
    audioDurationMinutes: 3,
    audioScript: parsed.audioScript || 'ไม่สามารถสร้างบทบรรยายได้',
    summarySections: parsed.summarySections || [],
    mockQuiz: parsed.mockQuiz || [],
  };
}
