/**
 * Improved Speech Engine
 * - Breaks Thai text into short sentences for natural pacing
 * - Adds pauses between sentences
 * - Handles Web Speech API quirks on Windows
 */

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private queue: string[] = [];
  private isActive = false;
  private isPaused = false;
  private currentRate = 1.0;
  private onFinishCallback?: () => void;
  private onSentenceCallback?: (index: number, total: number) => void;
  private sentenceIndex = 0;
  private totalSentences = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private getVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    // Prefer Thai voice
    const thai = voices.find(v => v.lang.startsWith('th'));
    if (thai) return thai;
    // Fallback to any available voice
    return voices[0] || null;
  }

  /**
   * Split Thai/English text into natural sentence chunks
   */
  private splitIntoSentences(text: string): string[] {
    // Clean the text first
    const cleaned = text
      .replace(/[#*`_~>[\]]/g, '')     // Remove markdown
      .replace(/https?:\/\/\S+/g, '')   // Remove URLs
      .replace(/\s+/g, ' ')             // Normalize whitespace
      .trim();

    // Split on Thai sentence boundaries and punctuation
    const parts = cleaned.split(/(?<=[.!?。！？\n])\s*|(?<=ครับ|ค่ะ|นะ|เลย|ด้วย|ไป|มา)\s+/);
    
    // Further split long segments (max ~80 chars per chunk for natural pacing)
    const result: string[] = [];
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.length <= 100) {
        result.push(trimmed);
      } else {
        // Split on spaces roughly every 80 chars
        const words = trimmed.split(/\s+/);
        let chunk = '';
        for (const word of words) {
          if ((chunk + ' ' + word).length > 80 && chunk.length > 0) {
            result.push(chunk.trim());
            chunk = word;
          } else {
            chunk += (chunk ? ' ' : '') + word;
          }
        }
        if (chunk.trim()) result.push(chunk.trim());
      }
    }

    return result.filter(s => s.length > 0);
  }

  /**
   * Speak a single sentence and resolve when done
   */
  private speakOne(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || !this.isActive) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.getVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = 'th-TH';
      utterance.rate = Math.max(0.5, Math.min(this.currentRate, 2.0));
      utterance.pitch = 1.0;

      utterance.onend = () => {
        resolve();
      };
      utterance.onerror = () => {
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  /**
   * Process the sentence queue sequentially with short pauses
   */
  private async processQueue() {
    while (this.queue.length > 0 && this.isActive) {
      // Wait while paused
      while (this.isPaused && this.isActive) {
        await new Promise(r => setTimeout(r, 200));
      }
      if (!this.isActive) break;

      const sentence = this.queue.shift()!;
      this.sentenceIndex++;
      
      if (this.onSentenceCallback) {
        this.onSentenceCallback(this.sentenceIndex, this.totalSentences);
      }

      await this.speakOne(sentence);

      // Short pause between sentences for natural pacing
      if (this.queue.length > 0 && this.isActive) {
        await new Promise(r => setTimeout(r, 250));
      }
    }

    this.isActive = false;
    this.isPaused = false;
    if (this.onFinishCallback) {
      this.onFinishCallback();
    }
  }

  /**
   * Start speaking the full text
   */
  public speak(
    text: string,
    rate: number = 0.95,
    onFinish?: () => void,
    onSentence?: (index: number, total: number) => void
  ) {
    this.stop();

    this.currentRate = rate;
    this.onFinishCallback = onFinish;
    this.onSentenceCallback = onSentence;
    this.isActive = true;
    this.isPaused = false;
    this.sentenceIndex = 0;

    this.queue = this.splitIntoSentences(text);
    this.totalSentences = this.queue.length;

    if (this.queue.length === 0) {
      this.isActive = false;
      if (onFinish) onFinish();
      return;
    }

    this.processQueue();
  }

  public pause() {
    if (this.isActive && !this.isPaused) {
      this.isPaused = true;
      if (this.synth) this.synth.pause();
    }
  }

  public resume() {
    if (this.isActive && this.isPaused) {
      this.isPaused = false;
      if (this.synth) this.synth.resume();
    }
  }

  public stop() {
    this.isActive = false;
    this.isPaused = false;
    this.queue = [];
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public getIsActive(): boolean { return this.isActive; }
  public getIsPaused(): boolean { return this.isPaused; }

  public isSupported(): boolean {
    return !!(this.synth);
  }
}

export const speechEngine = new SpeechEngine();
