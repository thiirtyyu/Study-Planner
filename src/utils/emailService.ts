/**
 * Email Notification Service for Student Groups
 * Generates polite, structured reminder emails that can be opened in 1 click
 * via Gmail Web, Mail Client (Outlook / Windows Mail), or copied to clipboard.
 */

export interface EmailReminderData {
  toEmail: string;
  toName: string;
  taskTitle: string;
  dueDate: string;
  projectName: string;
  subjectCode: string;
  senderName: string;
  senderEmail: string;
  tone: 'gentle' | 'formal' | 'urgent';
  customNote?: string;
}

export function buildReminderEmailSubject(data: EmailReminderData): string {
  if (data.tone === 'urgent') {
    return `[ด่วนไฟนอล] แจ้งเตือนงาน "${data.taskTitle}" (${data.subjectCode}) ใกล้ถึงเดดไลน์`;
  }
  if (data.tone === 'formal') {
    return `[UniSync AI] แจ้งเตือนสถานะงานกลุ่ม: ${data.taskTitle} - วิชา ${data.subjectCode}`;
  }
  return `[UniSync AI] สะกิดเตือนงานกลุ่ม "${data.taskTitle}" - โปรเจกต์ ${data.projectName}`;
}

export function buildReminderEmailBody(data: EmailReminderData): string {
  if (data.tone === 'urgent') {
    return `สวัสดีครับ/ค่ะ คุณ${data.toName}

[ข้อความแจ้งเตือนด่วนจากระบบ UniSync AI - ส่งโดย ${data.senderName}]

งานชิ้นนี้กำลังจะถึงกำหนดส่งในเร็วๆ นี้ครับ:
• วิชา: ${data.subjectCode} (${data.projectName})
• งานที่ต้องส่ง: ${data.taskTitle}
• กำหนดส่ง: ${data.dueDate}

${data.customNote ? `โน้ตเพิ่มเติมจากเพื่อน: "${data.customNote}"\n\n` : ''}หากเสร็จแล้วหรือมีความคืบหน้า รบกวนอัปเดตสถานะในระบบ UniSync หรือส่งไฟล์ให้เพื่อนๆ ในกลุ่มทราบด้วยนะครับ จะได้ช่วยตรวจและรวบรวมส่งทันตามกำหนดครับ

ขอบคุณมากๆ ครับ
${data.senderName} (ผ่านระบบ UniSync AI)`;
  }

  if (data.tone === 'formal') {
    return `เรียน คุณ${data.toName}

ระบบ UniSync AI ขอแจ้งเตือนกำหนดการส่งงานกลุ่มวิชา ${data.subjectCode} (${data.projectName})

รายละเอียดงาน:
- ชื่องาน: ${data.taskTitle}
- กำหนดส่ง: ${data.dueDate}
- ผู้ติดตามงาน: ${data.senderName} (${data.senderEmail})

${data.customNote ? `หมายเหตุเพิ่มเติม: ${data.customNote}\n\n` : ''}ขอความกรุณาตรวจสอบและอัปเดตสถานะการทำงานในระบบ เพื่อให้การกระจายภาระงานของทีมเป็นไปอย่างเรียบร้อยตามแผน

ขอแสดงความนับถือ
ระบบบริหารจัดการงานกลุ่ม UniSync AI`;
  }

  // Gentle (Default)
  return `สวัสดีครับ/ค่ะ คุณ${data.toName} ✨

บอท UniSync AI มาช่วยสะกิดเตือนเบาๆ แทนนาย ${data.senderName} ครับ/ค่ะ

โปรเจกต์: ${data.projectName} (วิชา ${data.subjectCode})
งานที่คุณดูแลอยู่: ${data.taskTitle}
กำหนดส่ง: ${data.dueDate}

${data.customNote ? `เพื่อนฝากบอกมาว่า: "${data.customNote}"\n\n` : ''}สบายดีไหมครับ? หากติดขัดหรือเจอปัญหาตรงไหน ไม่ต้องเกรงใจน้า ทักบอกเพื่อนในกลุ่มหรือตอบกลับอีเมลนี้ได้เลย เพื่อนๆ ในทีมพร้อมช่วยซัพพอร์ตเสมอครับ 💙

สู้ๆ นะครับ!
ระบบ UniSync AI (เพื่อนคู่คิดช่วงสอบ)`;
}

/**
 * 1-Click Open in Gmail Web compose window
 * Works on all modern browsers without requiring any desktop email client setup!
 */
export function openInGmailWeb(data: EmailReminderData): void {
  const subject = encodeURIComponent(buildReminderEmailSubject(data));
  const body = encodeURIComponent(buildReminderEmailBody(data));
  const to = encodeURIComponent(data.toEmail);
  const cc = encodeURIComponent(data.senderEmail);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}&cc=${cc}`;
  window.open(gmailUrl, '_blank');
}

/**
 * Opens the native mail client (Outlook, Apple Mail, Windows Mail) via mailto:
 */
export function openInMailto(data: EmailReminderData): void {
  const subject = encodeURIComponent(buildReminderEmailSubject(data));
  const body = encodeURIComponent(buildReminderEmailBody(data));
  const to = encodeURIComponent(data.toEmail);
  const cc = encodeURIComponent(data.senderEmail);

  const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}&cc=${cc}`;
  window.open(mailtoUrl, '_blank');
}

/**
 * Copies the formatted email content to clipboard
 */
export async function copyEmailToClipboard(data: EmailReminderData): Promise<boolean> {
  const fullText = `เรื่อง: ${buildReminderEmailSubject(data)}\nถึง: ${data.toEmail}\n\n${buildReminderEmailBody(data)}`;
  try {
    await navigator.clipboard.writeText(fullText);
    return true;
  } catch {
    return false;
  }
}
