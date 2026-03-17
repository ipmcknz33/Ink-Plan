import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, Calendar, Loader2 } from "lucide-react";
import { useProfile, useStyles, useDrawings, useProgress } from "@/hooks/use-api";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: styles, isLoading: stylesLoading } = useStyles();
  const { data: drawings, isLoading: drawingsLoading } = useDrawings();
  const { data: progressData, isLoading: progressLoading } = useProgress();

  const isLoading = profileLoading || stylesLoading || drawingsLoading || progressLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const drawingsCount = drawings?.length || 0;
  const totalHours = progressData?.reduce((sum, p) => sum + (p.hoursPracticed || 0), 0) || 0;
  
  const progressMap = new Map(
    progressData?.map((p) => [p.styleId, p.progressPercent || 0]) || []
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-display font-bold">Shop Status</h2>
          <p className="text-muted-foreground mt-1">Welcome back, {profile?.displayName || "Artist"}. Ready to ink?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground">Drawings</CardTitle>
              <Trophy className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display" data-testid="text-drawings-count">{drawingsCount}</div>
              <p className="text-xs text-muted-foreground">Total sheets completed</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground">Hours</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display" data-testid="text-hours-practiced">{totalHours}h</div>
              <p className="text-xs text-muted-foreground">Time on the machine (pen)</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-border shadow-sm bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-wider text-primary-foreground/80">Streak</CardTitle>
              <Flame className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display" data-testid="text-streak">0 Days</div>
              <p className="text-xs text-primary-foreground/60">Keep the fire burning</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold border-b border-border pb-2">Style Mastery</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {styles?.map((style) => (
              <Card 
                key={style.id} 
                className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => setLocation(`/styles/${style.id}`)}
                data-testid={`card-style-${style.id}`}
              >
                <div className="flex">
                  <div className="w-24 h-auto bg-muted object-cover relative">
                     <img src={style.previewImage} alt={style.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold font-display text-lg group-hover:text-accent transition-colors">{style.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{style.definition}</p>
                      </div>
                      <span className="font-mono text-sm font-bold" data-testid={`text-progress-${style.id}`}>
                        {progressMap.get(style.id) || 0}%
                      </span>
                    </div>
                    <Progress value={progressMap.get(style.id) || 0} className="h-2 mt-4 bg-secondary" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="p-6 border-2 border-dashed border-border rounded-lg bg-secondary/10">
              <h3 className="text-lg font-bold font-display mb-4">Daily Drill</h3>
              <p className="text-muted-foreground mb-6">Today's focus is on <span className="text-foreground font-bold">Line Consistency</span> in American Traditional.</p>
              <button 
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-all"
                onClick={() => setLocation('/styles/american_traditional')}
                data-testid="button-start-drill"
              >
                Start 5-min Warmup
              </button>
           </div>
        </div>

      </div>
    </Layout>
  );
}
