/**
 * Web Speech Synthesis & Recognition helper for AuraBridge
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private listeners: Set<(isSpeaking: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (isSpeaking: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isSpeakingState));
  }

  public speak(text: string, options: { rate?: number; pitch?: number; lang?: string } = {}) {
    if (!this.synth || !text) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 0.95; // Slightly calmer default rate
    utterance.pitch = options.pitch ?? 1.0;
    utterance.lang = options.lang ?? 'en-US';

    const voices = this.synth.getVoices();
    // Prefer natural/gentle sounding voice if available
    const preferredVoice = voices.find(
      (v) =>
        (v.lang.startsWith(options.lang?.split('-')[0] || 'en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen'))) ||
        v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      this.notify();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const speechService = new SpeechService();
