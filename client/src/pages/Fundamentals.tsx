import Layout from "@/components/Layout";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const lessons = [
  {
    title: "Readability",
    description: "Design should read clearly from a distance.",
    practiceHref: "/practice?focus=Composition",
  },
  {
    title: "Shape Language",
    description: "Strong shapes create strong tattoos.",
    practiceHref: "/practice?focus=Composition",
  },
  {
    title: "Flow",
    description: "Guide the viewer’s eye naturally.",
    practiceHref: "/practice?focus=Linework",
  },
];

export default function Fundamentals() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="space-y-8">
        {/* BACK */}
        <Button
          variant="ghost"
          className="gap-2 pl-0"
          onClick={() => setLocation("/library")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Button>

        {/* HEADER */}
        <div className="rounded-3xl border bg-card p-6">
          <h1 className="text-3xl font-bold">Fundamentals</h1>
          <p className="text-muted-foreground mt-2">
            Master the basics before chasing complexity.
          </p>
        </div>

        {/* 🔥 STUDY EXAMPLE (NEW SECTION) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Study Example</h2>

          <div className="rounded-2xl overflow-hidden border">
            <img
              src="/images/linework-1.jpg"
              alt="Line confidence tattoo study example"
              className="w-full h-auto object-cover"
            />
          </div>

          <p className="text-sm text-muted-foreground max-w-2xl">
            Notice the difference between clean, confident lines and sketchy,
            overworked ones. Strong tattoo work relies on clarity, not
            repetition.
          </p>
        </div>

        {/* 🔥 WHAT TO NOTICE */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold">What to Look For</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Lines are clean and intentional</li>
              <li>• Shapes are readable at a glance</li>
              <li>• No excessive sketching or overworking</li>
              <li>• Flow guides your eye naturally</li>
            </ul>
          </CardContent>
        </Card>

        {/* LESSON CARDS */}
        <div className="grid gap-6 md:grid-cols-3">
          {lessons.map((lesson) => (
            <Card key={lesson.title}>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">{lesson.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {lesson.description}
                </p>

                <Button
                  onClick={() => setLocation(lesson.practiceHref)}
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
