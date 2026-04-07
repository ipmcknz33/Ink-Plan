import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "inkplan_ai_context";

type LessonContext = {
  lessonKey: string;
};

type Props = {
  style?: string;
  focus?: string;
};

function getCoach({
  lesson,
  style,
  focus,
}: {
  lesson?: string;
  style?: string;
  focus?: string;
}) {
  // 🔥 LINEWORK (MOST IMPORTANT)
  if (focus === "Linework") {
    return {
      title: "Linework Coaching",
      points: [
        "If your lines look like the bad examples, you're likely hesitating mid stroke.",
        "If you see spreading like the blowout images, you're going too deep.",
        "If your lines look faint like the shallow examples, you're not hitting the dermis.",
        "Focus on one clean pass — not correcting lines after.",
      ],
    };
  }

  // 🔥 SHADING
  if (focus === "Shading") {
    return {
      title: "Shading Coaching",
      points: [
        "If your shading looks patchy, you're not building value evenly.",
        "If it looks muddy, you're overworking the same area.",
        "Compare your work to the examples — aim for clear value separation.",
      ],
    };
  }

  // 🔥 LESSON BASED
  if (lesson?.includes("readability")) {
    return {
      title: "Readability Check",
      points: [
        "If the design feels confusing, simplify before adding detail.",
        "Look at your work from a distance — does it read clearly?",
      ],
    };
  }

  if (lesson?.includes("flow")) {
    return {
      title: "Flow Check",
      points: [
        "If your eye gets stuck in one area, your flow is off.",
        "Adjust spacing and direction to guide movement.",
      ],
    };
  }

  // DEFAULT
  return {
    title: "Practice Coaching",
    points: [
      "Compare your work to the examples on this page.",
      "Identify one mistake and fix it — don’t try to fix everything.",
      "Clean execution beats more reps.",
    ],
  };
}

export default function AICoachPanel({ style, focus }: Props) {
  const [lesson, setLesson] = useState<string | undefined>();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setLesson(parsed.lessonKey);
      } catch {}
    }
  }, []);

  const coach = useMemo(() => {
    return getCoach({ lesson, style, focus });
  }, [lesson, style, focus]);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-4 w-4" />
          {coach.title}
        </div>

        {coach.points.map((p) => (
          <p key={p} className="text-sm text-muted-foreground">
            • {p}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
