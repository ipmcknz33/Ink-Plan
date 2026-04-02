"use client";

import { useEffect, useState } from "react";
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

type TeaserItem = {
  title: string;
  description: string;
  locked?: boolean;
};

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

  function handleStartFree() {
    if (isAuthenticated) {
      setLocation("/dashboard");
      return;
    }
    setAuthMode("signup");
    setAuthOpen(true);
  }

  function handleSignIn() {
    if (isAuthenticated) {
      setLocation("/dashboard");
      return;
    }
    setAuthMode("signin");
    setAuthOpen(true);
  }

  function handleSeeHowItWorks() {
    if (isAuthenticated) {
      setLocation("/dashboard");
      return;
    }
    setAuthMode("signin");
    setAuthOpen(true);
  }

  if (!isHydrated) return null;

  return (
    <>
      <div className="min-h-screen overflow-hidden bg-background text-foreground">
        <section className="bg-gradient-to-b from-background via-background to-muted/20">
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
            {/* HEADER */}
            <header className="flex items-center justify-between py-2">
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

              {/* 🔥 RESTORED BUTTONS */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={handleSignIn}>
                  {isAuthenticated ? "Dashboard" : "Sign In"}
                </Button>

                <Button onClick={handleStartFree}>
                  {isAuthenticated ? "Dashboard" : "Start Free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </header>

            {/* HERO */}
            <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Learn faster. Practice better. Unlock more.
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                  The tattoo learning platform that grows with you.
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  InkPlan helps artists build skill with structured practice,
                  style reference, and premium learning content.
                </p>

                {/* KEEP SEE HOW IT WORKS */}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSeeHowItWorks}
                  >
                    {isAuthenticated ? "View Library" : "See How It Works"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">Useful from day one</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Real value immediately for new artists.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-background p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">Clear skill progression</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Built to support consistent growth.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-background p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">Premium feels elite</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Strong upgrade path without cluttering the page.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="relative">
                <div className="grid gap-4">
                  <Card className="rounded-3xl border shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Crown className="h-5 w-5 text-primary" />
                        Premium Experience Preview
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
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

                          {item.locked && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/35">
                              <div className="rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm">
                                Upgrade to unlock
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
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
