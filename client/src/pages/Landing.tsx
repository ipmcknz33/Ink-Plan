import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenTool, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <h1 className="text-2xl font-display font-black tracking-tighter uppercase">
          Ink<span className="text-accent">Plan</span>
        </h1>
        <div className="flex gap-4">
          <a href="/api/login">
            <Button className="font-bold" data-testid="button-login">Get Started</Button>
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block px-3 py-1 mb-6 border border-primary/20 rounded-full bg-secondary/50 backdrop-blur-sm">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary">For Serious Apprentices</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black leading-tight tracking-tight mb-6">
              Respect the Craft.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Master the Styles.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
              Structured practice drills, style rules, and step-by-step lessons to take you from scratcher to artist.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/api/login">
                <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105" data-testid="button-start-training">
                  Start Training <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        </section>

        <section className="py-20 bg-card border-y border-border">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                <BookOpenIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-display">Deep Style Study</h3>
              <p className="text-muted-foreground">Don't just copy. Understand the rules, history, and definitions of American Traditional, Neo-Trad, and more.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/5 rounded-xl flex items-center justify-center border border-accent/10">
                <PenTool className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold font-display">Timed Drills</h3>
              <p className="text-muted-foreground">Build muscle memory with specific, timed exercises designed to improve line confidence and shading.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-display">Track Progress</h3>
              <p className="text-muted-foreground">Keep a digital portfolio of your practice sheets. Watch your lines get cleaner over time.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t border-border text-center text-sm text-muted-foreground font-mono">
        &copy; 2026 InkPlan. Built for the trade.
      </footer>
    </div>
  );
}

function BookOpenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
