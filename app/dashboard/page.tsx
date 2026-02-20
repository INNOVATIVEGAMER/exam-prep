import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { DashboardGuard } from './DashboardGuard'
import { Subject } from '@/types'

async function fetchDashboardData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .order('semester', { ascending: true })

  return {
    user,
    subjects: (subjects as Subject[]) ?? [],
  }
}

export const metadata = {
  title: 'Dashboard — NehaNotes',
}

export default async function DashboardPage() {
  const { user, subjects } = await fetchDashboardData()

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

      </div>
    </DashboardGuard>
  )
}
