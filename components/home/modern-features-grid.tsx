"use client"

import { motion } from "framer-motion"
import { FileText, Calculator, Users, BookOpen, Calendar, Bug, TrendingUp, ArrowRight, Sparkles, Zap, Star, Award, Target, Rocket } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const features = [
  {
    id: 1,
    title: "Past Papers",
    description: "Access 1000+ past exam papers organized by course and semester",
    icon: FileText,
    href: "/past-papers",
    gradient: "from-blue-500 to-cyan-500",
    stats: "1000+",
    label: "Papers",
    size: "large", // Takes 2 columns
  },
  {
    id: 2,
    title: "GPA Calculator",
    description: "Smart GPA calculation tools designed for COMSATS grading system",
    icon: Calculator,
    href: "/gpa-calculator",
    gradient: "from-purple-500 to-pink-500",
    stats: "4.0",
    label: "CGPA Max",
    size: "medium",
  },
  {
    id: 3,
    title: "Faculty Reviews",
    description: "500+ honest reviews from students",
    icon: Users,
    href: "/faculty",
    gradient: "from-orange-500 to-red-500",
    stats: "500+",
    label: "Reviews",
    size: "medium",
  },
  {
    id: 4,
    title: "Study Resources",
    description: "Comprehensive study materials shared by students and departments",
    icon: BookOpen,
    href: "/resources",
    gradient: "from-green-500 to-emerald-500",
    stats: "300+",
    label: "Resources",
    size: "large",
  },
  {
    id: 5,
    title: "Timetables",
    description: "Latest departmental schedules",
    icon: Calendar,
    href: "/timetable",
    gradient: "from-yellow-500 to-orange-500",
    stats: "Live",
    label: "Updates",
    size: "small",
  },
  {
    id: 6,
    title: "Support",
    description: "Report issues and get help",
    icon: Bug,
    href: "/report-issue",
    gradient: "from-indigo-500 to-blue-500",
    stats: "24/7",
    label: "Available",
    size: "small",
  },
]

export function ModernFeaturesGrid() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300">
            <Sparkles className="h-4 w-4 mr-2" />
            Everything You Need
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
            Academic Excellence
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Comprehensive tools and resources designed specifically for COMSATS students
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isLarge = feature.size === "large"
            const isMedium = feature.size === "medium"
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`
                  ${isLarge ? "sm:col-span-2 lg:col-span-2" : ""}
                  ${isMedium ? "sm:col-span-2 lg:col-span-2" : ""}
                  group
                `}
              >
                <Link href={feature.href} className="block h-full">
                  <Card className="relative h-full min-h-[280px] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-500 group-hover:scale-[1.02]">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Animated Border Gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} blur-xl`} />
                    </div>

                    <div className="relative h-full p-5 sm:p-6 lg:p-8 flex flex-col">
                      {/* Icon */}
                      <div className={`mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base lg:text-base text-slate-600 dark:text-slate-400 line-clamp-3">
                          {feature.description}
                        </p>
                      </div>

                      {/* Stats and CTA */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <div className={`text-2xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                            {feature.stats}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {feature.label}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Zap, label: "Active Users", value: "2.5K+", color: "text-yellow-500" },
            { icon: Star, label: "Student Rating", value: "4.8★", color: "text-amber-500" },
            { icon: Award, label: "Resources", value: "1.8K+", color: "text-blue-500" },
            { icon: Rocket, label: "Growth", value: "150%", color: "text-purple-500" },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800"
              >
                <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
