'use client'

import React from 'react'
import { UnifiedGlassCard } from '@/components/shared/UnifiedGlassCard'
import { UnifiedGlassButton } from '@/components/shared/UnifiedGlassButton'
import styles from './documentation.module.css'

const GlassmorphismDocumentation = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Glassmorphism Design System</h1>
        <p className={styles.subtitle}>
          A comprehensive guide to implementing glassmorphism effects in CampusAxis
        </p>
      </div>

      <div className={styles.content}>
        <UnifiedGlassCard variant="base" className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.paragraph}>
            The CampusAxis Glassmorphism Design System provides a unified approach to implementing 
            frosted glass effects across both light and dark modes. Our system offers multiple 
            intensity levels and interactive variants to suit different UI needs.
          </p>
        </UnifiedGlassCard>

        <UnifiedGlassCard variant="base" className={styles.section}>
          <h2 className={styles.sectionTitle}>Component Variants</h2>
          
          <div className={styles.variantGrid}>
            <UnifiedGlassCard variant="subtle" interactive>
              <h3 className={styles.variantTitle}>Subtle</h3>
              <p className={styles.variantDescription}>
                Lowest intensity with minimal transparency. Best for backgrounds and non-interactive elements.
              </p>
            </UnifiedGlassCard>
            
            <UnifiedGlassCard variant="base" interactive>
              <h3 className={styles.variantTitle}>Base</h3>
              <p className={styles.variantDescription}>
                Balanced transparency and contrast. Ideal for standard UI components.
              </p>
            </UnifiedGlassCard>
            
            <UnifiedGlassCard variant="medium" interactive>
              <h3 className={styles.variantTitle}>Medium</h3>
              <p className={styles.variantDescription}>
                Enhanced transparency with stronger visual effect. Suitable for feature highlights.
              </p>
            </UnifiedGlassCard>
            
            <UnifiedGlassCard variant="strong" interactive>
              <h3 className={styles.variantTitle}>Strong</h3>
              <p className={styles.variantDescription}>
                Maximum transparency with deep visual effect. Best for primary content areas.
              </p>
            </UnifiedGlassCard>
            
            <UnifiedGlassCard variant="intense" interactive glow>
              <h3 className={styles.variantTitle}>Intense</h3>
              <p className={styles.variantDescription}>
                Highest intensity with glow effect. Perfect for premium experiences and CTAs.
              </p>
            </UnifiedGlassCard>
          </div>
        </UnifiedGlassCard>

        <UnifiedGlassCard variant="base" className={styles.section}>
          <h2 className={styles.sectionTitle}>Interactive Effects</h2>
          
          <div className={styles.effectsGrid}>
            <div className={styles.effectItem}>
              <UnifiedGlassCard variant="base" interactive className={styles.effectCard}>
                <h3 className={styles.effectTitle}>Interactive</h3>
                <p className={styles.effectDescription}>
                  Adds hover and active states for clickable elements
                </p>
              </UnifiedGlassCard>
            </div>
            
            <div className={styles.effectItem}>
              <UnifiedGlassCard variant="base" glow className={styles.effectCard}>
                <h3 className={styles.effectTitle}>Glow</h3>
                <p className={styles.effectDescription}>
                  Adds gradient glow effect on hover
                </p>
              </UnifiedGlassCard>
            </div>
            
            <div className={styles.effectItem}>
              <UnifiedGlassCard variant="base" layered className={styles.effectCard}>
                <h3 className={styles.effectTitle}>Layered</h3>
                <p className={styles.effectDescription}>
                  Adds gradient overlay for depth perception
                </p>
              </UnifiedGlassCard>
            </div>
            
            <div className={styles.effectItem}>
              <UnifiedGlassCard variant="base" depth className={styles.effectCard}>
                <h3 className={styles.effectTitle}>Depth</h3>
                <p className={styles.effectDescription}>
                  Enables 3D transformation effects
                </p>
              </UnifiedGlassCard>
            </div>
          </div>
        </UnifiedGlassCard>

        <UnifiedGlassCard variant="base" className={styles.section}>
          <h2 className={styles.sectionTitle}>Button Components</h2>
          
          <div className={styles.buttonGrid}>
            <UnifiedGlassButton variant="subtle">Subtle Button</UnifiedGlassButton>
            <UnifiedGlassButton variant="base">Base Button</UnifiedGlassButton>
            <UnifiedGlassButton variant="medium">Medium Button</UnifiedGlassButton>
            <UnifiedGlassButton variant="strong">Strong Button</UnifiedGlassButton>
            <UnifiedGlassButton variant="premium" glow>Premium Button</UnifiedGlassButton>
          </div>
          
          <div className={styles.buttonSizes}>
            <UnifiedGlassButton variant="base" size="sm">Small</UnifiedGlassButton>
            <UnifiedGlassButton variant="base" size="md">Medium</UnifiedGlassButton>
            <UnifiedGlassButton variant="base" size="lg">Large</UnifiedGlassButton>
          </div>
        </UnifiedGlassCard>

        <UnifiedGlassCard variant="base" className={styles.section}>
          <h2 className={styles.sectionTitle}>Implementation Guide</h2>
          
          <div className={styles.guideSteps}>
            <div className={styles.guideStep}>
              <h3 className={styles.stepTitle}>1. Import Components</h3>
              <pre className={styles.codeBlock}>
                {`import { UnifiedGlassCard, UnifiedGlassButton } from '@/components/shared'`}
              </pre>
            </div>
            
            <div className={styles.guideStep}>
              <h3 className={styles.stepTitle}>2. Use Glass Cards</h3>
              <pre className={styles.codeBlock}>
                {`<UnifiedGlassCard variant="base" interactive>
  <h3>Card Title</h3>
  <p>Card content</p>
</UnifiedGlassCard>`}
              </pre>
            </div>
            
            <div className={styles.guideStep}>
              <h3 className={styles.stepTitle}>3. Use Glass Buttons</h3>
              <pre className={styles.codeBlock}>
                {`<UnifiedGlassButton variant="premium" size="lg" glow>
  Premium Button
</UnifiedGlassButton>`}
              </pre>
            </div>
          </div>
        </UnifiedGlassCard>
      </div>
    </div>
  )
}

export default GlassmorphismDocumentation