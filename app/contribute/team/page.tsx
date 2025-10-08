"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Users, 
  Award, 
  Crown,
  CheckCircle,
  Lock,
  AlertCircle,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { TEAM_ROLES, getLevelForPoints } from "@/lib/gamification"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function CoreTeamPage() {
  const { user } = useAuth()
  const [contributionData, setContributionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchContributionData()
    }
  }, [user])

  const fetchContributionData = async () => {
    try {
      const res = await fetch(`/api/contributions/points?userId=${user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setContributionData(data)
      }
    } catch (error) {
      console.error('Error fetching contribution data:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentLevel = contributionData ? getLevelForPoints(contributionData.totalPoints) : null
  const earnedBadgeIds = contributionData?.badges?.map((b: any) => b.id) || []

  const getRoleIcon = (roleId: string) => {
    const icons: Record<string, any> = {
      'content-curator': Award,
      'community-moderator': Users,
      'tech-support': Shield,
      'campus-ambassador': Crown
    }
    return icons[roleId] || Shield
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-red-300 dark:border-red-700 mb-4">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-bold text-red-700 dark:text-red-300">Core Team Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Join the Core Team
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Become an official platform contributor. Help shape the future of campus collaboration.
            </p>
          </motion.div>

          {/* Current Status */}
          {!loading && currentLevel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <Card className={cn(
                "border-2",
                currentLevel.level >= 9 
                  ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/50" 
                  : "bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-400/50"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {currentLevel.level >= 9 ? (
                          <>
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <h3 className="text-xl font-bold text-green-700 dark:text-green-400">
                              Congratulations! You're Eligible! 🎉
                            </h3>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-6 w-6 text-orange-600" />
                            <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400">
                              Keep Contributing!
                            </h3>
                          </>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {currentLevel.level >= 9 ? (
                          <>You've reached Level 9 and can now apply for Core Team roles below. Choose a role that matches your interests and expertise.</>
                        ) : (
                          <>You need to reach Level 9 (12,000 points) to unlock Core Team roles. You currently have {contributionData.totalPoints.toLocaleString()} points at Level {currentLevel.level}.</>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="text-sm">
                          <Trophy className="h-4 w-4 mr-1" />
                          Level {currentLevel.level}: {currentLevel.name}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          <Sparkles className="h-4 w-4 mr-1" />
                          {contributionData.totalPoints.toLocaleString()} Points
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          <Award className="h-4 w-4 mr-1" />
                          {earnedBadgeIds.length} Badges Earned
                        </Badge>
                      </div>
                    </div>
                    {currentLevel.level < 9 && (
                      <Button asChild>
                        <Link href="/profile">
                          View Progress
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Team Roles */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Available Team Roles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {TEAM_ROLES.map((role, idx) => {
                const RoleIcon = getRoleIcon(role.id)
                const isEligible = currentLevel && currentLevel.level >= role.requiredLevel && 
                                  contributionData && contributionData.totalPoints >= role.requiredPoints &&
                                  role.requiredBadges.every(badgeId => earnedBadgeIds.includes(badgeId))
                const missingBadges = role.requiredBadges.filter(badgeId => !earnedBadgeIds.includes(badgeId))

                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={cn(
                      "border-2 h-full transition-all hover:shadow-lg",
                      isEligible 
                        ? `bg-gradient-to-br from-${role.color}-500/10 to-${role.color}-600/10 border-${role.color}-400/50 hover:border-${role.color}-400`
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-75"
                    )}>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className={cn(
                            "p-3 rounded-xl bg-gradient-to-br",
                            `from-${role.color}-500 to-${role.color}-600`
                          )}>
                            <RoleIcon className="h-6 w-6 text-white" />
                          </div>
                          {isEligible ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Eligible
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-500">
                              <Lock className="h-3 w-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{role.name}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">Requirements:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Level</span>
                              <Badge variant="outline" className={cn(
                                currentLevel && currentLevel.level >= role.requiredLevel ? "text-green-600 border-green-400" : ""
                              )}>
                                Level {role.requiredLevel}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Points</span>
                              <Badge variant="outline" className={cn(
                                contributionData && contributionData.totalPoints >= role.requiredPoints ? "text-green-600 border-green-400" : ""
                              )}>
                                {role.requiredPoints.toLocaleString()}
                              </Badge>
                            </div>
                            {role.requiredBadges.length > 0 && (
                              <div className="text-sm">
                                <span className="text-slate-600 dark:text-slate-400 block mb-1">Required Badges:</span>
                                <div className="flex flex-wrap gap-1">
                                  {role.requiredBadges.map(badgeId => (
                                    <Badge 
                                      key={badgeId} 
                                      variant="outline" 
                                      className={cn(
                                        "text-xs",
                                        earnedBadgeIds.includes(badgeId) ? "text-green-600 border-green-400" : "text-slate-500"
                                      )}
                                    >
                                      {earnedBadgeIds.includes(badgeId) ? <CheckCircle className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                                      {badgeId}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Perks */}
                        <div>
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">Role Perks:</h4>
                          <ul className="space-y-1">
                            {role.perks.map((perk, perkIdx) => (
                              <li key={perkIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <div className={cn(
                                  "mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0",
                                  `bg-${role.color}-500`
                                )} />
                                {perk}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Button */}
                        <Button 
                          className="w-full" 
                          disabled={!isEligible}
                          variant={isEligible ? "default" : "outline"}
                        >
                          {isEligible ? (
                            <>
                              Apply for Role
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          ) : missingBadges.length > 0 ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Missing {missingBadges.length} Badge{missingBadges.length > 1 ? 's' : ''}
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Not Eligible Yet
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Core Team Benefits
                </CardTitle>
                <CardDescription>What you get as a Core Team member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Official Recognition</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Get official Core Team badge and recognition across the platform
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Team Access</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Access to private team channels, meetings, and decision-making processes
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Exclusive Perks</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Special privileges, swag, and potential stipends based on your role
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  )
}
