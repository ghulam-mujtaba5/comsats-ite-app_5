'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import layout from '@/app/styles/common.module.css'

export default function AccessibilityTestPage() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  return (
    <div className={`${layout.section} ${layout.max6xl} py-8 space-y-8`}>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Accessibility Test</h1>
        <p className="text-muted-foreground">
          Testing reduced motion and other accessibility features
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="font-medium">
            Prefers Reduced Motion: {prefersReducedMotion ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      {/* Test Card with Hover Effects */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Interactive Card</h2>
        <Card 
          variant="glass"
          className={`max-w-md mx-auto ${isHovered ? 'scale-105' : ''} ${isActive ? 'scale-95' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
        >
          <CardHeader>
            <CardTitle>Interactive Glass Card</CardTitle>
            <CardDescription>
              This card responds to hover and click events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Hover state: {isHovered ? 'Active' : 'Inactive'}
              <br />
              Active state: {isActive ? 'Active' : 'Inactive'}
            </p>
            <Button variant="glass" className="w-full">
              Glass Button
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Test Badges with Focus */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Focusable Badges</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Badge variant="glass" tabIndex={0}>
            Focusable Glass Badge
          </Badge>
          <Badge variant="glass-subtle" tabIndex={0}>
            Focusable Subtle Glass Badge
          </Badge>
        </div>
      </section>

      {/* Test Buttons with Different States */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Button States</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="glass">Glass Button</Button>
          <Button variant="glass-premium">Premium Glass Button</Button>
        </div>
      </section>
    </div>
  )
}