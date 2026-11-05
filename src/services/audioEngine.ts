/**
 * Synthesizer for cognitive focus audio using Web Audio API:
 * - 10Hz Alpha Waves (Binaural carrier 200Hz / 210Hz)
 * - Brown Noise (Calibrated low-frequency acoustic masking for deep reading)
 * - Gentle Tibetan focus chime for session transitions
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private currentMode: 'none' | 'alpha' | 'brown' | 'library' = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  public playSound(mode: 'none' | 'alpha' | 'brown' | 'library', volume: number = 0.25) {
    this.stopSound();
    if (mode === 'none') {
      this.currentMode = 'none';
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    this.currentMode = mode;
    this.isPlaying = true;

    if (mode === 'alpha') {
      // Binaural beat: 200Hz Left, 210Hz Right -> 10Hz Alpha Wave
      const merger = this.ctx.createChannelMerger(2);

      this.oscLeft = this.ctx.createOscillator();
      this.oscLeft.type = 'sine';
      this.oscLeft.frequency.setValueAtTime(200, this.ctx.currentTime);

      this.oscRight = this.ctx.createOscillator();
      this.oscRight.type = 'sine';
      this.oscRight.frequency.setValueAtTime(210, this.ctx.currentTime);

      const gainLeft = this.ctx.createGain();
      gainLeft.gain.setValueAtTime(0.3, this.ctx.currentTime);
      const gainRight = this.ctx.createGain();
      gainRight.gain.setValueAtTime(0.3, this.ctx.currentTime);

      this.oscLeft.connect(gainLeft);
      this.oscRight.connect(gainRight);

      gainLeft.connect(merger, 0, 0);
      gainRight.connect(merger, 0, 1);

      merger.connect(this.masterGain);

      this.oscLeft.start();
      this.oscRight.start();
    } else if (mode === 'brown' || mode === 'library') {
      // Brown Noise Generator via White Noise + Lowpass Integration
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to shape into soothing gentle background
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(mode === 'library' ? 350 : 220, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.masterGain);
      whiteNoise.start();
      this.noiseNode = whiteNoise;
    }
  }

  public stopSound() {
    if (this.oscLeft) {
      try { this.oscLeft.stop(); } catch { /* ignore */ }
      this.oscLeft.disconnect();
      this.oscLeft = null;
    }
    if (this.oscRight) {
      try { this.oscRight.stop(); } catch { /* ignore */ }
      this.oscRight.disconnect();
      this.oscRight = null;
    }
    if (this.noiseNode) {
      try { (this.noiseNode as AudioBufferSourceNode).stop(); } catch { /* ignore */ }
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    this.isPlaying = false;
    this.currentMode = 'none';
  }

  public playChime() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now); // 528 Hz Solfeggio frequency
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.6);
  }

  public getStatus() {
    return { isPlaying: this.isPlaying, currentMode: this.currentMode };
  }
}

export const audioEngine = new AudioEngine();
