import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Trophy,
  Calendar,
  Loader2,
  Lock,
  Sparkles,
  Crown,
} from "lucide-react";
import { useProfile, useStyles, useDrawings, useProgress } from "@/hooks/use-api";
import { useLocation } from "wouter";

function getTierLabel(tier?: string | null) {
  if (tier === "premium") return "Premium";
  if (tier === "pro") return "Pro";
  return "Free";
}

function canAccessPro(tier?: string | null) {
  return tier === "pro" || tier === "premium";
}

function canAccessPremium(tier?: string | null) {
  return tier === "premium";
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: styles, isLoading: stylesLoading } = useStyles();
  const { data: drawings, isLoading: drawingsLoading } = useDrawings();
  const { data: progressData, isLoading: progressLoading } = useProgress();

  const isLoading =
    profileLoading || stylesLoading || drawingsLoading || progressLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const tier = profile?.subscriptionTier ?? "free";
  const drawingsCount = drawings?.length || 0;
  const totalHours =
    progressData?.reduce((sum, p) => sum + (p.hoursPracticed || 0), 0) || 0;

  const progressMap = new Map(
    progressData?.map((p) => [p.styleId, p.progressPercent || 0]) || [],
  );

  const proUnlocked = canAccessPro(tier);
  const premiumUnlocked = canAccessPremium(tier);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold">Shop Status</h2>
            <p className="mt-1 text-muted-foreground">
              Welcome back, {profile?.displayName || "Artist"}. Ready to ink?
            </p>
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Current Plan
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Crown className="h-4 w-4 text-accent" />
              <span className="font-bold">{getTierLabel(tier)}</span>
            </div>
          </div>
        </div>

        <Card className="border-2 border-border bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-primary-foreground/70">
                Upgrade Path
              </p>
              <h3 className="mt-1 text-2xl font-display font-bold">
                Unlock Pro drills, premium reference packs, and future feature drops
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">
                Free gets you in the door. Pro sharpens the workflow. Premium opens
                the full InkPlan experience.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setLocation("/library")}
              className="rounded-md bg-white px-4 py-3 text-sm font-bold text-primary transition hover:opacity-90"
            >
              Explore Library
            </button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-2 border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground">
                Drawings
              </CardTitle>
              <Trophy className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold font-display"
                data-testid="text-drawings-count"
              >
                {drawingsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Total sheets completed
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground">
                Hours
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold font-display"
                data-testid="text-hours-practiced"
              >
                {totalHours}h
              </div>
              <p className="text-xs text-muted-foreground">
                Time on the machine (pen)
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border bg-primary text-primary-foreground shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-wider text-primary-foreground/80">
                Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display" data-testid="text-streak">
                0 Days
              </div>
              <p className="text-xs text-primary-foreground/60">
                Keep the fire burning
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="border-b border-border pb-2 text-xl font-display font-bold">
            Locked Growth Path
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className={proUnlocked ? "border-2 border-border" : "border-2 border-dashed border-border"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-display">
                    <Sparkles className="h-5 w-5" />
                    Pro Insights
                  </CardTitle>
                  {!proUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Advanced training breakdowns, higher-level progress analysis, and
                  deeper practice guidance.
                </p>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {proUnlocked ? "Unlocked on your plan" : "Requires Pro or Premium"}
                </div>
              </CardContent>
            </Card>

            <Card className={premiumUnlocked ? "border-2 border-border" : "border-2 border-dashed border-border"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-display">
                    <Crown className="h-5 w-5" />
                    Premium Library
                  </CardTitle>
                  {!premiumUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Exclusive premium references, advanced resources, and access to new
                  premium drops first.
                </p>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {premiumUnlocked ? "Unlocked on your plan" : "Requires Premium"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="border-b border-border pb-2 text-xl font-display font-bold">
            Style Mastery
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {styles?.map((style) => (
              <Card
                key={style.id}
                className="group cursor-pointer overflow-hidden transition-colors hover:border-primary/50"
                onClick={() => setLocation(`/styles/${style.id}`)}
                data-testid={`card-style-${style.id}`}
              >
                <div className="flex">
                  <div className="relative h-auto w-24 bg-muted object-cover">
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold font-display transition-colors group-hover:text-accent">
                          {style.name}
                        </h4>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {style.definition}
                        </p>
                      </div>

                      <span
                        className="text-sm font-bold font-mono"
                        data-testid={`text-progress-${style.id}`}
                      >
                        {progressMap.get(style.id) || 0}%
                      </span>
                    </div>

                    <Progress
                      value={progressMap.get(style.id) || 0}
                      className="mt-4 h-2 bg-secondary"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border-2 border-dashed border-border bg-secondary/10 p-6">
            <h3 className="mb-4 text-lg font-bold font-display">Daily Drill</h3>
            <p className="mb-6 text-muted-foreground">
              Today's focus is on{" "}
              <span className="font-bold text-foreground">Line Consistency</span> in
              American Traditional.
            </p>
            <button
              className="w-full rounded-md bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90"
              onClick={() => setLocation("/styles/american_traditional")}
              data-testid="button-start-drill"
            >
              Start 5-min Warmup
            </button>
          </div>

          <div className="rounded-lg border-2 border-border p-6">
            <h3 className="mb-4 text-lg font-bold font-display">Plan Recommendation</h3>
            <p className="mb-6 text-muted-foreground">
              {tier === "free" &&
                "You are on Free. Upgrade to Pro or Premium to unlock advanced features and premium content."}
              {tier === "pro" &&
                "You are on Pro. Move to Premium when you want the full library and future premium drops."}
              {tier === "premium" &&
                "You are on Premium. You have access to the highest tier of InkPlan features."}
            </p>

            <button
              type="button"
              onClick={() => setLocation("/library")}
              className="w-full rounded-md border border-border py-3 font-bold transition hover:bg-secondary"
            >
              View Upgrade Value
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}