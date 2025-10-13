import { Metadata } from "next"
import { MotivationalDashboard } from "@/components/motivational/motivational-dashboard"

export const metadata: Metadata = {
  title: "Motivational System Demo",
  description: "Demonstration of the integrated motivational feedback system",
}

export default function MotivationalSystemDemo() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Motivational Feedback System</h1>
          <p className="text-muted-foreground">
            Experience the integrated system of celebrations, emotions, and motivational support
          </p>
        </div>
        
        <MotivationalDashboard />
        
        <div className="mt-12 p-6 bg-muted/50 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">About This System</h2>
          <p className="text-muted-foreground mb-4">
            This motivational feedback system integrates multiple psychological and emotional support mechanisms:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Celebration animations for achievements and milestones</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Emotional state detection and response</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Appreciation animations for positive interactions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Achievement tracking and celebration</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Personalized motivational suggestions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Stress detection and calming responses</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}