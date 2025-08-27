"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminGuard } from "@/components/admin/admin-guard"

// Timetable schema expected on Supabase table `timetable`:
// id uuid default gen_random_uuid(), course_code text, course_title text, section text,
// day text, start_time text, end_time text, room text, teacher_name text,
// department text, semester text, created_at timestamp default now()

type Row = {
  id: string
  course_code: string
  course_title: string
  section: string
  day: string
  start_time: string
  end_time: string
  room: string
  teacher_name: string
  department: string
  semester: string
  created_at?: string
}

export default function AdminTimetablePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/timetable-docs')
  }, [router])

  return (
    <AdminGuard fallback={<div className="p-6 text-center">Admin access required. <a className="underline" href="/admin/login">Login</a></div>}>
      <div className="app-container section text-center space-y-4">
        <h1 className="text-2xl font-bold">Timetable has moved</h1>
        <p className="text-muted-foreground">We now manage timetables as official PDF documents.</p>
        <Link className="underline" href="/admin/timetable-docs">Go to Timetable PDFs</Link>
      </div>
    </AdminGuard>
  )
}
