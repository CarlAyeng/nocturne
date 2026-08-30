import { Rng } from '../utils/seededRandom'

/* ============================================================= *
 *  AudioEngine
 *  ----------------------------------------------------------------
 *  Primary mode (offline): a procedural Web Audio "pad" synthesized
 *  per-track from a seed — a filtered chord with slow LFO movement.
 *  A virtual transport clock advances against the track's metadata
 *  duration so play/pause/seek/next/repeat all behave like a real
 *  player, and an AnalyserNode feeds the visualizer.
 *
 *  Upgrade path: if a track has `audioUrl`, an <audio> element is
 *  played instead (routed through the same analyser), so dropping
 *  real MP3s into /public/audio "just works".
 * ============================================================= */

export interface EngineTrack {
  id: string
  duration: number
  audioUrl?: string
  seed: number
}

type Mode = 'synth' | 'audio'

const ROOTS = [130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 246.94] // C3..B3

export class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private compressor: DynamicsCompressorNode | null = null
  private analyser: AnalyserNode | null = null

  // synth graph
  private voiceGain: GainNode | null = null
  private filter: BiquadFilterNode | null = null
  private voices: OscillatorNode[] = []
  private mods: OscillatorNode[] = []
  private builtFor: string | null = null

  // audio-element graph
  private audioEl: HTMLAudioElement | null = null
  private mediaSrc: MediaElementAudioSourceNode | null = null

  private mode: Mode = 'synth'
  private track: EngineTrack | null = null
  private _volume = 0.8
  private _muted = false

  // transport (synth)
  private _playing = false
  private _position = 0
  private _lastPerf = 0
  private raf = 0

  private timeCbs = new Set<(t: number) => void>()
  private endedCbs = new Set<() => void>()

  /* ---------------- context / graph ---------------- */

  private ensureContext(): AudioContext {
    if (this.ctx) return this.ctx
    const Ctor: typeof AudioContext =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctor()
    const master = ctx.createGain()
    master.gain.value = 0
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -18
    compressor.knee.value = 24
    compressor.ratio.value = 4
    compressor.attack.value = 0.005
    compressor.release.value = 0.25
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.82

    compressor.connect(master)
    master.connect(analyser)
    analyser.connect(ctx.destination)

    this.ctx = ctx
    this.master = master
    this.compressor = compressor
    this.analyser = analyser
    return ctx
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser
  }

  /** Subscribe once per frame to the analyser's frequency data, on an rAF loop.
   *  Returns an unsubscribe function. */
  onAnalyser(cb: (data: Uint8Array) => void): () => void {
    const loop = () => {
      const a = this.analyser
      if (a && this._playing) {
        const buf = a.frequencyBinCount
        const data = new Uint8Array(buf)
        a.getByteFrequencyData(data)
        cb(data)
      }
      this._analyserRaf = requestAnimationFrame(loop)
    }
    this._analyserRaf = requestAnimationFrame(loop)
    return () => {
      if (this._analyserRaf) cancelAnimationFrame(this._analyserRaf)
    }
  }

  private _analyserRaf = 0

  /* ---------------- track lifecycle ---------------- */

  /** Prepare a track for playback (stops any current sound). Does not start. */
  load(track: EngineTrack): void {
    this.stopSound()
    this.track = track
    this._position = 0
    this._playing = false
    this.mode = track.audioUrl ? 'audio' : 'synth'
    if (this.mode === 'audio') this.prepareAudioEl(track)
  }

  private prepareAudioEl(track: EngineTrack) {
    try {
      this.ensureContext()
      if (!this.audioEl) {
        this.audioEl = new Audio()
        this.audioEl.crossOrigin = 'anonymous'
        this.audioEl.preload = 'auto'
        this.audioEl.addEventListener('ended', () => this.emitEnded())
      }
      this.audioEl.src = track.audioUrl!
      this.audioEl.load()
      if (this.ctx && !this.mediaSrc) {
        this.mediaSrc = this.ctx.createMediaElementSource(this.audioEl)
        this.mediaSrc.connect(this.compressor!)
      }
    } catch {
      // If the element route fails, fall back to synth.
      this.mode = 'synth'
    }
  }

  private buildVoices(track: EngineTrack) {
    const ctx = this.ensureContext()
    const now = ctx.currentTime
    const rng = new Rng((track.seed || 1) * 2654435761)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    const baseCutoff = rng.range(720, 1500)
    filter.frequency.value = baseCutoff
    filter.Q.value = rng.range(2.5, 6)

    const voiceGain = ctx.createGain()
    voiceGain.gain.value = 0.16

    const root = rng.pick(ROOTS)
    const minor = rng.chance(0.62)
    const third = Math.pow(2, (minor ? 3 : 4) / 12)
    const fifth = Math.pow(2, 7 / 12)
    const freqs = [root, root * third, root * fifth, root * 2]

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = i === 0 ? 'sine' : rng.pick(['sine', 'triangle'] as const)
      osc.frequency.value = f
      osc.detune.value = rng.range(-7, 7)
      const g = ctx.createGain()
      g.gain.value = i === 0 ? 1 : rng.range(0.45, 0.8)
      osc.connect(g)
      g.connect(filter)
      osc.start(now)
      this.voices.push(osc)
    })

    filter.connect(voiceGain)
    voiceGain.connect(this.compressor!)

    // slow filter sweep for movement
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = rng.range(0.05, 0.18)
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = rng.range(120, 340)
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start(now)
    this.mods.push(lfo)

    // gentle tremolo
    const trem = ctx.createOscillator()
    trem.type = 'sine'
    trem.frequency.value = rng.range(0.18, 0.55)
    const tremGain = ctx.createGain()
    tremGain.gain.value = 0.04
    trem.connect(tremGain)
    tremGain.connect(voiceGain.gain)
    trem.start(now)
    this.mods.push(trem)

    this.filter = filter
    this.voiceGain = voiceGain
    this.builtFor = track.id
  }

  private stopSound() {
    // fade + stop synth voices
    const ctx = this.ctx
    if (ctx) {
      try {
        this.master?.gain.setTargetAtTime(0, ctx.currentTime, 0.015)
      } catch {
        /* noop */
      }
    }
    for (const o of this.voices) {
      try {
        o.stop()
        o.disconnect()
      } catch {
        /* noop */
      }
    }
    for (const m of this.mods) {
      try {
        m.stop()
        m.disconnect()
      } catch {
        /* noop */
      }
    }
    this.voices = []
    this.mods = []
    try {
      this.filter?.disconnect()
      this.voiceGain?.disconnect()
    } catch {
      /* noop */
    }
    this.filter = null
    this.voiceGain = null
    this.builtFor = null

    if (this.audioEl) {
      try {
        this.audioEl.pause()
      } catch {
        /* noop */
      }
    }
    this.stopRaf()
  }

  /* ---------------- transport ---------------- */

  async play(): Promise<void> {
    if (!this.track) return
    const ctx = this.ensureContext()
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {})

    if (this.mode === 'audio' && this.audioEl) {
      this.master?.gain.setTargetAtTime(this._muted ? 0 : 1, ctx.currentTime, 0.02)
      this.audioEl.volume = this._muted ? 0 : this._volume
      try {
        await this.audioEl.play()
      } catch {
        // autoplay/loading issue -> fall back to synth for this track
        this.mode = 'synth'
      }
    }

    if (this.mode === 'synth') {
      if (this.builtFor !== this.track.id) this.buildVoices(this.track)
      this.master?.gain.setTargetAtTime(this._muted ? 0 : this._volume, ctx.currentTime, 0.02)
    }

    this._lastPerf = performance.now()
    this._playing = true
    this.startRaf()
  }

  pause(): void {
    if (!this._playing) return
    this._position = this.getCurrentTime()
    this._playing = false
    const ctx = this.ctx
    if (this.mode === 'audio' && this.audioEl) {
      this.audioEl.pause()
    } else if (ctx) {
      this.master?.gain.setTargetAtTime(0, ctx.currentTime, 0.02)
    }
    this.stopRaf()
  }

  seek(seconds: number): void {
    const dur = this.getDuration()
    const t = Math.max(0, Math.min(seconds, dur))
    this._position = t
    this._lastPerf = performance.now()
    if (this.mode === 'audio' && this.audioEl) {
      try {
        this.audioEl.currentTime = t
      } catch {
        /* noop */
      }
    }
    this.emitTime(t)
  }

  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v))
    if (this._volume > 0) this._muted = false
    this.applyVolume()
  }

  setMuted(muted: boolean): void {
    this._muted = muted
    this.applyVolume()
  }

  private applyVolume() {
    const ctx = this.ctx
    if (!ctx) return
    const target = this._muted ? 0 : this._volume
    if (this.mode === 'audio' && this.audioEl) {
      this.audioEl.volume = target
      this.master?.gain.setTargetAtTime(this._playing ? 1 : 0, ctx.currentTime, 0.02)
    } else if (this._playing) {
      this.master?.gain.setTargetAtTime(target, ctx.currentTime, 0.02)
    }
  }

  getCurrentTime(): number {
    if (this.mode === 'audio' && this.audioEl && !Number.isNaN(this.audioEl.currentTime)) {
      return this.audioEl.currentTime
    }
    if (!this._playing) return this._position
    const elapsed = (performance.now() - this._lastPerf) / 1000
    return Math.min(this._position + elapsed, this.getDuration())
  }

  getDuration(): number {
    if (this.mode === 'audio' && this.audioEl && isFinite(this.audioEl.duration) && this.audioEl.duration > 0) {
      return this.audioEl.duration
    }
    return this.track?.duration ?? 0
  }

  get isPlaying(): boolean {
    return this._playing
  }

  get volume(): number {
    return this._volume
  }

  get muted(): boolean {
    return this._muted
  }

  /* ---------------- rAF pump ---------------- */

  private startRaf() {
    if (this.raf) return
    const tick = () => {
      const t = this.getCurrentTime()
      this.emitTime(t)
      if (this.mode === 'synth' && t >= this.getDuration() - 0.05 && this.getDuration() > 0) {
        this._playing = false
        this._position = this.getDuration()
        this.stopRaf()
        this.emitEnded()
        return
      }
      this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }

  private stopRaf() {
    if (this.raf) {
      cancelAnimationFrame(this.raf)
      this.raf = 0
    }
  }

  /* ---------------- events ---------------- */

  onTime(cb: (t: number) => void): () => void {
    this.timeCbs.add(cb)
    return () => this.timeCbs.delete(cb)
  }
  onEnded(cb: () => void): () => void {
    this.endedCbs.add(cb)
    return () => this.endedCbs.delete(cb)
  }
  private emitTime(t: number) {
    this.timeCbs.forEach((cb) => cb(t))
  }
  private emitEnded() {
    this.endedCbs.forEach((cb) => cb())
  }
}

/* App-lifetime singleton (survives React StrictMode remounts). */
let _engine: AudioEngine | null = null
export function getEngine(): AudioEngine {
  if (!_engine) _engine = new AudioEngine()
  return _engine
}
