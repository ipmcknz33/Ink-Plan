"use client";

import { useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  PenTool,
  Library,
  BarChart3,
  Sparkles,
  Menu,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/AuthProvider";

type LayoutProps = {
  children: ReactNode;
};

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

export default function Layout({ children }: LayoutProps) {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Learn", href: "/learn", icon: GraduationCap },
    { label: "Styles", href: "/styles", icon: BookOpen },
    { label: "Practice", href: "/practice", icon: PenTool },
    { label: "Library", href: "/library", icon: Library },
    { label: "Progress", href: "/progress", icon: BarChart3 },
    { label: "Upgrade", href: "/upgrade", icon: Sparkles },
  ];

  const userLabel = getUserLabel(user?.email);
  const avatarLetter = user?.email?.charAt(0).toUpperCase() || "G";

  const handleNavigate = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      setIsMobileMenuOpen(false);
      navigate("/", { replace: true });
      window.location.replace("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      <div className="border-b border-border px-4 py-4 sm:px-5 sm:py-5">
        <button
          type="button"
          onClick={() => handleNavigate("/dashboard")}
          className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-90"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <span className="text-sm font-semibold tracking-[0.16em] text-red-400">
              IP
            </span>
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-white">
              InkPlan
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              Apprenticeship prep platform
            </p>
          </div>
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4 ink-scroll-touch">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNavigate(item.href)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.22)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border p-4">
        <div className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0 border border-white/10">
              <AvatarFallback className="bg-zinc-900 text-sm text-white">
                {avatarLetter}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {userLabel}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full justify-start rounded-2xl px-4 py-6 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="mr-3 h-4 w-4 shrink-0" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => handleNavigate("/dashboard")}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <span className="text-xs font-semibold tracking-[0.16em] text-red-400">
                IP
              </span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-white">
                InkPlan
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Apprenticeship prep
              </p>
            </div>
          </button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-white hover:bg-white/5"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[86vw] max-w-72 border-r border-border bg-card p-0"
            >
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-72 shrink-0 border-r border-border bg-card lg:sticky lg:top-0 lg:block">
          {sidebarContent}
        </aside>

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10">
          <div className="ink-content-width">{children}</div>
        </main>
      </div>
    </div>
  );
}
