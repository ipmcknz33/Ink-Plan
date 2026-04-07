import { useEffect, useMemo, useState } from "react";
import { Sparkles, ArrowRight, BookOpen, PenTool, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


type LessonContext = {
  source: "fundamentals" | "practice" | "library";
  lessonKey: string;
  title: string;
  description: string;
  focus?: string;
  updatedAt: number;
};

const STORAGE_KEY = "inkplan_ai_context";
const EVENT_NAME = "inkplan-ai-context-updated";

const fallbackCoachState = {
  eyebrow: "AI Tattoo Coach",
  title: "Ready when you are",
  message:
    "Pick a Fundamentals lesson and I’ll shift into lesson-specific guidance with what to look for, what to avoid, and what to practice next.",
  bullets: [
    "Choose a lesson to get focused coaching",
    "Keep your sessions simple and intentional",
    "Use repetition to improve consistency",
  ],
  cta: "Start with Fundamentals",
};

function getCoachResponse(context: LessonContext | null) {
  if (!context) {
    return fallbackCoachState;
  }

  const lessonKey = context.lessonKey.toLowerCase();

  if (lessonKey.includes("readability")) {
    return {
      eyebrow: "Fundamentals • Readability",
      title: "Make the tattoo read fast",
      message:
        "Your goal here is clarity before detail. If the viewer has to work too hard to understand the design, the tattoo usually loses impact on skin.",
      bullets: [
        "Check if the design still reads from a distance",
        "Prioritize strong silhouette over tiny details",
        "Remove lines or shapes that muddy the focal point",
      ],
      cta: "Practice cleaner readability",
    };
  }

  if (lessonKey.includes("shape")) {
    return {
      eyebrow: "Fundamentals • Shape Language",
      title: "Build stronger forms",
      message:
        "Strong tattoos are built from confident big shapes first. Small details only help when the main forms are already clear and balanced.",
      bullets: [
        "Use larger primary shapes before adding texture",
        "Avoid too many equally weighted forms",
        "Create contrast between major and minor elements",
      ],
      cta: "Practice stronger shapes",
    };
  }

  if (lessonKey.includes("flow")) {
    return {
      eyebrow: "Fundamentals • Flow",
      title: "Guide the eye naturally",
      message:
        "Flow is what keeps a tattoo moving. The viewer’s eye should travel through the design instead of getting stuck in one crowded area.",
      bullets: [
        "Use line direction to move the eye through the design",
        "Avoid awkward tangents and dead-end shapes",
        "Keep the composition moving with rhythm and spacing",
      ],
      cta: "Practice smoother flow",
    };
  }

  return {
    eyebrow: `Lesson • ${context.title}`,
    title: "Stay focused on the current lesson",
    message:
      context.description ||
      "Use this lesson as your anchor and refine one core visual principle at a time.",
    bullets: [
      "Focus on one improvement target",
      "Keep the design readable and intentional",
      "Refine before adding extra detail",
    ],
    cta: "Keep refining",
  };
}

function readContextFromStorage(): LessonContext | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LessonContext;
  } catch {
    return null;
  }
}

export default function AICoachPanel() {
  const [lessonContext, setLessonContext] = useState<LessonContext | null>(
    null,
  );

  useEffect(() => {
    const sync = () => {
      setLessonContext(readContextFromStorage());
    };

    sync();
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const coach = useMemo(() => getCoachResponse(lessonContext), [lessonContext]);

  return (
    <Card className="border-white/10 bg-gradient-to-br from-zinc-900 to-black text-white shadow-xl">
      <CardHeader className="pb-3">
        <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-300">
          <Sparkles className="h-3.5 w-3.5" />
          {coach.eyebrow}
        </div>

        <CardTitle className="text-xl sm:text-2xl">{coach.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-zinc-300 sm:text-base">
          {coach.message}
        </p>

        <div className="grid gap-3">
          {coach.bullets.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <div className="mt-0.5 rounded-full bg-white/10 p-2">
                <Target className="h-4 w-4 text-zinc-200" />
              </div>
              <p className="text-sm text-zinc-200">{item}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <BookOpen className="h-4 w-4" />
              Current Source
            </div>
            <p className="text-sm text-zinc-300">
              {lessonContext
                ? lessonContext.source
                : "Waiting for lesson selection"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <PenTool className="h-4 w-4" />
              Current Focus
            </div>
            <p className="text-sm text-zinc-300">
              {lessonContext?.title || "No lesson selected yet"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          className="w-full justify-between rounded-2xl"
          variant="secondary"
        >
          <span>{coach.cta}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
