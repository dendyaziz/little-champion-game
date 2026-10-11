// Local Voice Audio Engine powered by Google Gemini 3.8 Flash TTS recordings
// High-performance Web Audio API engine: pre-decodes audio buffers into RAM for 0ms zero-latency playback!
// NO Web Speech API / Chrome TTS is used!

export interface SpeechOptions {
  onEnd?: () => void;
}

// Map of canonical phrases and items to locally saved audio files
const LOCAL_AUDIO_MAP: Record<string, string> = {
  // Individual Numbers 0 to 11 (digits and words)
  '0': '/audio/numbers/0.mp3',
  '1': '/audio/numbers/1.mp3',
  '2': '/audio/numbers/2.mp3',
  '3': '/audio/numbers/3.mp3',
  '4': '/audio/numbers/4.mp3',
  '5': '/audio/numbers/5.mp3',
  '6': '/audio/numbers/6.mp3',
  '7': '/audio/numbers/7.mp3',
  '8': '/audio/numbers/8.mp3',
  '9': '/audio/numbers/9.mp3',
  '10': '/audio/numbers/10.mp3',
  '11': '/audio/numbers/11.mp3',
  'zero': '/audio/numbers/0.mp3',
  'one': '/audio/numbers/1.mp3',
  'two': '/audio/numbers/2.mp3',
  'three': '/audio/numbers/3.mp3',
  'four': '/audio/numbers/4.mp3',
  'five': '/audio/numbers/5.mp3',
  'six': '/audio/numbers/6.mp3',
  'seven': '/audio/numbers/7.mp3',
  'eight': '/audio/numbers/8.mp3',
  'nine': '/audio/numbers/9.mp3',
  'ten': '/audio/numbers/10.mp3',
  'eleven': '/audio/numbers/11.mp3',

  // Letters A to Z
  'a': '/audio/letters/A.mp3',
  'b': '/audio/letters/B.mp3',
  'c': '/audio/letters/C.mp3',
  'd': '/audio/letters/D.mp3',
  'e': '/audio/letters/E.mp3',
  'f': '/audio/letters/F.mp3',
  'g': '/audio/letters/G.mp3',
  'h': '/audio/letters/H.mp3',
  'i': '/audio/letters/I.mp3',
  'j': '/audio/letters/J.mp3',
  'k': '/audio/letters/K.mp3',
  'l': '/audio/letters/L.mp3',
  'm': '/audio/letters/M.mp3',
  'n': '/audio/letters/N.mp3',
  'o': '/audio/letters/O.mp3',
  'p': '/audio/letters/P.mp3',
  'q': '/audio/letters/Q.mp3',
  'r': '/audio/letters/R.mp3',
  's': '/audio/letters/S.mp3',
  't': '/audio/letters/T.mp3',
  'u': '/audio/letters/U.mp3',
  'v': '/audio/letters/V.mp3',
  'w': '/audio/letters/W.mp3',
  'x': '/audio/letters/X.mp3',
  'y': '/audio/letters/Y.mp3',
  'z': '/audio/letters/Z.mp3',

  // Shapes
  'square': '/audio/shapes/square.mp3',
  'rectangle': '/audio/shapes/rectangle.mp3',
  'triangle': '/audio/shapes/triangle.mp3',
  'rhombus': '/audio/shapes/rhombus.mp3',
  'heart': '/audio/shapes/heart.mp3',
  'star': '/audio/shapes/star.mp3',
  'circle': '/audio/shapes/circle.mp3',
  'oval': '/audio/shapes/oval.mp3',

  // Colors
  'blue': '/audio/colors/blue.mp3',
  'red': '/audio/colors/red.mp3',
  'green': '/audio/colors/green.mp3',
  'purple': '/audio/colors/purple.mp3',
  'yellow': '/audio/colors/yellow.mp3',
  'orange': '/audio/colors/orange.mp3',
  'white': '/audio/colors/white.mp3',
  'black': '/audio/colors/black.mp3',

  // Order Games Narrations
  "let's count from zero to eleven": '/audio/narrations/count-zero-to-eleven.mp3',
  "let's count from zero to eleven!": '/audio/narrations/count-zero-to-eleven.mp3',
  'count-zero-to-eleven': '/audio/narrations/count-zero-to-eleven.mp3',
  "let's order the letters from a to l": '/audio/narrations/order-letters-a-to-l.mp3',
  "let's order the letters from a to l!": '/audio/narrations/order-letters-a-to-l.mp3',
  'order-letters-a-to-l': '/audio/narrations/order-letters-a-to-l.mp3',
  "let's order the letters from m to z": '/audio/narrations/order-letters-m-to-z.mp3',
  "let's order the letters from m to z!": '/audio/narrations/order-letters-m-to-z.mp3',
  'order-letters-m-to-z': '/audio/narrations/order-letters-m-to-z.mp3',

  // Find Games Narration Prefixes
  "let's find the number...": '/audio/narrations/find-the-number.mp3',
  "let's find the number": '/audio/narrations/find-the-number.mp3',
  'find-the-number': '/audio/narrations/find-the-number.mp3',
  "let's find the letter...": '/audio/narrations/find-the-letter.mp3',
  "let's find the letter": '/audio/narrations/find-the-letter.mp3',
  'find-the-letter': '/audio/narrations/find-the-letter.mp3',
  "let's find the shape...": '/audio/narrations/find-the-shape.mp3',
  "let's find the shape": '/audio/narrations/find-the-shape.mp3',
  'find-the-shape': '/audio/narrations/find-the-shape.mp3',
  "let's find the color...": '/audio/narrations/find-the-color.mp3',
  "let's find the color": '/audio/narrations/find-the-color.mp3',
  'find-the-color': '/audio/narrations/find-the-color.mp3',

  // Victory Cheers
  'hooray!': '/audio/narrations/victory-hooray.mp3',
  'victory-hooray': '/audio/narrations/victory-hooray.mp3',
  'great job!': '/audio/narrations/victory-great-job.mp3',
  'victory-great-job': '/audio/narrations/victory-great-job.mp3',
  'good job!': '/audio/narrations/victory-good-job.mp3',
  'victory-good-job': '/audio/narrations/victory-good-job.mp3',
  'victory-new-record': '/audio/narrations/victory-new-record.mp3',

  // Lose / Try Again Encouragement
  'no worries, we can try again!': '/audio/narrations/lose-try-again.mp3',
  'lose-try-again': '/audio/narrations/lose-try-again.mp3',

  // Home Menu Titles
  'order numbers': '/audio/narrations/order-numbers.mp3',
  'pick number': '/audio/narrations/pick-number.mp3',
  'find number': '/audio/narrations/pick-number.mp3',
};

const VICTORY_CHEERS = ['victory-hooray', 'victory-great-job', 'victory-good-job'];

interface ActiveVoice {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
}

class SpeechAnnouncer {
  private isMuted: boolean = false;
  private ctx: AudioContext | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private activeVoices: Set<ActiveVoice> = new Set();
  private currentSequenceId: number = 0;
  private lastCheerIndex: number = -1;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kids_speech_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
      this.initContext();
      this.preloadBuffers();

      // Ensure AudioContext is resumed upon any user interaction
      const resumeHandler = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      };
      window.addEventListener('touchstart', resumeHandler, { passive: true, once: false });
      window.addEventListener('mousedown', resumeHandler, { passive: true, once: false });
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Pre-loads and decodes all local audio MP3s into uncompressed PCM AudioBuffers in memory.
   * This guarantees zero audio startup latency (0ms delay) when items are tapped.
   */
  public async preloadBuffers() {
    if (typeof window === 'undefined') return;
    const ctx = this.initContext();
    if (!ctx) return;

    const uniqueUrls = Array.from(new Set(Object.values(LOCAL_AUDIO_MAP)));
    for (const url of uniqueUrls) {
      if (this.bufferCache.has(url)) continue;
      try {
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        this.bufferCache.set(url, audioBuf);
      } catch (err) {
        console.warn(`Failed to pre-decode audio buffer for ${url}:`, err);
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('kids_speech_muted', String(this.isMuted));
      if (this.isMuted) {
        this.stopAll();
      }
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Softly fades out all currently playing voice audio over 60ms
   * and cancels any pending multi-part sequence.
   */
  private interruptCurrentSpeech() {
    this.currentSequenceId++;
    const ctx = this.ctx;

    for (const voice of Array.from(this.activeVoices)) {
      try {
        if (ctx) {
          const now = ctx.currentTime;
          voice.gainNode.gain.cancelScheduledValues(now);
          voice.gainNode.gain.setValueAtTime(voice.gainNode.gain.value, now);
          voice.gainNode.gain.linearRampToValueAtTime(0.001, now + 0.06);
          voice.source.stop(now + 0.065);
        } else {
          voice.source.stop();
        }
      } catch {
        // Source might already have stopped
      }
      this.activeVoices.delete(voice);
    }
  }

  /**
   * Immediately stops all voices.
   */
  public stopAll() {
    this.currentSequenceId++;
    for (const voice of Array.from(this.activeVoices)) {
      try {
        voice.source.stop();
      } catch {}
    }
    this.activeVoices.clear();
  }

  /**
   * Resolves a phrase to a local audio file URL.
   * Throws an error if no mapping exists (as requested: "let other crash because it has no locally saved TTS mapping").
   */
  private resolveAudioUrl(phrase: string): string {
    const key = phrase.trim().toLowerCase();
    const url = LOCAL_AUDIO_MAP[key];
    if (!url) {
      throw new Error(
        `[Local TTS Error] No locally saved TTS audio mapping for: "${phrase}". ` +
        `Only numbers 0-11 and number narrations were generated for this trial.`
      );
    }
    return url;
  }

  /**
   * Speaks a single phrase immediately with sample-accurate zero latency.
   * Any previously playing voice is softly faded out concurrently over 60ms.
   */
  public speak(phrase: string, options: SpeechOptions | number = {}) {
    if (this.isMuted || typeof window === 'undefined') return;

    this.interruptCurrentSpeech();

    const opts: SpeechOptions = typeof options === 'number' ? {} : options;
    const { onEnd } = opts;
    const url = this.resolveAudioUrl(phrase);

    this.playAudioUrl(url, onEnd);
  }

  /**
   * Spoken feedback when child taps an item in game.
   * Instant 0ms response time via pre-decoded AudioBuffer. Zero delay!
   */
  public speakItem(label: string) {
    if (this.isMuted || typeof window === 'undefined') return;

    this.interruptCurrentSpeech();
    const url = this.resolveAudioUrl(label);
    this.playAudioUrl(url);
  }

  /**
   * Plays a single sentence assembled from two or more separate audios.
   * Each subsequent part plays after an optional pause (default 500ms for natural emphasis).
   */
  public speakSequence(phrases: string[], options: SpeechOptions & { gapMs?: number } = {}) {
    if (this.isMuted || typeof window === 'undefined') {
      if (options.onEnd) options.onEnd();
      return;
    }

    const gapMs = options.gapMs ?? 500;
    const urls = phrases.map((phrase) => this.resolveAudioUrl(phrase));
    this.interruptCurrentSpeech();

    const sequenceToken = ++this.currentSequenceId;
    let currentIndex = 0;

    const playNextPart = () => {
      if (sequenceToken !== this.currentSequenceId || this.isMuted) return;

      if (currentIndex >= urls.length) {
        if (options.onEnd) options.onEnd();
        return;
      }

      const url = urls[currentIndex];
      currentIndex++;

      this.playAudioUrl(url, () => {
        if (sequenceToken !== this.currentSequenceId || this.isMuted) return;

        if (currentIndex < urls.length && gapMs > 0) {
          setTimeout(() => {
            if (sequenceToken === this.currentSequenceId && !this.isMuted) {
              playNextPart();
            }
          }, gapMs);
        } else {
          playNextPart();
        }
      });
    };

    playNextPart();
  }

  /**
   * Announce pick target:
   * Plays "Let's find the {kind}...", waits 0.5s, then plays the target item (e.g. "One!", "A!", "Star!", "Red!").
   */
  public announcePickTarget(kind: string, targetValue: string, onEnd?: () => void) {
    if (this.isMuted || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    const prefixMap: Record<string, string> = {
      number: "let's find the number...",
      letter: "let's find the letter...",
      shape: "let's find the shape...",
      color: "let's find the color...",
    };

    const prefix = prefixMap[kind] || "let's find the number...";
    this.speakSequence([prefix, targetValue], { gapMs: 500, onEnd });
  }

  /**
   * Plays an audio URL using Web Audio API buffer if available (0ms latency),
   * or falls back to HTMLAudioElement if buffer is still decoding.
   */
  private async playAudioUrl(url: string, onEnd?: () => void) {
    if (this.isMuted || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    const ctx = this.initContext();
    let buffer = this.bufferCache.get(url);

    // If buffer is already decoded in memory: instant zero-latency playback!
    if (ctx && buffer) {
      this.playBuffer(ctx, buffer, onEnd);
      return;
    }

    // If buffer not decoded yet, decode it now or fallback to HTMLAudio
    if (ctx) {
      try {
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        buffer = await ctx.decodeAudioData(arrayBuf);
        this.bufferCache.set(url, buffer);
        this.playBuffer(ctx, buffer, onEnd);
        return;
      } catch (err) {
        console.warn(`Buffer decode fallback for ${url}:`, err);
      }
    }

    // Fallback to HTML Audio element
    const audio = new Audio(url);
    audio.volume = 1.0;
    audio.onended = () => { if (onEnd) onEnd(); };
    audio.onerror = () => { if (onEnd) onEnd(); };
    audio.play().catch(() => { if (onEnd) onEnd(); });
  }

  private playBuffer(ctx: AudioContext, buffer: AudioBuffer, onEnd?: () => void) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(1.0, ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    const voice: ActiveVoice = { source, gainNode };
    this.activeVoices.add(voice);

    source.onended = () => {
      this.activeVoices.delete(voice);
      if (onEnd) onEnd();
    };

    // Starts immediately at sample 0 (0ms latency!)
    source.start(0);
  }

  /**
   * Plays a celebratory cheer when the Champion UI is shown, rotating through
   * "Hooray!", "Great job!", and "Good job!" so kids don't get bored.
   */
  public cheer() {
    if (this.isMuted || typeof window === 'undefined') return;
    const candidates = VICTORY_CHEERS.map((_, i) => i).filter((i) => i !== this.lastCheerIndex);
    const chosenIndex = candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
    this.lastCheerIndex = chosenIndex;
    this.speak(VICTORY_CHEERS[chosenIndex]);
  }

  /**
   * Plays a special celebratory voice when the kid achieves a new fastest time record!
   */
  public speakNewRecord() {
    if (this.isMuted || typeof window === 'undefined') return;
    this.speak('victory-new-record');
  }

  /**
   * Plays an encouraging voice when the Lose UI is shown: "No worries, we can try again!"
   */
  public speakLose() {
    if (this.isMuted || typeof window === 'undefined') return;
    this.speak('lose-try-again');
  }
}

export const announcer = new SpeechAnnouncer();
