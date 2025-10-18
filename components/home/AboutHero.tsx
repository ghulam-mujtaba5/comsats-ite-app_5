'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { UnifiedGlassCard } from '@/components/shared/UnifiedGlassCard';
import styles from './AboutHero.module.css';

// Define animation variants directly in the component
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const AboutHero = () => {
  const { theme } = useTheme();

  return (
    <section className={`${styles.heroContainerLight} ${theme === 'dark' ? styles.heroContainerDark : ''}`}>
      <div className={styles.backgroundEffect}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
      </div>

      <motion.div 
        className={styles.contentWrapper}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <UnifiedGlassCard 
          variant="strong" 
          interactive 
          glow 
          className={styles.heroCard}
        >
          <motion.h1 
            className={styles.heading}
            variants={fadeInUp}
          >
            <span className={styles.gradientText}>About</span> CampusAxis
          </motion.h1>

          <motion.p 
            className={styles.subheading}
            variants={fadeInUp}
          >
            We are a team of passionate educators and technologists dedicated to transforming 
            the educational landscape through innovative AI-powered solutions. Our mission is 
            to empower institutions and learners with cutting-edge tools that enhance the 
            learning experience.
          </motion.p>
        </UnifiedGlassCard>
      </motion.div>

      <motion.div 
        className={styles.scrollIndicator}
        animate={{ 
          y: [0, 5, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ 
          y: { duration: 1.5, repeat: Infinity },
          opacity: { duration: 1.5, repeat: Infinity }
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
};

export default AboutHero;