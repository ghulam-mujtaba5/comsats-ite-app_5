"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

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

export function CampusProvider({ children }: { children: ReactNode }) {
  const [selectedCampus, setSelectedCampusState] = useState<Campus | null>(null)
  const [selectedDepartment, setSelectedDepartmentState] = useState<Department | null>(null)
  const [selectedProgram, setSelectedProgramState] = useState<Program | null>(null)
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load campuses on mount
  useEffect(() => {
    loadCampuses()
  }, [])

  // Load saved selection from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
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
  }, [])

  // Save selection to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && selectedCampus) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          campus: selectedCampus,
          department: selectedDepartment,
          program: selectedProgram,
        })
      )
    }
  }, [selectedCampus, selectedDepartment, selectedProgram])

  const loadCampuses = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/campuses")
      if (res.ok) {
        const data = await res.json()
        setCampuses(data)
        
        // Auto-select default campus (Lahore) if no selection
        if (!selectedCampus) {
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

  const loadDepartments = async (campusId: string) => {
    try {
      const res = await fetch(`/api/departments?campus_id=${campusId}`)
      if (res.ok) {
        const data = await res.json()
        setDepartments(data)
      }
    } catch (error) {
      console.error("Failed to load departments:", error)
    }
  }

  const loadPrograms = async (departmentId: string) => {
    try {
      const res = await fetch(`/api/programs?department_id=${departmentId}`)
      if (res.ok) {
        const data = await res.json()
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
