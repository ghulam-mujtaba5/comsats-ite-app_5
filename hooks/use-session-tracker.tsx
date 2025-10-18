"use client"

import { useEffect, useState, useRef } from 'react'
import styles from './use-session-tracker.module.css';

interface SessionTrackerOptions {
  /** Minimum active session time (in ms) before wellness notifications are allowed */
  minSessionTime?: number
  /** How often to check for user activity (in ms) */
  checkInterval?: number
  /** Time of inactivity (in ms) before considering session paused */
  inactivityThreshold?: number
}

export function useSessionTracker(options: SessionTrackerOptions = {}) {
  const {
    minSessionTime = 45 * 60 * 1000, // 45 minutes default
    checkInterval = 60 * 1000, // 1 minute
    inactivityThreshold = 5 * 60 * 1000, // 5 minutes
  } = options

  const [activeTime, setActiveTime] = useState(0)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [isActive, setIsActive] = useState(true)
  const startTimeRef = useRef(Date.now())

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now())
      setIsActive(true)
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    // Throttle activity updates to avoid too many state updates
    let throttleTimeout: NodeJS.Timeout | null = null
    const throttledHandleActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          handleActivity()
          throttleTimeout = null
        }, 1000) // Update at most once per second
      }
    }

    events.forEach(event => {
      document.addEventListener(event, throttledHandleActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledHandleActivity)
      })
      if (throttleTimeout) clearTimeout(throttleTimeout)
    }
  }, [])

  // Calculate active time and check for inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivity

      if (timeSinceLastActivity < inactivityThreshold) {
        // User is active, increment active time
        setActiveTime(prev => prev + checkInterval)
        setIsActive(true)
      } else {
        // User is inactive
        setIsActive(false)
      }
    }, checkInterval)

    return () => clearInterval(interval)
  }, [lastActivity, checkInterval, inactivityThreshold])

  const shouldShowWellnessNotifications = activeTime >= minSessionTime && isActive

  const resetSession = () => {
    startTimeRef.current = Date.now()
    setActiveTime(0)
    setLastActivity(Date.now())
  }

  return {
    /** Total active time in milliseconds */
    activeTime,
    /** Whether user is currently active (not idle) */
    isActive,
    /** Whether wellness notifications should be shown (after minimum session time) */
    shouldShowWellnessNotifications,
    /** Active time in minutes (for display) */
    activeMinutes: Math.floor(activeTime / 60000),
    /** Reset the session timer */
    resetSession,
  }
}
