import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EvaluationProvider } from "./contexts/EvaluationContext";
import { EnhancedNotificationProvider } from "./contexts/EnhancedNotificationContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Sessions from "./pages/Sessions";
import Dynamics from "./pages/Dynamics";
import Materials from "./pages/Materials";
import FacilitatorGuide from "./pages/FacilitatorGuide";
import Evaluation from "./pages/Evaluation";
import EvaluationTracking from "./pages/EvaluationTracking";
import ComparisonCharts from "./pages/ComparisonCharts";
import GroupDashboard from "./pages/GroupDashboard";
import AdvancedSearch from './pages/AdvancedSearch';
import ExecutiveSummary from './pages/ExecutiveSummary';
import SessionCalendar from "./pages/SessionCalendar";
import Dashboard from "./pages/Dashboard";

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/" component={Home} />
        <Route path="/programa" component={About} />
        <Route path="/sesiones" component={Sessions} />
        <Route path="/dinamicas" component={Dynamics} />
        <Route path="/materiales" component={Materials} />
        <Route path="/guia" component={FacilitatorGuide} />
        <Route path="/evaluacion" component={Evaluation} />
        <Route path="/registro-evaluaciones" component={EvaluationTracking} />
        <Route path="/analisis-comparativo" component={ComparisonCharts} />
        <Route path="/dashboard-grupos" component={GroupDashboard} />
        <Route path="/busqueda-avanzada" component={AdvancedSearch} />
        <Route path="/resumen-ejecutivo" component={ExecutiveSummary} />
        <Route path="/calendario" component={SessionCalendar} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <EnhancedNotificationProvider>
        <ThemeProvider defaultTheme="light" switchable>
          <EvaluationProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </EvaluationProvider>
        </ThemeProvider>
      </EnhancedNotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
