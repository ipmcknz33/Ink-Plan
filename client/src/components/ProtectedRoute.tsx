"use client";

import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/providers/AuthProvider";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isHydrated, navigate]);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}