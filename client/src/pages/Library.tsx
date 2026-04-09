"use client";

import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Lock,
  MessageSquare,
  PenTool,
  Sparkles,
  Stars,
} from "lucide-react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-api";

type PlanTier = "free" | "pro" | "premium";

type StarterStyle = {
  title: string;
  description: string;
  href?: string;
};

type TierExpansion = {
  title: string;
  description: string;
};

const freeStarterStyles: StarterStyle[] = [
  {
    title: "Traditional",
    description:
      "Starter references for bold shape language, readability, and classic tattoo flow.",
    href: "/library/reference-packs",
  },
  {
    title: "Neo Traditional",
    description:
      "Starter references for stylized forms, bolder motion, and decorative composition.",
    href: "/library/neo-traditional",
  },
  {
    title: "Japanese",
    description:
      "Starter references for movement, background balance, and larger design storytelling.",
    href: "/library/japanese",
  },
  {
    title: "Fine Line",
    description:
      "Starter references for cleaner spacing, restraint, and lighter visual structure.",
    href: "/library/flash-studies",
  },
  {
    title: "Lettering",
    description:
      "Starter references for script rhythm, readability, spacing, and clean letter balance.",
    href: "/library/fundamentals",
  },
  {
    title: "Black & Grey Realism",
    description:
      "Starter references for value observation, contrast, softness, and visual interpretation.",
    href: "/library/black-grey-realism",
  },
];

const proUnlocks: TierExpansion[] = [
  {
    title: "More packs in core styles",
    description:
      "Open additional reference packs in Traditional, Neo Traditional, Japanese, Fine Line, Lettering, and Black & Grey Realism.",
  },
  {
    title: "Geometric",
    description:
      "Add cleaner structured inspiration focused on spacing, symmetry, repetition, and visual precision.",
  },
  {
    title: "Biomechanical",
    description:
      "Add more complex mechanical flow, layered forms, and stronger visual movement.",
  },
];

const premiumUnlocks: TierExpansion[] = [
  {
    title: "Full example access",
    description:
      "Unlock the deepest visual library across the platform with the strongest reference range.",
  },
  {
    title: "Watercolor",
    description:
      "Study softer, more fluid visual motion, edge breakup, and painterly inspiration.",
  },
  {
    title: "Japanese Realism",
    description:
      "Explore more advanced compositions blending realism with larger Japanese influence.",
  },
  {
    title: "Chicano",
    description:
      "Study black and grey mood, lettering flow, portrait influence, and stronger cultural design language.",
  },
  {
    title: "Polynesian",
    description:
      "Focus on pattern language, body flow, repetition, spacing, and stronger layout discipline.",
  },
  {
    title: "Fake skin guidance + real AI chat",
    description:
      "Premium is where application begins with guided fake skin practice, common mistakes, and real AI support.",
  },
];

function getPlanRank(plan: PlanTier) {
  if (plan === "premium") return 3;
  if (plan === "pro") return 2;
  return 1;
}

export default function Library() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading } = useProfile();

  const currentPlan = (profile?.subscriptionTier ?? "free") as PlanTier;
  const currentPlanRank = getPlanRank(currentPlan);

  function handleUpgradeClick() {
    setLocation("/upgrade");
  }

  function handleStarterClick(item: StarterStyle) {
    if (item.href) {
      setLocation(item.href);
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
          <div className="h-40 animate-pulse rounded-3xl bg-muted/40" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-3xl border bg-muted/40"
              />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl border bg-gradient-to-b from-background to-muted/20 p-6 shadow-sm sm:p-8">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              Library
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start wide. Unlock deeper study as you level up.
            </h1>

            <p className="mt-4 text-muted-foreground">
              Free gives starter reference packs across core tattoo styles. Pro
              opens more packs and more styles. Premium unlocks advanced styles,
              fake skin guidance, and real AI chat.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <PlanSummaryCard
                label="Free"
                title="Starter access across 6 core styles"
                description="A strong visual base so users can start studying immediately."
                active={currentPlan === "free"}
              />
              <PlanSummaryCard
                label="Pro"
                title="More packs + more styles"
                description="Expand the same styles further and add geometric and biomechanical."
                active={currentPlan === "pro"}
              />
              <PlanSummaryCard
                label="Premium"
                title="Full access + application"
                description="Advanced styles, fake skin guidance, and real AI chat support."
                active={currentPlan === "premium"}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-muted/20 p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <InfoCard
              icon={<PenTool className="h-4 w-4 text-primary" />}
              title="How to use the library"
              text="Study, trace, redraw, and break designs down. The goal is better hand movement, visual understanding, and stronger drawing process."
            />
            <InfoCard
              icon={<Lock className="h-4 w-4 text-primary" />}
              title="Inspiration only"
              text="These are references to learn from, not designs to rely on as finished tattoos. Users should create their own variations."
            />
            <InfoCard
              icon={<MessageSquare className="h-4 w-4 text-primary" />}
              title="Application comes later"
              text="Premium is where fake skin guidance and real AI support begin, once the user is ready for more serious practice."
            />
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Included in free
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                6 starter style packs available right away
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                These are the core styles everyone can start with. Higher plans
                do not replace these — they expand them.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {freeStarterStyles.map((style) => (
              <Card
                key={style.title}
                onClick={() => handleStarterClick(style)}
                className="group cursor-pointer overflow-hidden rounded-3xl border bg-background transition-all hover:border-primary hover:shadow-md"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-primary/80" />
                <CardContent className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground">
                        Free
                      </div>
                      <div className="inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground">
                        Starter Pack
                      </div>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold leading-tight">
                    {style.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {style.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm font-medium">Open starter pack</p>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <TierHeader
            eyebrow="Unlock with Pro"
            title="More packs in core styles, plus more styles overall"
            subtitle="Pro expands what free already starts. It adds depth inside the same major styles and opens more variety."
            buttonLabel={currentPlanRank < 2 ? "Upgrade to Pro" : undefined}
            onButtonClick={currentPlanRank < 2 ? handleUpgradeClick : undefined}
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {proUnlocks.map((item) => (
              <LockedFeatureCard
                key={item.title}
                tier="Pro"
                title={item.title}
                description={item.description}
                unlocked={currentPlanRank >= 2}
                onClick={currentPlanRank >= 2 ? undefined : handleUpgradeClick}
              />
            ))}
          </div>
        </section>

        <section>
          <TierHeader
            eyebrow="Unlock with Premium"
            title="Advanced styles and real practice support"
            subtitle="Premium is where the deepest visual library and actual application guidance come together."
            buttonLabel={currentPlanRank < 3 ? "Upgrade to Premium" : undefined}
            onButtonClick={currentPlanRank < 3 ? handleUpgradeClick : undefined}
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {premiumUnlocks.map((item) => (
              <LockedFeatureCard
                key={item.title}
                tier="Premium"
                title={item.title}
                description={item.description}
                unlocked={currentPlanRank >= 3}
                onClick={currentPlanRank >= 3 ? undefined : handleUpgradeClick}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border bg-gradient-to-r from-background to-muted/30 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary">Level flow</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                Free starts the study process. Pro expands it. Premium applies
                it.
              </h3>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                This keeps the library clear. Users can start across multiple
                core styles immediately, then unlock more depth, more variety,
                and eventually practical support when they are ready.
              </p>
            </div>

            {currentPlan !== "premium" ? (
              <div className="rounded-3xl border bg-background p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <p className="font-semibold">
                    {currentPlan === "free"
                      ? "Ready for more packs and styles?"
                      : "Ready for the full premium layer?"}
                  </p>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                  Move from starter access into deeper references, broader style
                  exposure, fake skin guidance, and real AI help.
                </p>

                <Button className="mt-5 w-full" onClick={handleUpgradeClick}>
                  {currentPlan === "free"
                    ? "See Pro & Premium"
                    : "Unlock Premium"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="rounded-3xl border bg-background p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="font-semibold">Premium active</p>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                  You have access to the full library direction, including
                  advanced styles and deeper practice support.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function PlanSummaryCard({
  label,
  title,
  description,
  active,
}: {
  label: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-background px-4 py-4 ${
        active ? "border-primary shadow-sm" : ""
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <p className="font-semibold">{title}</p>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function TierHeader({
  eyebrow,
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {buttonLabel && onButtonClick ? (
        <Button variant="outline" onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      ) : null}
    </div>
  );
}

function LockedFeatureCard({
  tier,
  title,
  description,
  unlocked,
  onClick,
}: {
  tier: "Pro" | "Premium";
  title: string;
  description: string;
  unlocked: boolean;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={`overflow-hidden rounded-3xl border transition-all ${
        unlocked
          ? "bg-background"
          : "cursor-pointer bg-muted/20 hover:border-primary hover:shadow-md"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/80" />
      <CardContent className="p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground">
              {tier}
            </div>
            <div className="inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground">
              {unlocked ? "Unlocked" : "Locked"}
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            {unlocked ? (
              <Stars className="h-5 w-5 text-primary" />
            ) : (
              <Lock className="h-5 w-5 text-primary" />
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold leading-tight">{title}</h3>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium">
            {unlocked ? "Included in your plan" : `Unlock with ${tier}`}
          </p>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
