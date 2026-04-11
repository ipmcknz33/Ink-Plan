import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Learn from "@/pages/Learn";
import Library from "@/pages/Library";
import ReferencePacks from "@/pages/ReferencePacks";
import FlashStudies from "@/pages/FlashStudies";
import Fundamentals from "@/pages/Fundamentals";
import StylesList from "@/pages/StylesList";
import StyleDetail from "@/pages/StyleDetail";
import Practice from "@/pages/Practice";
import Progress from "@/pages/Progress";
import Upgrade from "@/pages/Upgrade";
import CheckoutPro from "@/pages/CheckoutPro";

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

      <Route path="/learn">
        <ProtectedRoute>
          <Learn />
        </ProtectedRoute>
      </Route>

      <Route path="/library/reference-packs">
        <ProtectedRoute>
          <ReferencePacks />
        </ProtectedRoute>
      </Route>

      <Route path="/library/flash-studies">
        <ProtectedRoute>
          <FlashStudies />
        </ProtectedRoute>
      </Route>

      <Route path="/library/fundamentals">
        <ProtectedRoute>
          <Fundamentals />
        </ProtectedRoute>
      </Route>

      <Route path="/library">
        <ProtectedRoute>
          <Library />
        </ProtectedRoute>
      </Route>

      <Route path="/styles/:id">
        <ProtectedRoute>
          <StyleDetail />
        </ProtectedRoute>
      </Route>

      <Route path="/styles">
        <ProtectedRoute>
          <StylesList />
        </ProtectedRoute>
      </Route>

      <Route path="/practice">
        <ProtectedRoute>
          <Practice />
        </ProtectedRoute>
      </Route>

      <Route path="/progress">
        <ProtectedRoute>
          <Progress />
        </ProtectedRoute>
      </Route>

      <Route path="/checkout/pro">
        <ProtectedRoute>
          <CheckoutPro />
        </ProtectedRoute>
      </Route>

      <Route path="/upgrade">
        <ProtectedRoute>
          <Upgrade />
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
