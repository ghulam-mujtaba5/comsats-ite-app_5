'use client'

import React from 'react'
import { UnifiedGlassCard } from '@/components/shared/UnifiedGlassCard'
import { UnifiedGlassButton } from '@/components/shared/UnifiedGlassButton'
import styles from './light-mode-demo.module.css'

const LightModeDemo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundEffect}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
      </div>

      <div className={styles.contentWrapper}>
        <h1 className={styles.heading}>
          <span className={styles.gradientText}>Light Mode</span> Glassmorphism
        </h1>
        
        <p className={styles.subheading}>
          Experience the clean, crisp glass effects optimized for daylight viewing
        </p>

        <div className={styles.cardGrid}>
          <UnifiedGlassCard variant="subtle" interactive>
            <h3 className={styles.cardTitle}>Subtle Glass</h3>
            <p className={styles.cardDescription}>
              Lightweight frosted effect with high transparency
            </p>
          </UnifiedGlassCard>

          <UnifiedGlassCard variant="base" interactive glow>
            <h3 className={styles.cardTitle}>Base Glass</h3>
            <p className={styles.cardDescription}>
              Classic frosted glass with balanced opacity
            </p>
          </UnifiedGlassCard>

          <UnifiedGlassCard variant="medium" interactive layered>
            <h3 className={styles.cardTitle}>Layered Glass</h3>
            <p className={styles.cardDescription}>
              Multi-layered effect with depth perception
            </p>
          </UnifiedGlassCard>

          <UnifiedGlassCard variant="strong" interactive depth glow>
            <h3 className={styles.cardTitle}>3D Glass</h3>
            <p className={styles.cardDescription}>
              Enhanced 3D effect with transform perspective
            </p>
          </UnifiedGlassCard>
        </div>

        <div className={styles.buttonGroup}>
          <UnifiedGlassButton variant="base" size="lg">
            Get Started
          </UnifiedGlassButton>
          <UnifiedGlassButton variant="premium" size="lg" glow>
            Premium Experience
          </UnifiedGlassButton>
        </div>
      </div>
    </div>
  )
}

export default LightModeDemo