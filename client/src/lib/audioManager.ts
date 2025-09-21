// Advanced Audio Manager for Gamefolio Underwater Experience
export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private sources: Map<string, AudioBufferSourceNode> = new Map();
  private isInitialized = false;
  private isMuted = false;
  
  // Audio configuration
  private config = {
    masterVolume: 0.7,
    ambientVolume: 0.4,
    effectsVolume: 0.6,
    musicVolume: 0.3
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.config.masterVolume;

      // Load underwater sounds
      await this.loadSounds();
      
      this.isInitialized = true;
      console.log('🔊 AudioManager initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AudioManager:', error);
    }
  }

  private async loadSounds(): Promise<void> {
    const soundFiles = [
      { name: 'ambient', url: '/sounds/background.mp3' },
      { name: 'swim', url: '/sounds/hit.mp3' }, // Repurpose as swimming sound
      { name: 'interaction', url: '/sounds/success.mp3' }
    ];

    const loadPromises = soundFiles.map(async (sound) => {
      try {
        const response = await fetch(sound.url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
        this.sounds.set(sound.name, audioBuffer);
        console.log(`🎵 Loaded sound: ${sound.name}`);
      } catch (error) {
        console.warn(`⚠️ Failed to load sound ${sound.name}:`, error);
      }
    });

    await Promise.all(loadPromises);
  }

  // Resume audio context (required for user interaction)
  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
      console.log('🔊 Audio context resumed');
    }
  }

  // Play ambient underwater sounds with looping
  playAmbient(): void {
    if (!this.isInitialized || this.isMuted) return;
    
    const ambientBuffer = this.sounds.get('ambient');
    if (!ambientBuffer || !this.audioContext || !this.masterGain) return;

    // Stop existing ambient if playing
    this.stopSound('ambient');

    // Create new source
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = ambientBuffer;
    source.loop = true;
    source.loopStart = 0;
    source.loopEnd = ambientBuffer.duration;
    
    // Set volume for ambient sounds
    gainNode.gain.value = this.config.ambientVolume;
    
    // Connect audio graph
    source.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    // Start playing
    source.start(0);
    this.sources.set('ambient', source);
    
    console.log('🌊 Started ambient underwater sounds');
  }

  // Play swimming sound effects
  playSwimSound(intensity: number = 1): void {
    if (!this.isInitialized || this.isMuted) return;
    
    this.playOneShot('swim', this.config.effectsVolume * intensity, {
      playbackRate: 0.8 + (intensity * 0.4), // Vary pitch based on intensity
      detune: (Math.random() - 0.5) * 200 // Add slight random pitch variation
    });
  }

  // Play interaction sound effects
  playInteractionSound(): void {
    if (!this.isInitialized || this.isMuted) return;
    
    this.playOneShot('interaction', this.config.effectsVolume, {
      playbackRate: 1 + (Math.random() - 0.5) * 0.2,
      detune: (Math.random() - 0.5) * 100
    });
  }

  // Play bubble sound effects (synthetic)
  playBubbleSound(): void {
    if (!this.isInitialized || this.isMuted || !this.audioContext || !this.masterGain) return;

    // Create synthetic bubble sound using oscillator
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Configure oscillator for bubble-like sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);

    // Configure filter
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    filter.Q.value = 5;

    // Configure gain envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

    // Connect audio graph
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    // Play the sound
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Play one-shot sound effects
  private playOneShot(
    soundName: string, 
    volume: number = 1, 
    options: { playbackRate?: number; detune?: number } = {}
  ): void {
    const buffer = this.sounds.get(soundName);
    if (!buffer || !this.audioContext || !this.masterGain) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    if (options.playbackRate) source.playbackRate.value = options.playbackRate;
    if (options.detune) source.detune.value = options.detune;

    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(0);
    
    // Clean up after sound finishes
    source.onended = () => {
      gainNode.disconnect();
    };
  }

  // Stop a specific sound
  stopSound(soundName: string): void {
    const source = this.sources.get(soundName);
    if (source) {
      try {
        source.stop();
        source.disconnect();
        this.sources.delete(soundName);
      } catch (error) {
        // Sound may have already stopped
      }
    }
  }

  // Stop all sounds
  stopAll(): void {
    this.sources.forEach((source, name) => {
      this.stopSound(name);
    });
  }

  // Mute/unmute audio
  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : this.config.masterVolume;
    }
    console.log(`🔊 Audio ${muted ? 'muted' : 'unmuted'}`);
  }

  // Set master volume
  setMasterVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.value = this.config.masterVolume;
    }
  }

  // Set ambient volume
  setAmbientVolume(volume: number): void {
    this.config.ambientVolume = Math.max(0, Math.min(1, volume));
  }

  // Set effects volume
  setEffectsVolume(volume: number): void {
    this.config.effectsVolume = Math.max(0, Math.min(1, volume));
  }

  // Get current configuration
  getConfig() {
    return { ...this.config, isMuted: this.isMuted, isInitialized: this.isInitialized };
  }

  // Clean up audio resources
  dispose(): void {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.isInitialized = false;
    console.log('🔊 AudioManager disposed');
  }
}

// Create global audio manager instance
export const audioManager = new AudioManager();