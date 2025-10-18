"use client"
// Client component extracted from original page for SEO-friendly server wrapper.
import { useEffect, useMemo, useState } from 'react'
import { useCampus } from '@/contexts/campus-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CourseCard } from '@/components/past-papers/course-card'
import { UploadPaperDialog } from '@/components/past-papers/upload-paper-dialog'
import { departments, type CourseWithPapers, type PastPaper } from '@/lib/past-papers-data'
import { standardFilters, sortOptions } from '@/lib/filter-data'
import { Upload, FileText, Download, Users, TrendingUp, RefreshCw, Filter, Tag, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AdvancedFilterBar } from '@/components/search/advanced-filter-bar'
import styles from './past-papers.module.css'
import './past-papers.light.module.css'
import './past-papers.dark.module.css'

export default function PastPapersClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedExamType, setSelectedExamType] = useState('All')
  const [selectedSemester, setSelectedSemester] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentSort, setCurrentSort] = useState('date-desc')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coursesWithPapers, setCoursesWithPapers] = useState<CourseWithPapers[]>([])
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const { selectedCampus, selectedDepartment: campusDepartment } = useCampus()

  const loadPapers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedSemester !== 'All') params.set('semester', selectedSemester)
      if (selectedYear !== 'All') params.set('year', selectedYear)
      if (searchTerm) params.set('q', searchTerm)
      // Add campus and department filtering
      if (selectedCampus?.id) params.set('campus_id', selectedCampus.id)
      if (campusDepartment?.id) params.set('department_id', campusDepartment.id)
      
      // Use force-cache to reduce function invocations on Vercel free tier
      const res = await fetch(`/api/past-papers?${params.toString()}`, { cache: 'force-cache' })
      
      // Handle non-OK responses gracefully
      if (!res.ok) {
        console.error("Failed to fetch past papers:", res.status, res.statusText)
        // Don't throw error, just set empty array
        setCoursesWithPapers([])
        return
      }
      
      const json = await res.json()
      
      // Handle API errors gracefully
      if (json.error) {
        console.error("API error:", json.error)
        // Don't throw error, just set empty array
        setCoursesWithPapers([])
        return
      }
      
      const rows: any[] = Array.isArray(json.data) ? json.data : []
      const papers: PastPaper[] = rows.map((r) => ({
        id: r.id || `paper-${Math.random().toString(36).slice(2, 9)}`,
        title: r.title || 'Untitled Paper',
        course: r.course_name || r.course_code || 'Unknown Course',
        courseCode: (r.course_code || 'UNKNOWN').toUpperCase(),
        department: r.department || 'Unknown Department',
        semester: r.semester || 'Unknown Semester',
        year: Number(r.year) || new Date(r.created_at).getFullYear(),
        examType: (r.exam_type === 'Midterm' ? 'Mid-Term' : r.exam_type) || 'Mid-Term',
        uploadedBy: r.uploaded_by || 'Anonymous',
        uploadDate: r.created_at || new Date().toISOString(),
        downloadCount: r.download_count || 0,
        fileSize: r.file_size || 'Unknown',
        fileType: (r.file_type || 'PDF').toUpperCase() as 'PDF' | 'DOC' | 'DOCX',
        downloadUrl: r.file_url || r.public_url || r.external_url || r.link_url || undefined,
        tags: Array.isArray(r.tags) ? r.tags : (r.tags ? [r.tags] : []),
      }))
      const map = new Map<string, CourseWithPapers>()
      for (const p of papers) {
        if (!map.has(p.courseCode)) {
          map.set(p.courseCode, {
            id: p.courseCode,
            name: p.course,
            code: p.courseCode,
            creditHours: 3,
            department: p.department || '',
            totalPapers: 0,
            assignments: [],
            quizzes: [],
            midterms: [],
            finals: [],
            lastUpdated: '1970-01-01',
          })
        }
        const c = map.get(p.courseCode)!
        c.totalPapers += 1
        switch (p.examType) {
          case 'Assignment': c.assignments.push(p); break
          case 'Quiz': c.quizzes.push(p); break
          case 'Mid-Term': c.midterms.push(p); break
          case 'Final': default: c.finals.push(p)
        }
        if (p.uploadDate > c.lastUpdated) c.lastUpdated = p.uploadDate
      }
      setCoursesWithPapers(Array.from(map.values()))
      const allTags = new Set<string>()
      papers.forEach(paper => paper.tags.forEach(tag => allTags.add(tag)))
      setAvailableTags(Array.from(allTags).sort())
    } catch (e: any) {
      console.error("Error loading past papers:", e)
      // Don't set error state that would break the page, just set empty array
      setCoursesWithPapers([])
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { loadPapers() }, [searchTerm, selectedSemester, selectedYear, selectedCampus, campusDepartment])
  useEffect(() => { const h=()=>loadPapers(); window.addEventListener('pastpaper:uploaded', h); return ()=>window.removeEventListener('pastpaper:uploaded', h)}, [])

  const filteredCourses = useMemo(() => {
    let preliminary = coursesWithPapers.filter(course => {
      const matchesSearch = !searchTerm || course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === 'All' || course.department === selectedDepartment
      return matchesSearch && matchesDepartment
    })
    if (selectedExamType !== 'All' || selectedSemester !== 'All' || selectedYear !== 'All' || selectedTags.length > 0) {
      preliminary = preliminary.map(course => {
        const papers = [...course.assignments, ...course.quizzes, ...course.midterms, ...course.finals]
        const filtered = papers.filter(p => {
          const matchesExamType = selectedExamType === 'All' || p.examType === selectedExamType
            , matchesSemester = selectedSemester === 'All' || p.semester === selectedSemester
            , matchesYear = selectedYear === 'All' || p.year.toString() === selectedYear
            , matchesTags = selectedTags.length === 0 || selectedTags.some(tag => p.tags.includes(tag))
          return matchesExamType && matchesSemester && matchesYear && matchesTags
        })
        return { ...course, totalPapers: filtered.length, assignments: filtered.filter(p=>p.examType==='Assignment'), quizzes: filtered.filter(p=>p.examType==='Quiz'), midterms: filtered.filter(p=>p.examType==='Mid-Term'), finals: filtered.filter(p=>p.examType==='Final') }
      }).filter(c => c.totalPapers > 0)
    }
    const sorted = [...preliminary].sort((a,b)=>{
      switch (currentSort) {
        case 'date-desc': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case 'date-asc': return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
        case 'title-asc': return a.name.localeCompare(b.name)
        case 'title-desc': return b.name.localeCompare(a.name)
        case 'course-asc': return a.code.localeCompare(b.code)
        case 'papers-desc': return b.totalPapers - a.totalPapers
        case 'papers-asc': return a.totalPapers - b.totalPapers
        default: return 0
      }
    })
    return sortDirection === 'desc' ? sorted : sorted.reverse()
  }, [coursesWithPapers, searchTerm, selectedDepartment, selectedExamType, selectedSemester, selectedYear, selectedTags, currentSort, sortDirection])

  const totalPapers = coursesWithPapers.reduce((s,c)=>s+c.totalPapers,0)

  return (
    <div className={`${styles.page} bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950`}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700/30 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6"><FileText className="h-4 w-4" /> Academic Resources</div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Past <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Papers</span></h1>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8 font-medium leading-relaxed">Browse courses and access organized past papers including assignments, quizzes, midterms, and finals.</p>
            <div className={styles.actions}>
              <UploadPaperDialog>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-1"><Upload className="h-5 w-5 mr-2" /> Upload Paper</Button>
              </UploadPaperDialog>
              <Button variant="outline" size="lg" onClick={loadPapers} disabled={loading} className="px-6 py-4 rounded-2xl border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"><RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
            </div>
          </div>
          <div className={styles.statGrid}>
            <Card className="glass-card glass-border-light glass-hover rounded-2xl transition-all duration-300 hover:-translate-y-1"><CardContent className="flex items-center gap-4 p-6"><div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30"><FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" /></div><div><div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{totalPapers}</div><div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Papers</div></div></CardContent></Card>
            <Card className="glass-card glass-border-light glass-hover rounded-2xl transition-all duration-300 hover:-translate-y-1"><CardContent className="flex items-center gap-4 p-6"><div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30 dark:border-green-700/30"><Download className="h-8 w-8 text-green-600 dark:text-green-400" /></div><div><div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{filteredCourses.length}</div><div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Filtered Courses</div></div></CardContent></Card>
            <Card className="glass-card glass-border-light glass-hover rounded-2xl transition-all duration-300 hover:-translate-y-1"><CardContent className="flex items-center gap-4 p-6"><div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30 dark:border-purple-700/30"><Users className="h-8 w-8 text-purple-600 dark:text-purple-400" /></div><div><div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{availableTags.length}</div><div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Available Tags</div></div></CardContent></Card>
            <Card className="glass-card glass-border-light glass-hover rounded-2xl transition-all duration-300 hover:-translate-y-1"><CardContent className="flex items-center gap-4 p-6"><div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-200/30 dark:border-orange-700/30"><TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" /></div><div><div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{departments.length}</div><div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Departments</div></div></CardContent></Card>
          </div>
          <AdvancedFilterBar
            search={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by course name, code, or tags..."
            selects={[
              { ...standardFilters.departments, value: selectedDepartment, onChange: setSelectedDepartment, label: 'Department', description: 'Filter by academic department', options: [...standardFilters.departments.options] as any },
              { ...standardFilters.examTypes, value: selectedExamType, onChange: setSelectedExamType, label: 'Exam Type', description: 'Filter by examination type', options: [...standardFilters.examTypes.options] as any },
              { ...standardFilters.semesters, value: selectedSemester, onChange: setSelectedSemester, label: 'Semester', description: 'Filter by academic semester', options: [...standardFilters.semesters.options] as any },
              { ...standardFilters.academicYears, value: selectedYear, onChange: setSelectedYear, label: 'Year', description: 'Filter by academic year', options: [...standardFilters.academicYears.options] as any }
            ]}
            sortOptions={sortOptions.pastPapers}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            filterPresets={[
              { id: 'recent-cs', name: 'Recent CS Papers', filters: { department: 'Computer Science', semester: 'Fall 2024' }, description: 'Latest Computer Science papers' },
              { id: 'midterms-all', name: 'All Midterms', filters: { examType: 'Mid-Term' }, description: 'Mid-term examinations only' },
              { id: 'programming-papers', name: 'Programming Papers', filters: { search: 'programming', department: 'Computer Science' }, description: 'Programming related papers' }
            ]}
            showActiveFilterCount
            collapsible
            defaultCollapsed={false}
            className="mb-10"
            right={<div className="flex items-center gap-4">{availableTags.length>0 && (<Button variant={showTagFilter? 'default':'outline'} size="sm" onClick={()=>setShowTagFilter(!showTagFilter)} className="flex items-center gap-2"><Tag className="h-4 w-4" /> Tags ({availableTags.length})</Button>)}<Button variant="outline" size="sm" onClick={()=>{setSearchTerm('');setSelectedDepartment('All');setSelectedExamType('All');setSelectedSemester('All');setSelectedYear('All');setSelectedTags([])}} className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"><Filter className="h-4 w-4" /> Clear All</Button></div>}
          />
          {showTagFilter && availableTags.length>0 && (
            <Card className="mb-8 glass-card glass-border-light glass-hover rounded-2xl"><CardContent className="p-6"><div className="flex items-center gap-2 mb-4"><Tag className="h-5 w-5 text-primary" /><h3 className="font-semibold text-slate-900 dark:text-white">Filter by Tags</h3>{selectedTags.length>0 && (<Badge variant="secondary" className="text-xs">{selectedTags.length} selected</Badge>)}</div><div className="flex flex-wrap gap-2">{availableTags.map(tag=>{const isSelected=selectedTags.includes(tag);return <Button key={tag} variant={isSelected? 'default':'outline'} size="sm" onClick={()=>setSelectedTags(isSelected? selectedTags.filter(t=>t!==tag):[...selectedTags,tag])} className={`text-xs rounded-full transition-all duration-200 ${isSelected? 'bg-primary text-primary-foreground shadow-lg':'hover:bg-primary/10 hover:text-primary hover:border-primary/30'}`}>{tag}</Button>})}</div>{selectedTags.length>0 && (<div className="mt-4 pt-4 border-t border-border"><Button variant="ghost" size="sm" onClick={()=>setSelectedTags([])} className="text-slate-700 dark:text-slate-300 hover:text-destructive">Clear tag selection</Button></div>)}</CardContent></Card>
          )}
          <div className="mb-8"><h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">{filteredCourses.length} Course{filteredCourses.length!==1? 's':''} <span className="text-blue-600 dark:text-blue-400">Found</span></h2><p className="text-slate-700 dark:text-slate-200 font-medium">Discover academic resources shared by your fellow students</p></div>
          {loading ? (
            <Card className="p-12 text-center"><FileText className="h-16 w-16 text-slate-700 dark:text-slate-300 mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">Loading...</h3><p className="text-muted-foreground">Fetching past papers from the database.</p></Card>
          ) : filteredCourses.length === 0 ? (
            <Card className="p-16 text-center glass-card glass-border-light glass-hover rounded-2xl"><FileText className="h-20 w-20 text-slate-400 dark:text-slate-500 mx-auto mb-6" /><h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">No Courses Found</h3><p className="text-slate-600 dark:text-slate-300 mb-6 font-serif text-lg max-w-md mx-auto">Try adjusting your search terms or department filter to find more courses.</p><Button onClick={()=>{setSearchTerm('');setSelectedDepartment('All');setSelectedExamType('All');setSelectedSemester('All');setSelectedYear('All')}} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3" size="lg">Clear Filters</Button></Card>
          ) : (
            <div className={styles.courseGrid}>{filteredCourses.map(course => <CourseCard key={course.code} course={course} />)}</div>
          )}
        </div>
      </main>
    </div>
  )
}