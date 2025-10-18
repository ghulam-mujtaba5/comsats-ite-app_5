"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, CheckCircle2, Users, TrendingUp, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"

export function InteractiveCTA() {
  const benefits = [
    "Access 1000+ past papers instantly",
    "Connect with 2500+ students",
    "Calculate GPA with precision",
    "Read honest faculty reviews",
  ]

  const testimonials = [
    {
      name: "Ahmad K.",
      role: "CS Student",
      text: "CampusAxis helped me ace my exams!",
      avatar: "AK",
    },
    {
      name: "Sara M.",
      role: "SE Student",
      text: "Best resource for COMSATS students",
      avatar: "SM",
    },
    {
      name: "Ali R.",
      role: "IT Student",
      text: "GPA calculator is incredibly accurate",
      avatar: "AR",
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - CTA Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Join the Community
              </span>
            </div>

            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Ready to Excel in
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Academics?
                </span>
              </h2>
              <p className="text-lg text-slate-800 dark:text-slate-200 font-medium">
                Join thousands of COMSATS students who are already using CampusAxis to transform their academic journey.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/50"
              >
                <Link href="/auth" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="px-8 py-6 text-lg rounded-2xl border-2"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">2,500+</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Active Students</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">150%</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Growth Rate</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <UnifiedGlassCard 
                  variant="medium" 
                  interactive
                  className="p-6 border-2 border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          · {testimonial.role}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">
                        "{testimonial.text}"
                      </p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Award key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                </UnifiedGlassCard>
              </motion.div>
            ))}

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <UnifiedGlassCard 
                variant="medium" 
                className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 h-full"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Trusted by Students
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Across all COMSATS campuses
                    </div>
                  </div>
                </div>
              </UnifiedGlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
