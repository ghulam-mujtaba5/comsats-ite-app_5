// Utility for persisting filter states and managing saved filter presets

import React from 'react'

export interface SavedFilter {
  id: string
  name: string
  description?: string
  pageType: 'past-papers' | 'resources' | 'faculty' | 'student-support'
  filters: Record<string, string | string[] | boolean>
  sortConfig?: {
    sort: string
    direction: 'asc' | 'desc'
  }
  createdAt: string
  lastUsed?: string
  useCount: number
  isDefault?: boolean
}

class FilterPersistence {
  private storageKey = 'comsats-saved-filters'
  private maxSavedFilters = 20

  // Get all saved filters for a specific page type
  getSavedFilters(pageType?: string): SavedFilter[] {
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (!saved) return []
      
      const filters: SavedFilter[] = JSON.parse(saved)
      return pageType ? filters.filter(f => f.pageType === pageType) : filters
    } catch (error) {
      console.error('Error loading saved filters:', error)
      return []
    }
  }

  // Save a new filter preset
  saveFilter(filter: Omit<SavedFilter, 'id' | 'createdAt' | 'useCount'>): SavedFilter {
    try {
      const savedFilters = this.getSavedFilters()
      
      const newFilter: SavedFilter = {
        ...filter,
        id: `filter-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
        useCount: 0
      }

      // Check if we're at the limit and remove least used non-default filter
      if (savedFilters.length >= this.maxSavedFilters) {
        const nonDefaultFilters = savedFilters.filter(f => !f.isDefault)
        if (nonDefaultFilters.length > 0) {
          const leastUsed = nonDefaultFilters.reduce((min, current) => 
            current.useCount < min.useCount ? current : min
          )
          this.deleteFilter(leastUsed.id)
        }
      }

      const updatedFilters = [...this.getSavedFilters(), newFilter]
      localStorage.setItem(this.storageKey, JSON.stringify(updatedFilters))
      
      return newFilter
    } catch (error) {
      console.error('Error saving filter:', error)
      throw new Error('Failed to save filter')
    }
  }

  // Load and use a saved filter (updates usage stats)
  useFilter(filterId: string): SavedFilter | null {
    try {
      const savedFilters = this.getSavedFilters()
      const filterIndex = savedFilters.findIndex(f => f.id === filterId)
      
      if (filterIndex === -1) return null

      // Update usage stats
      savedFilters[filterIndex].useCount += 1
      savedFilters[filterIndex].lastUsed = new Date().toISOString()
      
      localStorage.setItem(this.storageKey, JSON.stringify(savedFilters))
      
      return savedFilters[filterIndex]
    } catch (error) {
      console.error('Error using filter:', error)
      return null
    }
  }

  // Delete a saved filter
  deleteFilter(filterId: string): boolean {
    try {
      const savedFilters = this.getSavedFilters()
      const updatedFilters = savedFilters.filter(f => f.id !== filterId)
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedFilters))
      return true
    } catch (error) {
      console.error('Error deleting filter:', error)
      return false
    }
  }

  // Update an existing filter
  updateFilter(filterId: string, updates: Partial<SavedFilter>): boolean {
    try {
      const savedFilters = this.getSavedFilters()
      const filterIndex = savedFilters.findIndex(f => f.id === filterId)
      
      if (filterIndex === -1) return false

      savedFilters[filterIndex] = {
        ...savedFilters[filterIndex],
        ...updates
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(savedFilters))
      return true
    } catch (error) {
      console.error('Error updating filter:', error)
      return false
    }
  }

  // Get most frequently used filters
  getMostUsedFilters(pageType: string, limit = 5): SavedFilter[] {
    const filters = this.getSavedFilters(pageType)
    return filters
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit)
  }

  // Get recently used filters
  getRecentFilters(pageType: string, limit = 5): SavedFilter[] {
    const filters = this.getSavedFilters(pageType)
    return filters
      .filter(f => f.lastUsed)
      .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
      .slice(0, limit)
  }

  // Export filters for backup
  exportFilters(): string {
    const filters = this.getSavedFilters()
    return JSON.stringify(filters, null, 2)
  }

  // Import filters from backup
  importFilters(filtersJson: string): boolean {
    try {
      const filters: SavedFilter[] = JSON.parse(filtersJson)
      
      // Validate the structure
      if (!Array.isArray(filters)) {
        throw new Error('Invalid format: expected array')
      }

      filters.forEach(filter => {
        if (!filter.id || !filter.name || !filter.pageType || !filter.filters) {
          throw new Error('Invalid filter structure')
        }
      })

      localStorage.setItem(this.storageKey, JSON.stringify(filters))
      return true
    } catch (error) {
      console.error('Error importing filters:', error)
      return false
    }
  }

  // Clear all saved filters
  clearAllFilters(): boolean {
    try {
      localStorage.removeItem(this.storageKey)
      return true
    } catch (error) {
      console.error('Error clearing filters:', error)
      return false
    }
  }

  // Get filter statistics
  getFilterStats(pageType?: string): {
    totalFilters: number
    totalUsage: number
    averageUsage: number
    mostUsedFilter?: SavedFilter
  } {
    const filters = this.getSavedFilters(pageType)
    const totalUsage = filters.reduce((sum, f) => sum + f.useCount, 0)
    const mostUsedFilter = filters.reduce((max, current) => 
      current.useCount > (max?.useCount || 0) ? current : max, filters[0]
    )

    return {
      totalFilters: filters.length,
      totalUsage,
      averageUsage: filters.length > 0 ? totalUsage / filters.length : 0,
      mostUsedFilter
    }
  }
}

// Create a singleton instance
export const filterPersistence = new FilterPersistence()

// Hook for using saved filters in React components
export function useSavedFilters(pageType: string) {
  const [savedFilters, setSavedFilters] = React.useState<SavedFilter[]>([])

  React.useEffect(() => {
    setSavedFilters(filterPersistence.getSavedFilters(pageType))
  }, [pageType])

  const saveFilter = React.useCallback((filter: Omit<SavedFilter, 'id' | 'createdAt' | 'useCount'>) => {
    const newFilter = filterPersistence.saveFilter(filter)
    setSavedFilters(filterPersistence.getSavedFilters(pageType))
    return newFilter
  }, [pageType])

  const useFilter = React.useCallback((filterId: string) => {
    const filter = filterPersistence.useFilter(filterId)
    setSavedFilters(filterPersistence.getSavedFilters(pageType))
    return filter
  }, [pageType])

  const deleteFilter = React.useCallback((filterId: string) => {
    const success = filterPersistence.deleteFilter(filterId)
    if (success) {
      setSavedFilters(filterPersistence.getSavedFilters(pageType))
    }
    return success
  }, [pageType])

  const updateFilter = React.useCallback((filterId: string, updates: Partial<SavedFilter>) => {
    const success = filterPersistence.updateFilter(filterId, updates)
    if (success) {
      setSavedFilters(filterPersistence.getSavedFilters(pageType))
    }
    return success
  }, [pageType])

  return {
    savedFilters,
    saveFilter,
    useFilter,
    deleteFilter,
    updateFilter,
    mostUsedFilters: filterPersistence.getMostUsedFilters(pageType),
    recentFilters: filterPersistence.getRecentFilters(pageType),
    stats: filterPersistence.getFilterStats(pageType)
  }
}

// Default filter presets that get loaded on first visit
export const defaultFilterPresets: Record<string, SavedFilter[]> = {
  'past-papers': [
    {
      id: 'default-recent-cs',
      name: 'Recent CS Papers',
      description: 'Latest Computer Science papers from current semester',
      pageType: 'past-papers',
      filters: {
        department: 'Computer Science',
        semester: 'Fall 2024'
      },
      sortConfig: {
        sort: 'date-desc',
        direction: 'desc'
      },
      createdAt: new Date().toISOString(),
      useCount: 0,
      isDefault: true
    },
    {
      id: 'default-midterms',
      name: 'All Midterms',
      description: 'Mid-term examinations from all departments',
      pageType: 'past-papers',
      filters: {
        examType: 'Mid-Term'
      },
      sortConfig: {
        sort: 'date-desc',
        direction: 'desc'
      },
      createdAt: new Date().toISOString(),
      useCount: 0,
      isDefault: true
    }
  ],
  'resources': [
    {
      id: 'default-verified',
      name: 'Verified Resources',
      description: 'Only verified and high-quality resources',
      pageType: 'resources',
      filters: {
        showVerifiedOnly: true
      },
      sortConfig: {
        sort: 'rating-desc',
        direction: 'desc'
      },
      createdAt: new Date().toISOString(),
      useCount: 0,
      isDefault: true
    }
  ],
  'faculty': [
    {
      id: 'default-highly-rated',
      name: 'Highly Rated Faculty',
      description: 'Faculty members with 4+ star ratings',
      pageType: 'faculty',
      filters: {
        minRating: '4.0'
      },
      sortConfig: {
        sort: 'rating-desc',
        direction: 'desc'
      },
      createdAt: new Date().toISOString(),
      useCount: 0,
      isDefault: true
    }
  ],
  'student-support': [
    {
      id: 'default-emergency',
      name: 'Emergency Resources',
      description: 'High priority emergency support resources',
      pageType: 'student-support',
      filters: {
        priority: 'high',
        showEmergencyOnly: true
      },
      sortConfig: {
        sort: 'priority-desc',
        direction: 'desc'
      },
      createdAt: new Date().toISOString(),
      useCount: 0,
      isDefault: true
    }
  ]
}

// Initialize default presets if none exist
export function initializeDefaultPresets() {
  try {
    const existingFilters = filterPersistence.getSavedFilters()
    
    if (existingFilters.length === 0) {
      // Load all default presets
      const allDefaults = Object.values(defaultFilterPresets).flat()
      localStorage.setItem('comsats-saved-filters', JSON.stringify(allDefaults))
    }
  } catch (error) {
    console.error('Error initializing default presets:', error)
  }
}