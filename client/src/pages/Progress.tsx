import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle2,
  Flame,
  Trophy,
  Clock3,
  Target,
} from "lucide-react";

const progressStats = [
  {
    label: "Lessons Completed",
    value: "0",
    icon: CheckCircle2,
  },
  {
    label: "Current Streak",
    value: "0 days",
    icon: Flame,
  },
  {
    label: "Milestones",
    value: "0",
    icon: Trophy,
  },
];

export default function Progress() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Progress
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Growth tracking
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            This page will become the personal progress center for InkPlan,
            showing lesson completion, consistency, milestones, and long-term
            development.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {progressStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.label} className="border-border shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Progress overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              For now, this page is a clean visible shell so you can build the
              UX before connecting real completion data, streak logic, and user
              milestone tracking.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">
                Upcoming progress modules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Lesson completion tracking
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Track which lessons were started, completed, or saved for
                  later.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Practice streaks
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Encourage consistency by showing daily or weekly activity
                  patterns.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Milestone markers
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Surface key wins and progress achievements as learners move
                  through the platform.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Build notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Visible during development
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This page should remain visible while you build the product
                  shell and data connections.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Ready for real data later
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Once the learning system is wired, this page can pull live
                  stats from your backend without changing the overall layout.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
