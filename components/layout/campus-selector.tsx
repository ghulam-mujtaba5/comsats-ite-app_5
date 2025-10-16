"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, GraduationCap, ChevronDown, Check } from "lucide-react"
import { useCampus } from "@/contexts/campus-context"
import { cn } from "@/lib/utils"

export function CampusSelector() {
  const {
    selectedCampus,
    selectedDepartment,
    campuses,
    departments,
    setSelectedCampus,
    setSelectedDepartment,
    isLoading,
  } = useCampus()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (isLoading || !selectedCampus) {
    return (
      <Button variant="outline" size="sm" disabled className="h-9 glass-button glass-border-subtle glass-hover">
        <MapPin className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2 glass-interactive">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedCampus.name}</span>
          <span className="sm:hidden">{selectedCampus.code}</span>
          {selectedDepartment && (
            <>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <span className="hidden md:inline">{selectedDepartment.code}</span>
            </>
          )}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Your Campus & Department</DialogTitle>
          <DialogDescription>
            Choose your campus location and department to see relevant content. 
            If you plan to sign in with Google, make sure to select the campus that matches your email domain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campus Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Campus
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campuses.map((campus) => (
                <Card
                  key={campus.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md glass-interactive",
                    selectedCampus?.id === campus.id
                      ? "border-primary bg-primary/5 glass-card-premium glass-border-glow"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => {
                    setSelectedCampus(campus)
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {campus.name}
                          {campus.is_default && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {campus.city}
                        </CardDescription>
                      </div>
                      {selectedCampus?.id === campus.id && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Department Selection */}
          {selectedCampus && departments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Department (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md glass-interactive",
                    !selectedDepartment
                      ? "border-primary bg-primary/5 glass-card-premium glass-border-glow"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => setSelectedDepartment(null)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">All Departments</div>
                        <div className="text-xs text-muted-foreground">
                          View content from all departments
                        </div>
                      </div>
                      {!selectedDepartment && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {departments.map((dept) => (
                  <Card
                    key={dept.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md glass-interactive",
                      selectedDepartment?.id === dept.id
                        ? "border-primary bg-primary/5 glass-card-premium glass-border-glow"
                        : "hover:border-primary/50"
                    )}
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{dept.code}</div>
                          <div className="text-xs text-muted-foreground">
                            {dept.name}
                          </div>
                        </div>
                        {selectedDepartment?.id === dept.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="glass-button glass-border-light glass-hover">
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} className="glass-interactive">
              Apply Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Compact version for mobile/navbar
export function CampusSelectorCompact() {
  const { selectedCampus, selectedDepartment, campuses, setSelectedCampus, isLoading } = useCampus()

  if (isLoading || !selectedCampus) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-1 px-2 glass-button glass-border-subtle glass-hover">
          <MapPin className="h-4 w-4" />
          <span className="truncate max-w-[60px]">{selectedCampus.code}</span>
          {selectedDepartment && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="truncate max-w-[60px]">{selectedDepartment.code}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-secondary">
        <DropdownMenuLabel>Quick Campus Switch</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {campuses.map((campus) => (
          <DropdownMenuItem
            key={campus.id}
            onClick={() => setSelectedCampus(campus)}
            className={cn(
              "flex items-center justify-between glass-button glass-border-subtle glass-hover",
              selectedCampus.id === campus.id && "bg-accent glass-card-premium glass-border-glow"
            )}
          >
            <span className="truncate">{campus.name}</span>
            {selectedCampus.id === campus.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}