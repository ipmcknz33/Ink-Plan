import Layout from "@/components/Layout";
import AICoachPanel from "../components/AICoachPanel";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Lesson = {
  lessonKey: string;
  title: string;
  description: string;
  image: string;
  practiceHref: string;
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
    practiceHref: "/practice?focus=Readability",
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
    practiceHref: "/practice?focus=Shape%20Language",
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
    practiceHref: "/practice?focus=Flow",
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
    updatedAt: Date.now(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export default function FundamentalsPage() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            className="rounded-2xl"
            onClick={() => setLocation("/library")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Guided Fundamentals
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Fundamentals
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Learn core tattoo design principles first. Each lesson now
                connects directly to your AI coach so the guidance feels tied to
                what you’re actively studying.
              </p>
            </div>

            <div className="grid gap-5">
              {lessons.map((lesson) => (
                <Card
                  key={lesson.lessonKey}
                  className="overflow-hidden rounded-3xl border-white/10 bg-card"
                >
                  <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
                    <div className="min-h-[240px] bg-zinc-950">
                      <img
                        src={lesson.image}
                        alt={lesson.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <CardContent className="flex flex-col justify-between p-5 sm:p-6">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {lesson.title}
                        </h2>
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

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                          className="rounded-2xl"
                          variant="secondary"
                          onClick={() => saveLessonContext(lesson)}
                        >
                          Coach me on this lesson
                        </Button>

                        <Button
                          className="rounded-2xl"
                          onClick={() => {
                            saveLessonContext(lesson);
                            setLocation(lesson.practiceHref);
                          }}
                        >
                          Practice this focus
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="xl:sticky xl:top-6 xl:self-start"></div>
        </div>
      </div>
    </Layout>
  );
}
