"use client"

import React from 'react'
import { useThemeMode } from '@/lib/theme/useThemeMode'
import stylesLight from './admin.light.module.css'
import stylesDark from './admin.dark.module.css'

export function AdminThemeWrapper({ children }: { children: React.ReactNode }) {
  const mode = useThemeMode()
  const themeClass = mode === 'dark' ? stylesDark.adminDark : stylesLight.adminLight
  return <div className={themeClass}>{children}</div>
}
