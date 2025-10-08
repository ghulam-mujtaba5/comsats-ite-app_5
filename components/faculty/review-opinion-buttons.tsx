"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'

interface ReviewOpinionButtonsProps {
  reviewId: string
  initialAgreeCount?: number
  initialDisagreeCount?: number
  initialUserOpinion?: 'agree' | 'disagree' | null
  className?: string
}

export function ReviewOpinionButtons({
  reviewId,
  initialAgreeCount = 0,
  initialDisagreeCount = 0,
  initialUserOpinion = null,
  className
}: ReviewOpinionButtonsProps) {
  const { user } = useAuth()
  const [agreeCount, setAgreeCount] = useState(initialAgreeCount)
  const [disagreeCount, setDisagreeCount] = useState(initialDisagreeCount)
  const [userOpinion, setUserOpinion] = useState<'agree' | 'disagree' | null>(initialUserOpinion)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpinion = async (action: 'agree' | 'disagree') => {
    if (!user?.id) {
      alert('Please sign in to vote on reviews')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/reviews/opinions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId,
          userId: user.id,
          action
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Update local state based on action
        if (result.action === 'removed') {
          // User toggled off their opinion
          if (userOpinion === 'agree') {
            setAgreeCount(prev => prev - 1)
          } else if (userOpinion === 'disagree') {
            setDisagreeCount(prev => prev - 1)
          }
          setUserOpinion(null)
        } else if (result.action === 'updated') {
          // User changed their opinion
          if (userOpinion === 'agree') {
            setAgreeCount(prev => prev - 1)
            setDisagreeCount(prev => prev + 1)
          } else if (userOpinion === 'disagree') {
            setDisagreeCount(prev => prev - 1)
            setAgreeCount(prev => prev + 1)
          }
          setUserOpinion(action)
        } else {
          // New opinion
          if (action === 'agree') {
            setAgreeCount(prev => prev + 1)
          } else {
            setDisagreeCount(prev => prev + 1)
          }
          setUserOpinion(action)
        }
      } else {
        alert(result.error || 'Failed to submit opinion')
      }
    } catch (error) {
      console.error('Error submitting opinion:', error)
      alert('Failed to submit opinion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleOpinion('agree')}
        disabled={isLoading}
        className={cn(
          "gap-2",
          userOpinion === 'agree' && "bg-green-500/20 text-green-700 border-green-400 hover:bg-green-500/30"
        )}
      >
        <ThumbsUp className={cn(
          "h-4 w-4",
          userOpinion === 'agree' && "fill-current"
        )} />
        <span className="font-semibold">{agreeCount}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleOpinion('disagree')}
        disabled={isLoading}
        className={cn(
          "gap-2",
          userOpinion === 'disagree' && "bg-red-500/20 text-red-700 border-red-400 hover:bg-red-500/30"
        )}
      >
        <ThumbsDown className={cn(
          "h-4 w-4",
          userOpinion === 'disagree' && "fill-current"
        )} />
        <span className="font-semibold">{disagreeCount}</span>
      </Button>

      {userOpinion && (
        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
          You {userOpinion}d
        </span>
      )}
    </div>
  )
}
