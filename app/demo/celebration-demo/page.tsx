'use client'

import React from 'react'
import { CelebrationDemo } from '@/components/animations/celebration-demo'
import { FormCelebrationExample } from '@/components/animations/form-celebration-example'
import { AchievementBadge } from '@/components/animations/achievement-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function CelebrationDemoPage() {
  return (
    <div className="container py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-2">Celebration Animations Demo</h1>
        <p className="text-center text-slate-700 dark:text-slate-300 mb-8">
          Experience the engaging, motivational animations that enhance user experience
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>
                Click the buttons to trigger different celebration animations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CelebrationDemo />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Form Submission Example</CardTitle>
              <CardDescription>
                See how animations work with form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormCelebrationExample />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Achievement Badges</CardTitle>
            <CardDescription>
              Interactive badges that trigger celebrations when earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AchievementBadge
                title="First Steps"
                description="Complete your first task"
                icon="👣"
                earned={true}
              />
              <AchievementBadge
                title="Quick Learner"
                description="Complete 10 lessons"
                icon="🎓"
                earned={true}
              />
              <AchievementBadge
                title="Community Builder"
                description="Make 50 contributions"
                icon="🤝"
                earned={false}
              />
              <AchievementBadge
                title="Streak Master"
                description="Maintain a 30-day streak"
                icon="🔥"
                earned={false}
              />
              <AchievementBadge
                title="Explorer"
                description="Visit 20 different sections"
                icon="🧭"
                earned={true}
              />
              <AchievementBadge
                title="Perfectionist"
                description="Achieve 100% accuracy"
                icon="🎯"
                earned={false}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center py-8"
      >
        <p className="text-muted-foreground">
          These celebration animations provide positive feedback and motivation for user achievements, 
          enhancing the overall experience while maintaining the glassmorphism design theme.
        </p>
      </motion.div>
    </div>
  )
}