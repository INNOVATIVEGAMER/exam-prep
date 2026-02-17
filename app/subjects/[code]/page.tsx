import { createClient } from '@/lib/supabase/server'
import { Subject, Paper } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Clock, Award, BookOpen, FileText } from 'lucide-react'

interface SubjectPageProps {
  params: Promise<{ code: string }>
}

const PAPER_TYPE_LABELS: Record<Paper['type'], string> = {
  end_sem: 'End Semester',
  mid_sem_1: 'Mid Semester 1',
  mid_sem_2: 'Mid Semester 2',
  practice: 'Practice',
}

async function fetchSubjectWithPapers(
  code: string
): Promise<{ subject: Subject; papers: Paper[] } | null> {
  try {
    const supabase = await createClient()

    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (subjectError || !subjectData) return null

    const { data: papersData } = await supabase
      .from('papers')
      .select(
        'id, subject_id, title, type, year, is_free, price, metadata, created_at'
      )
      .eq('subject_id', subjectData.id)
      .order('year', { ascending: false })

    return {
      subject: subjectData as Subject,
      papers: (papersData as Paper[]) ?? [],
    }
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: SubjectPageProps) {
  const { code } = await params
  return {
    title: `${code.toUpperCase()} — ExamPrep`,
  }
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { code } = await params
  const result = await fetchSubjectWithPapers(code)

  if (!result) notFound()

  const { subject, papers } = result
  const { exam_pattern } = subject
  const durationLabel = formatDuration(exam_pattern.duration_minutes)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link */}
      <Link
        href="/subjects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Subjects
      </Link>

      {/* Subject header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="font-mono">
                {subject.code}
              </Badge>
              <Badge variant="outline">{subject.regulation}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{subject.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {subject.department} · Semester {subject.semester} · {subject.college}
            </p>
          </div>
        </div>

        {/* Exam stats */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Award className="size-4 text-primary" />
            <strong className="text-foreground">{exam_pattern.total_marks}</strong> total marks
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4 text-primary" />
            <strong className="text-foreground">{durationLabel}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-4 text-primary" />
            <strong className="text-foreground">{exam_pattern.groups.length}</strong> groups
          </span>
        </div>

        {/* Exam pattern breakdown */}
        {exam_pattern.groups.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Exam Pattern
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {exam_pattern.groups.map((group) => (
                  <div
                    key={group.name}
                    className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1"
                  >
                    <p className="font-semibold">
                      Group {group.name.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {group.instructions}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      Type: {group.question_type.replace('_', ' ')}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {group.attempt_count} × {group.marks_per_question}m ={' '}
                      {group.attempt_count * group.marks_per_question} marks
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Separator />

      {/* Papers section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          Papers
          {papers.length > 0 && (
            <Badge variant="secondary">{papers.length}</Badge>
          )}
        </h2>

        {papers.length === 0 ? (
          <div className="rounded-xl border border-dashed py-14 text-center space-y-2">
            <p className="font-medium">No papers available yet</p>
            <p className="text-sm text-muted-foreground">
              Papers for {subject.name} will be added soon.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {papers.map((paper) => (
              <PaperRow
                key={paper.id}
                paper={paper}
                subjectCode={subject.code}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PaperRow({
  paper,
  subjectCode,
}: {
  paper: Paper
  subjectCode: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {PAPER_TYPE_LABELS[paper.type]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {paper.year}
              </Badge>
              {paper.is_free && (
                <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                  FREE
                </Badge>
              )}
            </div>
            <CardTitle className="text-base leading-snug">{paper.title}</CardTitle>
          </div>
          <div className="shrink-0 text-right space-y-1">
            <p className="text-lg font-bold">
              {paper.is_free ? 'FREE' : `₹${paper.price}`}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs">
            {paper.metadata?.difficulty && (
              <span className="capitalize">
                Difficulty: {paper.metadata.difficulty}
              </span>
            )}
          </CardDescription>
          <Button asChild size="sm">
            <Link href={`/subjects/${subjectCode}/${paper.id}`}>
              View Paper
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}
