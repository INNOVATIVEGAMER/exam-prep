import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Lock, TrendingUp, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Subject } from "@/types";

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Browse Papers",
    description:
      "Find question papers for your subject and semester — sample papers, past year papers, organised by exam type.",
  },
  {
    icon: Lock,
    step: "02",
    title: "Unlock Answers",
    description:
      "Purchase a paper once for ₹99 and get lifetime access to detailed solutions with step-by-step working.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Study Smart",
    description:
      "Understand concepts through worked examples, key points, and course-outcome-mapped explanations.",
  },
];

async function fetchFeaturedSubjects(): Promise<Subject[]> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .gte("featured_until", today)
      .order("featured_until", { ascending: true });

    if (error) return [];
    return (data as Subject[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredSubjects = await fetchFeaturedSubjects();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="size-3 mr-1" />
            MAKAUT Engineering Question Papers
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Ace Your Exams
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access question papers with fully worked solutions — including
            sample papers and past year papers. Mapped to course outcomes,
            with step-by-step answers and inline math rendering, built for
            MAKAUT students.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/subjects">Browse Subjects</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New papers promo banner */}
      {featuredSubjects.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-background">
                New
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                Question papers just added
              </span>
            </div>

            <div className={`grid gap-4 ${featuredSubjects.length === 1 ? "" : "sm:grid-cols-2"}`}>
              {featuredSubjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/subjects/${subject.code}`}
                  className="group relative overflow-hidden rounded-2xl bg-foreground p-6 sm:p-8 transition-transform hover:-translate-y-0.5"
                >
                  {/* Decorative gradient blob */}
                  <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/5 blur-2xl" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <p className="font-mono text-xs font-medium text-white/40 uppercase tracking-widest">
                        {subject.code} · {subject.department} · Sem {subject.semester}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-white/50">
                        {subject.college} · {subject.regulation}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center size-10 rounded-full bg-white/10 text-white group-hover:bg-white/20 transition-colors mt-1">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>

                  <div className="relative mt-5 pt-5 border-t border-white/10 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-white/60">
                      Sample papers
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-white/60">
                      Worked solutions
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-white/60">
                      ₹99
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, description }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary">
                  <Icon className="size-6" />
                  <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full size-5 flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
