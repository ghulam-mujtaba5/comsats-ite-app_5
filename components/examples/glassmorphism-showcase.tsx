/**
 * Example Component - Glassmorphism Showcase
 * Demonstrates all glass utilities and patterns
 */

import React from 'react';

export function GlassmorphismShowcase() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div className="container section">
        {/* Header */}
        <div className="glass-panel-overlay" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            🎨 Glassmorphism Design System
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Modern glass UI components for light and dark modes
          </p>
        </div>

        {/* Glass Cards Grid */}
        <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
          <div className="glass-card">
            <h3>Standard Card</h3>
            <p>Default glassmorphism effect with balanced opacity and blur.</p>
            <button className="glass-button" style={{ marginTop: '1rem' }}>
              Learn More
            </button>
          </div>

          <div className="glass-card-subtle">
            <h3>Subtle Card</h3>
            <p>Less prominent glass effect for background elements.</p>
            <button className="glass-button" style={{ marginTop: '1rem' }}>
              Explore
            </button>
          </div>

          <div className="glass-card-elevated">
            <h3>Elevated Card</h3>
            <p>More prominent with stronger shadow and higher opacity.</p>
            <button className="glass-button-primary" style={{ marginTop: '1rem' }}>
              Get Started
            </button>
          </div>
        </div>

        {/* Colored Glass Cards */}
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Colored Glass Variants</h2>
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
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Glass Buttons</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="glass-button">Standard</button>
            <button className="glass-button-primary">Primary</button>
            <button className="glass-button" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Small
            </button>
            <button className="glass-button-primary" style={{ padding: '1rem 2rem' }}>
              Large
            </button>
          </div>
        </div>

        {/* Form Example */}
        <div className="glass-panel-overlay">
          <h2 style={{ marginBottom: '1.5rem' }}>Glass Form Elements</h2>
          <div style={{ maxWidth: '500px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: 500 
              }}>
                Email Address
              </label>
              <input 
                type="email" 
                className="glass-input" 
                placeholder="you@example.com"
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: 500 
              }}>
                Message
              </label>
              <textarea 
                className="glass-input" 
                placeholder="Your message..."
                rows={4}
                style={{ resize: 'vertical', minHeight: '100px' }}
              />
            </div>
            
            <button className="glass-button-primary" style={{ width: '100%' }}>
              Send Message
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid-cols-4" style={{ marginTop: '2rem' }}>
          <div className="glass-card-subtle" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              1,234
            </div>
            <div style={{ opacity: 0.8 }}>Active Users</div>
          </div>
          
          <div className="glass-card-subtle" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              98%
            </div>
            <div style={{ opacity: 0.8 }}>Satisfaction</div>
          </div>
          
          <div className="glass-card-subtle" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              24/7
            </div>
            <div style={{ opacity: 0.8 }}>Support</div>
          </div>
          
          <div className="glass-card-subtle" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              50+
            </div>
            <div style={{ opacity: 0.8 }}>Features</div>
          </div>
        </div>

        {/* Badges */}
        <div className="glass-panel" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Glass Badges</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="glass-badge">New</span>
            <span className="glass-badge">Premium</span>
            <span className="glass-badge">Featured</span>
            <span className="glass-badge">Popular</span>
            <span className="glass-badge">Limited</span>
          </div>
        </div>

        {/* Footer */}
        <div className="glass-panel-overlay" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ opacity: 0.9 }}>
            ✨ Glassmorphism Design System - Beautiful UI for Modern Apps
          </p>
          <p style={{ opacity: 0.7, fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Optimized for both light and dark modes
          </p>
        </div>
      </div>
    </div>
  );
}

export default GlassmorphismShowcase;
