import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineQueueSync from "./components/OfflineQueueSync";
import PublicShell from "./components/PublicShell";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const History = lazy(() => import("./pages/History"));
const ObservationMap = lazy(() => import("./pages/ObservationMap"));
const ObservationResult = lazy(() => import("./pages/ObservationResult"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoading() {
  return <div className="loading-note">Loading…</div>;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/history"}>{() => <Suspense fallback={<PageLoading />}><History /></Suspense>}</Route>
      <Route path={"/map"}>{() => <Suspense fallback={<PageLoading />}><ObservationMap /></Suspense>}</Route>
      <Route path={"/results/:id"}>{params => <Suspense fallback={<PageLoading />}><ObservationResult id={Number(params.id)} /></Suspense>}</Route>
      <Route path={"/404"}>{() => <Suspense fallback={<PageLoading />}><NotFound /></Suspense>}</Route>
      <Route>{() => <Suspense fallback={<PageLoading />}><NotFound /></Suspense>}</Route>
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <OfflineQueueSync />
            <PublicShell><Router /></PublicShell>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
