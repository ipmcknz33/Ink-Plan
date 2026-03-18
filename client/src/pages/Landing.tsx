"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Lock,
  PenTool,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";

type AuthMode = "signin" | "signup";

type TierCard = {
  name: "Free" | "Pro" | "Premium";
  description: string;
  priceLabel: string;
  features: string[];
  highlight?: boolean;
};

type TeaserItem = {
  title: string;
  description: string;
  locked?: boolean;
};

const tierCards: TierCard[] = [
  {
    name: "Free",
    description:
      "Get in, explore styles, and start building your tattoo practice routine.",
    priceLabel: "Start free",
    features: [
      "Core dashboard access",
      "Basic library content",
      "Practice workflow",
      "Progressive learning foundation",
    ],
  },
  {
    name: "Pro",
    description:
      "For artists ready to move faster, learn deeper, and build real momentum.",
    priceLabel: "Upgrade path",
    highlight: true,
    features: [
      "Everything in Free",
      "Expanded reference library",
      "Pro learning tracks",
      "Stronger guided practice flow",
    ],
  },
  {
    name: "Premium",
    description:
      "The full InkPlan experience for serious artists who want the highest ceiling.",
    priceLabel: "Best experience",
    features: [
      "Everything in Pro",
      "Premium content access",
      "Advanced study resources",
      "Full value ladder experience",
    ],
  },
];

const teaserItems: TeaserItem[] = [
  {
    title: "Starter Reference Packs",
    description: "Useful, practical content to get moving right away.",
  },
  {
    title: "Pro Style Breakdowns",
    description:
      "Deeper, more refined references designed to sharpen your eye.",
    locked: true,
  },
  {
    title: "Premium Master Study Vault",
    description:
      "High-value premium learning content that feels like the real InkPlan experience.",
    locked: true,
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isHydrated } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");

  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isHydrated, setLocation]);

  const primaryCtaLabel = useMemo(() => {
    return isAuthenticated ? "Go to Dashboard" : "Start Free";
  }, [isAuthenticated]);

  function handlePrimaryCta() {
    if (isAuthenticated) {
      setLocation("/dashboard");
      return;
    }

    setAuthMode("signup");
    setAuthOpen(true);
  }

  function handleSecondaryCta() {
    if (isAuthenticated) {
      setLocation("/dashboard");
      return;
    }

    setAuthMode("signin");
    setAuthOpen(true);
  }

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <section className="border-b bg-gradient-to-b from-background via-background to-muted/30">
          <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col px-6 py-10">
            <header className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <PenTool className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">InkPlan</p>
                  <p className="text-sm text-muted-foreground">
                    Structured growth for tattoo artists
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={handleSecondaryCta}>
                  {isAuthenticated ? "Dashboard" : "Sign In"}
                </Button>
                <Button onClick={handlePrimaryCta}>
                  {primaryCtaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </header>

            <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-2">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Learn faster. Practice better. Unlock more.
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  The tattoo learning platform that grows with you.
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  InkPlan helps artists build skill with structured practice,
                  style reference, and premium learning content. Free gets you
                  started. Pro builds momentum. Premium unlocks the real depth.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" onClick={handlePrimaryCta}>
                    {primaryCtaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSecondaryCta}
                  >
                    {isAuthenticated ? "View Library" : "See How It Works"}
                  </Button>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">Useful from day one</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Free access gives new users real value immediately.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-background p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">Clear skill progression</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pro feels like the next serious step, not a paywall.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-background p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">Premium feels elite</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Locked content teases the full experience without clutter.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="grid gap-4">
                  <Card className="rounded-3xl border shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Crown className="h-5 w-5 text-primary" />
                        Premium Experience Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {teaserItems.map((item) => (
                        <div
                          key={item.title}
                          className="relative overflow-hidden rounded-2xl border bg-card p-4"
                        >
                          <div
                            className={
                              item.locked ? "blur-[2px] opacity-80" : ""
                            }
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium">{item.title}</p>
                              {item.locked ? (
                                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                                  <Lock className="h-3.5 w-3.5" />
                                  Locked
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
                                  Included
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>

                          {item.locked ? (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/35">
                              <div className="rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm">
                                Upgrade to unlock
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="rounded-3xl">
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">
                          Free users get
                        </p>
                        <p className="mt-2 text-2xl font-semibold">
                          A real start
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Enough value to explore, trust the product, and begin
                          a habit.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">
                          Premium users get
                        </p>
                        <p className="mt-2 text-2xl font-semibold">
                          The full system
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Deeper content, stronger progression, and a more
                          complete creative workflow.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium text-primary">
              Free → Pro → Premium
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A clean value ladder that makes upgrading feel natural.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Free is useful. Pro is momentum. Premium is mastery. Each step
              adds more depth, more access, and more reasons to stay inside
              InkPlan.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {tierCards.map((tier) => (
              <Card
                key={tier.name}
                className={`rounded-3xl border transition-all ${
                  tier.highlight ? "border-primary shadow-md" : "shadow-sm"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    {tier.highlight ? (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Best next step
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </CardHeader>

                <CardContent>
                  <p className="mb-6 text-sm font-medium text-primary">
                    {tier.priceLabel}
                  </p>

                  <div className="space-y-3">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                          <Star className="h-3 w-3 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="mt-8 w-full"
                    variant={tier.highlight ? "default" : "outline"}
                    onClick={handlePrimaryCta}
                  >
                    {tier.name === "Free"
                      ? "Start Free"
                      : `Choose ${tier.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="rounded-3xl border bg-background p-8 shadow-sm sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
                <div>
                  <p className="text-sm font-medium text-primary">
                    Start simple. Grow into more.
                  </p>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight">
                    Free gets artists in the door. Premium makes them want to
                    stay.
                  </h3>
                  <p className="mt-4 max-w-2xl text-muted-foreground">
                    InkPlan should feel helpful immediately, but clearly more
                    powerful at higher tiers. That contrast creates the upgrade
                    pull without making free feel empty.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button size="lg" onClick={handlePrimaryCta}>
                    {primaryCtaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSecondaryCta}
                  >
                    {isAuthenticated ? "Open Dashboard" : "Sign In"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
