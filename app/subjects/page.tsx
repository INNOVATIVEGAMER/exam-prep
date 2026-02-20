import { createClient } from '@/lib/supabase/server'
import { Subject } from '@/types'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Users } from 'lucide-react'

export const metadata = {
  title: 'Subjects — NehaNotes',
  description: 'Browse question papers and solutions by subject',
}

async function fetchSubjects(): Promise<Subject[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('semester', { ascending: true })
      .order('code', { ascending: true })

    if (error) {
      console.error('[subjects] fetch error:', error.message)
      return []
    }

    return (data as Subject[]) ?? []
  } catch {
    return []
  }
}

export default async function SubjectsPage() {
  const subjects = await fetchSubjects()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <p className="text-muted-foreground">
          Browse question papers and solutions organised by subject and semester.
        </p>
      </div>

      {subjects.length === 0 ? (
        <EmptyState />
      ) : (
        <SubjectGrid subjects={subjects} />
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center gap-4">
      <div className="flex items-center justify-center size-14 rounded-full bg-muted text-muted-foreground">
        <BookOpen className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-lg">No subjects available yet</p>
        <p className="text-sm text-muted-foreground">
          Check back soon — papers are being added regularly.
        </p>
      </div>
    </div>
  )
}

function SubjectGrid({ subjects }: { subjects: Subject[] }) {
  // Group by semester for visual hierarchy
  const bySemester = subjects.reduce<Record<number, Subject[]>>((acc, s) => {
    if (!acc[s.semester]) acc[s.semester] = []
    acc[s.semester].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-10">
      {Object.entries(bySemester).map(([sem, semSubjects]) => (
        <section key={sem}>
          <h2 className="text-lg font-semibold mb-4">
            Semester {sem}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {semSubjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function SubjectCard({ subject }: { subject: Subject }) {
  const totalMarks = subject.exam_pattern.total_marks
  const durationMins = subject.exam_pattern.duration_minutes
  const durationLabel =
    durationMins >= 60
      ? `${Math.floor(durationMins / 60)}h ${durationMins % 60 > 0 ? `${durationMins % 60}m` : ''}`.trim()
      : `${durationMins}m`

  return (
    <Link href={`/subjects/${subject.code}`} className="group">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {subject.code}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {subject.regulation}
            </Badge>
          </div>
          <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors mt-2">
            {subject.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {subject.department}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3" />
              {totalMarks} marks
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {durationLabel}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
