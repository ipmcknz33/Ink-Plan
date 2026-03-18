"use client";

import { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  GraduationCap,
  Library,
  Palette,
  BarChart3,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Learn",
      icon: GraduationCap,
      href: "/learn",
    },
    {
      label: "Library",
      icon: Library,
      href: "/library",
    },
    {
      label: "Styles",
      icon: Palette,
      href: "/styles",
    },
    {
      label: "Progress",
      icon: BarChart3,
      href: "/progress",
    },
    {
      label: "Upgrade",
      icon: Sparkles,
      href: "/upgrade",
    },
  ];

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <aside className="hidden md:flex md:w-72 md:flex-col md:border-r md:border-border md:bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 text-left transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-lg font-bold text-primary">IP</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-foreground">
              InkPlan
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tattoo Education Platform
            </p>
          </div>
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-background px-4 py-4">
            <p className="text-sm font-semibold text-foreground">
              {user?.email ?? "Signed in"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ready to keep building your craft.
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
