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
import { Search, Download, Filter, BookOpen, FileText, Users } from 'lucide-react'
import { useState } from 'react'

export default function TestPreparationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Sample test preparation data
  const testData = [
    {
      id: 1,
      title: 'NTS Practice Test - Mathematics',
      description: 'Comprehensive practice test covering algebra, geometry, and calculus concepts for NTS.',
      category: 'NTS',
      difficulty: 'Intermediate',
      subject: 'Mathematics',
      file_url: 'https://example.com/nts-math.pdf',
      downloads: 1240
    },
    {
      id: 2,
      title: 'GAT General English Practice',
      description: 'Practice questions for GAT General English section including vocabulary and comprehension.',
      category: 'GAT',
      difficulty: 'Beginner',
      subject: 'English',
      file_url: 'https://example.com/gat-english.pdf',
      downloads: 980
    },
    {
      id: 3,
      title: 'Subject GRE - Computer Science',
      description: 'Advanced practice questions for GRE Computer Science subject test.',
      category: 'GRE',
      difficulty: 'Advanced',
      subject: 'Computer Science',
      file_url: 'https://example.com/gre-cs.pdf',
      downloads: 650
    },
    {
      id: 4,
      title: 'NTS Analytical Reasoning',
      description: 'Practice questions focusing on analytical reasoning and logical deduction.',
      category: 'NTS',
      difficulty: 'Intermediate',
      subject: 'Analytical Reasoning',
      file_url: 'https://example.com/nts-analytical.pdf',
      downloads: 1120
    },
    {
      id: 5,
      title: 'GAT Subject - Physics',
      description: 'Comprehensive practice material for GAT Physics subject test.',
      category: 'GAT',
      difficulty: 'Advanced',
      subject: 'Physics',
      file_url: 'https://example.com/gat-physics.pdf',
      downloads: 780
    },
  ]

  const filteredData = testData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'NTS':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">NTS</Badge>
      case 'GAT':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">GAT</Badge>
      case 'GRE':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">GRE</Badge>
      default:
        return <Badge variant="secondary">{category}</Badge>
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Beginner</Badge>
      case 'Intermediate':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Intermediate</Badge>
      case 'Advanced':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Advanced</Badge>
      default:
        return <Badge variant="secondary">{difficulty}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Test Preparation Resources</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          Access practice tests, study materials, and preparation guides for various entrance exams
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Preparation Information</CardTitle>
          <CardDescription>
            Resources to help you prepare for entrance exams and standardized tests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Popular Exams</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                NTS, GAT, GRE, SAT, and subject-specific tests
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Study Tips</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                Effective preparation strategies and time management
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Resources</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                Practice tests, study guides, and video tutorials
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, subject, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Resources</CardTitle>
          <CardDescription>
            Practice tests and study materials for various exams (Updated: June 15, 2025)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Downloads</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(item.category)}
                    </TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>
                      {getDifficultyBadge(item.difficulty)}
                    </TableCell>
                    <TableCell className="text-right">{item.downloads}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" asChild>
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No results found for "{searchTerm}"
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Study Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Create a study schedule and stick to it consistently</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Practice with timed tests to improve speed and accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Focus on weak areas identified through practice tests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Take regular breaks to avoid burnout and maintain focus</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Official test preparation guides from exam authorities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Online practice platforms with adaptive testing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Study groups and peer learning sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Mentorship programs with senior students</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}