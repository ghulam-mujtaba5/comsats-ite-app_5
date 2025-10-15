import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Users } from "lucide-react"
import Link from "next/link"
import { GlassCard } from "@/components/admin/glass-card"

interface MentorCardProps {
  id: number
  name: string
  department: string
  program: string
  rating: number
  reviewCount: number
  specialization: string[]
  availability: string
  bio: string
}

export function MentorCard({
  id,
  name,
  department,
  program,
  rating,
  reviewCount,
  specialization,
  availability,
  bio
}: MentorCardProps) {
  return (
    <GlassCard hover={true}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{program}</p>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span>{rating} ({reviewCount} reviews)</span>
        </div>
        
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {specialization.slice(0, 2).map((spec, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary"
              >
                {spec}
              </span>
            ))}
            {specialization.length > 2 && (
              <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                +{specialization.length - 2}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {bio}
        </p>
        
        <Button size="sm" className="w-full" asChild>
          <Link href={`/admissions/mentor/${id}`}>Connect</Link>
        </Button>
      </CardContent>
    </GlassCard>
  )
}