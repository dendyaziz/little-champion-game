// Web Audio API procedural sound synthesizer for instant zero-latency feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kids_sound_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('kids_sound_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cheerful bubble pop sound for tapping items
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;
    
    // Quick upward pitch sweep
    osc.frequency.setValueAtTime(380, startTime);
    osc.frequency.exponentialRampToValueAtTime(860, startTime + 0.08);

    gain.gain.setValueAtTime(0.4, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.12);
  }

  // Sparkling chime for correct answers
  public playChime(pitchMultiplier: number = 1.0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const baseFreq = notes[Math.floor(Math.random() * notes.length)] * pitchMultiplier;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const startTime = ctx.currentTime;

    osc.frequency.setValueAtTime(baseFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, startTime + 0.2);

    gain.gain.setValueAtTime(0.35, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.28);
  }

  // Sweet, gentle low-volume bell ding for correct taps in Pick mode
  public playCorrectBell() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;

    // Fundamental crystal tone (1046.5 Hz - C6)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, startTime);

    gain1.gain.setValueAtTime(0.22, startTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(startTime);
    osc1.stop(startTime + 0.32);

    // Subtle metallic bell chime harmonic (2637 Hz - E7)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2637, startTime);

    gain2.gain.setValueAtTime(0.08, startTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(startTime);
    osc2.stop(startTime + 0.16);
  }

  // Clear, friendly cartoon "uh-oh / boing" sound for wrong taps (audible and distinct)
  public playWobble() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;

    // Warm low-pass filter to keep sound rounded and friendly while remaining punchy
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.connect(ctx.destination);

    // Tone 1: Gentle descending cartoon chirp (290Hz -> 230Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(290, startTime);
    osc1.frequency.exponentialRampToValueAtTime(220, startTime + 0.11);

    gain1.gain.setValueAtTime(0.55, startTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

    osc1.connect(gain1);
    gain1.connect(filter);
    osc1.start(startTime);
    osc1.stop(startTime + 0.12);

    // Tone 2: Lower cartoon spring "bonk" (190Hz -> 120Hz with slight vibrato wobble)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    const t2 = startTime + 0.08;
    osc2.frequency.setValueAtTime(200, t2);
    osc2.frequency.exponentialRampToValueAtTime(120, t2 + 0.22);

    gain2.gain.setValueAtTime(0.55, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.24);

    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start(t2);
    osc2.stop(t2 + 0.24);
  }

  // Victory fanfare arpeggio
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [392, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const startTime = ctx.currentTime + idx * 0.1;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // Star pop-in chime on score screen
  public playStarDing(index: number = 0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00];
    const freq = scale[Math.min(index, scale.length - 1)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;

    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.4, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.4);
  }

  // Playful descending 4-note cartoon losing sound effect ("wah-wah-wah-waaah")
  public playGameOver() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, ctx.currentTime);
    filter.connect(ctx.destination);

    // 4 chromatic descending notes: G4, F#4, F4, E4 (with gentle downward slide on final note)
    const steps = [
      { freq: 392.00, delay: 0.00, dur: 0.16, slideTo: 382.00 },
      { freq: 369.99, delay: 0.16, dur: 0.16, slideTo: 360.00 },
      { freq: 349.23, delay: 0.32, dur: 0.16, slideTo: 340.00 },
      { freq: 329.63, delay: 0.48, dur: 0.42, slideTo: 277.18 },
    ];

    steps.forEach((step) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + step.delay;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(step.freq, t);
      osc.frequency.exponentialRampToValueAtTime(step.slideTo, t + step.dur);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + step.dur);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(t);
      osc.stop(t + step.dur);
    });
  }
}

export const sound = new SoundEngine();
