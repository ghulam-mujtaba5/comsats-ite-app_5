"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"

interface Campus {
  id: string
  name: string
  code: string
  city: string
  full_name: string
  is_default: boolean
}

interface Department {
  id: string
  campus_id: string
  name: string
  code: string
  full_name: string
  description?: string
}

interface Program {
  id: string
  department_id: string
  name: string
  code: string
  degree_type: string
}

interface CampusContextType {
  selectedCampus: Campus | null
  selectedDepartment: Department | null
  selectedProgram: Program | null
  campuses: Campus[]
  departments: Department[]
  programs: Program[]
  setSelectedCampus: (campus: Campus | null) => void
  setSelectedDepartment: (department: Department | null) => void
  setSelectedProgram: (program: Program | null) => void
  loadCampuses: () => Promise<void>
  loadDepartments: (campusId: string) => Promise<void>
  loadPrograms: (departmentId: string) => Promise<void>
  isLoading: boolean
}

const CampusContext = createContext<CampusContextType | undefined>(undefined)

const STORAGE_KEY = "campus-selection"

// Simple in-memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

export function CampusProvider({ children }: { children: ReactNode }) {
  const [selectedCampus, setSelectedCampusState] = useState<Campus | null>(null)
  const [selectedDepartment, setSelectedDepartmentState] = useState<Department | null>(null)
  const [selectedProgram, setSelectedProgramState] = useState<Program | null>(null)
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load campuses on mount
  useEffect(() => {
    loadCampuses()
  }, [])

  // Load user preferences when user logs in
  useEffect(() => {
    if (user) {
      loadUserPreferences()
    }
  }, [user])

  // Load saved selection from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const { campus, department, program } = JSON.parse(saved)
          if (campus) setSelectedCampusState(campus)
          if (department) setSelectedDepartmentState(department)
          if (program) setSelectedProgramState(program)
        } catch (e) {
          console.error("Failed to parse saved campus selection:", e)
        }
      }
    }
  }, [user])

  // Save selection to localStorage (only for non-logged in users)
  useEffect(() => {
    if (typeof window !== "undefined" && !user && selectedCampus) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          campus: selectedCampus,
          department: selectedDepartment,
          program: selectedProgram,
        })
      )
    }
  }, [selectedCampus, selectedDepartment, selectedProgram, user])

  const loadCampuses = async () => {
    setIsLoading(true)
    try {
      // Check cache first
      const cacheKey = "/api/campuses"
      const cached = apiCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setCampuses(cached.data)
        
        // Auto-select default campus (Lahore) if no selection and no user
        if (!selectedCampus && !user) {
          const defaultCampus = cached.data.find((c: Campus) => c.is_default) || cached.data[0]
          if (defaultCampus) {
            setSelectedCampusState(defaultCampus)
            // Load departments for default campus
            await loadDepartments(defaultCampus.id)
          }
        }
        return
      }

      const res = await fetch("/api/campuses")
      if (res.ok) {
        const data = await res.json()
        // Cache the response
        apiCache.set(cacheKey, { data, timestamp: Date.now() })
        setCampuses(data)
        
        // Auto-select default campus (Lahore) if no selection and no user
        if (!selectedCampus && !user) {
          const defaultCampus = data.find((c: Campus) => c.is_default) || data[0]
          if (defaultCampus) {
            setSelectedCampusState(defaultCampus)
            // Load departments for default campus
            await loadDepartments(defaultCampus.id)
          }
        }
      }
    } catch (error) {
      console.error("Failed to load campuses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserPreferences = async () => {
    if (!user) return
    
    try {
      const res = await fetch("/api/user-preferences")
      if (res.ok) {
        const data = await res.json()
        if (data) {
          // Set campus from user preferences
          if (data.campus) {
            setSelectedCampusState(data.campus)
            await loadDepartments(data.campus.id)
          }
          
          // Set department from user preferences
          if (data.department) {
            setSelectedDepartmentState(data.department)
            await loadPrograms(data.department.id)
          }
          
          // Set program from user preferences
          if (data.program) {
            setSelectedProgramState(data.program)
          }
        }
      }
    } catch (error) {
      console.error("Failed to load user preferences:", error)
    }
  }

  const loadDepartments = async (campusId: string) => {
    try {
      // Check cache first
      const cacheKey = `/api/departments?campus_id=${campusId}`
      const cached = apiCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setDepartments(cached.data)
        return
      }

      const res = await fetch(`/api/departments?campus_id=${campusId}`)
      if (res.ok) {
        const data = await res.json()
        // Cache the response
        apiCache.set(cacheKey, { data, timestamp: Date.now() })
        setDepartments(data)
      }
    } catch (error) {
      console.error("Failed to load departments:", error)
    }
  }

  const loadPrograms = async (departmentId: string) => {
    try {
      // Check cache first
      const cacheKey = `/api/programs?department_id=${departmentId}`
      const cached = apiCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setPrograms(cached.data)
        return
      }

      const res = await fetch(`/api/programs?department_id=${departmentId}`)
      if (res.ok) {
        const data = await res.json()
        // Cache the response
        apiCache.set(cacheKey, { data, timestamp: Date.now() })
        setPrograms(data)
      }
    } catch (error) {
      console.error("Failed to load programs:", error)
    }
  }

  const setSelectedCampus = (campus: Campus | null) => {
    setSelectedCampusState(campus)
    setSelectedDepartmentState(null)
    setSelectedProgramState(null)
    setDepartments([])
    setPrograms([])
    if (campus) {
      loadDepartments(campus.id)
    }
  }

  const setSelectedDepartment = (department: Department | null) => {
    setSelectedDepartmentState(department)
    setSelectedProgramState(null)
    setPrograms([])
    if (department) {
      loadPrograms(department.id)
    }
  }

  const setSelectedProgram = (program: Program | null) => {
    setSelectedProgramState(program)
  }

  return (
    <CampusContext.Provider
      value={{
        selectedCampus,
        selectedDepartment,
        selectedProgram,
        campuses,
        departments,
        programs,
        setSelectedCampus,
        setSelectedDepartment,
        setSelectedProgram,
        loadCampuses,
        loadDepartments,
        loadPrograms,
        isLoading,
      }}
    >
      {children}
    </CampusContext.Provider>
  )
}

export function useCampus() {
  const context = useContext(CampusContext)
  if (context === undefined) {
    throw new Error("useCampus must be used within a CampusProvider")
  }
  return context
}