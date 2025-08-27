"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, Filter, X, ChevronDown, SortAsc, SortDesc, RotateCcw, BookmarkPlus, Bookmark } from "lucide-react"
import { ReactNode, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export type Option = { label: string; value: string; description?: string }

export type SortOption = {
  label: string
  value: string
  direction?: 'asc' | 'desc'
}

interface FilterPreset {
  id: string
  name: string
  filters: Record<string, string>
  description?: string
}

interface AdvancedFilterBarProps {
  searchPlaceholder?: string
  search: string
  onSearchChange: (v: string) => void
  selects?: Array<{
    id: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    options: Option[]
    className?: string
    label?: string
    description?: string
    multiSelect?: boolean
    searchable?: boolean
  }>
  sortOptions?: SortOption[]
  currentSort?: string
  onSortChange?: (value: string) => void
  sortDirection?: 'asc' | 'desc'
  onSortDirectionChange?: (direction: 'asc' | 'desc') => void
  filterPresets?: FilterPreset[]
  onLoadPreset?: (preset: FilterPreset) => void
  onSavePreset?: (filters: Record<string, string>) => void
  showActiveFilterCount?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  left?: ReactNode
  right?: ReactNode
  className?: string
  compact?: boolean
}

export function AdvancedFilterBar({
  searchPlaceholder = "Search...",
  search,
  onSearchChange,
  selects = [],
  sortOptions = [],
  currentSort,
  onSortChange,
  sortDirection = 'asc',
  onSortDirectionChange,
  filterPresets = [],
  onLoadPreset,
  onSavePreset,
  showActiveFilterCount = true,
  collapsible = false,
  defaultCollapsed = false,
  left,
  right,
  className,
  compact = false,
}: AdvancedFilterBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>(filterPresets)

  // Count active filters
  const activeFilterCount = selects.filter(s => s.value && s.value !== 'All' && s.value !== '').length + (search ? 1 : 0)

  // Get current filters for saving
  const getCurrentFilters = () => {
    const filters: Record<string, string> = {}
    if (search) filters.search = search
    selects.forEach(s => {
      if (s.value && s.value !== 'All' && s.value !== '') {
        filters[s.id] = s.value
      }
    })
    return filters
  }

  // Reset all filters
  const resetFilters = () => {
    onSearchChange('')
    selects.forEach(s => s.onChange('All'))
    if (onSortChange) onSortChange('')
  }

  // Save current state as preset
  const saveCurrentAsPreset = () => {
    const filters = getCurrentFilters()
    if (Object.keys(filters).length === 0) return
    
    const presetName = `Filter ${savedPresets.length + 1}`
    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      filters,
      description: `Saved on ${new Date().toLocaleDateString()}`
    }
    
    setSavedPresets(prev => [...prev, newPreset])
    if (onSavePreset) onSavePreset(filters)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search and Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "pl-10 transition-all duration-200",
              compact ? "h-9" : "h-11",
              "focus:ring-2 focus:ring-primary/20 hover:border-primary/30"
            )}
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              onClick={() => onSearchChange('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        {left}
        {right}
      </div>

      {/* Filter Controls */}
      {selects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filters</span>
              {showActiveFilterCount && activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>

          <div className={cn(
            "grid gap-4",
            compact 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
            {selects.map((select) => (
              <div key={select.id} className="space-y-2">
                {select.label && (
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {select.label}
                  </label>
                )}
                <Select value={select.value} onValueChange={select.onChange}>
                  <SelectTrigger className={cn(
                    "transition-all duration-200 hover:border-primary/30",
                    compact ? "h-9" : "h-11",
                    select.value && select.value !== 'All' && select.value !== '' && "border-primary/50 bg-primary/5",
                    select.className
                  )}>
                    <SelectValue placeholder={select.placeholder || "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {select.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div>
                            <div>{opt.label}</div>
                            {opt.description && (
                              <div className="text-xs text-muted-foreground">{opt.description}</div>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {select.description && (
                  <p className="text-xs text-muted-foreground">{select.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sort and Advanced Options */}
      {(sortOptions.length > 0 || savedPresets.length > 0) && (
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
          {/* Sort Options */}
          {sortOptions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sort by:</span>
              <Select value={currentSort} onValueChange={onSortChange}>
                <SelectTrigger className={cn("w-36", compact ? "h-8 text-xs" : "h-9")}>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentSort && onSortDirectionChange && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className={cn("flex items-center gap-1", compact ? "h-8 px-2" : "h-9 px-3")}
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc className="h-3 w-3" />
                  ) : (
                    <SortDesc className="h-3 w-3" />
                  )}
                  <span className="sr-only">
                    {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                  </span>
                </Button>
              )}
            </div>
          )}

          {/* Filter Presets */}
          {savedPresets.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Presets:</span>
              {savedPresets.slice(0, 3).map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onLoadPreset?.(preset)}
                  className={cn("flex items-center gap-1", compact ? "h-8 px-2 text-xs" : "h-9 px-3")}
                >
                  <Bookmark className="h-3 w-3" />
                  {preset.name}
                </Button>
              ))}
            </div>
          )}

          {/* Save Current Filters */}
          {activeFilterCount > 0 && onSavePreset && (
            <Button
              variant="outline"
              size="sm"
              onClick={saveCurrentAsPreset}
              className={cn(
                "ml-auto flex items-center gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30",
                compact ? "h-8 px-2 text-xs" : "h-9 px-3"
              )}
            >
              <BookmarkPlus className="h-3 w-3" />
              Save Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )

  if (collapsible) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-12 justify-between px-6 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filters & Search</span>
                {showActiveFilterCount && activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                !isCollapsed && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="px-6 pb-6">
              <FilterContent />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className={cn(compact ? "p-4" : "p-6")}>
        <FilterContent />
      </CardContent>
    </Card>
  )
}
