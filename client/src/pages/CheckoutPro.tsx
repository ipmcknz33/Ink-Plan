import { useState } from "react";
import Layout from "@/components/Layout";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";

type CheckoutSessionResponse = {
  url?: string;
  error?: string;
};

export default function CheckoutPro() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function handleCompleteCheckout() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setCheckoutError("");

    try {
      const response = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          plan: "pro",
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          text?.trim()
            ? "Checkout route returned a non-JSON response."
            : "Checkout route did not return a valid response.",
        );
      }

      const data = (await response.json()) as CheckoutSessionResponse;

      if (!response.ok) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      if (!data.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Something went wrong starting checkout.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => setLocation("/upgrade")}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="rounded-3xl border">
          <CardContent className="space-y-6 p-6">
            <div>
              <h1 className="text-2xl font-bold">Checkout</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete your Pro subscription
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border p-4">
              <h2 className="font-semibold">InkPlan Pro</h2>

              <div className="flex justify-between text-sm">
                <span>Monthly subscription</span>
                <span>$24</span>
              </div>

              <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                <span>Total</span>
                <span>$24/mo</span>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-primary" />
                Secure checkout
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                You will be redirected to Stripe to complete payment securely.
              </p>
            </div>

            {checkoutError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {checkoutError}
              </div>
            ) : null}

            <Button
              className="w-full gap-2"
              onClick={handleCompleteCheckout}
              disabled={isSubmitting}
            >
              <CreditCard className="h-4 w-4" />
              {isSubmitting
                ? "Starting Checkout..."
                : "Proceed to Secure Checkout"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              After payment, Stripe should return you to the app.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
