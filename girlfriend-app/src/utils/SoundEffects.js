// Web Audio API Sound Synthesizer + Custom Background Music Support with IndexedDB Persistence

const DB_NAME = 'LoveAppAudioDB'
const STORE_NAME = 'audioStore'

function openAudioDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return resolve(null)
    }

    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => resolve(null)
  })
}

async function saveCustomAudioBlob(blob) {
  try {
    const db = await openAudioDB()
    if (!db) return

    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(blob, 'bgSong')
  } catch (e) {
    console.warn('Could not save audio to IndexedDB', e)
  }
}

async function getCustomAudioBlob() {
  try {
    const db = await openAudioDB()
    if (!db) return null

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get('bgSong')
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

class SoundController {
  constructor() {
    this.ctx = null
    this.isMuted = false
    this.ambientLoopInterval = null
    this.isAmbientPlaying = true
    this.unlocked = false
    this.audioElement = null
    this.customSongName = ''

    if (typeof window !== 'undefined') {
      this.initAudioElement()

      const unlockAudio = () => {
        this.init()
        if (this.isAmbientPlaying && !this.isMuted && this.audioElement) {
          this.audioElement.play().catch(() => {})
        }

        window.removeEventListener('pointerdown', unlockAudio, true)
        window.removeEventListener('click', unlockAudio, true)
        window.removeEventListener('touchstart', unlockAudio, true)
        window.removeEventListener('keydown', unlockAudio, true)
      }

      window.addEventListener('pointerdown', unlockAudio, { once: true, capture: true })
      window.addEventListener('click', unlockAudio, { once: true, capture: true })
      window.addEventListener('touchstart', unlockAudio, { once: true, capture: true })
      window.addEventListener('keydown', unlockAudio, { once: true, capture: true })
    }
  }

  initAudioElement() {
    const audioUrl = '/kadim-al-saherzeidini-ishqan.mp3'
    this.audioElement = new Audio(audioUrl)
    this.audioElement.preload = 'auto'
    this.audioElement.loop = true
    this.audioElement.volume = 0.6

    this.audioElement.addEventListener('error', () => {
      if (this.audioElement && this.audioElement.src !== `${window.location.origin}${audioUrl}`) {
        this.audioElement.src = audioUrl
      }
    })

    this.checkSavedCustomAudio()
  }

  async checkSavedCustomAudio() {
    try {
      const savedBlob = await getCustomAudioBlob()
      if (savedBlob && this.audioElement) {
        const wasPlaying = !this.audioElement.paused
        this.audioElement.src = URL.createObjectURL(savedBlob)
        this.customSongName = 'أغنية مخصصة'
        if (wasPlaying && this.isAmbientPlaying && !this.isMuted) {
          this.audioElement.play().catch(() => {})
        }
      }
    } catch {
      // Ignore
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    if (this.audioElement && this.isAmbientPlaying && !this.isMuted && this.audioElement.paused) {
      this.audioElement.play().catch(() => {})
    }

    this.unlocked = true
  }

  async loadCustomAudioFile(file) {
    if (!file) return

    try {
      await saveCustomAudioBlob(file)
      const url = URL.createObjectURL(file)

      if (this.audioElement) {
        this.audioElement.pause()
      }

      this.audioElement = new Audio(url)
      this.audioElement.loop = true
      this.audioElement.volume = 0.6
      this.useAudioFile = true
      this.customSongName = file.name

      if (this.isAmbientPlaying && !this.isMuted) {
        this.audioElement.play().catch(() => {})
      }
    } catch (err) {
      console.error('Failed to load custom audio file:', err)
    }
  }

  setMuted(muted) {
    this.isMuted = muted

    if (this.audioElement) {
      this.audioElement.muted = muted
    }

    if (muted) {
      if (this.ambientLoopInterval) {
        clearInterval(this.ambientLoopInterval)
        this.ambientLoopInterval = null
      }

      if (this.audioElement) {
        this.audioElement.pause()
      }
    } else if (this.isAmbientPlaying) {
      this.startAmbient()
    }
  }

  playDodge() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      const now = this.ctx.currentTime

      osc.frequency.setValueAtTime(240, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.15)
    } catch {
      // Ignore
    }
  }

  playPop() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      const now = this.ctx.currentTime

      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.08)
    } catch {
      // Ignore
    }
  }

  playChime() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        const startTime = this.ctx.currentTime + index * 0.07

        osc.frequency.setValueAtTime(freq, startTime)

        gain.gain.setValueAtTime(0.12, startTime)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + 0.45)
      })
    } catch {
      // Ignore
    }
  }

  playFanfare() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const notes = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.12 },
        { f: 1046.5, d: 0.35 }
      ]

      let currentOffset = 0
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'triangle'
        const startTime = this.ctx.currentTime + currentOffset

        osc.frequency.setValueAtTime(n.f, startTime)

        gain.gain.setValueAtTime(0.2, startTime)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + n.d)

        currentOffset += n.d * 0.8
      })
    } catch {
      // Ignore
    }
  }

  playHeartbeat() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      [0, 0.22].forEach((offset) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        const startTime = this.ctx.currentTime + offset

        osc.frequency.setValueAtTime(85, startTime)
        osc.frequency.exponentialRampToValueAtTime(45, startTime + 0.14)

        gain.gain.setValueAtTime(0.25, startTime)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + 0.15)
      })
    } catch {
      // Ignore
    }
  }

  startAmbient() {
    this.isAmbientPlaying = true
    if (this.isMuted) return

    if (!this.audioElement) {
      this.initAudioElement()
    }

    if (this.audioElement) {
      this.audioElement.muted = false
      this.audioElement.play().catch(() => {})
    }
  }

  stopAmbient() {
    this.isAmbientPlaying = false
    if (this.audioElement) {
      this.audioElement.pause()
    }
  }

  toggleAmbient() {
    if (this.isAmbientPlaying) {
      this.stopAmbient()
      return false
    }

    this.startAmbient()
    return true
  }
}

export const sounds = new SoundController()
