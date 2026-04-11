import Layout from "@/components/Layout";
import AICoachPanel from "@/components/AICoachPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { useLocation } from "wouter";
import {
  ensureTrialStarted,
  getAccessPhase,
  getTrialDaysLeftLabel,
  type AccessPhase,
} from "@/lib/access";

type LibrarySection = {
  id: string;
  title: string;
  description: string;
  route: string;
  locked: boolean;
  cta: string;
};

function getLibrarySections(phase: AccessPhase): LibrarySection[] {
  const referencePacksLocked = phase === "expired";

  return [
    {
      id: "reference-packs",
      title: "Reference Packs",
      description:
        "Study curated style references by tier. Trial opens Fine Line and Blackwork. Subscription opens Traditional and Lettering. Premium opens the rest of the style library.",
      route: referencePacksLocked ? "/upgrade" : "/library/reference-packs",
      locked: referencePacksLocked,
      cta: referencePacksLocked
        ? "Unlock Reference Packs"
        : "Open Reference Packs",
    },
    {
      id: "flash-studies",
      title: "Flash Studies",
      description:
        "Train observation, redraw discipline, spacing, and stronger style awareness through guided flash study.",
      route: "/library/flash-studies",
      locked: false,
      cta: "Open Flash Studies",
    },
    {
      id: "fundamentals",
      title: "Fundamentals",
      description:
        "Build beginner structure through hand-drawn repetition, visual analysis, cleaner line habits, and stronger study order.",
      route: "/library/fundamentals",
      locked: false,
      cta: "Open Fundamentals",
    },
  ];
}

function SectionCard({
  section,
  onClick,
}: {
  section: LibrarySection;
  onClick: () => void;
}) {
  return (
    <Card className="group rounded-2xl border border-white/8 bg-card shadow-none transition-colors hover:border-red-500/30">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              {section.title}
            </h3>
            <p className="text-sm leading-6 text-zinc-400">
              {section.description}
            </p>
          </div>

          {section.locked ? (
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white">
              <Lock className="h-3.5 w-3.5" />
              Locked
            </div>
          ) : null}
        </div>

        <Button
          onClick={onClick}
          variant={section.locked ? "outline" : "default"}
          className="w-full gap-2"
        >
          {section.cta}
          {section.locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Library() {
  const [, setLocation] = useLocation();

  ensureTrialStarted();

  const phase = getAccessPhase();
  const trialLabel = getTrialDaysLeftLabel();

  const librarySections = getLibrarySections(phase);

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/8 bg-card shadow-none">
          <div className="space-y-4 p-5 sm:p-6">
            <div>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                Library
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">
                Build stronger visual knowledge through reference study, redraw
                discipline, and better beginner sequencing. InkPlan is here to
                strengthen your fundamentals and prepare you for real
                mentorship. It is not a replacement for apprenticeship.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">
                {phase === "subscribed"
                  ? "Subscription active"
                  : phase === "trial"
                    ? `3-day trial active • ${trialLabel}`
                    : "Trial ended • subscribe to continue"}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Library sections
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Reference Packs is your main study hub. Flash Studies and
              Fundamentals support your learning without overloading you.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {librarySections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onClick={() => setLocation(section.route)}
              />
            ))}
          </div>
        </section>

        <AICoachPanel title="AI Library Coach" pageContext="library" />
      </div>
    </Layout>
  );
}
