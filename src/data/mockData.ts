import { Subject, LectureMaterial, GroupProject, NudgeTemplate } from '../types';

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    code: 'CS302',
    name: 'สถาปัตยกรรมซอฟต์แวร์และคลาวด์คอมพิวติง (Cloud Architecture)',
    faculty: 'วิศวกรรมศาสตร์ / ไอที',
    slidePages: 94,
    examDate: '10 พ.ย. 2026 (09:00 - 12:00)',
    daysRemaining: 5,
    category: 'วิศวกรรม/ไอที',
    color: '#2563EB',
    hasAudio: true,
    isSummarized: true,
    scoreTarget: 'เป้าหมาย A (ต้องได้ 85+)'
  },
  {
    id: 'sub-2',
    code: 'MKT201',
    name: 'กลยุทธ์การตลาดดิจิทัลและพฤติกรรมผู้บริโภค',
    faculty: 'บริหารธุรกิจ / การตลาด',
    slidePages: 82,
    examDate: '12 พ.ย. 2026 (13:30 - 16:30)',
    daysRemaining: 7,
    category: 'บริหาร/การตลาด',
    color: '#D97706',
    hasAudio: true,
    isSummarized: true,
    scoreTarget: 'เป้าหมาย B+ ขึ้นไป'
  },
  {
    id: 'sub-3',
    code: 'BIO105',
    name: 'ชีววิทยาโมเลกุลและการส่งสัญญาณระดับเซลล์',
    faculty: 'วิทยาศาสตร์',
    slidePages: 76,
    examDate: '13 พ.ย. 2026 (09:00 - 12:00)',
    daysRemaining: 8,
    category: 'วิทยาศาสตร์',
    color: '#059669',
    hasAudio: false,
    isSummarized: false,
    scoreTarget: 'เป้าหมาย B+'
  },
  {
    id: 'sub-4',
    code: 'LAW101',
    name: 'กฎหมายธุรกิจและสัญญานิติกรรมเบื้องต้น',
    faculty: 'นิติศาสตร์ / สังคมศาสตร์',
    slidePages: 68,
    examDate: '14 พ.ย. 2026 (13:30 - 16:30)',
    daysRemaining: 9,
    category: 'นิติศาสตร์',
    color: '#7C3AED',
    hasAudio: true,
    isSummarized: false,
    scoreTarget: 'เป้าหมาย A'
  }
];

export const MOCK_MATERIALS: Record<string, LectureMaterial> = {
  'sub-1': {
    id: 'mat-1',
    subjectCode: 'CS302',
    subjectName: 'สถาปัตยกรรมซอฟต์แวร์และคลาวด์คอมพิวติง',
    title: 'สรุปเตรียมสอบไฟนอล: Microservices vs Monolith & Event-Driven Systems',
    totalSlides: 94,
    audioDurationMinutes: 3.5,
    audioScript: `ยินดีต้อนรับสู่ UniSync Quick Recap วิชา CS302 สถาปัตยกรรมซอฟต์แวร์ครับ! จุดสำคัญ 3 เรื่องที่อาจารย์เน้นย้ำและออกข้อสอบไฟนอลชัวร์ๆ เรื่องแรกคือ Microservices Pattern: จำไว้เลยว่าหัวใจสำคัญไม่ใช่แค่การแยกโค้ด แต่คือ Database per Service และ Loose Coupling ครับ ถ้าบริการยังแชร์ฐานข้อมูลเดียวกัน จะถือเป็น Distributed Monolith ทันที! เรื่องที่สอง CAP Theorem ในระบบคลาวด์: เมื่อเกิด Network Partition (P) ระบบจะต้องเลือกระหว่าง Consistency (ความถูกต้องตรงกันทันที) หรือ Availability (พร้อมตอบกลับเสมอ) เลือกพร้อมกันทั้ง 3 อย่างไม่ได้! และเรื่องสุดท้าย Circuit Breaker Pattern เพื่อป้องกัน Cascading Failure ถ้าเซอร์วิสปลายทางล่ม ระบบเราต้องตัดวงจรไป Fallback ทันที อย่าปล่อยให้ Thread ค้างจนระบบล่มทั้งแผงครับ ทบทวน 3 ประเด็นนี้แล้วไปลุยแบบฝึกหัดได้เลย!`,
    summarySections: [
      {
        id: 'sec-1',
        title: '1. สถาปัตยกรรม Monolith vs Microservices',
        timeToReadMinutes: 4,
        keyPoints: [
          'Monolith เหมาะกับช่วง MVP และทีมขนาดเล็กเพราะ Deployment ง่ายและไม่ต้องกังวลเรื่อง Network Latency',
          'Microservices แก้ปัญหาการขยายทีม (Organizational Scaling) และการขยายระบบอิสระเฉพาะจุด (Independent Scaling)',
          'กฎเหล็ก: "Database per Service" ห้ามข้ามไป Query ตรงๆ ที่ฐานข้อมูลของเซอร์วิสอื่น ต้องผ่าน API หรือ Event เสมอ'
        ],
        examTraps: [
          'ข้อสอบชอบหลอกว่า: "การทำ Microservices ช่วยลดความซับซ้อนของระบบโดยรวมเสมอ" -> คำตอบคือ ผิด! เพราะเพิ่ม Operational Complexity และ Network Latency มหาศาล',
          'อย่าสับสนระหว่าง SOA แบบเดิมที่มี ESB รวมศูนย์ กับ Microservices ยุคใหม่ที่เน้น Smart endpoints and dumb pipes'
        ],
        formulaOrDefinition: 'Loose Coupling + High Cohesion = แกนหลักของการแบ่ง Domain-Driven Design (DDD)'
      },
      {
        id: 'sec-2',
        title: '2. ทฤษฎีบท CAP Theorem & Eventual Consistency',
        timeToReadMinutes: 5,
        keyPoints: [
          'C (Consistency): ทุก Node ต้องเห็นข้อมูลตรงกันล่าสุดพร้อมกัน',
          'A (Availability): ทุก Request ที่ไม่ล่มต้องได้รับ Response เสมอ (แม้ข้อมูลอาจยังไม่อัปเดตล่าสุด)',
          'P (Partition Tolerance): ระบบยังคงทำงานได้แม้เครือข่ายระหว่างโหนดจะขาดการเชื่อมต่อ',
          'ในโลก Distributed System สภาพ P เป็นสิ่งที่เกิดขึ้นจริงเสมอ ดังนั้นเราต้องเลือก CP (เช่น สถาบันการเงิน, การจองตั๋ว) หรือ AP (เช่น Social Media Feed, โน้ตย่อ)'
        ],
        examTraps: [
          'ข้อสอบชอบถามว่า: "มีระบบ Cloud ระบบใดที่ได้ทั้ง C, A, P พร้อมกัน 100% หรือไม่?" -> ตอบ: ตามทฤษฎีบทของ Eric Brewer เป็นไปไม่ได้ในสภาวะที่มี Network Partition'
        ],
        formulaOrDefinition: 'PACELC Theorem: If Partition (P) -> choose Availability (A) or Consistency (C); Else (E) -> choose Latency (L) or Consistency (C)'
      },
      {
        id: 'sec-3',
        title: '3. ความทนทานต่อความผิดพลาด (Resilience Patterns)',
        timeToReadMinutes: 6,
        keyPoints: [
          'Circuit Breaker: มี 3 สถานะ Closed (ปกติ), Open (มี error เกิน threshold ตัดวงจรส่ง error/fallback ทันที), Half-Open (ทดสอบส่ง request เล็กน้อยเพื่อดูว่าฟื้นหรือยัง)',
          'Retry with Exponential Backoff + Jitter: รอจังหวะสุ่มก่อนส่งคำขอใหม่ เพื่อเลี่ยงปรากฏการณ์ Thundering Herd',
          'Bulkhead Pattern: การจำกัดทรัพยากร (เช่น Thread Pool) แยกกัน เพื่อไม่ให้การล่มของโมดูลหนึ่งดูดทรัพยากรจนระบบทั้งหมดล่มตาม'
        ],
        examTraps: [
          'ระวังข้อสอบถามถึง Circuit Breaker เมื่ออยู่ในสถานะ "Open" จะไม่มีการยิง Request ไปยัง downstream service เลยแม้แต่ครั้งเดียว เพื่อให้เวลาระบบฟื้นตัว'
        ]
      }
    ],
    mockQuiz: [
      {
        id: 'q1',
        question: 'ข้อใดคือข้อผิดพลาดสำคัญที่สุด (Anti-pattern) ที่ทำให้ Microservices กลายสภาพเป็น "Distributed Monolith"?',
        options: [
          'การใช้ภาษาโปรแกรมหลายภาษาในระบบเดียวกัน (Polyglot)',
          'การแชร์ Database เดียวกันระหว่างหลายเซอร์วิส และเปิดให้เขียนตารางข้ามกันได้ตรงๆ',
          'การใช้ Message Queue เช่น Apache Kafka เพื่อส่งข้อมูลแบบ Asynchronous',
          'การแยกทีมพัฒนาออกเป็นอิสระตามฟีเจอร์'
        ],
        correctAnswerIndex: 1,
        explanation: 'การแชร์ Database ข้ามเซอร์วิสทำให้เกิด High Coupling หากมีการเปลี่ยน Schema ในตารางหนึ่ง จะกระทบกับเซอร์วิสอื่นทั้งหมด ทำให้สูญเสียความเป็นอิสระในการ Deploy ทันที',
        sourceSlide: 'สไลด์หน้า 28 หัวข้อ Database-per-service vs Shared Database',
        difficulty: 'ยาก (เก็งข้อสอบ)'
      },
      {
        id: 'q2',
        question: 'ตามทฤษฎีบท CAP Theorem ในระบบ Distributed Cloud เมื่อเกิดปัญหาการเชื่อมต่อระหว่าง Data Center (Network Partition) ทางเลือกของวิศวกรคือข้อใด?',
        options: [
          'ต้องเลือกได้ทั้ง Consistency และ Availability เสมอเพื่อความเสถียร',
          'ต้องเลือกระหว่างรักษาสัจธรรมข้อมูล (Consistency) หรือให้ระบบพร้อมรับสายตอบกลับ (Availability)',
          'ระบบจะรีเซ็ตตัวเองเป็น Monolith อัตโนมัติ',
          'ทฤษฎีบทนี้ไม่นำมาใช้กับฐานข้อมูล NoSQL ยุคใหม่'
        ],
        correctAnswerIndex: 1,
        explanation: 'เมื่อเกิด Partition (P) ขึ้นจริงในเน็ตเวิร์ก เราจำเป็นต้อง Trade-off เลือกระหว่าง CP (ยอมตอบช้าหรือปฏิเสธคำขอเพื่อความถูกต้องของข้อมูล) หรือ AP (ยอมตอบข้อมูลเดิมที่อาจยังไม่อัปเดตแต่ระบบไม่ล่ม)',
        sourceSlide: 'สไลด์หน้า 45 หัวข้อ Understanding Trade-offs in Distributed Systems',
        difficulty: 'ปานกลาง'
      },
      {
        id: 'q3',
        question: 'Circuit Breaker Pattern ในสถานะ "Open" มีพฤติกรรมอย่างไรเมื่อมีคำขอใหม่ (New Request) วิ่งเข้ามา?',
        options: [
          'ส่งคำขอไปยังปลายทางซ้ำๆ 5 ครั้งก่อนตัดวงจร',
          'ปฏิเสธคำขอทันทีหรือส่งข้อมูลสำรอง (Fallback) โดยไม่ส่งต่อไปยังเซอร์วิสปลายทางที่กำลังล่ม',
          'ปิดระบบทั้ง Server เพื่อความปลอดภัย',
          'อนุญาตให้คำขอผ่านได้เพียง 50% เท่านั้น'
        ],
        correctAnswerIndex: 1,
        explanation: 'เมื่อ Circuit breaker เปิด (Open) จะ Fail Fast ทันทีเพื่อปกป้องปลายทางไม่ให้โดนคำขอถล่มจนล่มถาวร และช่วยคืน Resource ให้ Client เร็วที่สุด',
        sourceSlide: 'สไลด์หน้า 72 แผนภาพ Circuit Breaker State Machine',
        difficulty: 'ง่าย'
      }
    ]
  },
  'sub-2': {
    id: 'mat-2',
    subjectCode: 'MKT201',
    subjectName: 'กลยุทธ์การตลาดดิจิทัลและพฤติกรรมผู้บริโภค',
    title: 'สรุปคีย์สำคัญ: Customer Acquisition Cost (CAC), LTV และ Retention Funnel',
    totalSlides: 82,
    audioDurationMinutes: 2.8,
    audioScript: `สรุปด่วน MKT201 สำหรับสอบไฟนอลครับ! หัวใจของการตลาดยุคใหม่คือสมการ LTV ต่อ CAC อัตราส่วนที่เหมาะสมสำหรับธุรกิจที่โตอย่างยั่งยืนคือ 3:1 ถ้าต่ำกว่า 1:1 คือธุรกิจกำลังเผาเงินและจะล้มละลาย และจำ Customer Journey แบบ AARRR Funnel ไว้ให้ขึ้นใจ Acquisition, Activation, Retention, Referral, Revenue การรักษาลูกค้าเดิมถูกกว่าหาลูกค้าใหม่ถึง 5-7 เท่าครับ!`,
    summarySections: [
      {
        id: 'sec-m1',
        title: '1. เศรษฐศาสตร์การหาลูกค้า (CAC vs LTV Ratio)',
        timeToReadMinutes: 5,
        keyPoints: [
          'CAC (Customer Acquisition Cost): ต้นทุนรวมค่าการตลาดและทีมขายหารด้วยจำนวนลูกค้าใหม่ที่ได้',
          'LTV (Lifetime Value): มูลค่ารวมตลอดช่วงชีวิตที่ลูกค้าคนหนึ่งจ่ายให้ธุรกิจ',
          'Benchmark สำคัญ: LTV:CAC ควรอยู่ที่ประมาณ 3:1 ขึ้นไป',
          'หาก LTV:CAC = 1:1 แปลว่าได้เงินมาเท่าไร จ่ายค่าโฆษณาหมด ไม่มีกำไรสุทธิ'
        ],
        examTraps: [
          'ระวังข้อสอบถามลึกถึงระยะเวลาคืนทุน (CAC Payback Period) ซึ่งโดยทั่วไปในธุรกิจ SaaS ไม่ควรเกิน 12 เดือน'
        ],
        formulaOrDefinition: 'LTV / CAC >= 3.0 (Healthy Growth)'
      },
      {
        id: 'sec-m2',
        title: '2. Pirate Metrics (AARRR Framework)',
        timeToReadMinutes: 5,
        keyPoints: [
          'Acquisition: ลูกค้ามาจากช่องทางไหน (SEO, Ads, Social)',
          'Activation: ผู้ใช้สัมผัสถึงคุณค่าครั้งแรก (Aha! Moment)',
          'Retention: ผู้ใช้กลับมาใช้งานซ้ำอย่างสม่ำเสมอ (ตัวชี้วัดที่สำคัญที่สุด)',
          'Referral: ผู้ใช้ประทับใจจนบอกต่อปากต่อปากหรือแชร์ลิงก์',
          'Revenue: ผู้ใช้เริ่มเปลี่ยนมาเป็นลูกค้าที่ยอมจ่ายเงิน'
        ],
        examTraps: [
          'อย่าจำสลับระหว่าง Activation (ความประทับใจแรก) กับ Retention (ความถี่ในการกลับมาใช้ซ้ำ)'
        ]
      }
    ],
    mockQuiz: [
      {
        id: 'qm1',
        question: 'สตาร์ทอัปแห่งหนึ่งมีค่าเฉลี่ย LTV อยู่ที่ 1,500 บาท และมี CAC อยู่ที่ 2,000 บาท สถานการณ์ของบริษัทนี้เป็นอย่างไรในมุมมองการเงินการตลาด?',
        options: [
          'มีประสิทธิภาพสูงมากเพราะหาลูกค้าได้ไว',
          'กำลังขาดทุนในทุกๆ ลูกค้าใหม่ที่ได้มา ยิ่งเติบโตเงินสดจะยิ่งหมดเร็ว (LTV:CAC < 1)',
          'อยู่ในเกณฑ์มาตรฐานของธุรกิจยุคดิจิทัล',
          'ควรเพิ่มงบยิงโฆษณาเป็นสองเท่าทันที'
        ],
        correctAnswerIndex: 1,
        explanation: 'เมื่อ CAC สูงกว่า LTV แปลว่าต้นทุนการได้ลูกค้า 1 คน แพงกว่ากำไรที่ลูกค้าคนนั้นจะสร้างให้ตลอดชีวิต ธุรกิจจะสูญเสียเงิน 500 บาทต่อลูกค้าหนึ่งรายเสมอ',
        sourceSlide: 'สไลด์หน้า 34 ตัวอย่าง Unit Economics',
        difficulty: 'ง่าย'
      }
    ]
  }
};

export const MOCK_GROUP_PROJECT: GroupProject = {
  id: 'proj-1',
  title: 'โครงงานสถาปัตยกรรมระบบ UniHub & รายงานสไลด์ Final (วิชา CS302)',
  subjectCode: 'CS302',
  subjectName: 'สถาปัตยกรรมซอฟต์แวร์และคลาวด์คอมพิวติง',
  deadline: '10 พ.ย. 2026 (เหลืออีก 5 วัน)',
  daysRemaining: 5,
  overallProgress: 42,
  members: [
    {
      id: 'mem-1',
      name: 'กานต์ (ฉัน)',
      role: 'Project Lead & Architecture Design',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assignedTasksCount: 2,
      workloadPercentage: 28,
      lineStatus: 'online'
    },
    {
      id: 'mem-2',
      name: 'เบลล์',
      role: 'UI/UX & Frontend Components',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      assignedTasksCount: 2,
      workloadPercentage: 26,
      lineStatus: 'online'
    },
    {
      id: 'mem-3',
      name: 'พีท',
      role: 'Database Schema & API Spec',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      assignedTasksCount: 1,
      workloadPercentage: 23,
      lineStatus: 'busy'
    },
    {
      id: 'mem-4',
      name: 'มิว',
      role: 'Testing & Presentation Slide Deck',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      assignedTasksCount: 1,
      workloadPercentage: 23,
      lineStatus: 'away'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'ออกแบบแผนผัง System Architecture (Microservices + Message Queue)',
      description: 'วาดไดอะแกรมระบุ Database per Service และลำดับการรับส่ง Event ของเซอร์วิสหลัก',
      assignedTo: 'mem-1',
      dueDate: 'พรุ่งนี้ 20:00 น.',
      daysLeft: 1,
      status: 'review',
      priority: 'high',
      estimatedHours: 6
    },
    {
      id: 'task-2',
      title: 'ออกแบบโครงสร้างฐานข้อมูล (ER-Diagram & Migration Script)',
      description: 'กำหนดตาราง Users, Enrollments, Summaries และ Quizzes ให้รองรับการสเกล',
      assignedTo: 'mem-3',
      dueDate: 'อีก 2 วัน 18:00 น.',
      daysLeft: 2,
      status: 'in_progress',
      priority: 'high',
      estimatedHours: 5,
      lastReminderSent: 'เมื่อวานนี้ 19:30 น.'
    },
    {
      id: 'task-3',
      title: 'พัฒนาหน้าจอ Interactive UI ตาม Design System',
      description: 'เขียนโค้ด React สำหรับหน้าสรุปเนื้อหาและหน้าบอร์ดแบ่งงานกลุ่มให้เสร็จสมบูรณ์',
      assignedTo: 'mem-2',
      dueDate: 'อีก 3 วัน 12:00 น.',
      daysLeft: 3,
      status: 'in_progress',
      priority: 'medium',
      estimatedHours: 8
    },
    {
      id: 'task-4',
      title: 'เขียนชุดทดสอบและสรุปผล User Testing จากเพื่อน 5 คน',
      description: 'รวบรวมข้อคิดเห็นเรื่องความยากง่ายในการทำข้อสอบจำลอง และการจับเวลาอ่าน 15 นาที',
      assignedTo: 'mem-4',
      dueDate: 'อีก 4 วัน 17:00 น.',
      daysLeft: 4,
      status: 'todo',
      priority: 'medium',
      estimatedHours: 4
    },
    {
      id: 'task-5',
      title: 'จัดทำสไลด์นำเสนอ Final 15 หน้า และซ้อมพรีเซนต์ 10 นาที',
      description: 'รวมข้อสรุปปัญหา Insight ทางออก และผลกระทบเชิงบวกที่วัดผลได้เข้าสู่ Template สวยงาม',
      assignedTo: 'mem-1',
      dueDate: 'อีก 4 วัน 23:59 น.',
      daysLeft: 4,
      status: 'todo',
      priority: 'high',
      estimatedHours: 5
    }
  ]
};

export const NUDGE_TEMPLATES: NudgeTemplate[] = [
  {
    id: 'nudge-1',
    name: 'สุภาพ นุ่มนวล ไม่กดดัน (Gentle Friendly)',
    tone: 'gentle',
    previewText: 'สวัสดีครับคุณ {name} ✨ บอท UniSync มาช่วยสะกิดเตือนเบาๆ ว่างาน "{task_title}" มีกำหนดส่ง {due_date} น้า เพื่อให้ทีมเราประกอบร่างทันกำหนด หากติดขัดหรือมีปัญหาตรงไหน ทักมาในกลุ่มได้เลยน้า เพื่อนๆ พร้อมซัพพอร์ตเสมอค้าบ! 💙'
  },
  {
    id: 'nudge-2',
    name: 'แจ้งสถานะไทม์ไลน์กลาง (Neutral Timeline Bot)',
    tone: 'friendly',
    previewText: '📢 [UniSync System Update] แจ้งเตือนสถานะงานกลุ่มวิชา {subject_code}: งานชิ้น "{task_title}" มอบหมายให้คุณ {name} ขณะนี้เหลือเวลาอีก {days_left} วัน ({due_date}) หากเสร็จแล้วอย่าลืมกดอัปเดตสถานะในระบบนะค้าบ ขอบคุณที่ร่วมมือกันครับ 🙏'
  },
  {
    id: 'nudge-3',
    name: 'เตือนด่วนก่อนเดดไลน์ 24 ชม. (Countdown Alert)',
    tone: 'urgent',
    previewText: '⏳ [UniSync 24h Countdown] งานด่วน "{task_title}" ของคุณ {name} กำลังจะถึงเดดไลน์ในอีก 24 ชม. แล้วครับ! รบกวนส่งไฟล์หรือแจ้งความคืบหน้าให้เพื่อนในกลุ่มทราบหน่อยน้า จะได้ส่งโปรเจกต์ทันคะแนนเต็มค้าบ 🚀'
  }
];

export const PITCH_REQUIREMENT_DATA = {
  problemAndInsight: {
    targetUser: "นักศึกษาระดับปริญญาตรีชั้นปีที่ 1-4 ที่ต้องการจัดการตารางเรียน เตรียมตัวสอบให้ทันเวลา สรุปเนื้อหาเลกเชอร์จำนวนมากให้เข้าใจง่าย และบริหารจัดการงานกลุ่มร่วมกับเพื่อนให้เสร็จตามกำหนดโดยไม่เกิดความขัดแย้ง",
    currentSituation: "ปัญหาช่วงกลางภาค (Midterm) และปลายภาค (Final) ที่มีทั้งการสอบและโปรเจกต์หลายวิชาชนกัน ปัจจุบันนักศึกษารับมือด้วยการจดโน้ตแยกกันในหลายแอป (เช่น Goodnotes, Notion) คุยงานและส่งไฟล์ผ่าน LINE กลุ่ม และพยายามอ่านสไลด์เรียนหลายร้อยหน้าด้วยตัวเองในคืนก่อนสอบ",
    problem: "ไฟล์สไลด์และเนื้อหาเรียนมีปริมาณมากเกินไปจนจับประเด็นสำคัญไม่ทัน ส่วนการทำงานกลุ่มในแชททำให้ไฟล์หาย ตามงานยาก และแบ่งงานไม่ชัดเจน ส่งผลให้นักศึกษาพักผ่อนไม่เพียงพอ เกิดความเครียดสะสม งานกลุ่มล่าช้า และได้คะแนนสอบต่ำกว่าที่ควรจะเป็น",
    evidence: "จากการสังเกตพฤติกรรมและพูดคุยกับเพื่อนนักศึกษาในมหาวิทยาลัย รวมถึงกระทู้บ่นเรื่องการเรียนและงานกลุ่มในโซเชียลมีเดียของมหาวิทยาลัย (เช่น X/Twitter แฮชแท็กมหาลัย และกลุ่ม Facebook) ที่มักพบปัญหาอ่านหนังสือไม่ทันและเพื่อนในกลุ่มตามงานยากทุกช่วงสอบ",
    insightHypothesis: "นักศึกษาไม่ได้ขี้เกียจ แต่ขาดเครื่องมือที่รวมศูนย์ (All-in-One) สำหรับย่อยข้อมูลจำนวนมากให้พร้อมอ่านในเวลาจำกัด และต้องการระบบตัวกลางที่ช่วยแบ่งงานกลุ่มและแจ้งเตือนเดดไลน์แทนตัวเอง เพื่อลดความเกรงใจในการทวงงานเพื่อน",
    nextValidation: "ยังไม่แน่ใจว่านักศึกษาแต่ละคณะ (เช่น สายวิทย์ สายศิลป์ สายวิศวะ) มีรูปแบบการสรุปเนื้อหาและแนวข้อสอบที่แตกต่างกันอย่างไร รวมถึงยอมจ่ายเงินค่าบริการรายเดือนที่ราคาเท่าไหร่ โดยจะเก็บข้อมูลเพิ่มจากการทำแบบสอบถามออนไลน์และสัมภาษณ์นักศึกษาตัวแทนจาก 5 คณะหลัก"
  },
  aiSolution: {
    types: ["LLM (Large Language Models)", "Speech AI (Whisper / Audio Synthesis)", "Recommendation Systems"],
    description: "แปลงสไลด์และเสียงบรรยายยาวๆ ให้กลายเป็นสรุปย่อ 15 นาที พร้อมข้อสอบจำลอง และมี AI Agent ทำหน้าที่เป็นตัวกลางจัดสรรงานกลุ่มและช่วยติดตามงานอัตโนมัติ"
  },
  useCaseScenario: {
    useCase: "ใช้เพื่อแปลงไฟล์สไลด์เรียนและเสียงอัดในห้องเรียนให้กลายเป็นสรุปย่อพร้อมแนวข้อสอบฝึกทำ และใช้สร้างพื้นที่ทำงานกลุ่มที่ AI ช่วยแตกหัวข้องานย่อย (Task) กำหนดเดดไลน์ และติดตามความคืบหน้าของสมาชิกในกลุ่มอัตโนมัติ",
    scenario: "เหลือเวลาอีก 5 วันจะถึงสัปดาห์สอบไฟนอล นักศึกษาต้องอ่านสไลด์เรียนรวม 4 วิชา มากกว่า 300 หน้า และยังมีโปรเจกต์กลุ่มวิชาบังคับที่ต้องส่งพร้อมกัน แต่สมาชิกในกลุ่มยังไม่เริ่มแบ่งงานและไม่มีใครกล้าทวงงานกันตรงๆ",
    flow: "เปิดเว็บไซต์ UniSync AI -> ล็อกอินด้วยอีเมลมหาวิทยาลัย -> อัปโหลดไฟล์สไลด์ PDF หรือไฟล์เสียงบรรยาย (หรืออัปโหลดโจทย์งานกลุ่ม) -> เลือกโหมด 'สรุปเนื้อหา + สร้างข้อสอบจำลอง' หรือ 'จัดสรรงานกลุ่มอัตโนมัติ' -> AI ประมวลผลและแสดงผลลัพธ์ -> กดแชร์ลิงก์สรุปหรือตารางงานให้เพื่อนในกลุ่มพร้อมตั้งค่าแจ้งเตือนเดดไลน์",
    outcome: "ได้รับชีทสรุปประเด็นสำคัญที่อ่านจบได้ใน 15 นาทีพร้อมแบบฝึกหัดทบทวนความเข้าใจ และได้ตารางแบ่งงานกลุ่มที่ชัดเจนว่าใครต้องทำอะไร ส่งวันไหน ช่วยให้เตรียมสอบทันเวลาและส่งงานกลุ่มได้ครบถ้วนโดยไม่ต้องเหนื่อยตามงานเอง"
  },
  impactAndFeasibility: {
    impact: {
      summary: "ช่วยลดเวลาในการเตรียมตัวอ่านหนังสือสอบลง 50% และลดปัญหาการส่งงานกลุ่มล่าช้า",
      metrics: [
        "เวลาเฉลี่ยที่ใช้ในการสรุปเนื้อหา 1 บทเรียนลดลงจาก 2 ชั่วโมง เหลือ 15 นาที",
        "อัตราการส่งงานกลุ่มทันตามกำหนดมากกว่า 90%",
        "คะแนนความพึงพอใจของผู้ใช้งานหลังผ่านช่วงสอบ (NPS > 60)"
      ]
    },
    feasibility: {
      resources: "Web Application (Frontend/Backend), LLM API (เช่น Gemini API หรือ OpenAI API), ระบบ OCR สำหรับอ่านไฟล์ PDF ภาษาไทย และนักพัฒนา 2-3 คน",
      risks: "ความแม่นยำของ AI ในการอ่านสไลด์ที่มีกราฟหรือสูตรคำนวณซับซ้อน โอกาสที่ AI จะสรุปข้อมูลคลาดเคลื่อน (Hallucination) และต้นทุนค่า API ต่อจำนวนผู้ใช้งานที่ต้องควบคุมให้คุ้มค่า",
      solutions: "ใช้ Grounding เทคนิค อ้างอิงเลขหน้าสไลด์ทุกจุดเพื่อให้นักศึกษาตรวจสอบได้ และทำ Caching ระบบสรุปสำหรับวิชาที่เรียนซ้ำกัน"
    },
    valueAndRevenue: {
      valueTarget: "ผู้ได้รับคุณค่าคือนักศึกษาที่ประหยัดเวลาและได้ผลการเรียนดีขึ้น รวมถึงมหาวิทยาลัยที่ได้อัตราการเรียนจบและคุณภาพการศึกษาสูงขึ้น",
      pricingModel: "รูปแบบ Freemium (นักศึกษาใช้ฟีเจอร์พื้นฐานฟรี และสมัครแพ็กเกจ Pro ราคาประหยัดช่วงสอบ เช่น 99 บาท/เดือน) หรือขายสิทธิ์การใช้งานแบบ Campus License ให้กับทางคณะ/มหาวิทยาลัย"
    }
  }
};
