"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function BreathingCircle() {
  return (
    <motion.div
      className="rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center"
      animate={{
        scale: [1, 1.2, 1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        width: 150,
        height: 150,
      }}
    >
      <div className="rounded-full bg-white/20 flex items-center justify-center"
        style={{
          width: 105,
          height: 105,
        }}
      >
        <motion.div
          className="rounded-full bg-white/30"
          animate={{
            scale: [1, 1.1, 1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: 60,
            height: 60,
          }}
        />
      </div>
    </motion.div>
  )
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([])
  
  useEffect(() => {
    // Initialize particles
    const initialParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }))
    setParticles(initialParticles)
    
    // Update particles periodically
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: (particle.x + (Math.random() - 0.5) * 2 + 100) % 100,
          y: (particle.y + (Math.random() - 0.5) * 2 + 100) % 100
        }))
      )
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  )
}

export function GradientWave() {
  return (
    <div className="relative h-32 w-full overflow-hidden rounded-lg">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        animate={{
          background: [
            "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)",
            "linear-gradient(to right, #818cf8, #ec4899, #60a5fa)",
            "linear-gradient(to right, #0ea5e9, #6366f1, #ec4899)",
            "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)",
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: `linear-gradient(to top, rgba(255,255,255,0.3), transparent)`,
            borderRadius: "50%",
            transform: `scaleX(${1 + i * 0.2})`,
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}
    </div>
  )
}