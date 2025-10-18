"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import { departments, examTypes, semesters, years, getCoursesByDepartment } from "@/lib/past-papers-data"

interface PaperFiltersProps {
  filters: {
    department: string
    course: string
    examType: string
    semester: string
    year: string
    search: string
  }
  onFilterChange: (key: string, value: string) => void
  onReset: () => void
}

export function PaperFilters({ filters, onFilterChange, onReset }: PaperFiltersProps) {
  const availableCourses =
    filters.department && filters.department !== "All" ? getCoursesByDepartment(filters.department) : []

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-slate-800 border border-border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filter Papers
        </h3>
        <Button variant="outline" size="sm" onClick={onReset} className="bg-transparent">
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">Department</label>
          <Select value={filters.department} onValueChange={(value) => onFilterChange("department", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">Course</label>
          <Select
            value={filters.course}
            onValueChange={(value) => onFilterChange("course", value)}
            disabled={!filters.department || filters.department === "All"}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Courses</SelectItem>
              {availableCourses.map((course) => (
                <SelectItem key={course.id} value={course.code}>
                  {course.code} - {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">Exam Type</label>
          <Select value={filters.examType} onValueChange={(value) => onFilterChange("examType", value)}>
            <SelectTrigger>
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
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">Semester</label>
          <Select value={filters.semester} onValueChange={(value) => onFilterChange("semester", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((semester) => (
                <SelectItem key={semester} value={semester}>
                  {semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">Year</label>
          <Select value={filters.year} onValueChange={(value) => onFilterChange("year", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search papers..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
