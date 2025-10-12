'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCelebrationAnimations } from '@/hooks/use-celebration-animations'
import { useAnimation } from '@/contexts/animation-context'
import { CelebrationAnimation } from './celebration-animation'

export function CelebrationDemo() {
  const { 
    triggerConfetti, 
    triggerBalloons, 
    triggerFlickeringLights, 
    triggerWrappingRibbons,
    triggerCelebrationSequence,
    triggerAchievement
  } = useCelebrationAnimations()
  
  const { isAnimationEnabled, setIsAnimationEnabled } = useAnimation()
  const [showDemo, setShowDemo] = useState(false)

  const handleConfetti = () => {
    triggerConfetti({
      message: 'Congratulations! Task completed successfully!',
      duration: 5000,
      particleCount: 300
    })
  }

  const handleBalloons = () => {
    triggerBalloons({
      message: 'Well done! You\'ve reached a milestone!',
      duration: 6000,
      balloonCount: 20
    })
  }

  const handleFlickeringLights = () => {
    triggerFlickeringLights({
      message: 'Brilliant work! Keep it up!',
      duration: 4000,
      lightCount: 30
    })
  }

  const handleWrappingRibbons = () => {
    triggerWrappingRibbons({
      message: 'Achievement unlocked! Great job!',
      duration: 7000,
      ribbonCount: 15
    })
  }

  const handleCelebrationSequence = () => {
    triggerCelebrationSequence({
      message: 'Outstanding achievement! You\'ve completed all tasks!',
      duration: 8000,
      effects: ['confetti', 'balloons', 'lights', 'ribbons']
    })
  }

  const handleAchievement = () => {
    triggerAchievement({
      title: 'Level 10 Explorer',
      description: 'You\'ve completed 50 challenges!',
      type: 'milestone'
    })
  }

  return (
    <div className="p-6 rounded-xl glass-card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Celebration Animations Demo</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Animations</span>
          <Button
            variant={isAnimationEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAnimationEnabled(!isAnimationEnabled)}
          >
            {isAnimationEnabled ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground">
        Click the buttons below to trigger different celebratory animations. 
        These animations provide positive feedback and motivation for user achievements.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button 
          variant="glass" 
          onClick={handleConfetti}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-lg">🎊</span>
          <span>Confetti</span>
        </Button>

        <Button 
          variant="glass" 
          onClick={handleBalloons}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-lg">🎈</span>
          <span>Balloons</span>
        </Button>

        <Button 
          variant="glass" 
          onClick={handleFlickeringLights}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-lg">✨</span>
          <span>Flickering Lights</span>
        </Button>

        <Button 
          variant="glass" 
          onClick={handleWrappingRibbons}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-lg">🎀</span>
          <span>Wrapping Ribbons</span>
        </Button>

        <Button 
          variant="glass-premium" 
          onClick={handleCelebrationSequence}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-lg">🎉</span>
          <span>Celebration Sequence</span>
        </Button>

        <Button 
          variant="glass-premium" 
          onClick={handleAchievement}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-lg">🏆</span>
          <span>Achievement</span>
        </Button>
      </div>

      <div className="pt-4">
        <Button 
          variant="outline" 
          onClick={() => setShowDemo(!showDemo)}
          className="w-full"
        >
          {showDemo ? 'Hide Demo Animation' : 'Show Demo Animation'}
        </Button>
        
        {showDemo && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50">
            <CelebrationAnimation 
              type="confetti" 
              message="This is a demo of the celebration animation component!" 
              duration={3000}
            />
          </div>
        )}
      </div>
    </div>
  )
}