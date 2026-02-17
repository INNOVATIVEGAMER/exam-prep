import { Paper, Subject } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, Award } from 'lucide-react'

const PAPER_TYPE_LABELS: Record<Paper['type'], string> = {
  end_sem: 'End Semester',
  mid_sem_1: 'Mid Semester 1',
  mid_sem_2: 'Mid Semester 2',
  practice: 'Practice',
}

const PAPER_TYPE_VARIANTS: Record<
  Paper['type'],
  'default' | 'secondary' | 'outline'
> = {
  end_sem: 'default',
  mid_sem_1: 'secondary',
  mid_sem_2: 'secondary',
  practice: 'outline',
}

interface PaperHeaderProps {
  paper: Paper
  subject: Subject
}

export function PaperHeader({ paper, subject }: PaperHeaderProps) {
  const { exam_pattern } = subject
  const durationHours = Math.floor(exam_pattern.duration_minutes / 60)
  const durationMins = exam_pattern.duration_minutes % 60
  const durationLabel =
    durationHours > 0
      ? `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : ''}`.trim()
      : `${durationMins}m`

  return (
    <div className="space-y-4">
      {/* Title row */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-tight">{paper.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {subject.name} · {subject.code} · {subject.regulation}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={PAPER_TYPE_VARIANTS[paper.type]}>
            {PAPER_TYPE_LABELS[paper.type]}
          </Badge>
          <Badge variant="outline">{paper.year}</Badge>
          {paper.is_free && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              FREE
            </Badge>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Award className="size-4 text-primary" />
          <span>
            <strong className="text-foreground">{exam_pattern.total_marks}</strong> marks
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="size-4 text-primary" />
          <span>
            <strong className="text-foreground">{durationLabel}</strong> duration
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>
            Department: <strong className="text-foreground">{subject.department}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>
            Semester: <strong className="text-foreground">{subject.semester}</strong>
          </span>
        </div>
      </div>

      {/* Exam pattern groups summary */}
      {exam_pattern.groups.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Exam Pattern
            </p>
            <div className="flex flex-wrap gap-2">
              {exam_pattern.groups.map((group) => (
                <div
                  key={group.name}
                  className="rounded-lg border bg-muted/30 px-3 py-2 text-xs space-y-0.5"
                >
                  <p className="font-semibold">
                    Group {group.name.toUpperCase()}
                  </p>
                  <p className="text-muted-foreground">{group.instructions}</p>
                  <p className="text-muted-foreground">
                    {group.attempt_count} × {group.marks_per_question} marks ={' '}
                    {group.attempt_count * group.marks_per_question} marks
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
