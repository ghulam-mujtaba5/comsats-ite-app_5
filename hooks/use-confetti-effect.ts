'use client'

import { useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'

export interface ConfettiOptions {
  particleCount?: number
  spread?: number
  origin?: { x?: number; y?: number }
  colors?: string[]
  shapes?: ('circle' | 'square')[]
  gravity?: number
  drift?: number
  ticks?: number
  startVelocity?: number
  scalar?: number
}

export function useConfettiEffect() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fire = useCallback((options: ConfettiOptions = {}) => {
    const {
      particleCount = 100,
      spread = 70,
      origin = { x: 0.5, y: 0.5 },
      colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
      shapes = ['circle', 'square'],
      gravity = 1,
      drift = 0,
      ticks = 200,
      startVelocity = 45,
      scalar = 1,
    } = options

    confetti({
      particleCount,
      spread,
      origin,
      colors,
      shapes,
      gravity,
      drift,
      ticks,
      startVelocity,
      scalar,
      disableForReducedMotion: true,
    })
  }, [])

  const burst = useCallback(() => {
    fire({ particleCount: 150, spread: 100 })
  }, [fire])

  const rain = useCallback(() => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      fire({
        particleCount: 5,
        spread: 60,
        origin: { x: Math.random(), y: -0.1 },
        gravity: 0.8,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [fire])

  const fireworks = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.5 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
        disableForReducedMotion: true,
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const cannon = useCallback(() => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    }

    function fireConfetti(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        disableForReducedMotion: true,
      })
    }

    fireConfetti(0.25, { spread: 26, startVelocity: 55 })
    fireConfetti(0.2, { spread: 60 })
    fireConfetti(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fireConfetti(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fireConfetti(0.1, { spread: 120, startVelocity: 45 })
  }, [])

  const pride = useCallback(() => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
        disableForReducedMotion: true,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  const stars = useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star' as 'star'],
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
    }

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star'],
        disableForReducedMotion: true,
      })

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle'],
        disableForReducedMotion: true,
      })
    }

    setTimeout(shoot, 0)
    setTimeout(shoot, 100)
    setTimeout(shoot, 200)
  }, [])

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    fire,
    burst,
    rain,
    fireworks,
    cannon,
    pride,
    stars,
    cleanup,
  }
}
