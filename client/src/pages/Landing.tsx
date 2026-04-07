"use client";

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BrainCircuit,
  Crown,
  Lock,
  PenTool,
  ShieldCheck,
} from "lucide-react";

import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";

const teaserItems = [
  {
    title: "Foundations + structured guidance",
    description:
      "Beginner-friendly tattoo fundamentals and cleaner practice direction.",
  },
  {
    title: "Deeper style study + portfolio support",
    description:
      "Stronger learning structure across styles and portfolio development.",
    locked: true,
  },
  {
    title: "Expanded AI Tattoo Coach support",
    description: "Deeper guidance and more tailored support as users progress.",
    locked: true,
  },
];

const valuePoints = [
  "Build stronger fundamentals",
  "Practice fake skin with more structure",
  "Understand styles before specializing",
  "Prepare a cleaner portfolio for shops",
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isHydrated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isHydrated, setLocation]);

  function openAuth() {
    if (isAuthenticated) {
      setLocation("/dashboard");
      return;
    }

    setAuthOpen(true);
  }

  if (!isHydrated) return null;

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.04),transparent_22%)]" />

        <section className="relative flex min-h-screen flex-col">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-6">
            <header className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                  <PenTool className="h-5 w-5 text-red-400" />
                </div>

                <div>
                  <p className="text-lg font-semibold text-white">InkPlan</p>
                  <p className="text-sm text-muted-foreground">
                    Apprenticeship prep for aspiring tattoo artists
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={openAuth}
                  className="text-white hover:bg-white/5 hover:text-white"
                >
                  {isAuthenticated ? "Dashboard" : "Sign In"}
                </Button>

                <Button
                  onClick={openAuth}
                  className="bg-red-600 text-white hover:bg-red-500"
                >
                  {isAuthenticated ? "Dashboard" : "Start Free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </header>

            <div className="flex flex-1 items-center">
              <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                    <BrainCircuit className="h-4 w-4 text-red-400" />
                    AI-guided apprenticeship preparation
                  </div>

                  <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
                    Build better tattoo habits before you step into a real shop.
                  </h1>

                  <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                    InkPlan helps aspiring tattoo artists build stronger
                    fundamentals, better practice habits, broader style
                    understanding, and a cleaner portfolio before approaching
                    apprenticeships.
                  </p>

                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {valuePoints.map((point) => (
                      <div
                        key={point}
                        className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300"
                      >
                        {point}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={openAuth}
                      className="bg-red-600 text-white hover:bg-red-500"
                    >
                      {isAuthenticated ? "Go to Dashboard" : "Start Free"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={openAuth}
                      className="border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white"
                    >
                      {isAuthenticated ? "Open Dashboard" : "Sign In"}
                    </Button>
                  </div>

                  <div className="mt-5 flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <p className="text-sm leading-6 text-zinc-300">
                      InkPlan is preparation for apprenticeship, not a
                      replacement for real mentorship in a real shop.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Card className="rounded-3xl border border-white/8 bg-card shadow-none">
                    <CardContent className="p-6">
                      <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white">
                        <Crown className="h-5 w-5 text-red-400" />
                        AI Tattoo Coach + premium path
                      </div>

                      <div className="space-y-3">
                        {teaserItems.map((item) => (
                          <div
                            key={item.title}
                            className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                          >
                            <div
                              className={
                                item.locked ? "blur-[2px] opacity-80" : ""
                              }
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-medium text-white">
                                  {item.title}
                                </p>

                                {item.locked ? (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                                    <Lock className="h-3.5 w-3.5" />
                                    Locked
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                                    Included
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {item.description}
                              </p>
                            </div>

                            {item.locked && (
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/35">
                                <div className="rounded-full border border-white/10 bg-background px-4 py-2 text-sm font-medium text-white shadow-sm">
                                  Upgrade later to unlock
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
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
