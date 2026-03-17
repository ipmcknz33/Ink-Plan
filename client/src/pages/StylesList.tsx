import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import { useStyles } from "@/hooks/use-api";

export default function StylesList() {
  const { data: styles, isLoading } = useStyles();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-display font-bold">Style Dictionary</h2>
          <p className="text-muted-foreground">Select a tradition to master its rules and techniques.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles?.map((style) => (
            <Link key={style.id} href={`/styles/${style.id}`}>
              <Card className="group cursor-pointer overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg" data-testid={`card-style-${style.id}`}>
                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                  <img 
                    src={style.previewImage} 
                    alt={style.name} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-display font-bold text-white mb-1">{style.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {style.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 backdrop-blur-sm text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 pt-6">
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {style.definition}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end">
                   <span className="text-xs font-bold font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                     OPEN STUDY <ArrowRight className="w-3 h-3" />
                   </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
