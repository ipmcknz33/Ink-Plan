import { Link, useLocation } from "wouter";
import { PenTool, Library, BookOpen, LayoutDashboard, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-api";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Styles", href: "/styles", icon: BookOpen },
    { label: "Practice", href: "/practice", icon: PenTool },
    { label: "Library", href: "/library", icon: Library },
  ];

  const displayName = profile?.displayName || user?.firstName || user?.email || "Artist";
  const initials = displayName.slice(0, 2).toUpperCase();
  const planName = profile?.planId === "pro" ? "Pro Plan" : "Free Plan";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-display font-black tracking-tighter uppercase">
          Ink<span className="text-accent">Plan</span>
        </h1>
        <p className="text-xs text-muted-foreground font-mono mt-1">v1.0.0-MVP</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href || location.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group cursor-pointer
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"}`} />
                <span className="font-medium font-sans">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-md bg-secondary/30">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={user?.profileImageUrl || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate" data-testid="text-display-name">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{planName}</p>
          </div>
          <a href="/api/logout">
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </a>
        </div>
        {profile?.planId === "free" && (
          <Link href="/upgrade">
            <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-white font-bold border-none" size="sm" data-testid="button-upgrade">
              Upgrade to Pro
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 px-4 flex items-center justify-between">
         <h1 className="text-xl font-display font-black tracking-tighter uppercase">
          Ink<span className="text-accent">Plan</span>
        </h1>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 animate-in fade-in duration-500">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
