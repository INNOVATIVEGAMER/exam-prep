import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Lock, TrendingUp } from "lucide-react";

const PREVIEW_SUBJECTS = [
  {
    code: "IT301",
    name: "Computer Organization & Architecture",
    short_name: "COA",
    regulation: "MAKAUT 2019",
    semester: 3,
    department: "IT",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Browse Papers",
    description:
      "Find past exam papers for your subject and semester — organised by year and exam type.",
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

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="size-3 mr-1" />
            JISCE Engineering Exam Papers
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Ace Your Exams
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access past exam papers with fully worked solutions. Mapped to
            course outcomes, with step-by-step answers and inline math rendering
            — built for MAKAUT students.
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

      {/* Subject preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Popular Subjects</h2>
            <Link
              href="/subjects"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all subjects →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PREVIEW_SUBJECTS.map((subject) => (
              <Link
                key={subject.code}
                href={`/subjects/${subject.code}`}
                className="group"
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {subject.code}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Sem {subject.semester}
                      </Badge>
                    </div>
                    <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors mt-2">
                      {subject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                      <span>{subject.regulation}</span>
                      <span>·</span>
                      <span>{subject.department}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
