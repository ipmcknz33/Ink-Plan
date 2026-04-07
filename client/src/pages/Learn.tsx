import Layout from "@/components/Layout";
import AITattooCoachWindow from "@/components/ai/AITattooCoachWindow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Layers3,
  ArrowRight,
  Clock3,
  Brush,
  Sparkles,
} from "lucide-react";

const learningSections = [
  {
    title: "Fundamentals",
    description:
      "Core tattoo knowledge, setup habits, terminology, machine basics, and foundational learning.",
    icon: BookOpen,
    status: "Available now",
  },
  {
    title: "Technique",
    description:
      "Linework, shading, depth control, hand speed, consistency, and practice structure.",
    icon: Brush,
    status: "Available now",
  },
  {
    title: "Curriculum Paths",
    description:
      "Structured learning tracks that will guide users from beginner stages into advanced growth.",
    icon: Layers3,
    status: "In progress",
  },
];

export default function Learn() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Learn
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Main curriculum hub
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            This is the education home for InkPlan. It will grow into the main
            place where users explore lessons, follow structured learning paths,
            and build real tattoo knowledge over time.
          </p>
        </div>

        <Card className="overflow-hidden border-border shadow-sm">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Meet your AI Tattoo Coach
              </CardTitle>
            </CardHeader>
          </div>
          <CardContent className="space-y-4 pt-6">
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Ask questions about linework, shading, fake skin practice, machine
              control, posture, stretch, and what to focus on next. This is the
              first step toward turning InkPlan into a guided learning
              experience instead of just a set of tools.
            </p>

            <AITattooCoachWindow />
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Learn overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-6 text-muted-foreground">
              During build phase, this page stays visible so you can design and
              test the curriculum experience without subscription restrictions
              getting in the way.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                Build mode visible
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                <ArrowRight className="h-3.5 w-3.5" />
                Tier gating can be re-added later
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {learningSections.map((section) => {
            const Icon = section.icon;

            return (
              <Card key={section.title} className="border-border shadow-sm">
                <CardHeader className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {section.status}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>What this page will become</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="text-sm font-semibold text-foreground">
                Curriculum categories
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Organized lesson groups like fundamentals, style study,
                technique, business, culture, and professional development.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="text-sm font-semibold text-foreground">
                Guided progression
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A clear path showing what users should start with, what comes
                next, and how their learning evolves over time.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="text-sm font-semibold text-foreground">
                Lesson cards
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Each lesson can later show completion state, estimated duration,
                level, and access tier without breaking the overall layout.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="text-sm font-semibold text-foreground">
                Future tier controls
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Locked and unlocked states can be added back later once the
                Stripe flow and subscription handling are fully wired.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
