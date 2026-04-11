import Layout from "@/components/Layout";
import AICoachPanel from "@/components/AICoachPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, PenTool, Target } from "lucide-react";

const lessonCards = [
  {
    title: "Readability",
    description:
      "A tattoo should read clearly at a glance. If the design is confusing from a distance, it usually gets weaker on skin.",
    icon: BookOpen,
  },
  {
    title: "Shape Language",
    description:
      "Big shapes carry the design first. Small details only work when the core forms are already strong and balanced.",
    icon: Target,
  },
  {
    title: "Flow",
    description:
      "The eye should move naturally through the design. Good flow helps tattoos feel intentional instead of stiff or crowded.",
    icon: PenTool,
  },
];

export default function Learn() {
  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary">
                Learn
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Build tattoo fundamentals before execution
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                Learn is where you train your eye. Focus on readability, shape,
                flow, and strong visual decisions before trying to force
                advanced execution too early.
              </p>
            </div>
          </div>
        </section>

        <AICoachPanel title="Learn Coach" pageContext="learn" />

        <div className="grid gap-6 lg:grid-cols-3">
          {lessonCards.map((lesson) => {
            const Icon = lesson.icon;

            return (
              <Card key={lesson.title} className="rounded-3xl border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    {lesson.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {lesson.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="rounded-3xl border shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-4 w-4 text-primary" />
              Apprenticeship prep mindset
            </div>

            <div className="space-y-2 text-sm leading-6 text-muted-foreground">
              <p>• InkPlan does not replace a real apprenticeship.</p>
              <p>
                • It helps you build stronger design awareness, better practice
                habits, and better portfolio readiness first.
              </p>
              <p>
                • The goal is to become more teachable, more disciplined, and
                more prepared when a real opportunity comes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
