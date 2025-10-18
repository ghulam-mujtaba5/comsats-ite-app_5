"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Calculator, Info } from "lucide-react"
import { GlassCard } from "@/components/admin/glass-card"
import { AdmissionsDisclaimer } from "@/components/admissions/disclaimer"

export function MeritCalculator() {
  const [matricPercentage, setMatricPercentage] = useState<string>("")
  const [intermediatePercentage, setIntermediatePercentage] = useState<string>("")
  const [ntsScore, setNtsScore] = useState<string>("")
  const [result, setResult] = useState<{ 
    meritScore: number; 
    likelihood: string; 
    message: string 
  } | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const calculateMerit = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate the calculation
      
      const matric = parseFloat(matricPercentage)
      const intermediate = parseFloat(intermediatePercentage)
      const nts = ntsScore ? parseFloat(ntsScore) : undefined
      
      // Simple mock calculation
      let meritScore: number
      if (nts !== undefined) {
        meritScore = (matric * 0.10) + (intermediate * 0.40) + (nts * 0.50)
      } else {
        meritScore = (matric * 0.20) + (intermediate * 0.80)
      }
      
      meritScore = Math.round(meritScore * 100) / 100
      
      let likelihood: string
      if (meritScore >= 80) {
        likelihood = "Very High"
      } else if (meritScore >= 70) {
        likelihood = "High"
      } else if (meritScore >= 60) {
        likelihood = "Moderate"
      } else {
        likelihood = "Low"
      }
      
      setResult({
        meritScore,
        likelihood,
        message: `Based on the provided scores, your estimated merit is ${meritScore}%. Admission likelihood: ${likelihood}.`
      })
    } catch (error) {
      console.error("Error calculating merit:", error)
      setResult({
        meritScore: 0,
        likelihood: "Unknown",
        message: "Error calculating merit. Please check your inputs and try again."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard title="Merit Calculator" description="Calculate your admission chances based on previous years' data" icon={Calculator}>
        <CardContent className="p-0">
          <div className="space-y-4">
            <div>
              <Label htmlFor="matric">Matric Percentage</Label>
              <Input
                id="matric"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="85"
                value={matricPercentage}
                onChange={(e) => setMatricPercentage(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="intermediate">Intermediate Percentage</Label>
              <Input
                id="intermediate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="80"
                value={intermediatePercentage}
                onChange={(e) => setIntermediatePercentage(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="nts" className="flex items-center gap-2">
                NTS Score (if applicable)
                <Info className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Input
                id="nts"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="75"
                value={ntsScore}
                onChange={(e) => setNtsScore(e.target.value)}
              />
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Leave blank if your program doesn't require NTS
              </p>
            </div>
            
            <Button 
              className="w-full" 
              onClick={calculateMerit}
              disabled={loading || !matricPercentage || !intermediatePercentage}
            >
              {loading ? "Calculating..." : "Calculate Merit"}
            </Button>
          </div>
        </CardContent>
      </GlassCard>

      {result && (
        <GlassCard title="Results">
          <CardContent className="p-0">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-primary mb-2">
                {result.meritScore}%
              </div>
              <div className="text-lg font-semibold mb-4">
                Admission Likelihood: {result.likelihood}
              </div>
              <p className="text-muted-foreground">
                {result.message}
              </p>
            </div>
          </CardContent>
        </GlassCard>
      )}

      <AdmissionsDisclaimer />
    </div>
  )
}