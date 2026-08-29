import { useState, useEffect } from 'react'
import facebookGif from './assets/facebook.gif'
import askGif from './assets/1.webp'
import { Folders } from './Folders.jsx'
import { RelationshipTimer } from './RelationshipTimer.jsx'
import { HeartTrail } from './HeartTrail.jsx'
import { sounds } from './utils/SoundEffects.js'
import confetti from 'canvas-confetti'
import './App.css'

const NO_PHRASES = [
  'تؤ',
  'سمسم انا حبيبك🥺',
  'اكيد بالغلط 🧐',
  'بصي انا عسول ازاي 🥺👉👈',
  'لا ده الزرار الغلط يا روحي 🚨',
  'لا مفيش هروب انتي حبيبتي 🏃‍♂️💨',
  'فلبي الصغير لا يتحمل 💔',
  'Error 404 🤖',
  'طب هجبلك شكولاتى 🍫',
  'فكري تاني يا عمري 🌸',
  'دوسي ايوة و ريحيني 🥰'
]

const TABS = [
  { id: 'folders', label: 'شوية كلام لازم تعرفيه', icon: '📂' },
  { id: 'timer', label: 'عارفة بقالنا قد ايه عارفين بعض ؟', icon: '⏳' },
]

function App() {
  const [accepted, setAccepted] = useState(() => {
    return localStorage.getItem('love_app_accepted') === 'true'
  })
  const [activeTab, setActiveTab] = useState('folders')
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [noIndex, setNoIndex] = useState(0)
  const [noAttempts, setNoAttempts] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(true) // Default ON

  // Floating background decorative hearts
  const [ambientHearts] = useState(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 94 + 3,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 5
    }))
  })

  useEffect(() => {
    sounds.setMuted(isMuted)
  }, [isMuted])

  // Try auto-starting ambient music on mount (sound manager will also unlock on first click)
  useEffect(() => {
    if (isMusicPlaying && !isMuted) {
      sounds.startAmbient()
    }
  }, [isMusicPlaying, isMuted])

  const handleAccept = () => {
    setAccepted(true)
    localStorage.setItem('love_app_accepted', 'true')
    sounds.playFanfare()

    // Multi-burst celebration confetti cannon
    const end = Date.now() + 2.5 * 1000
    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff4d6d', '#ff758f', '#c084fc', '#fbbf24']
      })
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff4d6d', '#ff758f', '#c084fc', '#fbbf24']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  // Playful dodging algorithm
  const floatAway = () => {
    sounds.playDodge()
    setNoAttempts((prev) => prev + 1)
    setNoIndex((prev) => (prev + 1) % NO_PHRASES.length)

    const maxDistance = Math.min(180, 100 + noAttempts * 8)
    const randomX = (Math.random() - 0.5) * maxDistance * 2
    const randomY = (Math.random() - 0.5) * maxDistance * 2

    setOffset({ x: randomX, y: randomY })
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    sounds.playPop()
  }

  const toggleMusic = () => {
    const playing = sounds.toggleAmbient()
    setIsMusicPlaying(playing)
  }

  const toggleMute = () => {
    const nextMute = !isMuted
    setIsMuted(nextMute)
    if (nextMute && isMusicPlaying) {
      setIsMusicPlaying(false)
    }
  }

  const handleCustomAudioUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      await sounds.loadCustomAudioFile(file)
      setIsMusicPlaying(true)
      sounds.playChime()
      alert(`تم تحميل وتشغيل الأغنية: ${file.name} 💖 بنجاح!`)
    }
    e.target.value = ''
  }

  const handleResetProposal = () => {
    if (window.confirm(' عايزة تجريبي السؤال من الاول ؟ 💖')) {
      setAccepted(false)
      localStorage.removeItem('love_app_accepted')
      setNoAttempts(0)
      setNoIndex(0)
      setOffset({ x: 0, y: 0 })
      sounds.playPop()
    }
  }

  // Dynamic scale for Yes button
  const yesButtonScale = Math.min(1.45, 1 + noAttempts * 0.07)

  return (
    <div className="main-wrapper" dir="rtl">
      {/* Interactive Cursor / Touch Heart Trail */}
      <HeartTrail enabled={true} />

      {/* Floating Ambient Background Hearts */}
      <div className="ambient-hearts-container" aria-hidden="true">
        {ambientHearts.map((h) => (
          <span
            key={h.id}
            className="ambient-heart"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`
            }}
          >
            💖
          </span>
        ))}
      </div>

      {/* Top Floating Utility Bar */}
      <header className="top-nav-bar">
        <div className="nav-brand">
          <span className="brand-dot"></span>
          <span className="brand-title">إلى حبيبة قلبي ودلوعتي 👑</span>
        </div>

        <div className="nav-controls">

          <button
            type="button"
            className={`audio-toggle-btn ${isMusicPlaying ? 'active' : ''}`}
            onClick={toggleMusic}
            title={isMusicPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
          >
            <span className={`music-icon ${isMusicPlaying ? 'spin-anim' : ''}`}>🎵</span>
            <span className="btn-label">{isMusicPlaying ? 'الموسيقى: تعمل' : 'الموسيقى: متوقفة'}</span>
          </button>

          <button
            type="button"
            className={`mute-btn ${isMuted ? 'muted' : ''}`}
            onClick={toggleMute}
            title={isMuted ? 'إلغاء كتم المؤثرات الصوتية' : 'كتم المؤثرات الصوتية'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-container">
        {!accepted ? (
          /* ================= PHASE 1: THE QUESTION ================= */
          <div className="proposal-view">
            <div className="gif-frame">
              <img
                src={askGif}
                alt="GIF حب لطيف"
                className="proposal-gif"
              />
              <span className="gif-sparkle">✨</span>
            </div>

            <h1 className="proposal-title">بتحبيني يسمسم ؟ 💖</h1>
            <p className="proposal-subtitle">
              {noAttempts > 0
                ? `حاولتي دوسي على "تؤ" ${noAttempts} ${noAttempts === 1 ? 'مرة' : 'مرات'}!`
                : 'فكري كويس...مفيش غير اختيار واحد! 🌸'}
            </p>

            <div className="button-group">
              <button
                type="button"
                className="yes-btn"
                style={{ transform: `scale(${yesButtonScale})` }}
                onClick={handleAccept}
              >
                ايوة ! طبعا 💖
              </button>

              <button
                type="button"
                className="no-btn-floating"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px)`
                }}
                onMouseEnter={floatAway}
                onTouchStart={floatAway}
                onClick={floatAway}
              >
                {NO_PHRASES[noIndex]}
              </button>
            </div>
          </div>
        ) : (
          /* ================= PHASE 2: ACCEPTED DASHBOARD ================= */
          <div className="dashboard-view">
            {/* Top Celebration Banner */}
            <div className="celebration-hero">
              <div className="celebration-gif-wrapper">
                <img
                  src={facebookGif}
                  alt="GIF احتفال بالحب"
                  className="celebration-gif"
                />
              </div>

              <div className="celebration-text">
                <h2 className="celebration-title">❤️ ايوة كده انتي حبيبتي</h2>
              </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <nav className="dashboard-tabs-bar" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Active Tab Panel */}
            <div className="tab-content-container">
              {activeTab === 'folders' && <Folders />}
              {activeTab === 'timer' && <RelationshipTimer startDate="2026-05-05" />}
            </div>

            {/* Footer Reset Option */}
            <footer className="dashboard-footer">
              <button
                type="button"
                className="replay-question-btn"
                onClick={handleResetProposal}
              >
                🔄 تجربي تاني ؟
              </button>
            </footer>
          </div>
        )}
      </main>
    </div>
  )
}

export default App