import Layout from "@/components/Layout";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Play, Info, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStyle } from "@/hooks/use-api";

interface Drill {
  title: string;
  minutes: number;
  prompt: string;
}

export default function StyleDetail() {
  const [match, params] = useRoute("/styles/:id");
  const { data: style, isLoading } = useStyle(params?.id || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!style) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Style not found</h2>
        </div>
      </Layout>
    );
  }

  const drills: Drill[] = JSON.parse(style.drills || "[]");

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden border border-border h-[300px]">
          <img src={style.previewImage} alt={style.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
             <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">{style.name}</h1>
              <p className="text-lg text-white/80 font-serif italic max-w-2xl border-l-4 border-accent pl-4">
                "{style.definition}"
              </p>
             </div>
          </div>
        </div>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 border-b border-border rounded-none space-x-6">
            <TabsTrigger 
              value="rules" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-lg px-0 py-3"
              data-testid="tab-rules"
            >
              The Rules
            </TabsTrigger>
            <TabsTrigger 
              value="drills" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-lg px-0 py-3"
              data-testid="tab-drills"
            >
              Practice Drills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="mt-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-accent" />
                    <h3 className="text-2xl font-display font-bold">Core Principles</h3>
                 </div>
                 <div className="space-y-4">
                    {style.rules.map((rule, i) => (
                      <Card key={i} className="border-l-4 border-l-primary border-y border-r border-border bg-card/50">
                        <CardContent className="p-4">
                          <p className="font-medium">{rule}</p>
                        </CardContent>
                      </Card>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                    <h3 className="text-2xl font-display font-bold">Common Mistakes</h3>
                 </div>
                 <div className="space-y-4">
                    {style.commonMistakes.map((mistake, i) => (
                      <Alert key={i} variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive-foreground">
                        <AlertTitle className="font-bold">Avoid this:</AlertTitle>
                        <AlertDescription>{mistake}</AlertDescription>
                      </Alert>
                    ))}
                 </div>
              </div>
            </div>
            
            <div className="p-6 bg-secondary/30 rounded-lg border border-border flex gap-4 items-start">
               <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
               <div>
                 <h4 className="font-bold font-display text-lg mb-2">From the Masters</h4>
                 <p className="text-muted-foreground">
                   When studying {style.name}, focus on <span className="text-foreground font-bold">clarity over complexity</span>. 
                   If it can't be read from across the room, it's too busy.
                 </p>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="drills" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drills.map((drill, i) => (
                <Card key={i} className="flex flex-col border-2 border-border shadow-sm hover:border-primary transition-colors" data-testid={`card-drill-${i}`}>
                  <CardHeader>
                    <div className="text-sm font-mono text-muted-foreground mb-1">DRILL #{i+1} • {drill.minutes} MIN</div>
                    <CardTitle className="font-display text-xl">{drill.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{drill.prompt}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button className="w-full font-bold group" data-testid={`button-start-drill-${i}`}>
                      Start Timer <Play className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
