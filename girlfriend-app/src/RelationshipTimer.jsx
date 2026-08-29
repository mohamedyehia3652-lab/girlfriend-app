import { useState, useEffect } from 'react'
import { sounds } from './utils/SoundEffects.js'



export function RelationshipTimer({ startDate = '2026-05-05' }) {
  const [currentStartDate, setCurrentStartDate] = useState(() => {
    return localStorage.getItem('love_start_date') || startDate
  })
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [dateInput, setDateInput] = useState(currentStartDate)

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  })

  useEffect(() => {
    const updateTime = () => {
      const start = new Date(currentStartDate).getTime()
      const now = new Date().getTime()
      let diff = now - start

      diff = Math.abs(diff)

      const totalSec = Math.floor(diff / 1000)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTime({ days, hours, minutes, seconds, totalSeconds: totalSec })
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [currentStartDate])

  const handleSaveDate = (e) => {
    e.preventDefault()
    if (dateInput) {
      setCurrentStartDate(dateInput)
      localStorage.setItem('love_start_date', dateInput)
      setIsEditingDate(false)
      sounds.playChime()
    }
  }

  const heartbeats = (time.totalSeconds * 1.3).toLocaleString('ar-EG', { maximumFractionDigits: 0 })
  const hoursLoved = (time.totalSeconds / 3600).toLocaleString('ar-EG', { maximumFractionDigits: 0 })

  return (
    <div className="timer-section-card" dir="rtl">
      <div className="timer-header">
        <span className="heart-icon-badge">⏳</span>
        <h3 className="timer-title">رحلة حبنا</h3>

      </div>


      <p className="timer-subtitle">
        كل ثانية ودقيقة تمر من يوم <span className="date-highlight">{currentStartDate}</span>
      </p>

      {/* Main Glassmorphic Countdown Digits */}
      <div className="digital-counter-grid">
        <div className="counter-digit-card">
          <span className="digit-value">{time.days}</span>
          <span className="digit-label">أيام</span>
        </div>
        <span className="digit-colon">:</span>
        <div className="counter-digit-card">
          <span className="digit-value">{String(time.hours).padStart(2, '0')}</span>
          <span className="digit-label">ساعات</span>
        </div>
        <span className="digit-colon">:</span>
        <div className="counter-digit-card">
          <span className="digit-value">{String(time.minutes).padStart(2, '0')}</span>
          <span className="digit-label">دقائق</span>
        </div>
        <span className="digit-colon">:</span>
        <div className="counter-digit-card">
          <span className="digit-value">{String(time.seconds).padStart(2, '0')}</span>
          <span className="digit-label">ثواني</span>
        </div>
      </div>

      

      {/* Sweet Relationship Stats */}
      <div className="love-stats-grid">
        <div className="love-stat-card">
          <span className="stat-icon">💓</span>
          <div className="stat-info">
            <span className="stat-number">~{heartbeats}</span>
            <span className="stat-desc">نبضة قلب في حبكِ</span>
          </div>
        </div>
        <div className="love-stat-card">
          <span className="stat-icon">✨</span>
          <div className="stat-info">
            <span className="stat-number">~{hoursLoved} ساعة</span>
            <span className="stat-desc">من الذكريات والمشاعر</span>
          </div>
        </div>
      </div>
    </div>
  )
}