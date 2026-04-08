import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  ImageIcon,
  Loader2,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useStyles } from "@/hooks/use-api";
import { useMemo } from "react";

type StyleItem = {
  id: string;
  name: string;
  definition: string;
  previewImage: string;
  tags: string[];
};

const fallbackStyles: StyleItem[] = [
  {
    id: "traditional",
    name: "American Traditional",
    definition:
      "Bold outlines, strong readability, and classic tattoo structure built to hold up clearly.",
    previewImage: "/images/traditional-style.png",
    tags: ["Bold", "Classic", "Readable"],
  },
  {
    id: "black-grey",
    name: "Black & Grey",
    definition:
      "Smooth shading, value control, and clean form separation built through light, mid, and dark balance.",
    previewImage: "/images/black-grey-style.png",
    tags: ["Smooth", "Value", "Contrast"],
  },
  {
    id: "japanese",
    name: "Japanese",
    definition:
      "Flowing composition, movement, hierarchy, and strong large-form design.",
    previewImage: "/images/japanese-style.png",
    tags: ["Flow", "Movement", "Large Forms"],
  },
  {
    id: "lettering",
    name: "Lettering",
    definition:
      "Clean typography, spacing, rhythm, and readable tattoo design.",
    previewImage: "/images/lettering-style.png",
    tags: ["Typography", "Spacing", "Readable"],
  },
  {
    id: "neo-traditional",
    name: "Neo Traditional",
    definition:
      "A richer, more illustrative evolution of Traditional with stronger color, stylized forms, and extra detail.",
    previewImage: "/images/neo-traditional-style.png",
    tags: ["Stylized", "Color", "Illustrative"],
  },
  {
    id: "fine-line",
    name: "Fine Line",
    definition:
      "Delicate, minimal tattooing built on restraint, spacing, subtle linework, and clean simplicity.",
    previewImage: "/images/fine-line-style.png",
    tags: ["Delicate", "Minimal", "Clean"],
  },
];

const flashSheetByStyleId: Record<string, string> = {
  traditional: "/images/traditional-flash-sheet.jpg",
  "black-grey": "/images/black-grey-flash-sheet.jpg",
  japanese: "/images/japanese-flash-sheet.jpg",
  lettering: "/images/lettering-flash-sheet.jpg",
  "neo-traditional": "/images/neo-traditional-flash-sheet.jpg",
  "fine-line": "/images/fine-line-flash-sheet.jpg",
};

export default function StylesList() {
  const stylesQuery = useStyles();

  const styles = (stylesQuery.data as StyleItem[] | undefined) ?? [];
  const isLoading = stylesQuery.isLoading;

  const displayStyles = useMemo<StyleItem[]>(() => {
    if (styles.length > 0) {
      return styles;
    }

    return fallbackStyles;
  }, [styles]);

  if (isLoading && styles.length === 0) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/8 bg-card p-6 shadow-none md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-red-300">
                <Sparkles className="h-3.5 w-3.5 text-red-400" />
                Study styles the right way
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Choose a style to study
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
                  Explore tattoo styles, understand what makes them readable,
                  and study the rules before practicing them. Build broad
                  understanding first, then narrow your direction later.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <Card className="border-white/8 bg-white/[0.03] shadow-none">
                <CardContent className="p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <BookOpen className="h-5 w-5 text-red-400" />
                  </div>
                  <p className="font-medium text-white">Study first</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Learn the structure behind the look.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/8 bg-white/[0.03] shadow-none">
                <CardContent className="p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <Target className="h-5 w-5 text-red-400" />
                  </div>
                  <p className="font-medium text-white">Train your eye</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Spot clarity, flow, and common mistakes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/8 bg-white/[0.03] shadow-none">
                <CardContent className="p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <ShieldCheck className="h-5 w-5 text-red-400" />
                  </div>
                  <p className="font-medium text-white">
                    Practice with intention
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Use study references to support cleaner drills.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-red-500/12 bg-red-500/5 p-4">
          <p className="text-sm leading-6 text-zinc-300">
            <span className="font-semibold text-white">Free access:</span> 6
            core styles to build broad foundation first.
            <span className="ml-2 font-semibold text-white">
              Later tiers:
            </span>{" "}
            more styles, deeper drills, stronger AI guidance, and expanded study
            tracks.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {displayStyles.map((style) => {
            const flashSheetSrc = flashSheetByStyleId[style.id];

            return (
              <Link key={style.id} href={`/styles/${style.id}`}>
                <Card
                  className="group h-full cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-card shadow-none transition-all duration-300 hover:border-red-500/30"
                  data-testid={`card-style-${style.id}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {style.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="border-0 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="text-2xl font-semibold text-white">
                        {style.name}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="space-y-4 p-5">
                    <p className="line-clamp-3 text-sm leading-6 text-zinc-400">
                      {style.definition}
                    </p>

                    {flashSheetSrc ? (
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          <ImageIcon className="h-3.5 w-3.5 text-red-400" />
                          AI Flash Sheet Preview
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-950">
                          <img
                            src={flashSheetSrc}
                            alt={`${style.name} flash sheet`}
                            className="h-48 w-full object-cover object-top"
                          />
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full border-white/10 text-zinc-300"
                      >
                        Study Guide
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full border-white/10 text-zinc-300"
                      >
                        Rules
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full border-white/10 text-zinc-300"
                      >
                        AI Flash Sheet
                      </Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between p-5 pt-0">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Open study page
                    </span>

                    <span className="flex items-center gap-1 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                      View
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </section>
      </div>
    </Layout>
  );
}
