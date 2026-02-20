import { createClient } from '@/lib/supabase/server'
import { Paper, Subject, Group } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { PaperHeader } from '@/components/paper/PaperHeader'
import { GroupSection } from '@/components/paper/GroupSection'
import { QuestionCard } from '@/components/paper/QuestionCard'
import { AnswerCard } from '@/components/paper/AnswerCard'
import { StickyUnlockBar } from '@/components/paper/StickyUnlockBar'
import { LockedQuestionsCard } from '@/components/paper/LockedQuestionsCard'

interface PaperPageProps {
  params: Promise<{ code: string; paperId: string }>
}

async function fetchPaperData(
  code: string,
  paperId: string
): Promise<{ paper: Paper; subject: Subject; isLoggedIn: boolean } | null> {
  try {
    const supabase = await createClient()

    // Fetch subject by code
    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (subjectError || !subjectData) return null

    // Fetch paper with all fields
    const { data: paperData, error: paperError } = await supabase
      .from('papers')
      .select('*')
      .eq('id', paperId)
      .eq('subject_id', subjectData.id)
      .single()

    if (paperError || !paperData) return null

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Logged-out users only see questions/answers marked is_preview === true
      if (paperData.answers) {
        const gatedAnswers: Record<string, unknown> = {}
        for (const [key, answer] of Object.entries(paperData.answers)) {
          const question = paperData.questions?.[key]
          if (question?.is_preview === true) {
            gatedAnswers[key] = answer
          }
        }
        paperData.answers = Object.keys(gatedAnswers).length > 0 ? gatedAnswers : null
      }

      // Strip question content for non-preview questions
      if (paperData.questions) {
        for (const key of Object.keys(paperData.questions)) {
          const q = paperData.questions[key]
          if (!q.is_preview) {
            paperData.questions[key] = {
              group: q.group,
              number: q.number,
              marks: q.marks,
              co: q.co,
              bl: q.bl,
              // text, options, sub_parts intentionally omitted
            } as typeof q
          }
        }
      }
    }
    // Logged-in user: all questions and answers pass through unmodified

    return {
      paper: paperData as Paper,
      subject: subjectData as Subject,
      isLoggedIn: !!user,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PaperPageProps) {
  const { code, paperId } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('papers')
    .select('title')
    .eq('id', paperId)
    .single()
  const title = data?.title ?? `Paper ${code.toUpperCase()}`
  return {
    title: `${title} — ${code.toUpperCase()} — NehaNotes`,
  }
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { code, paperId } = await params
  const result = await fetchPaperData(code, paperId)

  if (!result) notFound()

  const { paper, subject, isLoggedIn } = result

  // Group questions by their group field, preserving insertion order
  const questionsByGroup = Object.entries(paper.questions).reduce<
    Record<string, Array<[string, (typeof paper.questions)[string]]>>
  >((acc, [key, question]) => {
    const g = question.group
    if (!acc[g]) acc[g] = []
    acc[g].push([key, question])
    return acc
  }, {})

  // Build a map of group name → Group config.
  // For practice papers, derive from the questions themselves so counts/marks
  // reflect the actual paper rather than the subject's exam pattern.
  const groupConfig: Record<string, Group> = paper.type === 'practice'
    ? Object.entries(
        Object.values(paper.questions).reduce<
          Record<string, { marks: number; count: number; hasMcq: boolean }>
        >((acc, q) => {
          if (!acc[q.group]) acc[q.group] = { marks: 0, count: 0, hasMcq: false }
          acc[q.group].marks += q.marks
          acc[q.group].count += 1
          if (q.options && q.options.length > 0) acc[q.group].hasMcq = true
          return acc
        }, {})
      ).reduce<Record<string, Group>>((acc, [name, { marks, count, hasMcq }]) => {
        const marksPerQuestion = count > 0 ? marks / count : 0
        acc[name] = {
          name,
          label: `Group ${name.toUpperCase()}`,
          instructions: `Attempt all ${count} questions`,
          questions_count: count,
          attempt_count: count,
          marks_per_question: marksPerQuestion,
          question_type: hasMcq ? 'mcq' : marksPerQuestion >= 10 ? 'long' : 'short',
        }
        return acc
      }, {})
    : subject.exam_pattern.groups.reduce<Record<string, Group>>(
        (acc, g) => { acc[g.name] = g; return acc },
        {}
      )

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24 md:pb-10">
      {/* Back link */}
      <Link
        href={`/subjects/${subject.code}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to {subject.short_name}
      </Link>

      {/* Paper header */}
      <PaperHeader paper={paper} subject={subject} />

      <Separator />

      {/* Questions grouped by group */}
      <div className="space-y-10">
        {Object.entries(questionsByGroup).map(([groupName, groupQuestions]) => {
          const config = groupConfig[groupName]

          const groupDef: Group = config ?? {
            name: groupName,
            label: `Group ${groupName.toUpperCase()}`,
            instructions: '',
            questions_count: groupQuestions.length,
            attempt_count: groupQuestions.length,
            marks_per_question: 0,
            question_type: 'short',
          }

          // Logged-in: show all questions. Logged-out: only show preview questions.
          const visibleQuestions = isLoggedIn
            ? groupQuestions
            : groupQuestions.filter(([, q]) => q.is_preview)
          const lockedQuestions = isLoggedIn
            ? []
            : groupQuestions.filter(([, q]) => !q.is_preview)
          const lockedNumbers = lockedQuestions.map(([, q]) => q.number)

          return (
            <GroupSection key={groupName} group={groupDef}>
              {/* Visible questions */}
              {visibleQuestions.map(([questionKey, question]) => {
                const answer = paper.answers?.[questionKey] ?? null
                // Logged-in users always see answers; logged-out only see preview answers
                const answerLocked = !isLoggedIn && !question.is_preview

                return (
                  <QuestionCard
                    key={questionKey}
                    question={question}
                    showWatermark={isLoggedIn}
                    answerSlot={
                      <AnswerCard
                        answer={answer}
                        locked={answerLocked}
                      />
                    }
                  />
                )
              })}

              {/* Locked questions — single collapsed card for the whole group */}
              {lockedNumbers.length > 0 && (
                <LockedQuestionsCard questionNumbers={lockedNumbers} />
              )}
            </GroupSection>
          )
        })}
      </div>

      {/* Sticky bottom bar — mobile only, shown when paper is not fully unlocked */}
      <StickyUnlockBar locked={!isLoggedIn} />
    </div>
  )
}
