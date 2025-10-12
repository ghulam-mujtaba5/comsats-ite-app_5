"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, X, Building2 } from "lucide-react"
import { useCampus } from "@/contexts/campus-context"
import { CampusSelector } from "./campus-selector"

export function CampusReminder() {
  const { selectedCampus, selectedDepartment } = useCampus()
  const [isDismissed, setIsDismissed] = useState(false)
  const [showReminder, setShowReminder] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the reminder in this session
    const dismissed = sessionStorage.getItem("campus-reminder-dismissed")
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show reminder after 2 seconds if no campus selected or only campus without department
    const timer = setTimeout(() => {
      if (!selectedCampus || !selectedDepartment) {
        setShowReminder(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [selectedCampus, selectedDepartment])

  const handleDismiss = () => {
    setIsDismissed(true)
    setShowReminder(false)
    sessionStorage.setItem("campus-reminder-dismissed", "true")
  }

  // Don't show if dismissed or if both campus and department are selected
  if (isDismissed || (selectedCampus && selectedDepartment)) {
    return null
  }

  return (
    <AnimatePresence>
      {showReminder && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <Card className="border-2 border-primary/20 shadow-xl bg-background/95 backdrop-blur-sm glass-card glass-border-glow glass-hover glass-depth">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">
                        {!selectedCampus
                          ? "Select Your Campus"
                          : "Select Your Department"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {!selectedCampus
                          ? "Get personalized content for your campus location"
                          : "Filter content by your department for better results"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mt-1"
                      onClick={handleDismiss}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <CampusSelector />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                      className="text-xs"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Inline banner for specific pages (less intrusive)
export function CampusBanner({ 
  title = "Select Your Campus", 
  description = "Choose your campus to see relevant content"
}: { 
  title?: string
  description?: string
}) {
  const { selectedCampus, selectedDepartment } = useCampus()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible || (selectedCampus && selectedDepartment)) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6"
    >
      <Card className="border-primary/30 bg-primary/5 glass-card glass-border-light glass-hover glass-depth">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex gap-2">
              <CampusSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Subtle indicator when campus/department not selected
export function CampusIndicator() {
  const { selectedCampus, selectedDepartment } = useCampus()

  if (selectedCampus && selectedDepartment) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="glass-button glass-border-light glass-hover glass-depth glass-floating"
      >
        <CampusSelector />
      </motion.div>
    </motion.div>
  )
}
