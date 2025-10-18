"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Loader2 
} from "lucide-react"

interface FeedbackToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  duration?: number
  onOpenChange?: (open: boolean) => void
}

export function FeedbackToast({
  id,
  title,
  description,
  variant = "default",
  duration = 5000,
  onOpenChange
}: FeedbackToastProps) {
  const [open, setOpen] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!open) {
      onOpenChange?.(false)
      return
    }

    const timer = setTimeout(() => {
      setOpen(false)
    }, duration)

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressTimer)
          return 0
        }
        return prev - (100 / (duration / 100))
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [open, duration, onOpenChange])

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "destructive":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getProgressColor = () => {
    switch (variant) {
      case "success":
        return "bg-green-500"
      case "destructive":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-foreground"
    }
  }

  return (
    <Toast
      open={open}
      onOpenChange={(newOpen: boolean) => {
        setOpen(newOpen)
        onOpenChange?.(newOpen)
      }}
      className="border"
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 space-y-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && (
            <ToastDescription>{description}</ToastDescription>
          )}
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1">
            <div
              className={`h-1 rounded-full ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <ToastClose />
      </div>
    </Toast>
  )
}

interface LoadingToastProps {
  message?: string
  onCancel?: () => void
}

export function LoadingToast({ message = "Processing...", onCancel }: LoadingToastProps) {
  return (
    <Toast className="border">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div className="flex-1 space-y-1">
          <ToastDescription>{message}</ToastDescription>
        </div>
        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-6 px-2 text-xs"
          >
            Cancel
          </Button>
        )}
      </div>
    </Toast>
  )
}

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  isLoading?: boolean
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmationDialogProps) {
  return (
    <Toast open={open} onOpenChange={onOpenChange} className="max-w-md border">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div className="flex-1">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onCancel?.()
            }}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Toast>
  )
}

// Enhanced toast hook with additional feedback types
export function useFeedback() {
  const { toast } = useToast()

  const success = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "success"
    })
  }

  const error = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive"
    })
  }

  const warning = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "warning"
    })
  }

  const info = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "info"
    })
  }

  const loading = (message?: string) => {
    toast({
      description: message || "Processing...",
      variant: "loading"
    })
  }

  return {
    toast,
    success,
    error,
    warning,
    info,
    loading
  }
}