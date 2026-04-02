import Layout from "@/components/Layout";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const lessons = [
  {
    title: "Readability",
    description: "Design should read clearly from a distance.",
  },
  {
    title: "Shape Language",
    description: "Strong shapes create strong tattoos.",
  },
  {
    title: "Flow",
    description: "Guide the viewer’s eye naturally.",
  },
];

export default function Fundamentals() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="space-y-8">
        <Button
          variant="ghost"
          className="gap-2 pl-0"
          onClick={() => setLocation("/library")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Button>

        <div className="rounded-3xl border bg-card p-6">
          <h1 className="text-3xl font-bold">Fundamentals</h1>
          <p className="text-muted-foreground mt-2">
            Master the basics before chasing complexity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {lessons.map((lesson) => (
            <Card key={lesson.title}>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">{lesson.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {lesson.description}
                </p>

                <Button
                  onClick={() => setLocation("/practice")}
                  className="w-full"
                >
                  Practice This
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
