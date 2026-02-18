import { Paper, Subject, Group } from '@/types'
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

interface DerivedPaperInfo {
  totalMarks: number
  groups: Group[]
}

/** For practice papers, derive structure from the questions JSON directly. */
function derivePracticeInfo(paper: Paper): DerivedPaperInfo {
  const groupMap: Record<string, { marks: number; count: number; hasMcq: boolean }> = {}

  for (const question of Object.values(paper.questions)) {
    const g = question.group
    if (!groupMap[g]) groupMap[g] = { marks: 0, count: 0, hasMcq: false }
    groupMap[g].marks += question.marks
    groupMap[g].count += 1
    if (question.options && question.options.length > 0) groupMap[g].hasMcq = true
  }

  const totalMarks = Object.values(groupMap).reduce((sum, g) => sum + g.marks, 0)

  const groups: Group[] = Object.entries(groupMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, { marks, count, hasMcq }]) => {
      const marksPerQuestion = count > 0 ? marks / count : 0
      const questionType: Group['question_type'] = hasMcq ? 'mcq' : marksPerQuestion >= 10 ? 'long' : 'short'
      return {
        name,
        label: `Group ${name.toUpperCase()}`,
        instructions: `Attempt all ${count} questions`,
        questions_count: count,
        attempt_count: count,
        marks_per_question: marksPerQuestion,
        question_type: questionType,
      }
    })

  return { totalMarks, groups }
}

interface PaperHeaderProps {
  paper: Paper
  subject: Subject
}

export function PaperHeader({ paper, subject }: PaperHeaderProps) {
  const isPractice = paper.type === 'practice'
  const { exam_pattern } = subject

  const derived = isPractice ? derivePracticeInfo(paper) : null

  const totalMarks = derived ? derived.totalMarks : exam_pattern.total_marks
  const groups = derived ? derived.groups : exam_pattern.groups

  const durationHours = Math.floor(exam_pattern.duration_minutes / 60)
  const durationMins = exam_pattern.duration_minutes % 60
  const durationLabel =
    durationHours > 0
      ? `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : ''}`.trim()
      : `${durationMins}m`

  return (
    <div className="space-y-4">
      {/* Title row */}
      <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-start sm:gap-3">
        {/* Badges — shown above title on mobile, beside title on sm+ */}
        <div className="flex items-center gap-2 sm:order-last sm:shrink-0">
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
        <div className="sm:flex-1 sm:min-w-0">
          <h1 className="text-2xl font-bold leading-tight">{paper.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {subject.name} · {subject.code} · {subject.regulation}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Award className="size-4 text-primary" />
          <span>
            <strong className="text-foreground">{totalMarks}</strong> marks
          </span>
        </div>
        {!isPractice && (
          <div className="flex items-center gap-1.5">
            <Clock className="size-4 text-primary" />
            <span>
              <strong className="text-foreground">{durationLabel}</strong> duration
            </span>
          </div>
        )}
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

      {/* Groups summary */}
      {groups.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              {isPractice ? 'Paper Structure' : 'Exam Pattern'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {groups.map((group) => (
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
