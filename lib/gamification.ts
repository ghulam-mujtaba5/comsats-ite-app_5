// Gamification System Configuration

export interface Level {
  level: number
  name: string
  minPoints: number
  maxPoints: number
  icon: string
  color: string
  gradient: string
  perks: string[]
  title: string
}

export interface Reward {
  id: string
  name: string
  description: string
  icon: string
  requiredPoints: number
  requiredLevel: number
  type: 'badge' | 'title' | 'perk' | 'team'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
}

export interface TeamRole {
  id: string
  name: string
  description: string
  requiredLevel: number
  requiredPoints: number
  requiredBadges: string[]
  perks: string[]
  color: string
}

// 10-Level System (0-9)
export const LEVELS: Level[] = [
  {
    level: 0,
    name: 'Newcomer',
    minPoints: 0,
    maxPoints: 99,
    icon: 'User',
    color: 'slate',
    gradient: 'from-slate-500 to-slate-600',
    perks: ['Basic access', 'Community viewing'],
    title: 'New Student'
  },
  {
    level: 1,
    name: 'Contributor',
    minPoints: 100,
    maxPoints: 299,
    icon: 'UserPlus',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    perks: ['Upload papers', 'Write reviews', 'Create posts'],
    title: 'Active Contributor'
  },
  {
    level: 2,
    name: 'Helper',
    minPoints: 300,
    maxPoints: 599,
    icon: 'Heart',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    perks: ['Priority support', 'Helper badge', 'Featured posts'],
    title: 'Community Helper'
  },
  {
    level: 3,
    name: 'Scholar',
    minPoints: 600,
    maxPoints: 999,
    icon: 'BookOpen',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    perks: ['Scholar badge', 'Early access to features', 'Custom profile theme'],
    title: 'Campus Scholar'
  },
  {
    level: 4,
    name: 'Expert',
    minPoints: 1000,
    maxPoints: 1999,
    icon: 'Award',
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    perks: ['Expert badge', 'Moderator tools', 'Profile customization'],
    title: 'Subject Expert'
  },
  {
    level: 5,
    name: 'Mentor',
    minPoints: 2000,
    maxPoints: 3499,
    icon: 'Users',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    perks: ['Mentor badge', 'Host study groups', 'Verified checkmark'],
    title: 'Campus Mentor'
  },
  {
    level: 6,
    name: 'Champion',
    minPoints: 3500,
    maxPoints: 5499,
    icon: 'Trophy',
    color: 'yellow',
    gradient: 'from-yellow-500 to-amber-600',
    perks: ['Champion badge', 'Featured profile', 'Priority review'],
    title: 'Campus Champion'
  },
  {
    level: 7,
    name: 'Legend',
    minPoints: 5500,
    maxPoints: 7999,
    icon: 'Crown',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    perks: ['Legend badge', 'Special flair', 'Content creator access'],
    title: 'Campus Legend'
  },
  {
    level: 8,
    name: 'Elite',
    minPoints: 8000,
    maxPoints: 11999,
    icon: 'Zap',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    perks: ['Elite badge', 'Admin consultation', 'Feature suggestions'],
    title: 'Elite Contributor'
  },
  {
    level: 9,
    name: 'Core Team',
    minPoints: 12000,
    maxPoints: 999999,
    icon: 'Shield',
    color: 'red',
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
    perks: ['Core Team badge', 'Platform decision input', 'Official team member', 'All admin features'],
    title: 'Core Team Member'
  }
]

// Enhanced Badge System with Team Progression
export const BADGES = [
  // Beginner Badges (Common)
  { id: 'first-upload', name: 'First Upload', icon: 'Upload', points: 50, level: 1, rarity: 'common' },
  { id: 'first-review', name: 'First Review', icon: 'Star', points: 25, level: 1, rarity: 'common' },
  { id: 'first-post', name: 'First Post', icon: 'MessageSquare', points: 15, level: 1, rarity: 'common' },
  
  // Growth Badges (Uncommon)
  { id: 'helpful-5', name: 'Helpful Hand', icon: 'ThumbsUp', points: 100, level: 2, rarity: 'uncommon' },
  { id: 'papers-10', name: 'Paper Provider', icon: 'FileText', points: 300, level: 2, rarity: 'uncommon' },
  { id: 'reviewer', name: 'Trusted Reviewer', icon: 'CheckCircle', points: 300, level: 2, rarity: 'uncommon' },
  
  // Achievement Badges (Rare)
  { id: 'popular-100', name: 'Popular Contributor', icon: 'TrendingUp', points: 600, level: 3, rarity: 'rare' },
  { id: 'papers-25', name: 'Resource King', icon: 'Crown', points: 1000, level: 4, rarity: 'rare' },
  { id: 'reviews-50', name: 'Review Master', icon: 'Award', points: 1500, level: 4, rarity: 'rare' },
  
  // Excellence Badges (Epic)
  { id: 'downloads-500', name: 'Impact Maker', icon: 'Zap', points: 2000, level: 5, rarity: 'epic' },
  { id: 'community-leader', name: 'Community Leader', icon: 'Users', points: 3000, level: 6, rarity: 'epic' },
  { id: 'top-10', name: 'Top 10 Contributor', icon: 'Medal', points: 4000, level: 6, rarity: 'epic' },
  
  // Legendary Badges
  { id: 'legend', name: 'Campus Legend', icon: 'Flame', points: 5500, level: 7, rarity: 'legendary' },
  { id: 'top-3', name: 'Top 3 Elite', icon: 'Trophy', points: 8000, level: 8, rarity: 'legendary' },
  
  // Mythic - Core Team
  { id: 'core-team', name: 'Core Team Member', icon: 'Shield', points: 12000, level: 9, rarity: 'mythic' }
]

// Team Roles (unlocked at level 9)
export const TEAM_ROLES: TeamRole[] = [
  {
    id: 'content-curator',
    name: 'Content Curator',
    description: 'Review and approve past papers, manage resource quality',
    requiredLevel: 9,
    requiredPoints: 12000,
    requiredBadges: ['papers-25', 'reviewer'],
    perks: ['Approve/reject papers', 'Featured curator badge', 'Priority support channel'],
    color: 'blue'
  },
  {
    id: 'community-moderator',
    name: 'Community Moderator',
    description: 'Moderate community discussions, maintain positive environment',
    requiredLevel: 9,
    requiredPoints: 12000,
    requiredBadges: ['community-leader', 'helpful-5'],
    perks: ['Moderate posts', 'Ban/warn users', 'Community events access'],
    color: 'purple'
  },
  {
    id: 'tech-support',
    name: 'Tech Support Specialist',
    description: 'Help students with technical issues, LMS troubleshooting',
    requiredLevel: 9,
    requiredPoints: 12000,
    requiredBadges: ['helpful-5', 'reviewer'],
    perks: ['Priority ticket access', 'Tech support badge', 'Direct admin contact'],
    color: 'green'
  },
  {
    id: 'campus-ambassador',
    name: 'Campus Ambassador',
    description: 'Represent the platform, organize campus events, onboard new students',
    requiredLevel: 9,
    requiredPoints: 15000,
    requiredBadges: ['community-leader', 'top-10'],
    perks: ['Ambassador badge', 'Event hosting', 'Official swag', 'Monthly stipend'],
    color: 'yellow'
  }
]

// Utility functions
export function getLevelForPoints(points: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i]
    }
  }
  return LEVELS[0]
}

export function getNextLevel(currentLevel: number): Level | null {
  return LEVELS[currentLevel + 1] || null
}

export function getProgressToNextLevel(points: number): {
  currentLevel: Level
  nextLevel: Level | null
  progress: number
  pointsToNext: number
  pointsInLevel: number
} {
  const currentLevel = getLevelForPoints(points)
  const nextLevel = getNextLevel(currentLevel.level)
  
  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      pointsToNext: 0,
      pointsInLevel: points - currentLevel.minPoints
    }
  }
  
  const pointsInLevel = points - currentLevel.minPoints
  const levelRange = nextLevel.minPoints - currentLevel.minPoints
  const progress = Math.min((pointsInLevel / levelRange) * 100, 100)
  const pointsToNext = nextLevel.minPoints - points
  
  return {
    currentLevel,
    nextLevel,
    progress,
    pointsToNext,
    pointsInLevel
  }
}

export function getEarnedBadges(points: number, level: number): typeof BADGES {
  return BADGES.filter(badge => points >= badge.points && level >= badge.level)
}

export function getAvailableTeamRoles(level: number, points: number, earnedBadges: string[]): TeamRole[] {
  return TEAM_ROLES.filter(role => {
    if (level < role.requiredLevel || points < role.requiredPoints) return false
    return role.requiredBadges.every(badgeId => earnedBadges.includes(badgeId))
  })
}

export function getRarityColor(rarity: string): string {
  const colors = {
    common: 'text-slate-600 bg-slate-100 border-slate-300',
    uncommon: 'text-green-600 bg-green-100 border-green-400',
    rare: 'text-blue-600 bg-blue-100 border-blue-400',
    epic: 'text-purple-600 bg-purple-100 border-purple-400',
    legendary: 'text-yellow-600 bg-yellow-100 border-yellow-400',
    mythic: 'text-red-600 bg-red-100 border-red-400'
  }
  return colors[rarity as keyof typeof colors] || colors.common
}

export function getLevelColor(level: number): string {
  const levelData = LEVELS[level] || LEVELS[0]
  return levelData.color
}

export function getLevelGradient(level: number): string {
  const levelData = LEVELS[level] || LEVELS[0]
  return levelData.gradient
}
