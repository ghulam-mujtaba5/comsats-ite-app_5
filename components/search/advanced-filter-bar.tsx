"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, Filter, X, ChevronDown, SortAsc, SortDesc, RotateCcw, BookmarkPlus, Bookmark } from "lucide-react"
import { ReactNode, useState, useEffect } from "react"
import { cn } from "@lib/utils"
import styles from "./advanced-filter-bar.module.css"

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

  const renderFilterContent = () => (
    <div className="space-y-4">
      {/* Search and Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-700 dark:text-slate-300 group-focus-within:text-primary transition-colors duration-200" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "pl-12 pr-12 h-12 text-base",
              "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
              "border-slate-200 dark:border-slate-700/30",
              "focus:bg-white/80 dark:focus:bg-slate-800/80",
              "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
              "hover:border-primary/30 hover:bg-white/60 dark:hover:bg-slate-800/60",
              "rounded-2xl transition-all duration-200",
              "placeholder:text-slate-700 dark:text-slate-300/70"
            )}
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-slate-700/30 rounded-xl"
              onClick={() => onSearchChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {left}
        {right}
      </div>

      {/* Filter Controls */}
      {selects.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">Filters</span>
              {showActiveFilterCount && activeFilterCount > 0 && (
                <Badge className="text-xs bg-primary/10 text-primary border border-primary/20">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className={cn(
                  "h-9 px-4 text-sm",
                  "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                  "border-slate-200 dark:border-slate-700/30",
                  "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30",
                  "rounded-xl transition-all duration-200"
                )}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          <div className={cn(
            styles.filterGrid
          )}>
            {selects.map((select) => (
              <div key={select.id} className="space-y-2">
                {select.label && (
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {select.label}
                  </label>
                )}
                <Select value={select.value} onValueChange={select.onChange}>
                  <SelectTrigger className={cn(
                    "h-10 px-4 text-sm",
                    "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                    "border-slate-200 dark:border-slate-700/30",
                    "hover:border-primary/40 hover:bg-white/60 dark:hover:bg-slate-800/60",
                    "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                    "rounded-xl transition-all duration-200",
                    select.value && select.value !== 'All' && select.value !== '' && 
                      "border-primary/50 bg-primary/5 dark:bg-primary/10",
                    select.className
                  )}>
                    <SelectValue placeholder={select.placeholder || "Select"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700/30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                    {select.options.map((opt) => (
                      <SelectItem 
                        key={opt.value} 
                        value={opt.value} 
                        className="rounded-lg hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="font-medium">{opt.label}</div>
                          {opt.description && (
                            <div className="text-xs text-muted-foreground">{opt.description}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {select.description && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{select.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

          {/* Sort and Advanced Options */}
      {(sortOptions.length > 0 || savedPresets.length > 0) && (
        <div className={cn(
          "flex flex-col sm:flex-row gap-4 pt-4 mt-4",
          "border-t border-slate-200 dark:border-slate-700/30"
        )}>
          {/* Sort Options */}
          {sortOptions.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sort by:</span>
              <Select value={currentSort} onValueChange={onSortChange}>
                <SelectTrigger className={cn(
                  "w-40 h-10 px-4 text-sm",
                  "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                  "border-slate-200 dark:border-slate-700/30",
                  "hover:border-primary/40 hover:bg-white/60 dark:hover:bg-slate-800/60",
                  "rounded-xl transition-all duration-200"
                )}>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700/30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="rounded-lg hover:bg-primary/10">
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
                  className={cn(
                    "h-10 px-4 flex items-center gap-2",
                    "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                    "border-slate-200 dark:border-slate-700/30",
                    "hover:border-primary/40 hover:bg-white/60 dark:hover:bg-slate-800/60",
                    "rounded-xl transition-all duration-200"
                  )}
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                  <span className="font-medium capitalize">{sortDirection}ending</span>
                </Button>
              )}
            </div>
          )}

          {/* Filter Presets */}
          {savedPresets.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Presets:</span>
              <div className="flex flex-wrap gap-2">
                {savedPresets.slice(0, 3).map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadPreset?.(preset)}
                    className={cn(
                      "h-10 px-4 flex items-center gap-2 text-sm",
                      "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                      "border-slate-200 dark:border-slate-700/30",
                      "hover:border-primary/40 hover:bg-primary/10",
                      "rounded-xl transition-all duration-200"
                    )}
                  >
                    <Bookmark className="h-4 w-4" />
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Save Current Filters */}
          {activeFilterCount > 0 && onSavePreset && (
            <Button
              variant="outline"
              size="sm"
              onClick={saveCurrentAsPreset}
              className={cn(
                "h-10 px-4 flex items-center gap-2 text-sm",
                "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                "border-slate-200 dark:border-slate-700/30",
                "hover:border-primary/40 hover:bg-primary/10",
                "rounded-xl transition-all duration-200"
              )}
            >
              <BookmarkPlus className="h-4 w-4" />
              Save Filter
            </Button>
          )}
        </div>
      )}
    </div>
  )

  if (!collapsible) {
    return (
      <div className={cn(
        styles.filterBarContainer,
        "relative",
        "rounded-3xl shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "p-4 lg:p-6",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
        <div className="relative z-10">
          {renderFilterContent()}
        </div>
      </div>
    )
  }

  return (
    <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
      <div className={cn(
        styles.filterBarContainer,
        "relative",
        "rounded-3xl shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "overflow-hidden",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between p-4 lg:p-6 h-auto",
              "hover:bg-white/10 dark:hover:bg-slate-800/20",
              "border-0 rounded-none",
              "text-left font-medium"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">Filters & Search</span>
                {showActiveFilterCount && activeFilterCount > 0 && (
                  <Badge className="ml-3 bg-primary/10 text-primary border border-primary/20">
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 text-slate-700 dark:text-slate-300 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1">
          <div className="px-4 lg:px-6 pb-4 lg:pb-6 border-t border-slate-200 dark:border-slate-700/20">
            <div className="pt-4">
              {renderFilterContent()}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
