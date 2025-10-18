'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import layout from '@/app/styles/common.module.css'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'
import { UnifiedGlassCard } from '@/components/shared/UnifiedGlassCard'
import { UnifiedGlassButton } from '@/components/shared/UnifiedGlassButton'

export default function GlassmorphismTestPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [tabValue, setTabValue] = useState('tab1')

  return (
    <div className={`${layout.section} ${layout.max6xl} py-8 space-y-8`}>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Glassmorphism Design System</h1>
        <p className="text-muted-foreground">
          Comprehensive glassmorphism implementation with dark and light modes
        </p>
      </div>

      {/* Navigation Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Demos & Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UnifiedGlassCard variant="base" interactive glow>
            <Link href="/glassmorphism-test/dark-mode-demo" className="block">
              <h3 className="text-xl font-semibold mb-2">Dark Mode Demo</h3>
              <p className="text-muted-foreground">
                Experience deep, rich glass effects optimized for low-light environments
              </p>
            </Link>
          </UnifiedGlassCard>
          
          <UnifiedGlassCard variant="base" interactive glow>
            <Link href="/glassmorphism-test/light-mode-demo" className="block">
              <h3 className="text-xl font-semibold mb-2">Light Mode Demo</h3>
              <p className="text-muted-foreground">
                Experience clean, crisp glass effects optimized for daylight viewing
              </p>
            </Link>
          </UnifiedGlassCard>
          
          <UnifiedGlassCard variant="base" interactive glow>
            <Link href="/glassmorphism-test/documentation" className="block">
              <h3 className="text-xl font-semibold mb-2">Documentation</h3>
              <p className="text-muted-foreground">
                Comprehensive guide to implementing glassmorphism effects
              </p>
            </Link>
          </UnifiedGlassCard>
        </div>
      </section>

      {/* Unified Glass Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Unified Glass Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UnifiedGlassCard variant="base" interactive glow>
            <h3 className="text-xl font-semibold mb-2">Base Glass Card</h3>
            <p className="text-muted-foreground">
              This is a unified glass card with interactive and glow effects.
            </p>
          </UnifiedGlassCard>
          <UnifiedGlassCard variant="strong" layered depth>
            <h3 className="text-xl font-semibold mb-2">Strong Glass Card</h3>
            <p className="text-muted-foreground">
              This is a strong glass card with layered and depth effects.
            </p>
          </UnifiedGlassCard>
        </div>
      </section>

      {/* Unified Glass Buttons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Unified Glass Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <UnifiedGlassButton variant="base">Base Button</UnifiedGlassButton>
          <UnifiedGlassButton variant="medium" glow>Medium Glow Button</UnifiedGlassButton>
          <UnifiedGlassButton variant="premium" size="lg">Premium Large Button</UnifiedGlassButton>
        </div>
      </section>

      {/* Alert Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert variant="glass">
            <Info className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>
              This is a glassmorphism alert component.
            </AlertDescription>
          </Alert>
          <Alert variant="glass-subtle">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              This is a subtle glassmorphism alert component.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Card Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>
                This is a glassmorphism card component.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Glass cards have a frosted glass effect with backdrop blur.
              </p>
            </CardContent>
          </Card>
          <Card variant="soft">
            <CardHeader>
              <CardTitle>Subtle Glass Card</CardTitle>
              <CardDescription>
                This is a subtle glassmorphism card component.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Subtle glass cards have a lighter frosted effect.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Button Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="glass">Glass Button</Button>
          <Button variant="glass-premium">Premium Glass Button</Button>
        </div>
      </section>

      {/* Badge Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="glass">Glass Badge</Badge>
          <Badge variant="soft">Subtle Glass Badge</Badge>
        </div>
      </section>

      {/* Input Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input variant="glass" placeholder="Glass input" />
          <Input variant="glass-subtle" placeholder="Subtle glass input" />
        </div>
      </section>

      {/* Textarea Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Textareas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea variant="glass" placeholder="Glass textarea" />
          <Textarea variant="glass-subtle" placeholder="Subtle glass textarea" />
        </div>
      </section>

      {/* Select Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Selects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select>
            <SelectTrigger variant="glass">
              <SelectValue placeholder="Glass select" />
            </SelectTrigger>
            <SelectContent variant="glass">
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger variant="glass-subtle">
              <SelectValue placeholder="Subtle glass select" />
            </SelectTrigger>
            <SelectContent variant="glass-subtle">
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Dialog Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dialogs</h2>
        <div className="flex flex-wrap gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="glass">Open Glass Dialog</Button>
            </DialogTrigger>
            <DialogContent variant="glass">
              <DialogHeader>
                <DialogTitle>Glass Dialog</DialogTitle>
                <DialogDescription>
                  This is a glassmorphism dialog component.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Dialog content goes here.</p>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Open Subtle Glass Dialog</Button>
            </DialogTrigger>
            <DialogContent variant="glass-subtle">
              <DialogHeader>
                <DialogTitle>Subtle Glass Dialog</DialogTitle>
                <DialogDescription>
                  This is a subtle glassmorphism dialog component.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Dialog content goes here.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Tabs Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList variant="glass">
            <TabsTrigger variant="glass" value="tab1">Glass Tab</TabsTrigger>
            <TabsTrigger variant="glass" value="tab2">Another Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Glass Tab Content</CardTitle>
                <CardDescription>
                  This is content in a glass tab.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Glass tabs have a frosted glass effect with backdrop blur.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <Card variant="soft">
              <CardHeader>
                <CardTitle>Second Tab Content</CardTitle>
                <CardDescription>
                  This is content in another tab.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This is the second tab's content.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Popover Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Popovers</h2>
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="glass">Glass Popover</Button>
            </PopoverTrigger>
            <PopoverContent variant="glass" className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Glass Popover</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a glassmorphism popover component.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default">Subtle Glass Popover</Button>
            </PopoverTrigger>
            <PopoverContent variant="glass-subtle" className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Subtle Glass Popover</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a subtle glassmorphism popover component.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* Tooltip Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tooltips</h2>
        <div className="flex flex-wrap gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="glass">Glass Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent variant="glass">
                <p>Glass tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default">Subtle Glass Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent variant="glass-subtle">
                <p>Subtle glass tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>
    </div>
  )
}