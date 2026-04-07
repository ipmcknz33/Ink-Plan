"use client";

import { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  GraduationCap,
  Library,
  Palette,
  PenTool,
  BarChart3,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

function getUserLabel(email?: string | null) {
  if (!email) return "Guest";

  const normalized = email.toLowerCase();

  if (
    normalized.includes("guest") ||
    normalized.startsWith("guest@") ||
    normalized.startsWith("guest-")
  ) {
    return "Guest";
  }

  return email;
}

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
      label: "Styles",
      icon: Palette,
      href: "/styles",
    },
    {
      label: "Practice",
      icon: PenTool,
      href: "/practice",
    },
    {
      label: "Library",
      icon: Library,
      href: "/library",
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
      window.location.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  const userLabel = getUserLabel(user?.email);
  const avatarLetter = user?.email?.charAt(0).toUpperCase() || "G";

  return (
    <aside className="hidden md:flex md:w-72 md:flex-col md:border-r md:border-border md:bg-card">
      <div className="flex h-20 items-center border-b border-border px-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 text-left transition-opacity hover:opacity-90"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <span className="text-sm font-semibold tracking-[0.16em] text-red-400">
              IP
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              InkPlan
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Apprenticeship prep platform
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
                type="button"
                onClick={() => navigate(item.href)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.22)]"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-3">
          <div className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-sm text-white">
                {avatarLetter}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {userLabel}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ready to keep building your craft.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
