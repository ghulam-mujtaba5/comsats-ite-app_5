"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Calendar, BookOpen, AlertCircle, PartyPopper, FileText } from "lucide-react"
import type { TimetableEvent } from "@/lib/resources-data"

interface EventListProps {
  events: TimetableEvent[]
  title: string
}

const eventIcons = {
  Class: BookOpen,
  Exam: AlertCircle,
  Assignment: FileText,
  Holiday: PartyPopper,
  Event: Calendar,
  Deadline: Clock,
}

export function EventList({ events, title }: EventListProps) {
  const sortedEvents = events.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.startTime.localeCompare(b.startTime)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No events found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event) => {
              const EventIcon = eventIcons[event.type]
              return (
                <div key={event.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${event.color}20` }}>
                    <EventIcon className="h-5 w-5" style={{ color: event.color }} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        {event.course && (
                          <p className="text-sm text-muted-foreground">
                            {event.course}
                            {event.instructor && ` • ${event.instructor}`}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">{event.type}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.startTime}
                        {event.endTime !== event.startTime && ` - ${event.endTime}`}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                      {event.instructor && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {event.instructor}
                        </div>
                      )}
                    </div>

                    {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}

                    {event.department && (
                      <Badge variant="outline" className="text-xs">
                        {event.department}
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
