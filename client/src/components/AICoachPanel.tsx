import { useMemo, useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type CoachOption = {
  id: string;
  label: string;
  answer: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  options: CoachOption[];
};

export default function AICoachPanel({
  title = "InkPlan AI Coach",
  subtitle = "Select a question for focused guidance on this page.",
  options,
}: Props) {
  const [activeId, setActiveId] = useState<string>(options[0]?.id ?? "");

  const activeOption = useMemo(() => {
    return options.find((option) => option.id === activeId) ?? options[0];
  }, [activeId, options]);

  if (!options.length) {
    return null;
  }

  return (
    <Card className="rounded-3xl border-primary/20 bg-primary/5 shadow-sm">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            {title}
          </div>

          <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isActive = option.id === activeOption?.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveId(option.id)}
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted",
                ].join(" ")}
              >
                <ChevronRight className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <p className="mb-2 text-sm font-medium text-foreground">
            {activeOption?.label}
          </p>

          <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {activeOption?.answer}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
