'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Search, Users, Hash, Calendar, Plus } from 'lucide-react'
import { useState } from 'react'

export default function StudyGroupsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Sample study groups data
  const groupsData = [
    {
      id: 1,
      name: 'Data Structures & Algorithms',
      description: 'Study group for BSCS students focusing on DSA concepts and problem-solving.',
      subject: 'CS201',
      program: 'BSCS',
      member_count: 15,
      next_meeting: '2025-06-20',
      status: 'active'
    },
    {
      id: 2,
      name: 'Calculus Study Group',
      description: 'Group for students preparing for Calculus exams with weekly problem sessions.',
      subject: 'MTH101',
      program: 'All Programs',
      member_count: 22,
      next_meeting: '2025-06-18',
      status: 'active'
    },
    {
      id: 3,
      name: 'OOP Concepts Discussion',
      description: 'Advanced Object-Oriented Programming concepts discussion for senior students.',
      subject: 'CS301',
      program: 'BSCS',
      member_count: 8,
      next_meeting: '2025-06-22',
      status: 'active'
    },
    {
      id: 4,
      name: 'Digital Logic Design',
      description: 'Study group for BSEE students focusing on digital circuit design and analysis.',
      subject: 'EE201',
      program: 'BSEE',
      member_count: 12,
      next_meeting: '2025-06-19',
      status: 'active'
    },
    {
      id: 5,
      name: 'Software Engineering Principles',
      description: 'Group discussion on software development lifecycle and best practices.',
      subject: 'CS401',
      program: 'BSSE',
      member_count: 10,
      next_meeting: '2025-06-21',
      status: 'active'
    },
  ]

  const filteredData = groupsData.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.program.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Study Groups</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          Join or create study groups to collaborate with fellow students and enhance your learning experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study Groups Information</CardTitle>
          <CardDescription>
            Collaborate with peers and enhance your learning through group study sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Benefits of Study Groups</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                Enhanced understanding, shared resources, and improved motivation through peer learning
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">How to Join</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                Browse available groups, request to join, or create your own study group
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Group Guidelines</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                Respectful communication, active participation, and adherence to academic integrity
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by group name, subject, or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Study Groups</CardTitle>
          <CardDescription>
            Active study groups for various subjects and programs (Updated: June 15, 2025)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Next Meeting</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-muted-foreground">{group.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{group.subject}</Badge>
                    </TableCell>
                    <TableCell>{group.program}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{group.member_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(group.next_meeting).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(group.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm">
                        Join Group
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No study groups found for "{searchTerm}"
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tips for Effective Study Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Set clear goals and agendas for each meeting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Rotate leadership roles to encourage participation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Share resources and study materials with group members</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Maintain a regular meeting schedule for consistency</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Creating a Study Group</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Identify 3-5 committed members with similar goals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Choose a regular meeting time and location</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Establish ground rules for participation and respect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Use collaborative tools for sharing resources and notes</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}