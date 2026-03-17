import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Share2, Loader2 } from "lucide-react";
import { useDrawings } from "@/hooks/use-api";

export default function Library() {
  const { data: drawings, isLoading } = useDrawings();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const hasDrawings = drawings && drawings.length > 0;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold">Your Sketchbook</h2>
            <p className="text-muted-foreground">A digital archive of your progress.</p>
          </div>
          <Button className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" data-testid="button-upload">
            <Plus className="w-4 h-4 mr-2" /> Upload Drawing
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hasDrawings ? (
            drawings.map((drawing) => (
              <Card key={drawing.id} className="group overflow-hidden border-2 border-transparent hover:border-border transition-all" data-testid={`card-drawing-${drawing.id}`}>
                <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                  <img 
                    src={drawing.imageUrl} 
                    alt={drawing.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm">
                      <Share2 className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-bold text-sm truncate">{drawing.title}</p>
                    <p className="text-xs text-white/70 font-mono">
                      {new Date(drawing.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">No drawings yet. Upload your first practice sheet!</p>
            </div>
          )}
          
          <div className="aspect-[3/4] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/20 hover:border-primary/50 transition-colors cursor-pointer group" data-testid="card-add-new">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
               <Plus className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm">Add New Page</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
