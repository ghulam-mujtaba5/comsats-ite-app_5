/**
 * CampusAxis Animation Utilities
 * Lightweight, GPU-optimized celebration and emotional animations
 */

import confetti from 'canvas-confetti'
import * as party from 'party-js'

// Animation configuration
const ANIMATION_DURATION = 3000 // 3 seconds
const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Confetti Burst Animation
 * Perfect for: User signup, achievement unlock, milestone reached
 */
export function triggerConfetti(options?: {
  particleCount?: number
  spread?: number
  origin?: { x: number; y: number }
}) {
  if (REDUCED_MOTION) return

  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  }

  confetti({
    ...defaults,
    ...options,
    colors: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'],
  })
}

/**
 * Confetti Cannon - Multiple bursts
 * Perfect for: Major achievements, event completion
 */
export function triggerConfettiCannon() {
  if (REDUCED_MOTION) return

  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'],
  }

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

/**
 * Fireworks Animation
 * Perfect for: Leaderboard rank up, major milestones
 */
export function triggerFireworks(duration = ANIMATION_DURATION) {
  if (REDUCED_MOTION) return

  const animationEnd = Date.now() + duration
  const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981']

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2,
      },
      colors,
    })
  }, 250)
}

/**
 * Sparkle Effect
 * Perfect for: Hover effects, small wins, acknowledgments
 */
export function triggerSparkles(element: HTMLElement) {
  if (REDUCED_MOTION) return

  party.sparkles(element, {
    count: party.variation.range(20, 40),
    speed: party.variation.range(100, 400),
    size: party.variation.range(0.8, 1.2),
  })
}

/**
 * Heart Burst Animation
 * Perfect for: Thank you, appreciation, likes
 */
export function triggerHeartBurst(element?: HTMLElement) {
  if (REDUCED_MOTION) return

  const target = element || document.body

  confetti({
    particleCount: 30,
    spread: 60,
    origin: { y: 0.6 },
    shapes: ['circle'],
    colors: ['#EC4899', '#F472B6', '#FCA5A5'],
    scalar: 1.2,
  })
}

/**
 * Success Glow Effect
 * Perfect for: Form submission, button clicks
 */
export function triggerSuccessGlow(element: HTMLElement) {
  if (REDUCED_MOTION) return

  element.classList.add('success-glow-animation')
  setTimeout(() => {
    element.classList.remove('success-glow-animation')
  }, 2000)
}

/**
 * Balloon Float Animation
 * Perfect for: Event registration, team creation
 */
export function triggerBalloons() {
  if (REDUCED_MOTION) return

  const count = 5
  const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981']

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: 200,
        origin: {
          x: Math.random() * 0.8 + 0.1,
          y: 1,
        },
        colors: [colors[i % colors.length]],
        shapes: ['circle'],
        gravity: -0.3,
        scalar: 3,
        drift: Math.random() - 0.5,
      })
    }, i * 200)
  }
}

/**
 * Party Popper Effect
 * Perfect for: Community events, team achievements
 */
export function triggerPartyPopper(element?: HTMLElement) {
  if (REDUCED_MOTION) return

  const target = element || document.body

  confetti({
    particleCount: 150,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'],
  })

  confetti({
    particleCount: 150,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'],
  })
}

/**
 * Calm Mode Animation
 * Perfect for: Stress relief, focus mode
 */
export function triggerCalmEffect() {
  if (REDUCED_MOTION) return

  confetti({
    particleCount: 50,
    startVelocity: 10,
    spread: 360,
    ticks: 300,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    colors: ['#60A5FA', '#93C5FD', '#DBEAFE'],
    shapes: ['circle'],
    scalar: 0.6,
    gravity: 0.3,
    drift: 0,
  })
}

/**
 * XP/Level Up Effect
 * Perfect for: Gamification progress, points earned
 */
export function triggerLevelUp() {
  if (REDUCED_MOTION) return

  // Stars burst upward
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.8 },
    startVelocity: 45,
    colors: ['#FBBF24', '#FCD34D', '#FDE047', '#FACC15'],
    shapes: ['star'],
    gravity: 0.6,
  })

  // Circular glow
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 360,
      origin: { y: 0.7 },
      startVelocity: 25,
      colors: ['#FBBF24', '#FCD34D'],
      shapes: ['circle'],
      scalar: 0.8,
    })
  }, 200)
}

/**
 * Trophy Shine Effect
 * Perfect for: Badge earned, achievement unlocked
 */
export function triggerTrophyShine() {
  if (REDUCED_MOTION) return

  const end = Date.now() + 1500

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FFFF00'],
      shapes: ['star'],
      scalar: 1.5,
    })

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FFFF00'],
      shapes: ['star'],
      scalar: 1.5,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

/**
 * Contribution Accepted Animation
 * Perfect for: Content approval, resource accepted
 */
export function triggerContributionAccepted() {
  if (REDUCED_MOTION) return

  // Green checkmark burst
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#10B981', '#34D399', '#6EE7B7'],
    shapes: ['circle', 'square'],
    scalar: 1,
  })
}

/**
 * Motivational Burst
 * Perfect for: Daily goal met, streak maintained
 */
export function triggerMotivationBurst() {
  if (REDUCED_MOTION) return

  confetti({
    particleCount: 60,
    spread: 80,
    origin: { y: 0.65 },
    colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE047'],
    startVelocity: 40,
    gravity: 0.8,
  })
}

// Animation type mapping for easy component integration
export type AnimationType =
  | 'confetti'
  | 'confetti-cannon'
  | 'fireworks'
  | 'sparkles'
  | 'hearts'
  | 'balloons'
  | 'party-popper'
  | 'calm'
  | 'level-up'
  | 'trophy'
  | 'contribution'
  | 'motivation'

export function triggerAnimation(type: AnimationType, element?: HTMLElement) {
  switch (type) {
    case 'confetti':
      triggerConfetti()
      break
    case 'confetti-cannon':
      triggerConfettiCannon()
      break
    case 'fireworks':
      triggerFireworks()
      break
    case 'sparkles':
      if (element) triggerSparkles(element)
      break
    case 'hearts':
      triggerHeartBurst(element)
      break
    case 'balloons':
      triggerBalloons()
      break
    case 'party-popper':
      triggerPartyPopper(element)
      break
    case 'calm':
      triggerCalmEffect()
      break
    case 'level-up':
      triggerLevelUp()
      break
    case 'trophy':
      triggerTrophyShine()
      break
    case 'contribution':
      triggerContributionAccepted()
      break
    case 'motivation':
      triggerMotivationBurst()
      break
  }
}
