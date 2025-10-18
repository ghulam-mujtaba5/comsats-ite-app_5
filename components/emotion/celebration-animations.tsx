"use client"

import { motion } from "framer-motion"

export function SparkleBurst() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{
            rotate: `${i * 30}deg`,
            transformOrigin: "0 100px",
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [1, 0.7, 1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.1
          }}
        />
      ))}
      <motion.div
        className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

export function ConfettiSpray() {
  return (
    <div className="relative w-48 h-32 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${20 + Math.random() * 60}%`,
            backgroundColor: [
              "#fbbf24", // yellow
              "#ef4444", // red
              "#3b82f6", // blue
              "#10b981", // green
              "#ec4899", // pink
            ][Math.floor(Math.random() * 5)],
            rotate: `${Math.random() * 360}deg`,
          }}
          animate={{
            y: [100, -100],
            x: [0, (Math.random() - 0.5) * 100],
            rotate: [0, 360],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  )
}

export function TrophyShine() {
  return (
    <motion.div
      className="relative w-24 h-24"
      animate={{
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg opacity-20 blur-xl" />
      <div className="relative w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
        <svg
          className="w-12 h-12 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20.38C20.77 4 21.08 4.32 21.08 4.71C21.08 4.79 21.06 4.87 21.02 4.94L19.27 9.27C19.1 9.7 18.7 10 18.25 10H18.08L17.4 19.97C17.37 20.52 16.99 21 16.44 21H7.56C7.01 21 6.63 20.52 6.6 19.97L5.92 10H5.75C5.3 10 4.9 9.7 4.73 9.27L2.98 4.94C2.94 4.87 2.92 4.79 2.92 4.71C2.92 4.32 3.23 4 3.62 4H7ZM9 3V4H15V3H9ZM7.25 6L8 16H16L16.75 6H7.25Z" />
        </svg>
      </div>
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
        style={{
          transform: "skewX(-45deg)",
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </motion.div>
  )
}