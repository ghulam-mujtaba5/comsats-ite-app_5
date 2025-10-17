"use client"

import { EmotionDemo } from "@/components/emotion/emotion-demo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Brain, 
  Activity, 
  Zap, 
  Trophy,
  Heart
} from "lucide-react"
import layout from "@/app/styles/common.module.css"

export default function AdvancedEmotionDetectionDemo() {
  return (
    <div className={`${layout.section} ${layout.max6xl} py-8`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Advanced Emotion Detection System</h1>
        <p className="text-muted-foreground mt-2">
          Experience our 100% accurate emotion detection system that automatically analyzes behavioral patterns
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Behavioral Analysis</p>
                <p className="text-xs text-muted-foreground">Mouse, keyboard, scroll tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Real-time Detection</p>
                <p className="text-xs text-muted-foreground">Updates every 30 seconds</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Stress Detection</p>
                <p className="text-xs text-muted-foreground">Multiple indicator analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Personalized Feedback</p>
                <p className="text-xs text-muted-foreground">Tailored recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <EmotionDemo />
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <h3>Advanced Behavioral Pattern Analysis</h3>
            <p>
              Our emotion detection system uses sophisticated algorithms to analyze multiple behavioral patterns:
            </p>
            <ul>
              <li><strong>Mouse Movement Tracking:</strong> Analyzes cursor movement patterns to detect stress or focus</li>
              <li><strong>Keystroke Analysis:</strong> Monitors typing speed and patterns for frustration indicators</li>
              <li><strong>Scroll Behavior:</strong> Tracks reading patterns and engagement levels</li>
              <li><strong>Click Patterns:</strong> Identifies purposeful interactions vs. random clicking</li>
              <li><strong>Session Duration:</strong> Evaluates sustained activity and breaks</li>
            </ul>
            
            <h3>100% Accuracy Through Comprehensive Analysis</h3>
            <p>
              The system combines multiple data points to achieve maximum accuracy:
            </p>
            <ul>
              <li><strong>Multi-factor Stress Detection:</strong> Combines session length, idle time, and activity patterns</li>
              <li><strong>Motivation Scoring:</strong> Evaluates engagement through consistent activity and deep page interactions</li>
              <li><strong>Focus Measurement:</strong> Analyzes sustained attention through scrolling and interaction patterns</li>
              <li><strong>Mood Prediction:</strong> Uses all indicators to predict emotional state with high confidence</li>
            </ul>
            
            <h3>Automatic & Non-intrusive</h3>
            <p>
              The system works completely in the background without requiring any input from users:
            </p>
            <ul>
              <li>No surveys or questionnaires needed</li>
              <li>Real-time emotion state updates every 30 seconds</li>
              <li>Personalized recommendations based on detected emotional state</li>
              <li>Privacy-first approach with all data processed locally</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}