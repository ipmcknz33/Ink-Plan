import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useStyles } from "@/hooks/use-api";
import { Input } from "@/components/ui/input";

export default function StylesList() {
  const { data: styles, isLoading } = useStyles();
  const [search, setSearch] = useState("");

  const filteredStyles = useMemo(() => {
    if (!styles) return [];

    const query = search.trim().toLowerCase();

    if (!query) return styles;

    return styles.filter((style) => {
      const haystack = [style.name, style.definition, ...(style.tags || [])]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [styles, search]);

  if (isLoading) {
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
        <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Build your visual vocabulary
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold tracking-tight md:text-4xl">
                  Style Dictionary
                </h1>
                <p className="max-w-2xl text-muted-foreground">
                  Explore tattoo traditions, learn what makes each one readable,
                  and study the rules before you practice them. Start broad,
                  then go deep.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <Card className="border-border/80 shadow-none">
                <CardContent className="p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">Study first</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Learn the structure behind the look.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-none">
                <CardContent className="p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">Train your eye</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Spot patterns, contrast, and readability.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-none">
                <CardContent className="p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">Practice with purpose</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Move from reference into drills.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Browse styles</p>
            <p className="text-sm text-muted-foreground">
              Search by name, definition, or tags.
            </p>
          </div>

          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search styles..."
              className="pl-9"
            />
          </div>
        </section>

        {filteredStyles.length === 0 ? (
          <Card className="rounded-3xl border-dashed shadow-none">
            <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
              <p className="text-lg font-semibold">No styles found</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Try a different search term or clear the search to view the full
                style library.
              </p>
            </CardContent>
          </Card>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredStyles.map((style) => (
              <Link key={style.id} href={`/styles/${style.id}`}>
                <Card
                  className="group h-full cursor-pointer overflow-hidden rounded-3xl border-2 border-border transition-all duration-300 hover:border-primary hover:shadow-lg"
                  data-testid={`card-style-${style.id}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {(style.tags || []).slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="border-0 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="text-2xl font-display font-bold text-white">
                        {style.name}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="space-y-4 p-5">
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {style.definition}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="rounded-full">
                        Study
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        Rules
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        Drills
                      </Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between p-5 pt-0">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Open study page
                    </span>

                    <span className="flex items-center gap-1 text-sm font-bold transition-transform group-hover:translate-x-1">
                      View
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}
