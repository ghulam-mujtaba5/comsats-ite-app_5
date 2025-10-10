"use client"

import { motion } from "framer-motion"

export function FocusPulse() {
  return (
    <motion.div
      className="relative"
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 absolute inset-0 animate-ping" />
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center relative">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400" />
        </div>
      </div>
    </motion.div>
  )
}

export function ConcentricCircles() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-purple-500"
          style={{
            width: 60 + i * 20,
            height: 60 + i * 20,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.3, 0.7],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2
          }}
        />
      ))}
      <motion.div
        className="w-8 h-8 rounded-full bg-purple-500"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

export function FocusBeam() {
  return (
    <div className="relative h-48 w-48 flex items-center justify-center">
      {/* Outer beam */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border-4 border-purple-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Inner beam */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border-4 border-indigo-500"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Center point */}
      <motion.div
        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
          style={{
            rotate: `${i * 45}deg`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  )
}