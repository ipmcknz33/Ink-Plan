import Layout from "@/components/Layout";
import AICoachPanel from "@/components/AICoachPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import {
  ensureTrialStarted,
  getAccessPhase,
  getTrialDaysLeftLabel,
  type AccessPhase,
} from "@/lib/access";

type StyleItem = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const STYLE_IMAGE_MAP: Record<string, string> = {
  "fine-line": "/images/reference/fineline/fineline-cover.png",
  blackwork: "/images/reference/blackwork/blackwork-cover-img.png",
  traditional: "/images/reference/traditional/traditional-cover.png",
  lettering: "/images/reference/lettering/letter-cover.png",
  "black-grey": "/images/reference/black-grey/black&grey-cover.png",
  japanese: "/images/reference/japanese/jap-trad-cover.png",
  chicano: "/images/reference/chicano/chicano-cover.png",
  "japanese-realism":
    "/images/reference/japanese-realism/japanese-realism-cover.png",
  geometric: "/images/reference/geometric/geometric-cover.png",
  biomechanical: "/images/reference/biomechanical/biomechanical-cover.png",
  polynesian: "/images/reference/polynesian/polynesian-cover.png",
  "color-realism": "/images/reference/color-realism/color-realism-cover.png",
  surrealism: "/images/reference/surrealism/surrealism-cover.png",
  watercolor: "/images/reference/watercolor/watercolor-cover.png",
};

const STYLES: StyleItem[] = [
  {
    id: "fine-line",
    name: "Fine Line",
    description:
      "Clean precision, spacing control, delicate structure, and disciplined hand-drawn repetition.",
    image: STYLE_IMAGE_MAP["fine-line"],
  },
  {
    id: "blackwork",
    name: "Blackwork",
    description:
      "Bold shape language, contrast, clarity, and stronger visual confidence.",
    image: STYLE_IMAGE_MAP["blackwork"],
  },
  {
    id: "traditional",
    name: "Traditional",
    description:
      "Strong silhouettes, bold readability, classic structure, and timeless tattoo fundamentals.",
    image: STYLE_IMAGE_MAP["traditional"],
  },
  {
    id: "lettering",
    name: "Lettering",
    description:
      "Letter balance, spacing, rhythm, and cleaner hand-drawn word structure.",
    image: STYLE_IMAGE_MAP["lettering"],
  },
  {
    id: "black-grey",
    name: "Black & Grey Realism",
    description:
      "Value control, softness, patience, observation, and stronger rendering discipline.",
    image: STYLE_IMAGE_MAP["black-grey"],
  },
  {
    id: "japanese",
    name: "Japanese Traditional",
    description:
      "Flow, movement, motif discipline, and stronger large-form composition thinking.",
    image: STYLE_IMAGE_MAP["japanese"],
  },
  {
    id: "chicano",
    name: "Chicano",
    description:
      "Lettering rhythm, black-and-grey storytelling, and respect for stylistic identity.",
    image: STYLE_IMAGE_MAP["chicano"],
  },
  {
    id: "japanese-realism",
    name: "Japanese Realism",
    description:
      "Advanced realism control mixed with movement, motif structure, and storytelling flow.",
    image: STYLE_IMAGE_MAP["japanese-realism"],
  },
  {
    id: "geometric",
    name: "Geometric",
    description:
      "Precision, repeatability, symmetry, spacing, and measured visual structure.",
    image: STYLE_IMAGE_MAP["geometric"],
  },
  {
    id: "biomechanical",
    name: "Biomechanical",
    description:
      "Complex construction, texture logic, and advanced form-building discipline.",
    image: STYLE_IMAGE_MAP["biomechanical"],
  },
  {
    id: "polynesian",
    name: "Polynesian",
    description:
      "Pattern discipline, placement structure, and cultural respect in design study.",
    image: STYLE_IMAGE_MAP["polynesian"],
  },
  {
    id: "color-realism",
    name: "Color Realism",
    description:
      "Advanced color control, value relationships, rendering accuracy, and patience.",
    image: STYLE_IMAGE_MAP["color-realism"],
  },
  {
    id: "surrealism",
    name: "Surrealism",
    description:
      "Concept-driven imagery, symbolism, imagination, and unusual composition thinking.",
    image: STYLE_IMAGE_MAP["surrealism"],
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description:
      "Soft transitions, painterly movement, restraint, and controlled visual flow.",
    image: STYLE_IMAGE_MAP["watercolor"],
  },
];

const STYLE_COACH_OPTIONS: any[] = [
  {
    id: "start-fine-line",
    label: "What should I focus on first in Fine Line?",
    answer:
      "Start with clean line control, spacing, and redraw repetition. Keep your first reps hand drawn, use simple subjects, and focus on consistency before complexity.",
  },
  {
    id: "study-blackwork",
    label: "How do I practice Blackwork by hand without rushing?",
    answer:
      "Use bold simple shapes first. Practice filling evenly, controlling edges, and keeping negative space intentional. Do not jump into complex ornamental layouts too early.",
  },
  {
    id: "portfolio-binder",
    label: "What should I put in my first portfolio binder?",
    answer:
      "Lead with your cleanest hand-drawn pages: Fine Line studies, Blackwork studies, simple flash redraws, lettering practice, and repeated subject pages that show discipline.",
  },
  {
    id: "avoid-copying",
    label: "How do I study styles without copying tattoos line for line?",
    answer:
      "Study the rules, not just the image. Observe shape language, spacing, line weight, flow, and composition. Then redraw original studies using those principles instead of cloning another artist’s tattoo.",
  },
  {
    id: "approach-shop",
    label: "How should I approach tattooing with more respect?",
    answer:
      "Keep your first layer focused on fundamentals, hand-drawn repetition, and humility. This app is preparation, not a replacement for apprenticeship, bloodborne training, or real-skin procedures.",
  },
  {
    id: "next-step",
    label: "What should I study next after trial?",
    answer:
      "After Fine Line and Blackwork, move into Traditional and Lettering. Those styles sharpen readability, spacing, structure, and stronger design discipline before advanced styles.",
  },
];

function getAvailableStyles(phase: AccessPhase): StyleItem[] {
  if (phase === "subscribed") {
    return STYLES.filter((style) =>
      ["fine-line", "blackwork", "traditional", "lettering"].includes(style.id),
    );
  }

  if (phase === "trial") {
    return STYLES.filter((style) =>
      ["fine-line", "blackwork"].includes(style.id),
    );
  }

  return [];
}

function getStarterLockedPreviewStyles(phase: AccessPhase): StyleItem[] {
  if (phase === "subscribed") {
    return [];
  }

  return STYLES.filter((style) =>
    ["traditional", "lettering"].includes(style.id),
  );
}

function getAdvancedLockedPreviewStyles(): StyleItem[] {
  return STYLES.filter(
    (style) =>
      !["fine-line", "blackwork", "traditional", "lettering"].includes(
        style.id,
      ),
  );
}

function StyleCard({
  style,
  locked,
  onClick,
}: {
  style: StyleItem;
  locked: boolean;
  onClick: () => void;
}) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-white/8 bg-card shadow-none transition-colors hover:border-red-500/30">
      <div className="relative h-48 w-full overflow-hidden bg-white/[0.03]">
        <img
          src={style.image}
          alt={style.name}
          className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] ${
            locked ? "opacity-55 grayscale-[20%]" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

        {locked ? (
          <div className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white">
            <Lock className="h-3.5 w-3.5" />
            Locked
          </div>
        ) : null}
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{style.name}</h3>
          <p className="text-sm leading-6 text-zinc-400">{style.description}</p>
        </div>

        <Button
          onClick={onClick}
          variant={locked ? "outline" : "default"}
          className="w-full gap-2"
        >
          {locked ? "Unlock Style" : "Open Style"}
          {locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function StylesList() {
  const [, setLocation] = useLocation();

  ensureTrialStarted();

  const phase = getAccessPhase();
  const trialLabel = getTrialDaysLeftLabel();

  const availableStyles = getAvailableStyles(phase);
  const starterLockedPreviewStyles = getStarterLockedPreviewStyles(phase);
  const advancedLockedPreviewStyles = getAdvancedLockedPreviewStyles();

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/8 bg-card shadow-none">
          <div className="space-y-4 p-5 sm:p-6">
            <div>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                Styles
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">
                Study styles in the right order. InkPlan is here to help you
                build stronger fundamentals, better style awareness, and a
                cleaner beginner portfolio. It is not a replacement for a real
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
            <h2 className="text-xl font-semibold text-white">Available now</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Trial users see Fine Line and Blackwork. Subscription opens
              Traditional and Lettering next.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {availableStyles.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                locked={false}
                onClick={() => setLocation(`/styles/${style.id}`)}
              />
            ))}
          </div>
        </section>

        {starterLockedPreviewStyles.length > 0 ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Opens with subscription
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Traditional and Lettering are the next layer after the trial
                foundation.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {starterLockedPreviewStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  locked={true}
                  onClick={() => setLocation("/upgrade")}
                />
              ))}
            </div>
          </section>
        ) : null}

        {advancedLockedPreviewStyles.length > 0 ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Later advanced styles
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Keep the path visible without overwhelming the first stage.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {advancedLockedPreviewStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  locked={true}
                  onClick={() => setLocation("/upgrade")}
                />
              ))}
            </div>
          </section>
        ) : null}

        <AICoachPanel title="AI Style Coach" pageContext="styles" />
      </div>
    </Layout>
  );
}
