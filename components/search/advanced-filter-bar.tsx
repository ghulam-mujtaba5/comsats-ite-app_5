"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { ReactNode } from "react"

export type Option = { label: string; value: string }

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
  }>
  left?: ReactNode
  right?: ReactNode
}

export function AdvancedFilterBar({
  searchPlaceholder = "Search...",
  search,
  onSearchChange,
  selects = [],
  left,
  right,
}: AdvancedFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {left}
      {selects.map((s) => (
        <Select key={s.id} value={s.value} onValueChange={s.onChange}>
          <SelectTrigger className={"w-full md:w-56 " + (s.className || "") }>
            <SelectValue placeholder={s.placeholder || "Select"} />
          </SelectTrigger>
          <SelectContent>
            {s.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {right}
    </div>
  )
}
