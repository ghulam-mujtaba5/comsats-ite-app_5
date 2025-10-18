'use client'

import React from 'react'
import { UnifiedGlassCard } from '@/components/shared/UnifiedGlassCard'
import { UnifiedGlassButton } from '@/components/shared/UnifiedGlassButton'
import styles from './dark-mode-demo.module.css'

const DarkModeDemo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundEffect}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
      </div>

      <div className={styles.contentWrapper}>
        <h1 className={styles.heading}>
          <span className={styles.gradientText}>Dark Mode</span> Glassmorphism
        </h1>
        
        <p className={styles.subheading}>
          Experience the deep, rich glass effects optimized for low-light environments
        </p>

        <div className={styles.cardGrid}>
          <UnifiedGlassCard variant="subtle" interactive>
            <h3 className={styles.cardTitle}>Subtle Glass</h3>
            <p className={styles.cardDescription}>
              Lightweight glass effect with minimal transparency
            </p>
          </UnifiedGlassCard>

          <UnifiedGlassCard variant="base" interactive glow>
            <h3 className={styles.cardTitle}>Base Glass</h3>
            <p className={styles.cardDescription}>
              Balanced transparency with enhanced depth
            </p>
          </UnifiedGlassCard>

          <UnifiedGlassCard variant="medium" interactive layered>
            <h3 className={styles.cardTitle}>Layered Glass</h3>
            <p className={styles.cardDescription}>
              Multi-layered effect with gradient overlays
            </p>
          </UnifiedGlassCard>

          <UnifiedGlassCard variant="strong" interactive depth glow>
            <h3 className={styles.cardTitle}>Depth Glass</h3>
            <p className={styles.cardDescription}>
              Maximum depth with 3D transformation effects
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

export default DarkModeDemo