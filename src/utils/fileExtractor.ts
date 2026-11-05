/**
 * Improved File Extractor for PDF and Text files
 * Handles Thai text, encoding issues, and garbled output
 */

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export interface ExtractedContent {
  text: string;
  pageCount: number;
  fileName: string;
  hasReadableText: boolean;
}

export async function extractTextFromFile(file: File): Promise<ExtractedContent> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return extractPdf(file);
  }
  return extractPlainText(file);
}

async function extractPlainText(file: File): Promise<ExtractedContent> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      resolve({
        text: cleanText(text),
        pageCount: Math.max(1, Math.ceil(text.length / 1500)),
        fileName: file.name,
        hasReadableText: text.trim().length > 30,
      });
    };
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
    reader.readAsText(file, 'UTF-8');
  });
}

async function extractPdf(file: File): Promise<ExtractedContent> {
  const pdfjs = window.pdfjsLib;

  if (!pdfjs) {
    // If PDF.js is not loaded, tell user
    return {
      text: '',
      pageCount: 0,
      fileName: file.name,
      hasReadableText: false,
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    const maxPages = Math.min(pageCount, 80); // read up to 80 pages

    let allText = '';
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Build text with proper spacing
      let pageText = '';
      let lastY: number | null = null;
      for (const item of content.items) {
        const it = item as any;
        if (!it.str) continue;
        // Detect line breaks by Y-coordinate changes
        if (lastY !== null && Math.abs(it.transform[5] - lastY) > 5) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ')) {
          pageText += ' ';
        }
        pageText += it.str;
        lastY = it.transform[5];
      }

      if (pageText.trim()) {
        allText += `\n[หน้า ${i}]\n${pageText.trim()}\n`;
      }
    }

    const cleaned = cleanText(allText);
    const isReadable = hasThaiOrEnglish(cleaned) && cleaned.length > 50;

    return {
      text: cleaned,
      pageCount,
      fileName: file.name,
      hasReadableText: isReadable,
    };
  } catch (err) {
    console.error('PDF extraction error:', err);
    return {
      text: '',
      pageCount: 0,
      fileName: file.name,
      hasReadableText: false,
    };
  }
}

/**
 * Clean garbled text, excessive whitespace, and control characters
 */
function cleanText(raw: string): string {
  return raw
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Collapse multiple spaces into one
    .replace(/[ \t]+/g, ' ')
    // Collapse more than 2 consecutive newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove lines that are just numbers or very short (page numbers, etc.)
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      if (trimmed.length === 0) return true; // keep blank lines
      if (trimmed.length <= 2) return false;  // remove very short fragments
      if (/^\d+$/.test(trimmed)) return false; // remove standalone page numbers
      return true;
    })
    .join('\n')
    .trim();
}

/**
 * Check if text contains meaningful Thai or English content
 */
function hasThaiOrEnglish(text: string): boolean {
  // Thai Unicode range: \u0E00-\u0E7F
  const thaiCount = (text.match(/[\u0E00-\u0E7F]/g) || []).length;
  const englishCount = (text.match(/[a-zA-Z]/g) || []).length;
  return thaiCount > 10 || englishCount > 20;
}
