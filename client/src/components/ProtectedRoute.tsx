import { ReactNode } from "react";
import { useLocation } from "wouter";
import { getAccessPhase } from "@/lib/access";

type Props = {
  children: ReactNode;
};

function read(key: string) {
  try {
    return localStorage.getItem(key)?.toLowerCase() || "";
  } catch {
    return "";
  }
}

function isSubscriber() {
  const values = [
    read("inkplan-subscription-tier"),
    read("subscriptionTier"),
    read("inkplan-tier"),
    read("inkplan-subscription"),
    read("inkplan-plan"),
    read("plan"),
    read("subscription"),
  ];

  return values.some((v) =>
    [
      "subscriber",
      "subscribed",
      "active",
      "paid",
      "pro",
      "monthly",
      "yearly",
    ].includes(v),
  );
}

export default function ProtectedRoute({ children }: Props) {
  const [location, setLocation] = useLocation();

  const phase = getAccessPhase();
  const subscriber = isSubscriber();

  // --- GLOBAL LOCK (no skipping app entry)
  if (location !== "/" && !phase) {
    setLocation("/");
    return null;
  }

  // --- ROUTE LEVEL GATING
  const requiresSubscriptionRoutes = [
    "/styles/traditional",
    "/styles/lettering",
    "/library/reference-packs/traditional",
    "/library/reference-packs/lettering",
  ];

  const isRestricted = requiresSubscriptionRoutes.some((route) =>
    location.includes(route),
  );

  if (isRestricted && !subscriber) {
    setLocation("/upgrade");
    return null;
  }

  // --- FUTURE PREMIUM LOCK
  const premiumRoutes = [
    "/styles/japanese",
    "/styles/black-grey",
    "/styles/chicano",
    "/styles/geometric",
  ];

  const isPremiumRoute = premiumRoutes.some((route) =>
    location.includes(route),
  );

  if (isPremiumRoute) {
    setLocation("/upgrade");
    return null;
  }

  return <>{children}</>;
}
