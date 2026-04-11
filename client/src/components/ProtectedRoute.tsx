import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/providers/AuthProvider";

type Props = {
  children: ReactNode;
};

const subscriberRoutes = ["/styles/traditional", "/styles/lettering"];

const premiumRoutes = [
  "/styles/black-grey",
  "/styles/japanese",
  "/styles/chicano",
  "/styles/japanese-realism",
  "/styles/geometric",
  "/styles/biomechanical",
  "/styles/polynesian",
  "/styles/color-realism",
  "/styles/surrealism",
  "/styles/watercolor",
];

function matchesRoute(location: string, routes: string[]) {
  return routes.some(
    (route) => location === route || location.startsWith(`${route}/`),
  );
}

export default function ProtectedRoute({ children }: Props) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isHydrated, access } = useAuth();

  const phase = access?.phase ?? "trial";
  const requiresSubscriber = matchesRoute(location, subscriberRoutes);
  const requiresPremium = matchesRoute(location, premiumRoutes);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      if (location !== "/") {
        setLocation("/");
      }
      return;
    }

    if (requiresSubscriber && phase !== "subscribed") {
      setLocation("/upgrade");
      return;
    }

    if (requiresPremium) {
      setLocation("/upgrade");
    }
  }, [
    isAuthenticated,
    isHydrated,
    location,
    phase,
    requiresPremium,
    requiresSubscriber,
    setLocation,
  ]);

  if (!isHydrated) return null;
  if (!isAuthenticated) return null;
  if (requiresSubscriber && phase !== "subscribed") return null;
  if (requiresPremium) return null;

  return <>{children}</>;
}
