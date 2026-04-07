import { useState } from "react";
import { useLocation } from "wouter";
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
  BrainCircuit,
  ArrowRight,
} from "lucide-react";
import {
  useProfile,
  useStyles,
  useDrawings,
  useProgress,
} from "@/hooks/use-api";

type CoachKey = "practice" | "fundamentals" | "styles" | "portfolio";

const coachContent: Record<
  CoachKey,
  {
    title: string;
    message: string;
    cta: string;
    href: string;
  }
> = {
  practice: {
    title: "Practice with intention",
    message:
      "Pick one skill and keep it simple. Focus on clean line control or basic shape repetition before jumping into harder designs.",
    cta: "Go to Practice",
    href: "/practice",
  },
  fundamentals: {
    title: "Build your foundation first",
    message:
      "Readability, spacing, line control, and value matter more than advanced-looking work. Get the basics cleaner before trying to look impressive.",
    cta: "Go to Learn",
    href: "/learn",
  },
  styles: {
    title: "Study styles without locking in too early",
    message:
      "Explore multiple tattoo styles first. Broad understanding makes you more rounded, more coachable, and easier to teach in a real shop.",
    cta: "Explore Styles",
    href: "/styles",
  },
  portfolio: {
    title: "Build a cleaner portfolio",
    message:
      "Show fundamentals first, then range, then your strongest work. Keep it organized and avoid presenting everything you make.",
    cta: "Build Portfolio",
    href: "/portfolio",
  },
};

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

  const [activeCoachKey, setActiveCoachKey] =
    useState<CoachKey>("fundamentals");

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
  const activeCoach = coachContent[activeCoachKey];

  return (
    <Layout>
      <div className="space-y-8">
        <Card className="border-white/8 bg-card shadow-none">
          <CardContent className="p-6 md:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-red-300">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  AI Tattoo Coach
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Focus on one thing today and do it clean.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
                  InkPlan helps you build fundamentals, improve practice habits,
                  and prepare for a real apprenticeship. Start simple and stay
                  consistent.
                </p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Current Plan
                </p>
                <div className="mt-2 flex items-center gap-2 text-white">
                  <Crown className="h-4 w-4 text-red-400" />
                  <span className="font-medium">{getTierLabel(tier)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveCoachKey("practice")}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  activeCoachKey === "practice"
                    ? "border-red-500/30 bg-red-500/10 text-white"
                    : "border-white/8 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.05]"
                }`}
              >
                Start Practice
              </button>

              <button
                type="button"
                onClick={() => setActiveCoachKey("fundamentals")}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  activeCoachKey === "fundamentals"
                    ? "border-red-500/30 bg-red-500/10 text-white"
                    : "border-white/8 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.05]"
                }`}
              >
                Study Fundamentals
              </button>

              <button
                type="button"
                onClick={() => setActiveCoachKey("styles")}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  activeCoachKey === "styles"
                    ? "border-red-500/30 bg-red-500/10 text-white"
                    : "border-white/8 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.05]"
                }`}
              >
                Explore Styles
              </button>

              <button
                type="button"
                onClick={() => setActiveCoachKey("portfolio")}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  activeCoachKey === "portfolio"
                    ? "border-red-500/30 bg-red-500/10 text-white"
                    : "border-white/8 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.05]"
                }`}
              >
                Build Portfolio
              </button>
            </div>

            <div className="mt-5 rounded-3xl border border-red-500/20 bg-red-500/8 p-5">
              <h3 className="text-lg font-semibold text-white">
                {activeCoach.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
                {activeCoach.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLocation(activeCoach.href)}
                  className="inline-flex items-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                >
                  {activeCoach.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>

                <p className="text-xs leading-6 text-zinc-500">
                  InkPlan is preparation for apprenticeship, not a replacement
                  for real mentorship in a real shop.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/8 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-none">
          <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                Upgrade Path
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Unlock deeper guidance, better structure, and future premium
                drops
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
                Free gets users started. Pro sharpens the workflow. Premium
                opens deeper support and stronger learning tools.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setLocation("/upgrade")}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:opacity-90"
            >
              View Upgrade Options
            </button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-white/8 bg-card shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                Drawings
              </CardTitle>
              <Trophy className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-semibold text-white"
                data-testid="text-drawings-count"
              >
                {drawingsCount}
              </div>
              <p className="text-xs text-zinc-500">Total sheets completed</p>
            </CardContent>
          </Card>

          <Card className="border-white/8 bg-card shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                Hours
              </CardTitle>
              <Calendar className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-semibold text-white"
                data-testid="text-hours-practiced"
              >
                {totalHours}h
              </div>
              <p className="text-xs text-zinc-500">Practice time logged</p>
            </CardContent>
          </Card>

          <Card className="border-white/8 bg-white/[0.03] shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-semibold text-white"
                data-testid="text-streak"
              >
                0 Days
              </div>
              <p className="text-xs text-zinc-500">Keep the habit moving</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="border-b border-white/8 pb-2 text-xl font-semibold text-white">
            Locked Growth Path
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Card
              className={
                proUnlocked
                  ? "border-white/8 bg-card shadow-none"
                  : "border-dashed border-white/10 bg-card shadow-none"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Sparkles className="h-5 w-5 text-red-400" />
                    Pro Insights
                  </CardTitle>
                  {!proUnlocked && <Lock className="h-4 w-4 text-zinc-500" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-6 text-zinc-400">
                  Advanced training breakdowns, higher-level progress analysis,
                  and deeper practice guidance.
                </p>
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {proUnlocked
                    ? "Unlocked on your plan"
                    : "Requires Pro or Premium"}
                </div>
              </CardContent>
            </Card>

            <Card
              className={
                premiumUnlocked
                  ? "border-white/8 bg-card shadow-none"
                  : "border-dashed border-white/10 bg-card shadow-none"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Crown className="h-5 w-5 text-red-400" />
                    Premium Library
                  </CardTitle>
                  {!premiumUnlocked && (
                    <Lock className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-6 text-zinc-400">
                  Exclusive premium references, advanced resources, and access
                  to new premium drops first.
                </p>
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {premiumUnlocked
                    ? "Unlocked on your plan"
                    : "Requires Premium"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="border-b border-white/8 pb-2 text-xl font-semibold text-white">
            Style Mastery
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {styles?.map((style) => (
              <Card
                key={style.id}
                className="group cursor-pointer overflow-hidden border-white/8 bg-card shadow-none transition hover:border-red-500/30"
                onClick={() => setLocation(`/styles/${style.id}`)}
                data-testid={`card-style-${style.id}`}
              >
                <div className="flex">
                  <div className="relative h-auto w-24 bg-zinc-900">
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white transition group-hover:text-red-400">
                          {style.name}
                        </h4>
                        <p className="line-clamp-1 text-xs text-zinc-500">
                          {style.definition}
                        </p>
                      </div>

                      <span
                        className="text-sm font-semibold text-white"
                        data-testid={`text-progress-${style.id}`}
                      >
                        {progressMap.get(style.id) || 0}%
                      </span>
                    </div>

                    <Progress
                      value={progressMap.get(style.id) || 0}
                      className="mt-4 h-2 bg-zinc-900"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Daily Drill
            </h3>
            <p className="mb-6 text-zinc-400">
              Today&apos;s focus is on{" "}
              <span className="font-medium text-white">Line Consistency</span>{" "}
              in American Traditional.
            </p>
            <button
              className="w-full rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              onClick={() => setLocation("/styles/american_traditional")}
              data-testid="button-start-drill"
            >
              Start 5-min Warmup
            </button>
          </div>

          <div className="rounded-3xl border border-white/8 bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Plan Recommendation
            </h3>
            <p className="mb-6 text-sm leading-7 text-zinc-400">
              {tier === "free" &&
                "You are on Free. Upgrade when you want deeper guidance, stronger structure, and premium content."}
              {tier === "pro" &&
                "You are on Pro. Move to Premium when you want the full library and deeper support."}
              {tier === "premium" &&
                "You are on Premium. You have access to the highest tier of InkPlan support."}
            </p>

            <button
              type="button"
              onClick={() => setLocation("/upgrade")}
              className="w-full rounded-2xl border border-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
            >
              View Upgrade Value
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
