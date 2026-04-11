"use client";

import { useEffect, useMemo, useState } from "react";
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
    title: "3-day trial: Fine Line + Blackwork",
    description:
      "Start with the first layer only so users build stronger fundamentals without getting overwhelmed.",
  },
  {
    title: "Subscription unlocks Traditional + Lettering",
    description:
      "The next layer opens deeper style study, stronger design structure, and full reference pack access.",
    locked: true,
  },
  {
    title: "Advanced styles stay locked for now",
    description:
      "Higher-complexity study paths stay closed until later so the learning flow stays clear and focused.",
    locked: true,
  },
];

const valuePoints = [
  "Build stronger tattoo fundamentals",
  "Practice with more structure and intention",
  "Study multiple styles before specializing",
  "Prepare a cleaner portfolio for shops",
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isHydrated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const enableRecruiterPreview =
    String(import.meta.env.VITE_ENABLE_RECRUITER_PREVIEW).toLowerCase() ===
    "true";

  const previewHref = useMemo(() => {
    return "/dashboard";
  }, []);

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

  function handleRecruiterPreview() {
    setLocation(previewHref);
  }

  if (!isHydrated) return null;

  return (
    <>
      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.04),transparent_22%)]" />

        <section className="relative flex min-h-screen flex-col">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
            <header className="flex flex-col gap-3 py-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 sm:h-11 sm:w-11">
                    <PenTool className="h-5 w-5 text-red-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-base font-semibold text-white sm:text-lg">
                      InkPlan
                    </p>
                    <p className="max-w-[18rem] text-xs leading-5 text-muted-foreground sm:max-w-none sm:text-sm">
                      Apprenticeship prep for aspiring tattoo artists
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                {enableRecruiterPreview ? (
                  <Button
                    variant="ghost"
                    onClick={handleRecruiterPreview}
                    className="w-full justify-center text-white hover:bg-white/5 hover:text-white sm:w-auto"
                  >
                    Recruiter Preview
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={openAuth}
                    className="w-full justify-center text-white hover:bg-white/5 hover:text-white sm:w-auto"
                  >
                    {isAuthenticated ? "Dashboard" : "Sign In"}
                  </Button>
                )}

                <Button
                  onClick={openAuth}
                  className="w-full justify-center bg-red-600 text-white hover:bg-red-500 sm:w-auto"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start 3-Day Trial"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </header>

            <div className="flex flex-1 items-center py-6 sm:py-8">
              <div className="grid w-full items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
                <div className="min-w-0 max-w-2xl">
                  <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200 sm:px-4 sm:text-sm">
                    <BrainCircuit className="h-4 w-4 shrink-0 text-red-400" />
                    <span className="min-w-0 truncate sm:whitespace-normal">
                      AI-guided apprenticeship preparation
                    </span>
                  </div>

                  <h1 className="max-w-[15ch] text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
                    Build better tattoo habits before you step into a real shop.
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-7">
                    InkPlan gives aspiring tattoo artists a focused first layer:
                    a 3-day trial with Fine Line and Blackwork, guided practice,
                    stronger style awareness, and cleaner portfolio preparation
                    before approaching real apprenticeships.
                  </p>

                  <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-sm leading-6 text-zinc-300">
                      Start with the right foundation first. Trial users open
                      Fine Line and Blackwork. Subscription then unlocks
                      Traditional and Lettering with full reference pack viewing
                      and downloads.
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-2">
                    {valuePoints.map((point) => (
                      <div
                        key={point}
                        className="min-w-0 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300"
                      >
                        <span className="block break-words">{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                    <Button
                      size="lg"
                      onClick={openAuth}
                      className="w-full justify-center bg-red-600 text-white hover:bg-red-500 sm:w-auto"
                    >
                      {isAuthenticated
                        ? "Go to Dashboard"
                        : "Start 3-Day Trial"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {enableRecruiterPreview ? (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleRecruiterPreview}
                        className="w-full justify-center border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white sm:w-auto"
                      >
                        View Recruiter Preview
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={openAuth}
                        className="w-full justify-center border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white sm:w-auto"
                      >
                        {isAuthenticated ? "Open Dashboard" : "Sign In"}
                      </Button>
                    )}
                  </div>

                  <div className="mt-5 flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <p className="min-w-0 text-sm leading-6 text-zinc-300">
                      InkPlan is preparation for apprenticeship, not a
                      replacement for real mentorship in a real shop.
                    </p>
                  </div>
                </div>

                <div className="relative min-w-0">
                  <Card className="rounded-3xl border border-white/8 bg-card shadow-none">
                    <CardContent className="p-4 sm:p-6">
                      <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white">
                        <Crown className="h-5 w-5 shrink-0 text-red-400" />
                        <span className="min-w-0 break-words">
                          Trial path + unlock flow
                        </span>
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
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="pr-0 font-medium text-white sm:pr-3">
                                  {item.title}
                                </p>

                                {item.locked ? (
                                  <span className="inline-flex w-fit items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                                    <Lock className="h-3.5 w-3.5" />
                                    Locked
                                  </span>
                                ) : (
                                  <span className="inline-flex w-fit items-center rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                                    Included in trial
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {item.description}
                              </p>
                            </div>

                            {item.locked && (
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/35 px-3">
                                <div className="rounded-full border border-white/10 bg-background px-4 py-2 text-center text-xs font-medium text-white shadow-sm sm:text-sm">
                                  Opens after subscription
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/8 p-4">
                        <p className="text-sm leading-6 text-zinc-300">
                          Keep the first stage simple. Trial should open only
                          the styles that help users build cleaner beginner
                          discipline first, then unlock more depth later.
                        </p>
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
