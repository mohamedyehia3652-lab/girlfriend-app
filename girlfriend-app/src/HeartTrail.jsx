import { useEffect } from 'react'

const PARTICLES = ['💖', '✨', '💕', '🌸', '💗', '⭐', '💝', '🥰']

export function HeartTrail({ enabled = true }) {
  useEffect(() => {
    if (!enabled) return

    let lastTime = 0
    const throttleMs = 35

    const createParticle = (x, y) => {
      const now = Date.now()
      if (now - lastTime < throttleMs) return
      lastTime = now

      const particle = document.createElement('span')
      particle.className = 'cursor-heart'
      
      const emoji = PARTICLES[Math.floor(Math.random() * PARTICLES.length)]
      particle.innerText = emoji
      
      // Slight random offset
      const offsetX = (Math.random() - 0.5) * 16
      const offsetY = (Math.random() - 0.5) * 16
      particle.style.left = `${x + offsetX}px`
      particle.style.top = `${y + offsetY}px`
      
      // Randomize particle size & rotation
      const size = Math.random() * 10 + 14
      const rotation = (Math.random() - 0.5) * 60
      particle.style.fontSize = `${size}px`
      particle.style.setProperty('--rot', `${rotation}deg`)

      document.body.appendChild(particle)

      setTimeout(() => {
        particle.remove()
      }, 950)
    }

    const handleMouseMove = (e) => {
      createParticle(e.clientX, e.clientY)
    }

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        createParticle(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [enabled])

  return null
}