import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Crown,
  Lock,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

type CheckoutResponse = {
  url?: string;
  error?: string;
};

export default function Upgrade() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleProCheckout() {
    try {
      setIsCheckingOut(true);
      setErrorMessage("");

      const response = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          plan: "pro",
        }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start checkout";
      setErrorMessage(message);
      console.error("Pro checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl border bg-card p-6">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Checkout
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Choose your plan
            </h1>

            <p className="mt-3 text-muted-foreground">
              Start with trial, then unlock the next layer with Pro. Premium
              stays visible but locked until the next build phase.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden rounded-3xl border border-primary/40 shadow-sm">
            <div className="border-b bg-primary/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold">Pro</h2>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Unlock the next learning layer.
                  </p>
                </div>

                <div className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                  Recommended
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">$24</span>
                  <span className="pb-1 text-sm text-muted-foreground">
                    /month
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="space-y-4 p-6">
              <FeatureItem text="Fine Line starter pack" />
              <FeatureItem text="Blackwork starter pack" />
              <FeatureItem text="Traditional unlocked" />
              <FeatureItem text="Lettering unlocked" />

              {errorMessage ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {errorMessage}
                </div>
              ) : null}

              <Button
                className="w-full gap-2"
                onClick={handleProCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Redirecting..." : "Checkout Pro"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl border opacity-95">
            <div className="border-b bg-muted/30 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold">Premium</h2>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Advanced tier (locked for now)
                  </p>
                </div>

                <div className="rounded-full border px-3 py-1 text-xs">
                  Coming Soon
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="pb-1 text-sm text-muted-foreground">
                    /month
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="space-y-4 p-6">
              <FeatureItem text="Advanced styles" />
              <FeatureItem text="AI coaching layer" />
              <FeatureItem text="Expanded library" />

              <div className="rounded-2xl border bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">
                    Developer upgrade pending
                  </p>
                </div>
              </div>

              <Button variant="outline" disabled className="w-full">
                Premium Coming Soon
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 text-sm text-muted-foreground">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
      <span>{text}</span>
    </div>
  );
}
