'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, BookOpen, Users, Zap } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/shared/common"
import styles from "../../app/styles/common.module.css"

interface FeatureItem {
  icon: React.ElementType
  title: string
  description: string
}

export function AnimatedSections() {
  const features: FeatureItem[] = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description: "Access to past papers, GPA calculators, and study resources to boost your academic performance."
    },
    {
      icon: Users,
      title: "Community Connection",
      description: "Connect with fellow students, share knowledge, and build meaningful academic relationships."
    },
    {
      icon: BookOpen,
      title: "Resource Hub",
      description: "Comprehensive collection of study materials, faculty reviews, and campus information."
    }
  ]

  return (
    <>
      {/* Enhanced About CampusAxis section with improved glassmorphism and visual hierarchy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/80 to-muted/30 glass-primary" aria-labelledby="about-campusaxis-heading">
        <div className={`${styles.section} ${styles.max6xl}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6" role="banner">
              <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-primary">Our Mission</span>
            </div>
            <h2 id="about-campusaxis-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-balance mb-6">
              Empowering <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">COMSATS Students</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              CampusAxis is more than just an academic portal - it's your comprehensive companion for academic excellence at COMSATS University.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <GlassCard 
                    title={item.title}
                    className="h-full transition-all duration-300 hover:shadow-2xl"
                    glassVariant="primary"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <p className="text-muted-foreground/90 leading-relaxed">{item.description}</p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <GlassCard 
              className="inline-block p-8 sm:p-10 md:p-12 border border-white/30 bg-card/90 backdrop-blur-3xl shadow-2xl rounded-2xl sm:rounded-3xl max-w-3xl mx-auto glass-primary glass-gradient glass-professional"
            >
              <div className="space-y-6 sm:space-y-8">
                <div className="flex justify-center">
                  <div className="relative p-4 sm:p-6 bg-gradient-to-r from-primary/30 to-indigo-500/30 rounded-2xl sm:rounded-2xl glass-secondary">
                    <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-primary" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Academic Experience?</h3>
                  <p className="text-base sm:text-lg text-muted-foreground/90 max-w-2xl mx-auto mb-6">
                    Join thousands of COMSATS students who are already using CampusAxis to excel in their studies and connect with their academic community.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                  <Button 
                    size="lg" 
                    className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    asChild
                  >
                    <Link href="/auth" className="flex items-center justify-center">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      <motion.div 
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 hover:shadow-md transition-all duration-300"
                    asChild
                  >
                    <Link href="/about" className="flex items-center justify-center">
                      <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </>
  )
}