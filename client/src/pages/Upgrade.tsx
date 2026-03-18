import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  CreditCard,
  Crown,
  Layers3,
  Settings,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Core access for getting started.",
    features: [
      "Basic platform access",
      "Intro learning sections",
      "Core dashboard experience",
    ],
  },
  {
    name: "Pro",
    description: "Expanded access for committed learners.",
    features: [
      "Deeper learning content",
      "More structured paths",
      "Additional library access",
    ],
  },
  {
    name: "Premium",
    description: "Full platform access for the complete experience.",
    features: [
      "Advanced curriculum",
      "Premium-only resources",
      "Highest level content access",
    ],
  },
];

export default function Upgrade() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Plans
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Subscription settings
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            This page will become the subscription and billing area for InkPlan.
            For now, keep it calm and functional while the payment system and
            tier handling are still being built.
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Upgrade page direction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              This should feel more like a clean account plan page than a hard
              sales page. Stripe can be connected after the product shell and
              subscription UI are stable.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="border-border shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  {plan.name === "Premium" ? (
                    <Crown className="h-5 w-5 text-primary" />
                  ) : plan.name === "Pro" ? (
                    <Layers3 className="h-5 w-5 text-primary" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment integration later
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Stripe is the right next payment API choice here, but we should
                wire it after the plan UI, access states, and upgrade flow are
                visually correct.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Build phase note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Keep this page visible while developing. Later we can connect it
                to live billing status, current plan, checkout, and subscription
                management.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
