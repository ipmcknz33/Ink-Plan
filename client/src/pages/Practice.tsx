import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Save } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Practice() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins default
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDurationChange = (val: number[]) => {
    setDuration(val[0]);
    setTimeLeft(val[0] * 60);
    setIsActive(false);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 space-y-8 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-display font-bold">Free Practice Mode</h2>
          <p className="text-muted-foreground">Select your time, grab your pen, and focus.</p>
        </div>

        <Card className="p-12 border-4 border-primary/10 shadow-xl bg-card relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-primary to-accent opacity-20" />

          <div className="space-y-12 relative z-10">
            {/* Timer Display */}
            <div className="font-mono text-9xl font-bold tracking-tighter tabular-nums text-primary">
              {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-6">
              <Button 
                size="lg" 
                className={`h-16 w-16 rounded-full border-4 ${isActive ? 'border-primary' : 'border-accent'} text-primary-foreground`}
                onClick={toggleTimer}
              >
                {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 w-16 rounded-full border-2"
                onClick={resetTimer}
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>

            {/* Duration Slider */}
            <div className="max-w-xs mx-auto space-y-4">
              <label className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-widest">
                Duration: {duration} Minutes
              </label>
              <Slider 
                defaultValue={[5]} 
                max={60} 
                min={1} 
                step={1} 
                value={[duration]}
                onValueChange={handleDurationChange}
                className="py-4"
              />
            </div>

            {/* Prompt Generator */}
             <div className="pt-8 border-t border-border">
                <p className="text-sm font-mono text-muted-foreground mb-4">NEED A PROMPT?</p>
                <p className="text-xl font-display font-medium max-w-lg mx-auto leading-relaxed">
                  "Draw a dagger piercing a heart with a banner that says 'MOM' using only black ink."
                </p>
                <Button variant="link" className="mt-2 text-accent">Generate New Prompt</Button>
             </div>
          </div>
        </Card>

        {isActive && (
           <div className="animate-pulse text-accent font-mono text-sm font-bold tracking-[0.2em] uppercase">
              • Session in Progress •
           </div>
        )}
      </div>
    </Layout>
  );
}
