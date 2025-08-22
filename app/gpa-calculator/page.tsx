"use client"
import { Footer } from "@/components/layout/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SemesterGPACalculator } from "@/components/gpa/semester-gpa-calculator"
import { CumulativeGPACalculator } from "@/components/gpa/cumulative-gpa-calculator"
import { AggregateCalculator } from "@/components/gpa/aggregate-calculator"
import { GPAPlanningCalculator } from "@/components/gpa/gpa-planning-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, TrendingUp, Target, Info, Calendar } from "lucide-react"

export default function GPACalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">GPA Calculator</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your semester GPA, cumulative GPA, admission aggregate, and plan your future semesters
            </p>
          </div>

          <div className="mb-8">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  COMSATS Grading System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">A+/A</div>
                    <div className="text-muted-foreground">4.0</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">A-</div>
                    <div className="text-muted-foreground">3.67</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">B+</div>
                    <div className="text-muted-foreground">3.33</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">B</div>
                    <div className="text-muted-foreground">3.0</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">B-</div>
                    <div className="text-muted-foreground">2.67</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">C+</div>
                    <div className="text-muted-foreground">2.33</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="semester" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="semester" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Semester GPA
              </TabsTrigger>
              <TabsTrigger value="cumulative" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Cumulative GPA
              </TabsTrigger>
              <TabsTrigger value="aggregate" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Aggregate
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                GPA Planning
              </TabsTrigger>
            </TabsList>

            <TabsContent value="semester">
              <SemesterGPACalculator />
            </TabsContent>

            <TabsContent value="cumulative">
              <CumulativeGPACalculator />
            </TabsContent>

            <TabsContent value="aggregate">
              <AggregateCalculator />
            </TabsContent>

            <TabsContent value="planning">
              <GPAPlanningCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
