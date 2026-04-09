import Layout from "@/components/Layout";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Lesson = {
  lessonKey: string;
  title: string;
  description: string;
  image: string;
  whatToLookFor: string[];
  whatToAvoid: string[];
};

const STORAGE_KEY = "inkplan_ai_context";
const EVENT_NAME = "inkplan-ai-context-updated";

const lessons: Lesson[] = [
  {
    lessonKey: "readability",
    title: "Readability",
    description: "Design should read clearly from a distance.",
    image: "/images/linework-1.jpg",
    whatToLookFor: [
      "Clear focal point",
      "Strong silhouette",
      "Simple value grouping",
    ],
    whatToAvoid: [
      "Overcrowded detail",
      "Weak outer shape",
      "Too many competing focal areas",
    ],
  },
  {
    lessonKey: "shape-language",
    title: "Shape Language",
    description: "Strong shapes create strong tattoos.",
    image: "/images/linework-1.jpg",
    whatToLookFor: [
      "Big-to-small shape hierarchy",
      "Intentional repetition",
      "Confident primary forms",
    ],
    whatToAvoid: [
      "Random filler shapes",
      "All elements same size",
      "Messy secondary forms",
    ],
  },
  {
    lessonKey: "flow",
    title: "Flow",
    description: "Guide the viewer’s eye naturally.",
    image: "/images/linework-1.jpg",
    whatToLookFor: [
      "Directional rhythm",
      "Smooth visual movement",
      "Balanced spacing",
    ],
    whatToAvoid: [
      "Awkward tangents",
      "Dead visual zones",
      "Crowded turns and corners",
    ],
  },
];

function saveLessonContext(lesson: Lesson) {
  if (typeof window === "undefined") return;

  const payload = {
    source: "fundamentals" as const,
    lessonKey: lesson.lessonKey,
    title: lesson.title,
    description: lesson.description,
    focus: lesson.title,
    whatToLookFor: lesson.whatToLookFor,
    whatToAvoid: lesson.whatToAvoid,
    updatedAt: Date.now(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(EVENT_NAME));
}

function getSavedLessonKey() {
  if (typeof window === "undefined") return "";

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return "";

    const parsed = JSON.parse(raw) as { lessonKey?: string; source?: string };
    if (parsed.source !== "fundamentals") return "";

    return parsed.lessonKey ?? "";
  } catch {
    return "";
  }
}

export default function FundamentalsPage() {
  const [, setLocation] = useLocation();
  const [activeLessonKey, setActiveLessonKey] = useState(getSavedLessonKey());

  const activeLesson = useMemo(
    () =>
      lessons.find((lesson) => lesson.lessonKey === activeLessonKey) ?? null,
    [activeLessonKey],
  );

  function handleActivateLesson(lesson: Lesson) {
    saveLessonContext(lesson);
    setActiveLessonKey(lesson.lessonKey);
  }

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            className="gap-2 pl-0"
            onClick={() => setLocation("/library")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Fundamentals
          </div>
        </div>

        <section className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Fundamentals
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Master the basics before chasing complexity. This page is for study,
            not execution. Choose a lesson here and InkPlan can carry that
            context into the Practice page so the coach highlights what you were
            just learning.
          </p>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-primary">
            Practice Coach Link
          </p>

          {activeLesson ? (
            <div className="mt-3 space-y-2">
              <p className="text-lg font-semibold">
                Active lesson: {activeLesson.title}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                This lesson is now saved for the Practice page. The coach can
                use it as the current study context when the user moves into
                practice.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              No lesson is currently highlighted for Practice. Pick one below to
              set the active coaching context.
            </p>
          )}
        </section>

        <section className="grid gap-5">
          {lessons.map((lesson) => {
            const isActive = lesson.lessonKey === activeLessonKey;

            return (
              <Card
                key={lesson.lessonKey}
                className={`overflow-hidden rounded-3xl border shadow-sm ${
                  isActive ? "border-primary/40" : "border-white/10"
                }`}
              >
                <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
                  <div className="min-h-[220px] bg-zinc-950">
                    <img
                      src={lesson.image}
                      alt={lesson.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <CardContent className="flex flex-col justify-between p-5 sm:p-6">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold">
                          {lesson.title}
                        </h2>

                        {isActive ? (
                          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            <Check className="h-3.5 w-3.5" />
                            Active in Practice Coach
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                        {lesson.description}
                      </p>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <h3 className="mb-2 text-sm font-medium text-white">
                            What to look for
                          </h3>
                          <div className="space-y-2">
                            {lesson.whatToLookFor.map((item) => (
                              <p
                                key={item}
                                className="text-sm text-muted-foreground"
                              >
                                • {item}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <h3 className="mb-2 text-sm font-medium text-white">
                            What not to do
                          </h3>
                          <div className="space-y-2">
                            {lesson.whatToAvoid.map((item) => (
                              <p
                                key={item}
                                className="text-sm text-muted-foreground"
                              >
                                • {item}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        className="w-full rounded-2xl sm:w-auto"
                        variant={isActive ? "secondary" : "default"}
                        onClick={() => handleActivateLesson(lesson)}
                      >
                        {isActive
                          ? "Highlighted for Practice Coach"
                          : "Highlight in Practice Coach"}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </section>
      </div>
    </Layout>
  );
}
