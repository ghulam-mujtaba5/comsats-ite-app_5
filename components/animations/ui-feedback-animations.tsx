'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

// Button with ripple effect
export function RippleButton({ 
  children, 
  onClick,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    }
    
    setRipples(prev => [...prev, newRipple])
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
    
    if (onClick) onClick(e)
  }

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
      
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          initial={{ 
            width: 0, 
            height: 0, 
            opacity: 0.7,
            x: 0,
            y: 0
          }}
          animate={{ 
            width: 200, 
            height: 200, 
            opacity: 0,
            x: -100,
            y: -100
          }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </button>
  )
}

// Card with hover glow effect
export function GlowCard({ 
  children, 
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative group ${className}`}
      {...props}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition-all duration-300"></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg">
        {children}
      </div>
    </div>
  )
}

// Input with success pulse effect
export function SuccessInput({ 
  isSuccess = false,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { isSuccess?: boolean }) {
  return (
    <div className="relative">
      <input
        className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        {...props}
      />
      
      {isSuccess && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-green-500/20 border border-green-500 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  )
}

// Animated checkmark
export function AnimatedCheckmark({ 
  isVisible = true,
  size = 24,
  className = ''
}: { 
  isVisible?: boolean;
  size?: number;
  className?: string;
}) {
  if (!isVisible) return null

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </motion.div>
  )
}

// Page transition component
export function PageTransition({ 
  children,
  isVisible = true
}: { 
  children: React.ReactNode;
  isVisible?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}