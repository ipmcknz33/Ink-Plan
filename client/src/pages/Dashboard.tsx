import { useMemo } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import AICoachPanel, { type CoachOption } from "@/components/AICoachPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Crown,
  Library,
  Loader2,
  Lock,
  PenTool,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useProfile, useStyles } from "@/hooks/use-api";

type StyleItem = {
  id: string;
  name: string;
  definition: string;
  previewImage: string;
  tags: string[];
};

const fallbackStyles: StyleItem[] = [
  {
    id: "traditional",
    name: "American Traditional",
    definition:
      "Bold outlines, strong readability, and classic tattoo structure built to hold up clearly.",
    previewImage: "/images/traditional-style.png",
    tags: ["Bold", "Classic", "Readable"],
  },
  {
    id: "black-grey",
    name: "Black & Grey",
    definition:
      "Smooth shading, value control, and clear form separation built through light, mid, and dark balance.",
    previewImage: "/images/black-grey-style.png",
    tags: ["Smooth", "Value", "Contrast"],
  },
  {
    id: "japanese",
    name: "Japanese",
    definition:
      "Flowing composition, movement, hierarchy, and strong large-form design.",
    previewImage: "/images/japanese-style.png",
    tags: ["Flow", "Movement", "Large Forms"],
  },
];

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

  const isLoading = profileLoading || stylesLoading;

  const tier = profile?.subscriptionTier ?? "free";
  const proUnlocked = canAccessPro(tier);
  const premiumUnlocked = canAccessPremium(tier);

  const displayStyles = useMemo<StyleItem[]>(() => {
    const apiStyles = (styles as StyleItem[] | undefined) ?? [];
    if (apiStyles.length > 0) {
      return apiStyles.slice(0, 3);
    }
    return fallbackStyles;
  }, [styles]);

  const coachOptions = useMemo<CoachOption[]>(
    () => [
      {
        id: "what-should-i-do-today",
        label: "What should I do today?",
        answer:
          "Start with one clear objective.\n\nA strong Dashboard session usually means choosing one path: study fundamentals, review a style, or do focused practice. Do not try to do everything at once.",
      },
      {
        id: "where-should-i-start",
        label: "Where should I start first?",
        answer:
          "If you are unsure, start with Learn, then move into Practice.\n\nBuild understanding first, then apply it. Broad foundation first, specialization later.",
      },
      {
        id: "how-does-ai-work",
        label: "How does the AI Coach work?",
        answer:
          "Right now, the coach gives you structured guidance based on where you are in the app.\n\nThis is intentional. Strong fundamentals come from clear direction, not random answers.\n\nPremium unlocks deeper coaching, custom questions, and broader AI support across tattoo learning and the app.",
      },
      {
        id: "what-is-inkplan-for",
        label: "What is InkPlan really for?",
        answer:
          "InkPlan is here to help you become more apprenticeship-ready.\n\nIt does not replace a real apprenticeship. It helps you build stronger habits, better study structure, more useful practice, and a cleaner learning path before real shop mentorship.",
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <Card className="border-white/8 bg-card shadow-none">
          <CardContent className="p-6 md:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-red-300">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  InkPlan Dashboard
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Build skill with structure, not random reps.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
                  Use Dashboard to pick the right next step, stay focused, and
                  keep moving toward apprenticeship readiness without clutter or
                  wasted effort.
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
          </CardContent>
        </Card>

        <AICoachPanel
          title="AI Tattoo Coach"
          subtitle="Get structured guidance for what to do next. Premium expands this into broader AI support and custom questions."
          options={coachOptions}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card
            className="cursor-pointer border-white/8 bg-card shadow-none transition hover:border-red-500/30"
            onClick={() => setLocation("/learn")}
          >
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <BookOpen className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Learn Fundamentals</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Study readability, flow, and foundational tattoo decisions
                before trying to force advanced execution.
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-white/8 bg-card shadow-none transition hover:border-red-500/30"
            onClick={() => setLocation("/styles")}
          >
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <Target className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Study Styles</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Build broad understanding across styles before narrowing your
                direction too early.
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-white/8 bg-card shadow-none transition hover:border-red-500/30"
            onClick={() => setLocation("/practice")}
          >
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <PenTool className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Practice With Intent</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Train one skill at a time. Cleaner repetition beats random
                volume.
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-white/8 bg-card shadow-none transition hover:border-red-500/30"
            onClick={() => setLocation("/library")}
          >
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <Library className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Use the Library</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Review references, examples, and supporting material that make
                your learning path more useful.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/8 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-none">
          <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                Upgrade Path
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Expand the coach, structure, and premium learning depth
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
                Free gives users a strong local-first coach and core learning
                flow. Premium is where broader AI support, deeper guidance, and
                stronger learning tools belong.
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

        <div className="space-y-4">
          <h2 className="border-b border-white/8 pb-2 text-xl font-semibold text-white">
            Recommended styles to study
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayStyles.map((style) => (
              <Card
                key={style.id}
                className="group cursor-pointer overflow-hidden border-white/8 bg-card shadow-none transition hover:border-red-500/30"
                onClick={() => setLocation(`/styles/${style.id}`)}
                data-testid={`card-style-${style.id}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                  <img
                    src={style.previewImage}
                    alt={style.name}
                    className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <CardContent className="space-y-4 p-5">
                  <div>
                    <h3 className="text-xl font-semibold text-white transition group-hover:text-red-400">
                      {style.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
                      {style.definition}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {style.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setLocation(`/styles/${style.id}`);
                    }}
                    className="inline-flex items-center text-sm font-semibold text-white transition hover:text-red-400"
                  >
                    Open study page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="border-b border-white/8 pb-2 text-xl font-semibold text-white">
            Locked growth path
          </h2>

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
                    Pro Guidance
                  </CardTitle>
                  {!proUnlocked && <Lock className="h-4 w-4 text-zinc-500" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-6 text-zinc-400">
                  Deeper workflow structure, stronger guidance layers, and more
                  useful support for focused development.
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
                    Premium AI Coach
                  </CardTitle>
                  {!premiumUnlocked && (
                    <Lock className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-6 text-zinc-400">
                  Broader AI support for tattoo learning and app guidance,
                  custom questions, and deeper premium coaching.
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

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Today&apos;s recommended focus
            </h3>
            <p className="mb-6 text-sm leading-7 text-zinc-400">
              Start with one clean objective:
              <span className="ml-1 font-medium text-white">
                line control, shape clarity, or design readability.
              </span>
              Pick one and work it on purpose.
            </p>
            <button
              className="w-full rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              onClick={() => setLocation("/practice")}
              data-testid="button-start-practice"
            >
              Start Practice
            </button>
          </div>

          <div className="rounded-3xl border border-white/8 bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Plan recommendation
            </h3>
            <p className="mb-6 text-sm leading-7 text-zinc-400">
              {tier === "free" &&
                "You are on Free. Use the local coach, core style study, and guided practice flow first. Upgrade when you want broader AI support and deeper structure."}
              {tier === "pro" &&
                "You are on Pro. You already have stronger structure. Move to Premium when you want broader AI coaching and deeper support."}
              {tier === "premium" &&
                "You are on Premium. You are positioned for the deepest InkPlan guidance layer as broader AI support rolls in."}
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

        <Card className="border-white/8 bg-card shadow-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Apprenticeship-first mindset
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">
                  InkPlan is here to help you become more prepared, more
                  teachable, and more disciplined before entering a real shop
                  learning environment. It is not a replacement for real
                  apprenticeship or real mentorship.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
