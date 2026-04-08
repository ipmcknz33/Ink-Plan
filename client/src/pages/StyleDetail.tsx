import Layout from "@/components/Layout";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  CheckCircle,
  Copy,
  ImageIcon,
  Info,
  Loader2,
  Play,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStyle } from "@/hooks/use-api";
import { useMemo, useState } from "react";

interface Drill {
  title: string;
  minutes: number;
  prompt: string;
}

type PromptBundle = {
  main: string;
  variations: string[];
};

type StyleItem = {
  id: string;
  name: string;
  definition: string;
  previewImage: string;
  tags: string[];
  rules: string[];
  commonMistakes: string[];
  drills: string;
};

const fallbackStyles: StyleItem[] = [
  {
    id: "traditional",
    name: "American Traditional",
    definition:
      "Bold outlines, strong readability, and classic tattoo structure built to hold up clearly.",
    previewImage: "/images/traditional-style.png",
    tags: ["Bold", "Classic", "Readable"],
    rules: [
      "Use strong line weight hierarchy.",
      "Keep shapes simple and readable.",
      "Prioritize silhouette before details.",
    ],
    commonMistakes: [
      "Adding too much detail too early.",
      "Using inconsistent line weights.",
      "Weak silhouettes that lose clarity fast.",
    ],
    drills: JSON.stringify([
      {
        title: "Traditional line control",
        minutes: 30,
        prompt:
          "Redraw a rose, dagger, or panther head using clean bold lines and simplified shapes.",
      },
      {
        title: "Traditional composition drill",
        minutes: 25,
        prompt:
          "Arrange two classic motifs into a balanced flash design with readable spacing.",
      },
    ]),
  },
  {
    id: "black-grey",
    name: "Black & Grey",
    definition:
      "Smooth shading, value control, and clean form separation built through light, mid, and dark balance.",
    previewImage: "/images/black-grey-style.png",
    tags: ["Smooth", "Value", "Contrast"],
    rules: [
      "Separate lights, mids, and darks clearly.",
      "Build smooth transitions without muddying forms.",
      "Keep the structure readable before soft shading.",
    ],
    commonMistakes: [
      "Flattening everything into one value.",
      "Overworking the same area.",
      "Ignoring structure while chasing smoothness.",
    ],
    drills: JSON.stringify([
      {
        title: "Black and grey shading control",
        minutes: 35,
        prompt:
          "Shade a simple skull or rose study using clear light, mid, and dark separation.",
      },
      {
        title: "Value grouping drill",
        minutes: 25,
        prompt:
          "Break a design into only three clear value families before rendering.",
      },
    ]),
  },
  {
    id: "japanese",
    name: "Japanese",
    definition:
      "Flowing composition, movement, hierarchy, and strong large-form design.",
    previewImage: "/images/japanese-style.png",
    tags: ["Flow", "Movement", "Large Forms"],
    rules: [
      "Let major forms guide the eye first.",
      "Use supporting background elements with intention.",
      "Keep hierarchy between main and secondary forms.",
    ],
    commonMistakes: [
      "Stiff flow and weak movement.",
      "Background elements competing with the subject.",
      "Adding detail before the major forms are working.",
    ],
    drills: JSON.stringify([
      {
        title: "Japanese flow composition",
        minutes: 40,
        prompt:
          "Arrange a koi, waves, and flowers so the eye moves naturally through the design.",
      },
      {
        title: "Large shape hierarchy",
        minutes: 30,
        prompt:
          "Block in the main Japanese forms first before touching internal detail.",
      },
    ]),
  },
  {
    id: "lettering",
    name: "Lettering",
    definition:
      "Clean typography, spacing, rhythm, and readable tattoo design.",
    previewImage: "/images/lettering-style.png",
    tags: ["Typography", "Spacing", "Readable"],
    rules: [
      "Readability comes before decoration.",
      "Keep spacing between letters controlled and intentional.",
      "Use line weight consistently where the style calls for it.",
    ],
    commonMistakes: [
      "Uneven spacing that hurts readability.",
      "Retracing letters repeatedly.",
      "Adding flourishes that confuse the word shape.",
    ],
    drills: JSON.stringify([
      {
        title: "Letter spacing drill",
        minutes: 25,
        prompt:
          "Repeat one phrase multiple times and focus only on spacing and clean structure.",
      },
      {
        title: "Script linework drill",
        minutes: 30,
        prompt:
          "Practice smooth loops, turns, and clean finishes without retracing.",
      },
    ]),
  },
  {
    id: "neo-traditional",
    name: "Neo Traditional",
    definition:
      "A richer, more illustrative evolution of Traditional with stronger color, stylized forms, and extra detail.",
    previewImage: "/images/neo-traditional-style.png",
    tags: ["Stylized", "Color", "Illustrative"],
    rules: [
      "Keep the silhouette strong before rendering details.",
      "Use color and detail to support form, not bury it.",
      "Maintain hierarchy between major and minor elements.",
    ],
    commonMistakes: [
      "Adding detail before the structure is solid.",
      "Over-rendering every area equally.",
      "Losing readable shape language under decoration.",
    ],
    drills: JSON.stringify([
      {
        title: "Neo traditional shape hierarchy",
        minutes: 35,
        prompt:
          "Build a stylized animal head using clean primary forms before adding secondary detail.",
      },
      {
        title: "Neo traditional color planning",
        minutes: 25,
        prompt:
          "Map color zones for a floral design without losing readability or balance.",
      },
    ]),
  },
  {
    id: "fine-line",
    name: "Fine Line",
    definition:
      "Delicate, minimal tattooing built on restraint, spacing, subtle linework, and clean simplicity.",
    previewImage: "/images/fine-line-style.png",
    tags: ["Delicate", "Minimal", "Clean"],
    rules: [
      "Use restraint and avoid unnecessary complexity.",
      "Keep spacing open so small designs can breathe.",
      "Make every line intentional because subtle work shows mistakes fast.",
    ],
    commonMistakes: [
      "Overcomplicating tiny designs.",
      "Crowding delicate elements together.",
      "Shaky line quality from rushing or overworking.",
    ],
    drills: JSON.stringify([
      {
        title: "Fine line control",
        minutes: 25,
        prompt:
          "Practice small botanical stems and leaves with smooth, delicate line movement.",
      },
      {
        title: "Minimal composition drill",
        minutes: 20,
        prompt:
          "Create a tiny readable design with clean spacing and intentional restraint.",
      },
    ]),
  },
];

/**
 * FLASH SHEET IMAGE + POSITIONING
 *
 * This is the only section you need to edit to reposition images.
 *
 * Keep baseX/baseY the same for consistency.
 * Change ONLY offsetX / offsetY for the style you want to nudge.
 *
 * Examples:
 * - move down 100px -> offsetY: 100
 * - move up 40px    -> offsetY: -40
 * - move right 20px -> offsetX: 20
 * - move left 20px  -> offsetX: -20
 */
const flashSheetConfigByStyleId: Record<
  string,
  {
    src: string;
    baseX: number;
    baseY: number;
    offsetX: number;
    offsetY: number;
  }
> = {
  traditional: {
    src: "/images/traditional-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  "black-grey": {
    src: "/images/black-grey-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  japanese: {
    src: "/images/japanese-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  lettering: {
    src: "/images/lettering-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  "neo-traditional": {
    src: "/images/neo-traditional-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  "fine-line": {
    src: "/images/fine-line-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
};

function getFocusFromDrillTitle(title: string) {
  const normalized = title.toLowerCase();

  if (
    normalized.includes("line") ||
    normalized.includes("outline") ||
    normalized.includes("letter") ||
    normalized.includes("script")
  ) {
    return "Linework";
  }

  if (
    normalized.includes("shade") ||
    normalized.includes("black and grey") ||
    normalized.includes("value")
  ) {
    return "Shading";
  }

  if (
    normalized.includes("composition") ||
    normalized.includes("layout") ||
    normalized.includes("hierarchy")
  ) {
    return "Composition";
  }

  return "Flash Redraw";
}

function getPromptBundle(styleName: string): PromptBundle {
  const normalized = styleName.toLowerCase();

  if (normalized.includes("american") && normalized.includes("traditional")) {
    return {
      main: "american traditional tattoo flash sheet, bold black outlines, limited color palette red yellow green, roses daggers eagles skulls panther heads, high contrast, flat classic shading, clean white background, tattoo study reference sheet",
      variations: [
        "traditional rose and dagger flash sheet",
        "classic eagle, skull, and snake flash sheet",
        "panther head and floral american traditional sheet",
      ],
    };
  }

  if (normalized.includes("black") || normalized.includes("grey")) {
    return {
      main: "black and grey tattoo flash sheet, smooth value transitions, realistic roses skulls clocks statues, soft gradients, high contrast, clean white background, tattoo study reference sheet",
      variations: [
        "black and grey rose and clock flash sheet",
        "statue portrait and floral black and grey sheet",
        "skull and rose realism black and grey flash sheet",
      ],
    };
  }

  if (normalized.includes("japanese")) {
    return {
      main: "japanese tattoo flash sheet, dragon, daruma dolls, samurai, oni mask, hannya mask, bold outlines, traditional japanese tattoo study sheet, clean white background",
      variations: [
        "dragon and floral japanese flash sheet",
        "samurai and mask japanese study sheet",
        "daruma dolls and hannya mask japanese sheet",
      ],
    };
  }

  if (normalized.includes("letter")) {
    return {
      main: "tattoo lettering flash sheet, family, ambition, forever, strength, tradition, honour, elegant script and blackletter mix, clean spacing, black ink, tattoo study reference sheet, white background",
      variations: [
        "script lettering study sheet",
        "blackletter tattoo flash sheet",
        "ornamental typography tattoo study sheet",
      ],
    };
  }

  if (normalized.includes("neo")) {
    return {
      main: "neo traditional tattoo flash sheet, fox, owl, ornate lady head, heart and dagger, potion bottle, rich color palette, bold outlines, decorative flowers, clean white background, tattoo study reference sheet",
      variations: [
        "neo traditional fox and owl flash sheet",
        "lady head and floral neo traditional sheet",
        "heart dagger and potion neo traditional study sheet",
      ],
    };
  }

  if (normalized.includes("fine")) {
    return {
      main: "fine line tattoo flash sheet, delicate florals, butterflies, ornamental details, subtle linework, minimal black ink, clean white background, tattoo study reference sheet",
      variations: [
        "fine line floral micro tattoo sheet",
        "delicate butterfly and botanical study sheet",
        "minimal ornamental fine line flash sheet",
      ],
    };
  }

  return {
    main: `${styleName} tattoo flash sheet, clean composition, tattoo study reference sheet, white background, professional practice reference`,
    variations: [
      `${styleName} floral flash sheet`,
      `${styleName} animal study sheet`,
      `${styleName} ornamental tattoo sheet`,
    ],
  };
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Copy failed:", error);
  }
}

export default function StyleDetail() {
  const [, params] = useRoute("/styles/:id");
  const styleId = params?.id || "";
  const { data: apiStyle, isLoading } = useStyle(styleId);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fallbackStyle = useMemo(() => {
    return fallbackStyles.find((style) => style.id === styleId) || null;
  }, [styleId]);

  const style = (apiStyle as StyleItem | undefined) ?? fallbackStyle ?? null;

  const flashSheetConfig = flashSheetConfigByStyleId[styleId] || {
    src: "",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  };

  const flashSheetSrc = flashSheetConfig.src;

  const drills: Drill[] = useMemo(() => {
    if (!style?.drills) {
      return [];
    }

    try {
      return JSON.parse(style.drills) as Drill[];
    } catch {
      return [];
    }
  }, [style]);

  const promptBundle = useMemo(() => {
    return getPromptBundle(style?.name || "");
  }, [style]);

  const handleCopy = async (key: string, value: string) => {
    await copyToClipboard(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1200);
  };

  if (isLoading && !style) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!style) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold text-white">Style not found</h2>
          <p className="mt-2 text-muted-foreground">
            The style you are looking for could not be loaded.
          </p>
          <Link href="/styles">
            <Button className="mt-6">Back to Styles</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center">
          <Link href="/styles">
            <Button
              variant="ghost"
              className="gap-2 pl-0 text-white hover:bg-transparent hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Styles
            </Button>
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-white/8">
          <div className="h-[320px]">
            <img
              src={style.previewImage}
              alt={style.name}
              className="h-full w-full object-cover"
              style={
                styleId === "lettering"
                  ? { transform: "translateY(100px)" }
                  : undefined
              }
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap gap-2">
                {(style.tags || []).map((tag) => (
                  <Badge
                    key={tag}
                    className="border-0 bg-white/10 text-white backdrop-blur-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {style.name}
              </h1>

              <p className="max-w-2xl border-l-4 border-red-500 pl-4 text-base italic text-white/85 md:text-lg">
                {style.definition}
              </p>

              <p className="text-sm text-white/60">Study Reference</p>
            </div>
          </div>
        </section>

        <Card className="border-white/8 bg-card shadow-none">
          <CardContent className="p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-red-300">
              <BrainCircuit className="h-3.5 w-3.5 text-red-400" />
              AI Tattoo Coach
            </div>

            <h2 className="text-xl font-semibold text-white">
              Study the structure before trying to master the style.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
              Focus on what makes {style.name} readable, what beginners usually
              miss, and how to practice the fundamentals without rushing into
              style identity too early.
            </p>
          </CardContent>
        </Card>

        {flashSheetSrc ? (
          <Card className="rounded-3xl border border-white/8 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <ImageIcon className="h-5 w-5 text-red-400" />
                AI Flash Sheet Preview
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="max-w-2xl text-sm leading-7 text-zinc-400">
                Use this generated flash sheet as a study reference for{" "}
                {style.name}. Study structure, readability, spacing, and shape
                language before moving into drills.
              </p>

              <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02]">
                <img
                  src={flashSheetSrc}
                  alt={`${style.name} AI flash sheet`}
                  className="absolute left-0 top-0 h-full w-full object-cover"
                  style={{
                    objectPosition: `${flashSheetConfig.baseX}% ${flashSheetConfig.baseY}%`,
                    transform: `translate(${flashSheetConfig.offsetX}px, ${flashSheetConfig.offsetY}px)`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl border-white/8 bg-card shadow-none">
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <BookOpen className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Study the rules</p>
              <p className="mt-1 text-sm text-zinc-400">
                Learn what makes this style readable.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/8 bg-card shadow-none">
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <Target className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Avoid mistakes</p>
              <p className="mt-1 text-sm text-zinc-400">
                Spot where beginners usually lose clarity.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/8 bg-card shadow-none">
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <Star className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Practice with intent</p>
              <p className="mt-1 text-sm text-zinc-400">
                Use drills to reinforce structure, not imitation.
              </p>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="h-12 w-full justify-start space-x-6 rounded-none border-b border-white/8 bg-transparent p-0">
            <TabsTrigger
              value="rules"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-semibold data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Study Guide
            </TabsTrigger>

            <TabsTrigger
              value="prompts"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-semibold data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              AI Flash Prompts
            </TabsTrigger>

            <TabsTrigger
              value="drills"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-semibold data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Practice Drills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="mt-8 space-y-8">
            <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-red-400" />
                  <h3 className="text-2xl font-semibold text-white">
                    Core Principles
                  </h3>
                </div>

                <div className="space-y-4">
                  {style.rules.map((rule, i) => (
                    <Card
                      key={i}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] shadow-none"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-sm font-bold text-red-400">
                            {i + 1}
                          </div>
                          <p className="leading-7 text-zinc-300">{rule}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <h3 className="text-2xl font-semibold text-white">
                    Common Mistakes
                  </h3>
                </div>

                <div className="space-y-4">
                  {style.commonMistakes.map((mistake, i) => (
                    <Alert
                      key={i}
                      variant="destructive"
                      className="rounded-2xl border-red-500/20 bg-red-500/8"
                    >
                      <AlertTitle className="font-semibold text-white">
                        Avoid this
                      </AlertTitle>
                      <AlertDescription className="leading-6 text-zinc-300">
                        {mistake}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border border-white/8 bg-card shadow-none">
              <CardContent className="flex gap-4 p-6">
                <Info className="mt-1 h-6 w-6 flex-shrink-0 text-red-400" />
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-white">
                    Study focus
                  </h4>
                  <p className="text-zinc-400">
                    When studying {style.name}, focus on{" "}
                    <span className="font-semibold text-white">
                      clarity over complexity
                    </span>
                    . Strong work reads fast, feels intentional, and holds up at
                    a glance before anyone notices the details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompts" className="mt-8 space-y-8">
            <Card className="rounded-3xl border border-white/8 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Sparkles className="h-5 w-5 text-red-400" />
                  AI Flash Sheet Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-7 text-zinc-400">
                  Use this prompt to generate a clean AI flash sheet for{" "}
                  {style.name}. Keep the output labeled inside InkPlan as a{" "}
                  <span className="font-semibold text-white">
                    Study Reference
                  </span>{" "}
                  or{" "}
                  <span className="font-semibold text-white">
                    Practice Reference
                  </span>
                  .
                </p>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm leading-7 text-zinc-300">
                    {promptBundle.main}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCopy("main", promptBundle.main)}
                  className="border-white/10 bg-transparent text-white hover:bg-white/5"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copiedKey === "main" ? "Copied" : "Copy Main Prompt"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {promptBundle.variations.map((variation, i) => (
                <Card
                  key={variation}
                  className="rounded-3xl border border-white/8 bg-card shadow-none"
                >
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Variation {i + 1}
                    </div>

                    <p className="text-sm leading-7 text-zinc-300">
                      {variation}
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleCopy(`variation-${i}`, variation)}
                      className="w-full border-white/10 bg-transparent text-white hover:bg-white/5"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copiedKey === `variation-${i}`
                        ? "Copied"
                        : "Copy Variation"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="rounded-3xl border border-red-500/20 bg-red-500/8 shadow-none">
              <CardContent className="p-5">
                <p className="text-sm leading-7 text-zinc-300">
                  These are AI study prompts, not real artist sheets. Keep the
                  output clearly labeled as
                  <span className="mx-1 font-semibold text-white">
                    Study Reference
                  </span>
                  so users understand they are generated practice tools.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drills" className="mt-8 space-y-8">
            {drills.length === 0 ? (
              <Card className="rounded-3xl border border-dashed border-white/10 bg-card shadow-none">
                <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                  <p className="text-lg font-semibold text-white">
                    No drills yet
                  </p>
                  <p className="mt-2 max-w-md text-sm text-zinc-400">
                    This style does not have drills loaded yet, but the page is
                    ready for them when your API data grows.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {drills.map((drill, i) => {
                  const focus = getFocusFromDrillTitle(drill.title);
                  const practiceHref = `/practice?style=${encodeURIComponent(
                    style.name,
                  )}&focus=${encodeURIComponent(
                    focus,
                  )}&duration=${drill.minutes}&prompt=${encodeURIComponent(
                    drill.prompt,
                  )}`;

                  return (
                    <Card
                      key={i}
                      className="flex flex-col rounded-3xl border border-white/8 bg-card shadow-none transition-colors hover:border-red-500/30"
                    >
                      <CardHeader className="space-y-3">
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Drill #{i + 1} • {drill.minutes} min
                        </div>
                        <CardTitle className="text-2xl text-white">
                          {drill.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <p className="leading-7 text-zinc-400">
                          {drill.prompt}
                        </p>
                      </CardContent>

                      <div className="p-6 pt-0">
                        <Link href={practiceHref}>
                          <Button className="group w-full bg-red-600 text-white hover:bg-red-500">
                            Practice this drill
                            <Play className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
