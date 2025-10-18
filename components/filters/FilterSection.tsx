"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import styles from "./FilterSection.module.css"

type FilterSectionProps = {
  onSearch?: (query: string) => void
  onDepartmentChange?: (dept: string) => void
  onExamTypeChange?: (type: string) => void
  onSemesterChange?: (semester: string) => void
  onYearChange?: (year: string) => void
  onSortChange?: (sort: string) => void
  onClearAll?: () => void
  departments?: string[]
  examTypes?: string[]
  semesters?: string[]
  years?: string[]
  presets?: { label: string; value: string; icon?: React.ReactNode }[]
  showPresets?: boolean
  totalResults?: number
}

export function FilterSection({
  onSearch,
  onDepartmentChange,
  onExamTypeChange,
  onSemesterChange,
  onYearChange,
  onSortChange,
  onClearAll,
  departments = ["All Departments"],
  examTypes = ["All Types"],
  semesters = ["All Semesters"],
  years = ["All Years"],
  presets = [],
  showPresets = true,
  totalResults = 0,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("desc")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleClearAll = () => {
    setSearchQuery("")
    onClearAll?.()
  }

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc"
    setSortOrder(newOrder)
    onSortChange?.(newOrder)
  }

  return (
    <div className={styles.filterSection}>
      <div className={styles.filterHeader}>
        <div className={styles.filterTitle}>
          <Filter className={styles.filterIcon} />
          <h2 className={styles.titleText}>Filters & Search</h2>
        </div>
        <button 
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle filters"
        >
          <ChevronDown className={`${styles.chevronIcon} ${isExpanded ? styles.chevronExpanded : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <div className={styles.filterContent}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <Input
                type="text"
                placeholder="Search by course name, code, or tags"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              className={styles.clearButton}
            >
              <X className={styles.clearIcon} />
              Clear All
            </Button>
          </div>

          {/* Filter Controls */}
          <div className={styles.filtersRow}>
            <div className={styles.filterTitle}>
              <Filter className={styles.filterIcon} />
              <span className={styles.filterLabel}>Filters</span>
            </div>

            <div className={styles.filterGrid}>
              {/* Department */}
              <div className={styles.filterItem}>
                <label className={styles.filterItemLabel}>Department</label>
                <Select onValueChange={onDepartmentChange}>
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className={styles.filterHint}>Filter by academic department</p>
              </div>

              {/* Exam Type */}
              <div className={styles.filterItem}>
                <label className={styles.filterItemLabel}>Exam Type</label>
                <Select onValueChange={onExamTypeChange}>
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className={styles.filterHint}>Filter by examination type</p>
              </div>

              {/* Semester */}
              <div className={styles.filterItem}>
                <label className={styles.filterItemLabel}>Semester</label>
                <Select onValueChange={onSemesterChange}>
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>
                        {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className={styles.filterHint}>Filter by academic semester</p>
              </div>

              {/* Year */}
              <div className={styles.filterItem}>
                <label className={styles.filterItemLabel}>Year</label>
                <Select onValueChange={onYearChange}>
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className={styles.filterHint}>Filter by academic year</p>
              </div>
            </div>
          </div>

          {/* Sort & Presets */}
          {showPresets && (
            <div className={styles.presetsRow}>
              <div className={styles.sortContainer}>
                <span className={styles.sortLabel}>SORT BY:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={styles.sortButton}
                  onClick={toggleSortOrder}
                >
                  Most Recent
                  <ChevronDown className={styles.sortIcon} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={styles.orderButton}
                  onClick={toggleSortOrder}
                >
                  {sortOrder === "desc" ? "Descending" : "Ascending"}
                </Button>
              </div>

              <div className={styles.presetsContainer}>
                <span className={styles.presetsLabel}>PRESETS:</span>
                <div className={styles.presetButtons}>
                  {presets.map((preset) => (
                    <Button
                      key={preset.value}
                      variant="outline"
                      size="sm"
                      className={styles.presetButton}
                    >
                      {preset.icon}
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
