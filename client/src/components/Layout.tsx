"use client";

import { useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  Library,
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
    { label: "Styles", href: "/styles", icon: BookOpen },
    { label: "Practice", href: "/practice", icon: PenTool },
    { label: "Library", href: "/library", icon: Library },
  ];

  const userLabel = getUserLabel(user?.email);
  const avatarLetter = user?.email?.charAt(0).toUpperCase() || "G";

  const handleNavigate = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
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

  const SidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">INKPLAN</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNavigate(item.href)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="space-y-4 border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{avatarLetter}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 text-xs">
            <p className="truncate font-medium text-slate-900">{userLabel}</p>
            <p className="text-slate-500">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:hidden flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">INKPLAN</h1>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72 p-0">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-200 bg-white lg:block">
          {SidebarContent}
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
