"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { testResponsiveComponent, DEVICE_SIZES } from "@/lib/responsive-test-utils"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import { cn } from "@/lib/utils"

interface TestResult {
  device: string;
  passed: boolean;
  issues: string[];
}

export function ResponsiveTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isTesting, setIsTesting] = useState(false)
  const testContainerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const runTests = async () => {
    if (!testContainerRef.current) return
    
    setIsTesting(true)
    const results: TestResult[] = []
    
    // Test on different screen sizes
    for (const [device, size] of Object.entries(DEVICE_SIZES)) {
      // Simulate resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: size.width
      })
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: size.height
      })
      
      window.dispatchEvent(new Event('resize'))
      
      // Wait for any responsive changes to take effect
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Run test
      const result = await testResponsiveComponent(testContainerRef.current, `Responsive Test on ${device}`)
      results.push({
        device,
        passed: result.passed,
        issues: result.issues
      })
    }
    
    setTestResults(results)
    setIsTesting(false)
  }

  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={cn(
          "text-2xl font-bold",
          animationClasses
        )}>Responsive Testing</h2>
        <Button 
          onClick={runTests} 
          disabled={isTesting}
          className={animationClasses}
        >
          {isTesting ? "Testing..." : "Run Responsive Tests"}
        </Button>
      </div>
      
      {/* Test container with responsive components */}
      <div 
        ref={testContainerRef}
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg",
          animationClasses
        )}
      >
        <Card className="min-h-[100px] flex items-center justify-center">
          <CardHeader>
            <CardTitle className={animationClasses}>Test Card 1</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className={cn(
              "min-h-[44px] min-w-[44px]",
              animationClasses
            )}>Test Button</Button>
          </CardContent>
        </Card>
        
        <Card className="min-h-[100px] flex items-center justify-center">
          <CardHeader>
            <CardTitle className={animationClasses}>Test Card 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn(
              "text-sm sm:text-base",
              animationClasses
            )}>Responsive text content</p>
          </CardContent>
        </Card>
        
        <Card className="min-h-[100px] flex items-center justify-center md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className={animationClasses}>Test Card 3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button className={cn(
                "min-h-[44px] min-w-[44px]",
                animationClasses
              )}>Btn 1</Button>
              <Button className={cn(
                "min-h-[44px] min-w-[44px]",
                animationClasses
              )}>Btn 2</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Test results */}
      {testResults.length > 0 && (
        <Card className={animationClasses}>
          <CardHeader>
            <CardTitle className={animationClasses}>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className={cn(
                  "border-b pb-4",
                  animationClasses
                )}>
                  <h3 className={cn(
                    "font-semibold text-lg capitalize",
                    animationClasses
                  )}>
                    {result.device}: {result.passed ? "✅ Passed" : "❌ Failed"}
                  </h3>
                  {result.issues.length > 0 && (
                    <ul className={cn(
                      "list-disc pl-5 mt-2 space-y-1",
                      animationClasses
                    )}>
                      {result.issues.map((issue, issueIndex) => (
                        <li key={issueIndex} className={cn(
                          "text-sm text-muted-foreground",
                          animationClasses
                        )}>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}