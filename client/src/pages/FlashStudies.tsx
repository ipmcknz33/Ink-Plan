import Layout from "@/components/Layout";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Eye, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const studies = [
  {
    title: "Basic Shading Transitions",
    prompt:
      "Recreate a simple value fade from dark to light with patience and control.",
    practiceHref:
      "/practice?focus=Shading&prompt=Recreate%20a%20simple%20value%20fade%20from%20dark%20to%20light%20with%20patience%20and%20control.",
  },
  {
    title: "Redraw a Simple Rose",
    prompt:
      "Copy a clean rose design to understand petal grouping, not to make it perfect.",
    practiceHref:
      "/practice?focus=Flash%20Redraw&prompt=Copy%20a%20clean%20rose%20design%20to%20understand%20petal%20grouping,%20not%20to%20make%20it%20perfect.",
  },
  {
    title: "Dagger Balance Study",
    prompt:
      "Redraw a dagger and focus on center line, symmetry, and clean shape flow.",
    practiceHref:
      "/practice?focus=Composition&prompt=Redraw%20a%20dagger%20and%20focus%20on%20center%20line,%20symmetry,%20and%20clean%20shape%20flow.",
  },
];

export default function FlashStudies() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="gap-2 pl-0"
            onClick={() => setLocation("/library")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>
        </div>

        <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4 text-primary" />
              Free Library
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Flash Studies
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                These studies help artists learn by observing and redrawing. The
                goal is understanding, not posting perfect copies.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {studies.map((study) => (
            <Card key={study.title} className="rounded-3xl border shadow-sm">
              <CardContent className="space-y-5 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <PenTool className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{study.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {study.prompt}
                  </p>
                </div>

                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Look for shape clarity, spacing, and where the design reads
                    well before chasing details.
                  </p>
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setLocation(study.practiceHref)}
                >
                  Open Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </Layout>
  );
}
