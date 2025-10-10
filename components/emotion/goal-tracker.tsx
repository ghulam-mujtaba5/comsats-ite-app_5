"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Trophy, 
  Star, 
  CheckCircle, 
  Plus,
  Flame
} from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  streak: number
  completed: boolean
  xpReward: number
  createdAt: Date
}

const INITIAL_GOALS: Goal[] = [
  {
    id: "1",
    title: "Complete Practice Papers",
    description: "Finish 5 past papers this week",
    target: 5,
    current: 3,
    unit: "papers",
    streak: 3,
    completed: false,
    xpReward: 50,
    createdAt: new Date()
  },
  {
    id: "2",
    title: "Daily Study Sessions",
    description: "Study for 2 hours each day",
    target: 14,
    current: 7,
    unit: "days",
    streak: 2,
    completed: false,
    xpReward: 30,
    createdAt: new Date()
  },
  {
    id: "3",
    title: "Community Contributions",
    description: "Share 3 helpful resources",
    target: 3,
    current: 3,
    unit: "resources",
    streak: 1,
    completed: true,
    xpReward: 40,
    createdAt: new Date()
  }
]

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS)
  const [showAddForm, setShowAddForm] = useState(false)

  const addProgress = (goalId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId && !goal.completed) {
        const newCurrent = Math.min(goal.current + 1, goal.target)
        const completed = newCurrent === goal.target
        return {
          ...goal,
          current: newCurrent,
          completed,
          streak: completed ? goal.streak : goal.streak + 1
        }
      }
      return goal
    }))
  }

  const addGoal = (newGoal: Omit<Goal, 'id' | 'current' | 'streak' | 'completed' | 'createdAt'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Math.random().toString(36).substr(2, 9),
      current: 0,
      streak: 0,
      completed: false,
      createdAt: new Date()
    }
    setGoals(prev => [...prev, goal])
    setShowAddForm(false)
  }

  const completedGoals = goals.filter(g => g.completed).length
  const totalXP = goals.reduce((sum, goal) => sum + (goal.completed ? goal.xpReward : 0), 0)
  const currentStreak = Math.max(...goals.map(g => g.streak), 0)

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Goal Tracker
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              {currentStreak} streak
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              {totalXP} XP
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {goal.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Target className="w-4 h-4 text-purple-500" />
                    )}
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                </div>
                
                {goal.completed ? (
                  <Badge variant="default" className="bg-green-500">
                    <Trophy className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => addProgress(goal.id)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  >
                    +1 {goal.unit}
                  </Button>
                )}
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{goal.current} / {goal.target} {goal.unit}</span>
                  <span className="text-purple-600">{goal.xpReward} XP</span>
                </div>
                <Progress 
                  value={(goal.current / goal.target) * 100} 
                  className="h-2" 
                />
              </div>
              
              {goal.streak > 0 && !goal.completed && (
                <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                  <Flame className="w-3 h-3" />
                  {goal.streak} day streak!
                </div>
              )}
            </motion.div>
          ))}
          
          {showAddForm ? (
            <AddGoalForm onAdd={addGoal} onCancel={() => setShowAddForm(false)} />
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddForm(true)}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function AddGoalForm({ onAdd, onCancel }: { 
  onAdd: (goal: Omit<Goal, 'id' | 'current' | 'streak' | 'completed' | 'createdAt'>) => void,
  onCancel: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [target, setTarget] = useState(5)
  const [unit, setUnit] = useState("tasks")
  const [xpReward, setXpReward] = useState(30)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ title, description, target, unit, xpReward })
  }

  return (
    <motion.form 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 bg-white space-y-3"
    >
      <h3 className="font-medium">Create New Goal</h3>
      
      <div>
        <label className="text-sm font-medium">Goal Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded text-sm"
          placeholder="e.g., Complete Practice Papers"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded text-sm"
          placeholder="Describe your goal..."
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium">Target</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded text-sm"
            min="1"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-2 border rounded text-sm"
            placeholder="e.g., papers"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">XP Reward</label>
        <input
          type="number"
          value={xpReward}
          onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
          className="w-full p-2 border rounded text-sm"
          min="10"
          max="100"
          required
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Create Goal
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </motion.form>
  )
}