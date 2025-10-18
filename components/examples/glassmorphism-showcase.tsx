/**
 * Example Component - Glassmorphism Showcase
 * Demonstrates all glass utilities and patterns
 */

import React from 'react';
import styles from './glassmorphism-showcase.module.css'

export function GlassmorphismShowcase() {
  return (
    <div className={styles.root}>
      <div className="container section">
        {/* Header */}
        <div className={`glass-panel-overlay ${styles.headerBlock}`}>
          <h1 className={styles.title}>
            🎨 Glassmorphism Design System
          </h1>
          <p className={styles.subtitle}>
            Modern glass UI components for light and dark modes
          </p>
        </div>

        {/* Glass Cards Grid */}
        <div className={`grid-cols-3 ${styles.mb2}`}>
          <div className="glass-card">
            <h3>Standard Card</h3>
            <p>Default glassmorphism effect with balanced opacity and blur.</p>
            <button className={`glass-button ${styles.mt1}`}>
              Learn More
            </button>
          </div>

          <div className="glass-card-subtle">
            <h3>Subtle Card</h3>
            <p>Less prominent glass effect for background elements.</p>
            <button className={`glass-button ${styles.mt1}`}>
              Explore
            </button>
          </div>

          <div className="glass-card-elevated">
            <h3>Elevated Card</h3>
            <p>More prominent with stronger shadow and higher opacity.</p>
            <button className={`glass-button-primary ${styles.mt1}`}>
              Get Started
            </button>
          </div>
        </div>

        {/* Colored Glass Cards */}
        <div className={`glass-panel ${styles.mb2}`}>
          <h2 className={styles.mb1_5}>Colored Glass Variants</h2>
          <div className="grid-cols-4">
            <div className="glass-card glass-blue">
              <h4>Blue</h4>
              <p>Tech & Innovation</p>
            </div>
            <div className="glass-card glass-indigo">
              <h4>Indigo</h4>
              <p>Features</p>
            </div>
            <div className="glass-card glass-purple">
              <h4>Purple</h4>
              <p>Premium</p>
            </div>
            <div className="glass-card glass-pink">
              <h4>Pink</h4>
              <p>Special</p>
            </div>
          </div>
        </div>

        {/* Buttons Showcase */}
        <div className={`glass-panel ${styles.mb2}`}>
          <h2 className={styles.mb1_5}>Glass Buttons</h2>
          <div className={styles.flexWrapRow}>
            <button className="glass-button">Standard</button>
            <button className="glass-button-primary">Primary</button>
            <button className={`glass-button ${styles.btnSmall}`}>
              Small
            </button>
            <button className={`glass-button-primary ${styles.btnLarge}`}>
              Large
            </button>
          </div>
        </div>

        {/* Form Example */}
        <div className="glass-panel-overlay">
          <h2 className={styles.mb1_5}>Glass Form Elements</h2>
          <div className={styles.formContainer}>
            <div className={styles.mb1}>
              <label className={styles.formLabel}>
                Email Address
              </label>
              <input 
                type="email" 
                className="glass-input" 
                placeholder="you@example.com"
              />
            </div>
            
            <div className={styles.mb1}>
              <label className={styles.formLabel}>
                Message
              </label>
              <textarea 
                className={`glass-input ${styles.textarea}`} 
                placeholder="Your message..."
                rows={4}
              />
            </div>
            
            <button className={`glass-button-primary ${styles.btnFull}`}>
              Send Message
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid-cols-4 ${styles.mt2}`}>
          <div className={`glass-card-subtle ${styles.textCenter}`}>
            <div className={styles.statNumber}>
              1,234
            </div>
            <div className={styles.muted}>Active Users</div>
          </div>
          
          <div className={`glass-card-subtle ${styles.textCenter}`}>
            <div className={styles.statNumber}>
              98%
            </div>
            <div className={styles.muted}>Satisfaction</div>
          </div>
          
          <div className={`glass-card-subtle ${styles.textCenter}`}>
            <div className={styles.statNumber}>
              24/7
            </div>
            <div className={styles.muted}>Support</div>
          </div>
          
          <div className={`glass-card-subtle ${styles.textCenter}`}>
            <div className={styles.statNumber}>
              50+
            </div>
            <div className={styles.muted}>Features</div>
          </div>
        </div>

        {/* Badges */}
        <div className={`glass-panel ${styles.mt2}`}>
          <h2 className={styles.mb1_5}>Glass Badges</h2>
          <div className={styles.chipsRow}>
            <span className="glass-badge">New</span>
            <span className="glass-badge">Premium</span>
            <span className="glass-badge">Featured</span>
            <span className="glass-badge">Popular</span>
            <span className="glass-badge">Limited</span>
          </div>
        </div>

        {/* Footer */}
        <div className={`glass-panel-overlay ${styles.footerBlock}`}>
          <p className={styles.footerText}>
            ✨ Glassmorphism Design System - Beautiful UI for Modern Apps
          </p>
          <p className={styles.footerSub}>
            Optimized for both light and dark modes
          </p>
        </div>
      </div>
    </div>
  );
}

export default GlassmorphismShowcase;
