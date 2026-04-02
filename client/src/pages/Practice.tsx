import Layout from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const practicePrompts = [
  "Draw a dagger piercing a heart with a banner that says 'MOM' using only black ink.",
  "Build a strong traditional rose using only clear shape language and bold contrast.",
  "Sketch a snake wrapping around a dagger with readable flow and balanced spacing.",
  "Create a black and grey skull study focused on light source and clean value separation.",
  "Design a panther head with aggressive movement and simple, powerful silhouettes.",
  "Practice a script nameplate with supporting flourishes that stay readable at tattoo scale.",
];

const defaultStyles = ["Traditional", "Black & Grey", "Japanese", "Lettering"];
const defaultFocuses = ["Linework", "Shading", "Composition", "Flash Redraw"];

type ProgressMap = Record<string, number>;

function getQueryParams() {
  if (typeof window === "undefined") {
    return {
      style: "",
      focus: "",
      duration: "",
      prompt: "",
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    style: params.get("style") || "",
    focus: params.get("focus") || "",
    duration: params.get("duration") || "",
    prompt: params.get("prompt") || "",
  };
}

export default function Practice() {
  const [location] = useLocation();

  const [duration, setDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);

  const [selectedStyle, setSelectedStyle] = useState(defaultStyles[0]);
  const [selectedFocus, setSelectedFocus] = useState(defaultFocuses[0]);
  const [customPrompt, setCustomPrompt] = useState("");

  const [styleOptions, setStyleOptions] = useState(defaultStyles);
  const [focusOptions, setFocusOptions] = useState(defaultFocuses);

  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const stored = localStorage.getItem("inkplan_progress");
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch {
        setProgress({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inkplan_progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const query = getQueryParams();

    if (query.style) {
      setSelectedStyle(query.style);
      setStyleOptions((prev) =>
        prev.includes(query.style) ? prev : [...prev, query.style],
      );
    }

    if (query.focus) {
      setSelectedFocus(query.focus);
      setFocusOptions((prev) =>
        prev.includes(query.focus) ? prev : [...prev, query.focus],
      );
    }

    if (query.duration) {
      const parsedDuration = Number(query.duration);
      if (
        !Number.isNaN(parsedDuration) &&
        parsedDuration >= 1 &&
        parsedDuration <= 60
      ) {
        setDuration(parsedDuration);
        setTimeLeft(parsedDuration * 60);
      }
    }

    if (query.prompt) {
      setCustomPrompt(query.prompt);
    } else {
      setCustomPrompt("");
    }

    setIsActive(false);
  }, [location]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleTimer = () => setIsActive((prev) => !prev);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (val: number[]) => {
    const nextDuration = val[0];
    setDuration(nextDuration);
    setTimeLeft(nextDuration * 60);
    setIsActive(false);
  };

  const handleNewPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % practicePrompts.length);
    setCustomPrompt("");
  };

  const completeSession = () => {
    const hours = duration / 60;

    setProgress((prev) => ({
      ...prev,
      [selectedStyle]: (prev[selectedStyle] || 0) + hours,
    }));

    resetTimer();
  };

  const progressPercent = useMemo(() => {
    const total = duration * 60;
    if (total <= 0) return 0;
    return ((total - timeLeft) / total) * 100;
  }, [duration, timeLeft]);

  const activePrompt = customPrompt || practicePrompts[promptIndex];
  const cameFromDrill =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("style");

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-8 py-8">
        <section className="flex flex-col items-start justify-between gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2"
            >
              {styleOptions.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>

            <select
              value={selectedFocus}
              onChange={(e) => setSelectedFocus(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2"
            >
              {focusOptions.map((focus) => (
                <option key={focus} value={focus}>
                  {focus}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm font-mono text-muted-foreground">
            {selectedStyle} • {selectedFocus}
          </div>
        </section>

        {cameFromDrill ? (
          <Card className="rounded-3xl border-primary/20 bg-primary/5 shadow-none">
            <CardContent className="flex items-start gap-3 p-5">
              <LinkIcon className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">
                  Practice loaded from a style drill
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your style, focus, duration, and prompt were preselected from
                  the study page. You can still customize this session before
                  you start.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {styleOptions.map((style) => (
            <Card key={style}>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">{style}</p>
                <p className="text-xl font-bold">
                  {(progress[style] || 0).toFixed(1)} hrs
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="relative overflow-hidden rounded-3xl border shadow-xl">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <CardContent className="space-y-10 p-8 text-center md:p-10">
            <div className="font-mono text-7xl font-bold text-primary md:text-8xl">
              {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={toggleTimer} size="lg">
                {isActive ? <Pause /> : <Play />}
              </Button>

              <Button onClick={resetTimer} variant="outline">
                <RotateCcw />
              </Button>
            </div>

            <div className="mx-auto max-w-md space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Duration</span>
                <span className="text-muted-foreground">{duration} min</span>
              </div>

              <Slider
                value={[duration]}
                onValueChange={handleDurationChange}
                max={60}
                min={1}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-mono text-muted-foreground">
              PRACTICE PROMPT
            </p>
            <p>{activePrompt}</p>
            <Button variant="outline" onClick={handleNewPrompt}>
              New Prompt
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="font-bold">Self Check</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Does it read clearly?</li>
              <li>• Are lines confident?</li>
              <li>• Is composition balanced?</li>
            </ul>
          </CardContent>
        </Card>

        <Button className="h-14 w-full text-lg" onClick={completeSession}>
          <CheckCircle className="mr-2" />
          Mark Session Complete
        </Button>
      </div>
    </Layout>
  );
}
