"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Smile, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Dynamically import Picker to avoid SSR issues
const Picker = dynamic(() => import('emoji-mart').then(mod => mod.Picker as any), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void
  className?: string
}

export function EmojiPicker({ onEmojiSelect, className }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Close picker when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!isClient) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("text-muted-foreground", className)}
        onClick={() => setShowPicker(!showPicker)}
      >
        <Smile className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        variant="ghost"
        size="sm"
        className={cn("text-muted-foreground", className)}
        onClick={() => setShowPicker(!showPicker)}
      >
        <Smile className="h-4 w-4" />
      </Button>

      {showPicker && (
        <div className="absolute bottom-full right-0 mb-2 z-50">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-muted z-10"
              onClick={() => setShowPicker(false)}
            >
              <X className="h-3 w-3" />
            </Button>
            {isClient && (
              <div>
                <Picker 
                  onSelect={onEmojiSelect}
                  theme="light"
                  emojiSize={20}
                  perLine={8}
                  emojiTooltip={true}
                  showPreview={false}
                  showSkinTones={false}
                  autoFocus={true}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}