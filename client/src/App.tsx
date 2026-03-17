import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import StylesList from "@/pages/StylesList";
import StyleDetail from "@/pages/StyleDetail";
import Practice from "@/pages/Practice";
import Library from "@/pages/Library";
import ProtectedRoute from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/styles">
        <ProtectedRoute>
          <StylesList />
        </ProtectedRoute>
      </Route>
      
      <Route path="/styles/:id">
        <ProtectedRoute>
          <StyleDetail />
        </ProtectedRoute>
      </Route>
      
      <Route path="/practice">
        <ProtectedRoute>
          <Practice />
        </ProtectedRoute>
      </Route>
      
      <Route path="/library">
        <ProtectedRoute>
          <Library />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
