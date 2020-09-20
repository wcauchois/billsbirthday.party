export enum Sound {
  Explosion = "/explosion-1.mp3",
}

export class SoundManager {
  private static readonly instance = new SoundManager();
  private readonly soundMap = new Map<Sound, AudioBuffer>();
  private readonly context: AudioContext;

  constructor() {
    this.context = new AudioContext();
  }

  static get() {
    return SoundManager.instance;
  }

  private async loadSound(sound: Sound) {
    const response = await fetch(sound.toString());
    const array = await response.arrayBuffer();
    const buffer = await this.context.decodeAudioData(array);
    this.soundMap.set(sound, buffer);
  }

  play(sound: Sound) {
    const buffer = this.soundMap.get(sound);
    if (!buffer) {
      return;
    }
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(0);
  }

  preload() {
    // There might be concurrency bugs in this, bleh
    for (const value of Object.values(Sound)) {
      if (!this.soundMap.has(value)) {
        this.loadSound(value).catch(err => {
          console.error(err);
        });
      }
    }
  }
}
