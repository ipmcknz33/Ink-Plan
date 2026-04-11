import Layout from "@/components/Layout";
import AICoachPanel from "@/components/AICoachPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Lock } from "lucide-react";
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

type AccessCardItem = {
  id: string;
  badge: string;
  title: string;
  description: string;
  locked: boolean;
  route: string;
  cta: string;
};

const LIBRARY_COACH_OPTIONS: any[] = [
  {
    id: "study-trial-packs",
    label: "What should I study first in the trial packs?",
    answer:
      "Start with Fine Line and Blackwork. Focus on shape language, spacing, line confidence, and what makes a design readable before trying to make anything advanced.",
  },
  {
    id: "use-reference-packs",
    label: "How should I use reference packs the right way?",
    answer:
      "Study the rules, not just the image. Look at silhouette, spacing, line weight, contrast, and flow. Then redraw original studies using those principles instead of copying tattoos line for line.",
  },
  {
    id: "after-trial-study",
    label: "What should I study after trial?",
    answer:
      "Traditional and Lettering are the next best step after trial. They build readability, spacing, structure, and stronger beginner design discipline.",
  },
  {
    id: "premium-layer",
    label: "What does premium open in the library?",
    answer:
      "Premium opens the rest of the style library so you can study Black & Grey, Japanese, Chicano, Japanese Realism, Geometric, Biomechanical, Polynesian, Color Realism, Surrealism, and Watercolor in a structured way.",
  },
];

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

function getAccessCards(phase: AccessPhase): AccessCardItem[] {
  const subscriberUnlocked = phase === "subscribed";
  const premiumUnlocked = phase === "subscribed";

  return [
    {
      id: "trial",
      badge: "Trial",
      title: "Fine Line + Blackwork",
      description:
        "The first layer stays focused on Fine Line and Blackwork starter packs so beginners build cleaner habits without too much noise.",
      locked: phase === "expired",
      route: phase === "expired" ? "/upgrade" : "/library/reference-packs",
      cta: phase === "expired" ? "Unlock Trial Access" : "Open Trial Packs",
    },
    {
      id: "subscriber",
      badge: "Subscription",
      title: "Traditional + Lettering",
      description:
        "Subscription opens Traditional and Lettering next. These sharpen readability, spacing, structure, and stronger design discipline.",
      locked: !subscriberUnlocked,
      route: subscriberUnlocked ? "/library/reference-packs" : "/upgrade",
      cta: subscriberUnlocked ? "Open Subscriber Packs" : "Unlock Subscription",
    },
    {
      id: "premium",
      badge: "Premium",
      title: "Advanced Style Library",
      description:
        "Premium opens the rest of the styles, including Black & Grey, Japanese, Chicano, Japanese Realism, Geometric, Biomechanical, Polynesian, Color Realism, Surrealism, and Watercolor.",
      locked: !premiumUnlocked,
      route: premiumUnlocked ? "/library/reference-packs" : "/upgrade",
      cta: premiumUnlocked ? "Open Premium Library" : "Unlock Premium",
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

function AccessCard({
  item,
  onClick,
}: {
  item: AccessCardItem;
  onClick: () => void;
}) {
  return (
    <Card className="rounded-2xl border border-white/8 bg-card shadow-none">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">
            <BookOpen className="h-3.5 w-3.5" />
            {item.badge}
          </div>

          {item.locked ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white">
              <Lock className="h-3.5 w-3.5" />
              Locked
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          <p className="text-sm leading-6 text-zinc-400">{item.description}</p>
        </div>

        <Button
          onClick={onClick}
          variant={item.locked ? "outline" : "default"}
          className="w-full gap-2"
        >
          {item.cta}
          {item.locked ? (
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
  const accessCards = getAccessCards(phase);

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
                strengthen your fundamentals and prepare you more respectfully
                for real mentorship. It is not a replacement for a real
                apprenticeship.
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
              Reference Packs is the main study hub. Flash Studies and
              Fundamentals support the learning path without overloading it.
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

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Reference Pack access path
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Trial opens Fine Line and Blackwork first. Subscription unlocks
              Traditional and Lettering. Premium opens the rest of the style
              library.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {accessCards.map((item) => (
              <AccessCard
                key={item.id}
                item={item}
                onClick={() => setLocation(item.route)}
              />
            ))}
          </div>
        </section>

        <AICoachPanel title="AI Library Coach" pageContext="library" />
      </div>
    </Layout>
  );
}
