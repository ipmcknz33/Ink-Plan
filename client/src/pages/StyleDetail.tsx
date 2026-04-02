import Layout from "@/components/Layout";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Info,
  Loader2,
  Play,
  Star,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStyle } from "@/hooks/use-api";

interface Drill {
  title: string;
  minutes: number;
  prompt: string;
}

function getFocusFromDrillTitle(title: string) {
  const normalized = title.toLowerCase();

  if (
    normalized.includes("line") ||
    normalized.includes("outline") ||
    normalized.includes("liner")
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
    normalized.includes("balance")
  ) {
    return "Composition";
  }

  return "Flash Redraw";
}

export default function StyleDetail() {
  const [, params] = useRoute("/styles/:id");
  const { data: style, isLoading } = useStyle(params?.id || "");

  if (isLoading) {
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
          <h2 className="text-2xl font-bold">Style not found</h2>
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

  let drills: Drill[] = [];

  try {
    drills = JSON.parse(style.drills || "[]");
  } catch {
    drills = [];
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center">
          <Link href="/styles">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Styles
            </Button>
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-border">
          <div className="h-[320px]">
            <img
              src={style.previewImage}
              alt={style.name}
              className="h-full w-full object-cover"
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

              <h1 className="text-4xl font-display font-black tracking-tight text-white md:text-5xl">
                {style.name}
              </h1>

              <p className="max-w-2xl border-l-4 border-primary pl-4 text-base italic text-white/85 md:text-lg">
                "{style.definition}"
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold">Study the rules</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Learn what makes this style readable and recognizable.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold">Avoid common mistakes</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Spot where beginners usually lose clarity.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold">Practice with intent</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use drills to reinforce structure, not just style imitation.
              </p>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="h-12 w-full justify-start space-x-6 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="rules"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-bold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              data-testid="tab-rules"
            >
              Study Guide
            </TabsTrigger>

            <TabsTrigger
              value="drills"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-bold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              data-testid="tab-drills"
            >
              Practice Drills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="mt-8 space-y-8">
            <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-display font-bold">
                    Core Principles
                  </h3>
                </div>

                <div className="space-y-4">
                  {style.rules.map((rule, i) => (
                    <Card
                      key={i}
                      className="rounded-2xl border border-border bg-card/70 shadow-sm"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {i + 1}
                          </div>
                          <p className="leading-7">{rule}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                  <h3 className="text-2xl font-display font-bold">
                    Common Mistakes
                  </h3>
                </div>

                <div className="space-y-4">
                  {style.commonMistakes.map((mistake, i) => (
                    <Alert
                      key={i}
                      variant="destructive"
                      className="rounded-2xl border-destructive/20 bg-destructive/5"
                    >
                      <AlertTitle className="font-bold">Avoid this</AlertTitle>
                      <AlertDescription className="leading-6">
                        {mistake}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border shadow-sm">
              <CardContent className="flex gap-4 p-6">
                <Info className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h4 className="mb-2 text-lg font-display font-bold">
                    Study focus
                  </h4>
                  <p className="text-muted-foreground">
                    When studying {style.name}, focus on{" "}
                    <span className="font-semibold text-foreground">
                      clarity over complexity
                    </span>
                    . Strong work reads fast, feels intentional, and holds up at
                    a glance before anyone notices the details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drills" className="mt-8 space-y-8">
            {drills.length === 0 ? (
              <Card className="rounded-3xl border-dashed shadow-none">
                <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                  <p className="text-lg font-semibold">No drills yet</p>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
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
                      className="flex flex-col rounded-3xl border-2 border-border shadow-sm transition-colors hover:border-primary"
                      data-testid={`card-drill-${i}`}
                    >
                      <CardHeader className="space-y-3">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Drill #{i + 1} • {drill.minutes} min
                        </div>
                        <CardTitle className="font-display text-2xl">
                          {drill.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <p className="leading-7 text-muted-foreground">
                          {drill.prompt}
                        </p>
                      </CardContent>

                      <div className="p-6 pt-0">
                        <Link href={practiceHref}>
                          <Button
                            className="group w-full font-bold"
                            data-testid={`button-start-drill-${i}`}
                          >
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
