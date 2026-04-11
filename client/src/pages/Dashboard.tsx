import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Folder, Lock } from "lucide-react";

import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AICoachPanel from "@/components/AICoachPanel";
import {
  ensureTrialStarted,
  getAccessPhase,
  getTrialDaysLeftLabel,
  type AccessPhase,
} from "@/lib/access";

const allStarterStyles = [
  {
    id: "fine-line",
    name: "Fine Line",
    description: "Practice restraint, spacing, and subtle control.",
    href: "/styles/fine-line",
    image: "/images/reference/fineline/fineline-cover.png",
  },
  {
    id: "blackwork",
    name: "Blackwork",
    description:
      "Learn contrast, graphic clarity, and stronger shape decisions.",
    href: "/styles/blackwork",
    image: "/images/reference/blackwork/blackwork-cover-img.png",
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Build clean structure, bold shape language, and readability.",
    href: "/styles/traditional",
    image: "/images/reference/traditional/trad-starter-pk-sh-1.png",
  },
  {
    id: "lettering",
    name: "Lettering",
    description: "Train spacing, rhythm, and clean line discipline.",
    href: "/styles/lettering",
    image: "/images/reference/lettering/letter-cover.png",
  },
];

const lockedNext = [
  "Black & Grey Realism",
  "Japanese Traditional",
  "Chicano",
  "Japanese Realism",
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [accessPhase, setAccessPhase] = useState<AccessPhase>("trial");
  const [trialLabel, setTrialLabel] = useState("3 days left");

  useEffect(() => {
    ensureTrialStarted();
    setAccessPhase(getAccessPhase());
    setTrialLabel(getTrialDaysLeftLabel());
  }, []);

  const visibleStarterStyles = useMemo(() => {
    if (accessPhase === "subscribed") return allStarterStyles;
    return allStarterStyles.slice(0, 2);
  }, [accessPhase]);

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/8 bg-card shadow-none">
          <div className="space-y-4 p-5 sm:p-6">
            <div>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                Start Here
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                Begin with the core styles that build the best beginner
                foundation. Keep your studies hand drawn, focus on clean lines,
                and build control before chasing advanced work.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">
                {accessPhase === "subscribed"
                  ? "Subscription active"
                  : accessPhase === "trial"
                    ? `3-day trial active • ${trialLabel}`
                    : "Trial ended • subscribe to continue"}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleStarterStyles.map((style) => (
                <Card
                  key={style.id}
                  onClick={() => setLocation(style.href)}
                  className="cursor-pointer overflow-hidden border-white/8 bg-white/[0.03] transition-colors hover:border-red-500/30"
                >
                  <div className="h-40 overflow-hidden bg-white/[0.03]">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <CardContent className="space-y-2 p-5">
                    <p className="text-lg font-semibold text-white">
                      {style.name}
                    </p>
                    <p className="text-sm leading-6 text-zinc-400">
                      {style.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <AICoachPanel title="AI Tattoo Coach" pageContext="dashboard" />

        <section className="rounded-3xl border border-white/8 bg-card shadow-none">
          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Build Your First Portfolio
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                Your first portfolio should be hand drawn only. No iPad. Focus
                on clean lines, repetition, strong shape control, and simple
                studies that show discipline instead of forcing complexity.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-white/8 bg-white/[0.03] shadow-none">
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-red-400" />
                    <p className="font-semibold text-white">Binder</p>
                  </div>
                  <p className="text-sm leading-6 text-zinc-400">
                    Simple, affordable, and perfect for a first portfolio. Good
                    for organizing repeated studies and early flash-based pages.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/8 bg-white/[0.03] shadow-none">
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-red-400" />
                    <p className="font-semibold text-white">Project Folder</p>
                  </div>
                  <p className="text-sm leading-6 text-zinc-400">
                    A cleaner presentation without rings. A good next step when
                    your work starts looking more organized and consistent.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/8 p-4">
              <p className="text-sm leading-7 text-zinc-300">
                Keep the early portfolio focused on hand-drawn studies, clean
                line control, repeated subject work, and respect for the
                fundamentals. This app is meant to help you approach the trade
                better prepared, not replace real apprenticeship.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              What opens up next
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
              After the first layer, the next step expands your style range and
              deepens how you study. Advanced access should feel earned, not
              overwhelming.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {accessPhase === "subscribed" ? (
              <>
                {lockedNext.map((item) => (
                  <Card
                    key={item}
                    className="relative overflow-hidden border-white/8 bg-white/[0.03] shadow-none"
                  >
                    <CardContent className="p-5 opacity-60">
                      <p className="text-base font-semibold text-white">
                        {item}
                      </p>
                    </CardContent>

                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background px-3 py-1 text-sm text-white">
                        <Lock className="h-4 w-4" />
                        Next level
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card
                  onClick={() => setLocation("/styles/traditional")}
                  className="cursor-pointer border-white/8 bg-white/[0.03] shadow-none transition-colors hover:border-red-500/30"
                >
                  <CardContent className="p-5">
                    <p className="text-base font-semibold text-white">
                      Traditional
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Opens with subscription after trial.
                    </p>
                  </CardContent>
                </Card>

                <Card
                  onClick={() => setLocation("/styles/lettering")}
                  className="cursor-pointer border-white/8 bg-white/[0.03] shadow-none transition-colors hover:border-red-500/30"
                >
                  <CardContent className="p-5">
                    <p className="text-base font-semibold text-white">
                      Lettering
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Opens with subscription after trial.
                    </p>
                  </CardContent>
                </Card>

                {lockedNext.slice(0, 2).map((item) => (
                  <Card
                    key={item}
                    className="relative overflow-hidden border-white/8 bg-white/[0.03] shadow-none"
                  >
                    <CardContent className="p-5 opacity-60">
                      <p className="text-base font-semibold text-white">
                        {item}
                      </p>
                    </CardContent>

                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background px-3 py-1 text-sm text-white">
                        <Lock className="h-4 w-4" />
                        Locked
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>

          {accessPhase !== "subscribed" ? (
            <Button
              type="button"
              onClick={() => setLocation("/upgrade")}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              View trial and subscription options
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </section>
      </div>
    </Layout>
  );
}
