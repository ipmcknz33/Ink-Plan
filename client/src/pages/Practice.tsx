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
  Target,
  Eye,
  AlertTriangle,
} from "lucide-react";
import AICoachPanel, { type CoachOption } from "../components/AICoachPanel";

const defaultStyles = ["Traditional", "Black & Grey", "Japanese", "Lettering"];
const defaultFocuses = ["Linework", "Shading", "Composition"];

function getQueryParams() {
  if (typeof window === "undefined") {
    return {
      style: "",
      focus: "",
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    style: params.get("style") || "",
    focus: params.get("focus") || "",
  };
}

type ExampleSection = {
  title: string;
  description: string;
  images: {
    src: string;
    alt: string;
  }[];
};

type ExampleContent = {
  focusTitle: string;
  focusPoints: string[];
  avoidPoints: string[];
  examples: ExampleSection[];
};

const sharedShadingExamples: ExampleSection[] = [
  {
    title: "Blotchy / patchy shading",
    description:
      "These examples show inconsistent saturation and uneven fill caused by poor control and rushed passes.",
    images: [
      {
        src: "/images/shading-blotchy-1.jpg",
        alt: "Blotchy shading example 1",
      },
      {
        src: "/images/shading-blotchy-2.jpg",
        alt: "Blotchy shading example 2",
      },
      {
        src: "/images/shading-blotchy-3.jpg",
        alt: "Blotchy shading example 3",
      },
    ],
  },
  {
    title: "Flat / one tone shading",
    description:
      "These examples show weak value separation where everything sits at the same tone and loses depth.",
    images: [
      {
        src: "/images/shading-flat-1.jpg",
        alt: "Flat shading example 1",
      },
      {
        src: "/images/shading-flat-2.jpg",
        alt: "Flat shading example 2",
      },
      {
        src: "/images/shading-flat-3.jpg",
        alt: "Flat shading example 3",
      },
    ],
  },
  {
    title: "Uneven / dirty gradients",
    description:
      "These examples show rough transitions, streaky fades, and gradients that do not flow cleanly.",
    images: [
      {
        src: "/images/shading-gradient-1.jpg",
        alt: "Uneven gradient example 1",
      },
      {
        src: "/images/shading-gradient-2.jpg",
        alt: "Uneven gradient example 2",
      },
      {
        src: "/images/shading-gradient-3.jpg",
        alt: "Uneven gradient example 3",
      },
    ],
  },
];

export default function Practice() {
  const [location] = useLocation();

  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60);

  const [selectedStyle, setSelectedStyle] = useState(defaultStyles[0]);
  const [selectedFocus, setSelectedFocus] = useState(defaultFocuses[0]);

  useEffect(() => {
    const query = getQueryParams();

    if (query.style) setSelectedStyle(query.style);
    if (query.focus) setSelectedFocus(query.focus);
  }, [location]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive((prev) => !prev);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(10 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const coachOptions = useMemo<CoachOption[]>(() => {
    if (selectedFocus === "Linework") {
      return [
        {
          id: "linework-1",
          label: "What should I focus on first?",
          answer:
            "Start with clean, confident passes. Focus on steadiness, consistent depth, and not retracing lines over and over.",
        },
        {
          id: "linework-2",
          label: "What am I trying to avoid here?",
          answer:
            "Watch for shaky lines, wobble, hesitation, weak saturation, and depth mistakes like going too shallow or too deep.",
        },
        {
          id: "linework-3",
          label: "How do these examples help me?",
          answer:
            "These references train your eye. You should be able to spot weak line confidence, faded shallow work, and blowout discoloration before you move into cleaner reps.",
        },
      ];
    }

    if (selectedFocus === "Shading") {
      return [
        {
          id: "shading-1",
          label: "What matters most in shading?",
          answer:
            "Focus on smooth value control, clean transitions, and making sure shading supports the design instead of muddying it.",
        },
        {
          id: "shading-2",
          label: "What should I avoid?",
          answer:
            "Avoid patchy fill, flat one-tone shading, and dirty gradients that make the design feel muddy or unfinished.",
        },
        {
          id: "shading-3",
          label: "How should I practice shading?",
          answer:
            "Keep the session narrow. Work on one fade type at a time, compare your values clearly, and do not try to finish everything in one pass.",
        },
      ];
    }

    return [
      {
        id: "composition-1",
        label: "What matters most in composition?",
        answer:
          "Clarity comes first. A design should read at a glance, have a clear focal area, and not feel crowded or confused.",
      },
      {
        id: "composition-2",
        label: "What should I avoid?",
        answer:
          "Avoid weak hierarchy, overcrowding, and adding detail before the layout works.",
      },
      {
        id: "composition-3",
        label: "How should I use this page?",
        answer:
          "Use this page to train your eye and your decisions. Study what weakens a tattoo, then practice with one clear goal instead of trying to fix everything at once.",
      },
    ];
  }, [selectedFocus]);

  const practiceContent = useMemo<ExampleContent>(() => {
    if (selectedStyle === "Traditional" && selectedFocus === "Linework") {
      return {
        focusTitle: "Traditional Linework",
        focusPoints: [
          "Use bold, confident lines with intentional spacing.",
          "Keep line weight choices consistent across the design.",
          "Pull each line in one clean pass whenever possible.",
        ],
        avoidPoints: [
          "Going back over lines multiple times.",
          "Mixing thin and bold lines randomly.",
          "Letting corners and curves get hesitant.",
        ],
        examples: [
          {
            title: "Bad line quality",
            description:
              "These examples show weak line confidence, hesitation, and uneven execution.",
            images: [
              {
                src: "/images/bad-linework-ai-1.jpg",
                alt: "Traditional bad linework example 1",
              },
              {
                src: "/images/bad-linework-ai-2.jpg",
                alt: "Traditional bad linework example 2",
              },
            ],
          },
          {
            title: "Too shallow / too light",
            description:
              "These examples show lines that healed weak because they did not settle properly into the dermis.",
            images: [
              {
                src: "/images/traditional-too-light-tattoo-example1.jpg",
                alt: "Traditional too light tattoo example 1",
              },
              {
                src: "/images/traditional-too-shallow-tattoo-example-2.jpg",
                alt: "Traditional too shallow tattoo example 2",
              },
              {
                src: "/images/traditional-too-shallow-tattoo-example-3.jpg",
                alt: "Traditional too shallow tattoo example 3",
              },
            ],
          },
          {
            title: "Blowout (too deep)",
            description:
              "These examples show what can happen when the needle goes too deep and ink spreads under the skin.",
            images: [
              {
                src: "/images/Traditional-blowout-example-1.jpg",
                alt: "Traditional blowout example 1",
              },
              {
                src: "/images/Traditional-blowout-example-2.jpg",
                alt: "Traditional blowout example 2",
              },
              {
                src: "/images/traditional-blowout-example-3.jpg",
                alt: "Traditional blowout example 3",
              },
            ],
          },
        ],
      };
    }

    if (selectedStyle === "Traditional" && selectedFocus === "Shading") {
      return {
        focusTitle: "Traditional Shading",
        focusPoints: [
          "Keep black and grey groupings readable and intentional.",
          "Use shading to support the design, not overpower the outline.",
          "Think in simple value blocks before soft transitions.",
        ],
        avoidPoints: [
          "Turning everything muddy and overworked.",
          "Letting shading bury the main outline.",
          "Making every area the same value.",
        ],
        examples: sharedShadingExamples,
      };
    }

    if (selectedStyle === "Black & Grey" && selectedFocus === "Linework") {
      return {
        focusTitle: "Black & Grey Linework",
        focusPoints: [
          "Keep outlines clean and controlled without forcing extra thickness.",
          "Use line weight with purpose so it supports the value plan.",
          "Make sure the foundation reads before soft shading is added.",
        ],
        avoidPoints: [
          "Sketchy doubled lines.",
          "Random line weight changes.",
          "Weak structure before shading.",
        ],
        examples: [
          {
            title: "Black & Grey linework reference",
            description: "Add your own Black & Grey linework examples here.",
            images: [
              {
                src: "/images/black-grey-linework-1.jpg",
                alt: "Black and grey linework example 1",
              },
              {
                src: "/images/black-grey-linework-2.jpg",
                alt: "Black and grey linework example 2",
              },
            ],
          },
        ],
      };
    }

    if (selectedStyle === "Black & Grey" && selectedFocus === "Shading") {
      return {
        focusTitle: "Black & Grey Shading",
        focusPoints: [
          "Separate lights, mids, and darks clearly.",
          "Build softness gradually instead of forcing smoothness.",
          "Keep forms readable even in darker areas.",
        ],
        avoidPoints: [
          "Muddy transitions from overworking.",
          "Ignoring the light source.",
          "Flattening the whole design into one tone.",
        ],
        examples: sharedShadingExamples,
      };
    }

    if (selectedStyle === "Japanese" && selectedFocus === "Linework") {
      return {
        focusTitle: "Japanese Linework",
        focusPoints: [
          "Keep major forms flowing and readable.",
          "Use linework to support motion and rhythm.",
          "Let big shapes lead the design before detail.",
        ],
        avoidPoints: [
          "Breaking the flow with stiff angles.",
          "Crowding major forms with too much detail early.",
          "Losing hierarchy between large and small shapes.",
        ],
        examples: [
          {
            title: "Japanese linework reference",
            description: "Add your own Japanese linework examples here.",
            images: [
              {
                src: "/images/japanese-linework-1.jpg",
                alt: "Japanese linework example 1",
              },
              {
                src: "/images/japanese-linework-2.jpg",
                alt: "Japanese linework example 2",
              },
            ],
          },
        ],
      };
    }

    if (selectedStyle === "Japanese" && selectedFocus === "Shading") {
      return {
        focusTitle: "Japanese Shading",
        focusPoints: [
          "Use shading to reinforce movement and depth.",
          "Keep forms readable inside larger compositions.",
          "Control dark areas so they anchor instead of overpower.",
        ],
        avoidPoints: [
          "Flattening background and subject together.",
          "Making every shaded area equally dark.",
          "Ignoring the direction of flow in the piece.",
        ],
        examples: sharedShadingExamples,
      };
    }

    if (selectedStyle === "Lettering" && selectedFocus === "Linework") {
      return {
        focusTitle: "Lettering Linework",
        focusPoints: [
          "Keep every stroke intentional and readable.",
          "Control spacing between letters and main stems.",
          "Make line weight consistent where the style calls for it.",
        ],
        avoidPoints: [
          "Uneven spacing that hurts readability.",
          "Wobbly turns in curves and loops.",
          "Overcorrecting letters by tracing repeatedly.",
        ],
        examples: [
          {
            title: "Lettering linework reference",
            description: "Add your own Lettering linework examples here.",
            images: [
              {
                src: "/images/lettering-linework-1.jpg",
                alt: "Lettering linework example 1",
              },
              {
                src: "/images/lettering-linework-2.jpg",
                alt: "Lettering linework example 2",
              },
            ],
          },
        ],
      };
    }

    if (selectedStyle === "Lettering" && selectedFocus === "Shading") {
      return {
        focusTitle: "Lettering Shading",
        focusPoints: [
          "Use shading to add depth without hurting legibility.",
          "Keep the letters readable first.",
          "Support the main forms instead of muddying them.",
        ],
        avoidPoints: [
          "Too much shading that kills readability.",
          "Uneven dark spots that pull the eye randomly.",
          "Softening edges that should stay clear.",
        ],
        examples: sharedShadingExamples,
      };
    }

    return {
      focusTitle: "Composition Practice",
      focusPoints: [
        "Check the design at a glance before detail.",
        "Keep focal areas clear and easy to read.",
        "Make sure the eye moves naturally through the piece.",
      ],
      avoidPoints: [
        "Overcrowding the center of the design.",
        "Letting every element compete equally.",
        "Adding detail before the layout works.",
      ],
      examples: [
        {
          title: "Composition reference",
          description: "Add your own composition examples here.",
          images: [
            {
              src: "/images/composition-1.jpg",
              alt: "Composition example 1",
            },
            {
              src: "/images/composition-2.jpg",
              alt: "Composition example 2",
            },
          ],
        },
      ],
    };
  }, [selectedStyle, selectedFocus]);

  return (
    <Layout>
      <div className="space-y-5 sm:space-y-6 lg:space-y-8">
        <section className="ink-section ink-section-padding">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary sm:text-sm">
                Practice
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Apply what you studied
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                Practice is for execution. Keep this page focused on cleaner
                decisions, stronger fundamentals, and better tattoo habits.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="min-w-0 rounded-xl border bg-background px-3 py-2.5 text-sm"
              >
                {defaultStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>

              <select
                value={selectedFocus}
                onChange={(e) => setSelectedFocus(e.target.value)}
                className="min-w-0 rounded-xl border bg-background px-3 py-2.5 text-sm"
              >
                {defaultFocuses.map((focus) => (
                  <option key={focus} value={focus}>
                    {focus}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <AICoachPanel
          title="Practice Coach"
          subtitle="Pick a question for focused guidance on this practice session."
          options={coachOptions}
        />

        <Card className="rounded-3xl border shadow-sm">
          <CardContent className="space-y-5 p-4 text-center sm:space-y-6 sm:p-5 lg:p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
                Optional focus timer
              </p>
              <div className="mt-4 font-mono text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={toggleTimer} className="w-full sm:w-auto">
                {isActive ? (
                  <Pause className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isActive ? "Pause" : "Start"}
              </Button>

              <Button
                variant="outline"
                onClick={resetTimer}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground">
              The timer is only here to help you stay focused. The goal is clean
              execution, not racing a countdown.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <Card className="rounded-3xl border shadow-sm">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="mb-4 flex items-center gap-2 font-semibold">
                <Target className="h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0 truncate">
                  {practiceContent.focusTitle}
                </span>
              </div>

              <div className="space-y-2">
                {practiceContent.focusPoints.map((item) => (
                  <p
                    key={item}
                    className="text-sm leading-6 text-muted-foreground"
                  >
                    • {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border shadow-sm">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="mb-4 flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4 shrink-0 text-primary" />
                What NOT to do
              </div>

              <div className="space-y-2">
                {practiceContent.avoidPoints.map((item) => (
                  <p
                    key={item}
                    className="text-sm leading-6 text-muted-foreground"
                  >
                    • {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border shadow-sm">
          <CardContent className="space-y-6 p-4 sm:p-5 lg:p-6">
            <div className="flex flex-wrap items-center gap-2 font-semibold">
              <Eye className="h-4 w-4 shrink-0 text-primary" />
              <span>
                Example references for {selectedStyle} • {selectedFocus}
              </span>
            </div>

            {practiceContent.examples.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="font-medium">{section.title}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {section.description}
                </p>

                <div
                  className={`grid gap-3 sm:gap-4 ${
                    section.images.length === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : section.images.length === 3
                        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1 md:grid-cols-2"
                  }`}
                >
                  {section.images.map((image) => (
                    <img
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="h-52 w-full rounded-2xl border object-cover sm:h-56"
                    />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border shadow-sm">
          <CardContent className="space-y-5 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2 font-semibold">
              <Eye className="h-4 w-4 shrink-0 text-primary" />
              Skin Depth and Layers
            </div>

            <img
              src="/images/skin layers.jpg"
              alt="Human skin layers diagram"
              loading="lazy"
              className="mx-auto max-h-80 w-full max-w-md rounded-2xl border bg-white object-contain"
            />

            <div className="space-y-2 text-sm leading-6 text-muted-foreground">
              <p>
                Tattoo ink should sit in the{" "}
                <span className="font-medium text-foreground">dermis</span>.
              </p>
              <p>• Too shallow → the tattoo can heal light or fall out.</p>
              <p>• Too deep → the ink can spread and blow out.</p>
              <p>
                • Correct depth → cleaner healed lines and more stable results.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="space-y-3 p-4 sm:p-5 lg:p-6">
            <p className="font-semibold">Real Skin vs Fake Skin</p>

            <div className="space-y-2 text-sm leading-6 text-muted-foreground">
              <p>• Fake skin does not behave like real human skin.</p>
              <p>
                • Real skin must be stretched properly to get smoother, cleaner
                lines.
              </p>
              <p>
                • Fake skin can help with repetition, but it does not perfectly
                teach feel, elasticity, or depth.
              </p>
              <p>
                • Build the habit of stretching even when practicing on fake
                skin so your technique transfers better later.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border shadow-sm">
          <CardContent className="space-y-3 p-4 sm:p-5 lg:p-6">
            <p className="font-semibold">Self check before you move on</p>

            <div className="space-y-2 text-sm leading-6 text-muted-foreground">
              <p>• Does it read clearly at a glance?</p>
              <p>• Are your lines cleaner than your last rep?</p>
              <p>
                • Did you stay intentional instead of correcting every mark
                repeatedly?
              </p>
            </div>
          </CardContent>
        </Card>

        <Button className="h-12 w-full text-base sm:h-14 sm:text-lg">
          <CheckCircle className="mr-2 h-5 w-5" />
          Complete Practice
        </Button>
      </div>
    </Layout>
  );
}
