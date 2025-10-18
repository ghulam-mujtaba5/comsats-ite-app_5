"use client"

import React from "react"
import { useThemeMode } from "@/lib/theme/useThemeMode"
import darkStyles from "./admin.dark.module.css"
import lightStyles from "./admin.light.module.css"
import styles from './AdminThemeRoot.module.css';

type Props = { children: React.ReactNode }

// Applies a local root class for the admin section based on the resolved theme.
export default function AdminThemeRoot({ children }: Props) {
  const mode = useThemeMode()
  const isDark = mode.isDark
  const rootClass = isDark ? darkStyles.adminRootDark : lightStyles.adminRootLight
  return <div className={rootClass}>{children}</div>
}
