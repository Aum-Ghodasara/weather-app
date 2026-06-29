export class WeatherAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Generate White Noise for Rain
  private createRainNode() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 5000;

    noise.connect(filter).connect(this.ctx.destination);
    noise.start();
  }

  public toggleSound(shouldPlay: boolean) {
    if (shouldPlay && !this.isPlaying) {
      this.createRainNode();
      this.isPlaying = true;
    }
    // Add logic to stop nodes here
  }
}