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
import { Search, Download, Filter } from 'lucide-react'
import { useState } from 'react'

export default function MeritList2025Page() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Sample merit list data
  const meritListData = [
    { rank: 1, name: 'Ahmed Raza', program: 'BSCS', score: 95.5, campus: 'Lahore' },
    { rank: 2, name: 'Fatima Khan', program: 'BSEE', score: 94.2, campus: 'Islamabad' },
    { rank: 3, name: 'Usman Ali', program: 'BSSE', score: 93.8, campus: 'Lahore' },
    { rank: 4, name: 'Ayesha Malik', program: 'BSCS', score: 92.9, campus: 'Lahore' },
    { rank: 5, name: 'Bilal Shah', program: 'BBA', score: 91.7, campus: 'Islamabad' },
    { rank: 6, name: 'Sana Javed', program: 'BSMT', score: 90.5, campus: 'Abbottabad' },
    { rank: 7, name: 'Omar Farooq', program: 'BSEE', score: 89.8, campus: 'Lahore' },
    { rank: 8, name: 'Hina Aslam', program: 'BSCS', score: 89.2, campus: 'Lahore' },
    { rank: 9, name: 'Tariq Mahmood', program: 'BSSE', score: 88.7, campus: 'Islamabad' },
    { rank: 10, name: 'Zainab Riaz', program: 'BBA', score: 88.1, campus: 'Lahore' },
  ]

  const filteredData = meritListData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.campus.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Merit List 2025</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Merit positions for admission to undergraduate programs for the academic year 2025
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Merit List Information</CardTitle>
          <CardDescription>
            Details about the merit calculation and selection process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Merit Formula</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Merit = (Matric: 10%) + (Intermediate: 40%) + (Entry Test: 50%)
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Last Date</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Merit lists will be finalized by July 15, 2025
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Contact</h3>
              <p className="text-sm text-muted-foreground mt-2">
                admissions@comsats.edu.pk
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, program, or campus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Merit List 2025</CardTitle>
          <CardDescription>
            Merit positions for all programs (Updated: June 15, 2025)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Campus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.rank}>
                    <TableCell className="font-medium">{item.rank}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.program}</TableCell>
                    <TableCell className="text-right">{item.score}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.campus}</Badge>
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
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Merit lists are provisional and subject to verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Final selection will be based on document verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Students with equal scores will be resolved by tie-breaker rules</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Merit lists may be updated based on appeals or corrections</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Check your email for admission offer letter</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Complete fee payment within the deadline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Submit required documents for verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Attend orientation session as per schedule</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}