import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ArrowRight, GraduationCap } from 'lucide-react'
import { DashboardGuard } from './DashboardGuard'
import { Subject } from '@/types'

interface PurchasedPaperRow {
  id: string
  amount: number
  created_at: string
  papers: {
    id: string
    title: string
    type: string
    year: string
    subjects: {
      code: string
      name: string
    }
  }
}

async function fetchDashboardData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: subjects }, { data: purchases }] = await Promise.all([
    supabase
      .from('subjects')
      .select('*')
      .order('semester', { ascending: true }),
    supabase
      .from('purchases')
      .select(`
        id,
        amount,
        created_at,
        papers (
          id,
          title,
          type,
          year,
          subjects (
            code,
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .order('created_at', { ascending: false }),
  ])

  return {
    user,
    subjects: (subjects as Subject[]) ?? [],
    purchases: (purchases as unknown as PurchasedPaperRow[]) ?? [],
  }
}

export const metadata = {
  title: 'Dashboard — ExamPrep',
}

const TYPE_LABEL: Record<string, string> = {
  end_sem: 'End Semester',
  mid_sem_1: 'Mid Semester 1',
  mid_sem_2: 'Mid Semester 2',
  practice: 'Practice',
}

export default async function DashboardPage() {
  const { user, subjects, purchases } = await fetchDashboardData()

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split('@')[0] ??
    'there'

  return (
    <DashboardGuard>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {displayName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
        </div>

        {/* Subjects — primary navigation */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Subjects</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/subjects">
                View all <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {subjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subjects available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/subjects/${subject.code}`}
                  className="group rounded-xl border bg-card p-4 hover:border-primary/50 hover:bg-accent/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {subject.code}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Sem {subject.semester}
                      </Badge>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-sm leading-snug">{subject.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {subject.department} · {subject.regulation}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Purchased papers — secondary */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Your Purchases</h2>

          {purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center gap-3">
              <div className="flex items-center justify-center size-12 rounded-full bg-muted text-muted-foreground">
                <GraduationCap className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-sm">No purchases yet</p>
                <p className="text-xs text-muted-foreground">
                  Open a subject above and unlock answers to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <PurchasedPaperCard key={purchase.id} purchase={purchase} />
              ))}
            </div>
          )}
        </section>

      </div>
    </DashboardGuard>
  )
}

function PurchasedPaperCard({ purchase }: { purchase: PurchasedPaperRow }) {
  const paper = purchase.papers
  const subject = paper?.subjects
  if (!paper || !subject) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                {subject.code}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {TYPE_LABEL[paper.type] ?? paper.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {paper.year}
              </Badge>
            </div>
            <CardTitle className="text-sm leading-snug">{paper.title}</CardTitle>
            <p className="text-xs text-muted-foreground">{subject.name}</p>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link href={`/subjects/${subject.code}/${paper.id}`}>
              View <BookOpen className="size-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {new Date(purchase.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
          {' · '}₹{purchase.amount / 100}
        </p>
      </CardContent>
    </Card>
  )
}
