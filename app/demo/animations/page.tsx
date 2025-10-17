'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import layout from '@/app/styles/common.module.css'
import { 
  useConfettiEffect, 
  useThankYouEffect, 
  useMotivationEffect, 
  useCommunityEffect,
  useUiFeedbackEffect
} from '@/hooks/use-animation-effects'
import { 
  Sparkles, 
  Trophy, 
  Heart, 
  Users, 
  CheckCircle,
  PartyPopper,
  Flame,
  Star,
  ArrowRight
} from 'lucide-react'
import { RippleButton, GlowCard, SuccessInput, AnimatedCheckmark } from '@/components/animations/ui-feedback-animations'

export default function AnimationsDemoPage() {
  const { 
    triggerConfetti, 
    triggerFireworks, 
    triggerBalloons, 
    triggerSparkles 
  } = useConfettiEffect()
  
  const { 
    triggerThankYou, 
    triggerHandClap, 
    triggerWaveEmoji, 
    triggerContributionBadge 
  } = useThankYouEffect()
  
  const { 
    triggerLevelUp, 
    triggerAchievementPop, 
    triggerMotivationalText, 
    triggerProgressBar,
    triggerXpGlow
  } = useMotivationEffect()
  
  const { 
    triggerPartyPopper, 
    triggerSpotlight, 
    triggerTeamCelebration, 
    triggerCountdownTimer,
    triggerFestiveTheme
  } = useCommunityEffect()
  
  const { 
    triggerButtonRipple, 
    triggerCardGlow, 
    triggerInputSuccess, 
    triggerCheckmarkDraw,
    triggerPageTransition
  } = useUiFeedbackEffect()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 py-12">
      <div className={`${layout.section} ${layout.max6xl}`}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            CampusAxis Animation Showcase
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Experience the emotional and celebratory animations that make CampusAxis more engaging and fun
          </p>
        </div>

        {/* New Celebration Animations Section */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              New Celebration Animations
            </CardTitle>
            <CardDescription>Enhanced celebratory animations with wrapping ribbons and more</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-slate-700 dark:text-slate-300">
                Experience the new enhanced celebration animations with wrapping ribbons, improved confetti, and more.
              </p>
              <Link href="/demo/celebration-demo">
                <Button className="rounded-xl group">
                  Try New Animations
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Celebration Animations */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Celebration Animations
            </CardTitle>
            <CardDescription>Animations for achievements and special moments</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => triggerConfetti("Congratulations!")} className="rounded-xl">
              Confetti
            </Button>
            <Button onClick={() => triggerFireworks("Fireworks!")} className="rounded-xl">
              Fireworks
            </Button>
            <Button onClick={() => triggerBalloons("Floating Balloons!")} className="rounded-xl">
              Balloons
            </Button>
            <Button onClick={() => triggerSparkles("Sparkles!")} className="rounded-xl">
              Sparkles
            </Button>
          </CardContent>
        </Card>

        {/* Gratitude Animations */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Gratitude Animations
            </CardTitle>
            <CardDescription>Animations for appreciation and acknowledgment</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => triggerThankYou("Thank You!")} className="rounded-xl">
              Thank You
            </Button>
            <Button onClick={() => triggerHandClap("Great Job!")} className="rounded-xl">
              Hand Clap
            </Button>
            <Button onClick={() => triggerWaveEmoji("Hello!")} className="rounded-xl">
              Wave Emoji
            </Button>
            <Button onClick={() => triggerContributionBadge("Badge Earned!")} className="rounded-xl">
              Contribution Badge
            </Button>
          </CardContent>
        </Card>

        {/* Motivation Animations */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              Motivation Animations
            </CardTitle>
            <CardDescription>Animations to encourage progress and engagement</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Button onClick={() => triggerLevelUp("Level Up!")} className="rounded-xl">
              Level Up
            </Button>
            <Button onClick={() => triggerAchievementPop("Achievement Unlocked!")} className="rounded-xl">
              Achievement Pop
            </Button>
            <Button onClick={() => triggerMotivationalText("Keep Going!")} className="rounded-xl">
              Motivational Text
            </Button>
            <Button onClick={() => triggerProgressBar("Progress Update!")} className="rounded-xl">
              Progress Bar
            </Button>
            <Button onClick={() => triggerXpGlow("XP Gained!")} className="rounded-xl">
              XP Glow
            </Button>
          </CardContent>
        </Card>

        {/* Community Animations */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Animations
            </CardTitle>
            <CardDescription>Animations for events and community celebrations</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Button onClick={() => triggerPartyPopper("Party Time!")} className="rounded-xl">
              Party Popper
            </Button>
            <Button onClick={() => triggerSpotlight("In the Spotlight!")} className="rounded-xl">
              Spotlight
            </Button>
            <Button onClick={() => triggerTeamCelebration("Team Celebration!")} className="rounded-xl">
              Team Celebration
            </Button>
            <Button onClick={() => triggerCountdownTimer("Event Starting!")} className="rounded-xl">
              Countdown Timer
            </Button>
            <Button onClick={() => triggerFestiveTheme("Festive Mode!")} className="rounded-xl">
              Festive Theme
            </Button>
          </CardContent>
        </Card>

        {/* UI Feedback Animations */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              UI Feedback Animations
            </CardTitle>
            <CardDescription>Subtle animations for user interface interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Ripple Button</h3>
                <RippleButton className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  Click Me!
                </RippleButton>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Glow Card</h3>
                <GlowCard className="p-4 rounded-xl">
                  <p className="text-slate-700 dark:text-slate-300">
                    Hover over this card to see the glow effect
                  </p>
                </GlowCard>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Success Input</h3>
                <SuccessInput 
                  placeholder="Type something..."
                  isSuccess={true}
                  className="px-4 py-2 border rounded-xl"
                />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Animated Checkmark</h3>
                <div className="flex items-center gap-2">
                  <AnimatedCheckmark isVisible={true} size={24} className="text-green-500" />
                  <span className="text-slate-700 dark:text-slate-300">Task Completed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Examples */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Integration Examples
            </CardTitle>
            <CardDescription>How animations enhance CampusAxis experiences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlowCard className="p-6 rounded-2xl">
                <Trophy className="h-8 w-8 text-yellow-500 mb-3" />
                <h3 className="font-semibold mb-2">Achievement Unlocked</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  When you earn a new badge or reach a milestone
                </p>
                <Button 
                  onClick={() => triggerAchievementPop("Top Contributor Badge Earned!")}
                  className="w-full rounded-xl"
                  variant="outline"
                >
                  Try It
                </Button>
              </GlowCard>
              
              <GlowCard className="p-6 rounded-2xl">
                <PartyPopper className="h-8 w-8 text-purple-500 mb-3" />
                <h3 className="font-semibold mb-2">Event Registration</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  When you sign up for a campus event
                </p>
                <Button 
                  onClick={() => triggerPartyPopper("Event Registration Confirmed!")}
                  className="w-full rounded-xl"
                  variant="outline"
                >
                  Try It
                </Button>
              </GlowCard>
              
              <GlowCard className="p-6 rounded-2xl">
                <Heart className="h-8 w-8 text-red-500 mb-3" />
                <h3 className="font-semibold mb-2">Contribution Accepted</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  When your contribution is approved by moderators
                </p>
                <Button 
                  onClick={() => triggerThankYou("Your contribution was accepted!")}
                  className="w-full rounded-xl"
                  variant="outline"
                >
                  Try It
                </Button>
              </GlowCard>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}