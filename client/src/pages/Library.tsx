"use client";

import { useMemo } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Lock,
  PenTool,
  Sparkles,
  Star,
} from "lucide-react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-api";

type PlanTier = "free" | "pro" | "premium";

type LibraryItem = {
  title: string;
  category: string;
  description: string;
  tier: PlanTier;
};

const libraryItems: LibraryItem[] = [
  {
    title: "Foundational Linework Reference",
    category: "Free",
    description: "Core reference material to build consistency and confidence.",
    tier: "free",
  },
  {
    title: "Basic Shading Study Set",
    category: "Free",
    description:
      "Useful, practical studies that help new artists start sharpening control.",
    tier: "free",
  },
  {
    title: "Composition Starter Pack",
    category: "Free",
    description:
      "Simple layout references that introduce stronger tattoo design structure.",
    tier: "free",
  },
  {
    title: "Pro Style Breakdown Collection",
    category: "Pro",
    description:
      "A deeper study library for artists who want more refined visual analysis.",
    tier: "pro",
  },
  {
    title: "Advanced Black & Grey Reference Vault",
    category: "Pro",
    description:
      "Higher-value study material designed for artists ready to level up faster.",
    tier: "pro",
  },
  {
    title: "Premium Master Reference Archive",
    category: "Premium",
    description:
      "The highest-tier content experience with premium-only reference access.",
    tier: "premium",
  },
  {
    title: "Elite Study Packs",
    category: "Premium",
    description:
      "Curated premium material meant to feel like the real InkPlan advantage.",
    tier: "premium",
  },
];

function tierRank(tier: PlanTier) {
  if (tier === "premium") return 3;
  if (tier === "pro") return 2;
  return 1;
}

export default function Library() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading } = useProfile();

  const currentPlan = (profile?.subscriptionTier ?? "free") as PlanTier;

  const visibleItems = useMemo(() => {
    return libraryItems.map((item) => {
      const locked = tierRank(item.tier) > tierRank(currentPlan);
      return {
        ...item,
        locked,
      };
    });
  }, [currentPlan]);

  const unlockedCount = visibleItems.filter((item) => !item.locked).length;
  const lockedCount = visibleItems.filter((item) => item.locked).length;

  const upgradeLabel =
    currentPlan === "free"
      ? "Upgrade to Pro"
      : currentPlan === "pro"
        ? "Upgrade to Premium"
        : "Premium Active";

  function handleUpgradeClick() {
    setLocation("/");
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-3xl border bg-muted/40"
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
        <section className="rounded-3xl border bg-gradient-to-b from-background to-muted/30 p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                Library
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Study what you can access now. See what unlocks next.
              </h1>

              <p className="mt-4 max-w-2xl text-muted-foreground">
                The InkPlan Library is designed to make free users feel
                supported, while clearly showing how much more valuable Pro and
                Premium become as you level up.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Current plan
                  </p>
                  <p className="mt-1 text-base font-semibold capitalize">
                    {currentPlan}
                  </p>
                </div>

                <div className="rounded-2xl border bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Available now
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {unlockedCount} items
                  </p>
                </div>

                <div className="rounded-2xl border bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Locked
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {lockedCount} items
                  </p>
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Crown className="h-5 w-5 text-primary" />
                  Upgrade path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Free</p>
                  <p className="mt-1 font-medium">Core reference access</p>
                </div>

                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Pro</p>
                  <p className="mt-1 font-medium">
                    Expanded study depth and stronger learning flow
                  </p>
                </div>

                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Premium</p>
                  <p className="mt-1 font-medium">
                    Best reference experience inside InkPlan
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={handleUpgradeClick}
                  disabled={currentPlan === "premium"}
                >
                  {upgradeLabel}
                  {currentPlan !== "premium" ? (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  ) : null}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">
                Content Library
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Free content first. Premium value clearly visible.
              </h2>
            </div>

            {currentPlan !== "premium" ? (
              <Button variant="outline" onClick={handleUpgradeClick}>
                Unlock more
              </Button>
            ) : null}
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <Card
                key={item.title}
                className="relative overflow-hidden rounded-3xl border shadow-sm transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-3 inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
                        {item.category}
                      </div>
                      <CardTitle className="text-xl leading-tight">
                        {item.title}
                      </CardTitle>
                    </div>

                    {item.locked ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className={item.locked ? "blur-[2px] opacity-70" : ""}>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm">
                      {!item.locked ? (
                        <>
                          <Star className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            Available on your plan
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            More depth available above your plan
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>

                {item.locked ? (
                  <div className="absolute inset-0 flex items-end bg-background/35 p-6">
                    <div className="w-full rounded-2xl border bg-background p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">
                            Unlock with{" "}
                            {item.tier === "pro" ? "Pro" : "Premium"}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Upgrade to access deeper study content and a
                            stronger InkPlan experience.
                          </p>
                        </div>
                        <Lock className="mt-1 h-4 w-4 text-primary" />
                      </div>

                      <Button
                        className="mt-4 w-full"
                        onClick={handleUpgradeClick}
                      >
                        {item.tier === "pro"
                          ? "Upgrade to Pro"
                          : "Upgrade to Premium"}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border bg-muted/30 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary">Why upgrade?</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                Free helps you start. Pro and Premium are where InkPlan really
                opens up.
              </h3>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Your current plan should feel useful, but the locked content
                should make the next step feel obvious. Better resources, more
                depth, and a more complete creative workflow are what make
                upgrading worth it.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border bg-background p-4">
                <div className="mb-2 flex items-center gap-2">
                  <PenTool className="h-4 w-4 text-primary" />
                  <p className="font-medium">Free</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enough to build trust and momentum.
                </p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <p className="font-medium">Pro</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Better resources for users ready to take growth seriously.
                </p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  <p className="font-medium">Premium</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  The full premium experience with the strongest content
                  perception.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
