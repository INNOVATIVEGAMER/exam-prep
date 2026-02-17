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
import { PaperAnswerWrapper } from '@/components/paper/PaperAnswerWrapper'
import { StickyUnlockBar } from '@/components/paper/StickyUnlockBar'

interface PaperPageProps {
  params: Promise<{ code: string; paperId: string }>
}

async function fetchPaperData(
  code: string,
  paperId: string
): Promise<{ paper: Paper; subject: Subject } | null> {
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

    // Server-side access gate:
    // If paper is not free, check whether the current user has a paid purchase.
    // Null out answers before the page renders — they never reach the browser
    // for unpaid users regardless of RLS column behaviour.
    if (!paperData.is_free) {
      const { data: { user } } = await supabase.auth.getUser()

      let hasPurchased = false
      if (user) {
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('paper_id', paperId)
          .eq('status', 'paid')
          .maybeSingle()
        hasPurchased = !!purchase
      }

      if (!hasPurchased) {
        paperData.answers = null
      }
    }

    return {
      paper: paperData as Paper,
      subject: subjectData as Subject,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PaperPageProps) {
  const { code, paperId } = await params
  return {
    title: `Paper ${paperId} — ${code.toUpperCase()} — ExamPrep`,
  }
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { code, paperId } = await params
  const result = await fetchPaperData(code, paperId)

  if (!result) notFound()

  const { paper, subject } = result
  const answersLocked = !paper.is_free && paper.answers === null

  // Group questions by their group field, preserving insertion order
  const questionsByGroup = Object.entries(paper.questions).reduce<
    Record<string, Array<[string, (typeof paper.questions)[string]]>>
  >((acc, [key, question]) => {
    const g = question.group
    if (!acc[g]) acc[g] = []
    acc[g].push([key, question])
    return acc
  }, {})

  // Build a map of group name → Group config from the exam pattern
  const groupConfig = subject.exam_pattern.groups.reduce<Record<string, Group>>(
    (acc, g) => {
      acc[g.name] = g
      return acc
    },
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

      {/* Questions grouped by group — wrapped for content protection when unlocked */}
      <PaperAnswerWrapper locked={answersLocked}>
        <div className="space-y-10">
          {Object.entries(questionsByGroup).map(([groupName, groupQuestions]) => {
            const config = groupConfig[groupName]

            // Fallback Group if not in pattern (shouldn't happen with good data)
            const groupDef: Group = config ?? {
              name: groupName,
              label: `Group ${groupName.toUpperCase()}`,
              instructions: '',
              questions_count: groupQuestions.length,
              attempt_count: groupQuestions.length,
              marks_per_question: 0,
              question_type: 'short',
            }

            return (
              <GroupSection key={groupName} group={groupDef}>
                {groupQuestions.map(([questionKey, question]) => {
                  const answer = paper.answers?.[questionKey] ?? null

                  return (
                    <QuestionCard
                      key={questionKey}
                      questionKey={questionKey}
                      question={question}
                      showWatermark={!answersLocked}
                      answerSlot={
                        <AnswerCard
                          answer={answer}
                          locked={answersLocked}
                          price={paper.price}
                          paperId={paper.id}
                          paperTitle={paper.title}
                        />
                      }
                    />
                  )
                })}
              </GroupSection>
            )
          })}
        </div>
      </PaperAnswerWrapper>

      {/* Sticky bottom unlock bar — mobile only, shown when paper is locked */}
      <StickyUnlockBar
        paperId={paper.id}
        price={paper.price}
        paperTitle={paper.title}
        locked={answersLocked}
      />
    </div>
  )
}
