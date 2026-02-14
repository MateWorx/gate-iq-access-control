
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ResidentDashboardPage from "./pages/ResidentDashboardPage";
import SecurityDashboardPage from "./pages/SecurityDashboardPage";
import VisitorRegistrationPage from "./pages/VisitorRegistrationPage";
import ScanningPage from "./pages/ScanningPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Resident Routes */}
          <Route path="/dashboard" element={<ResidentDashboardPage />} />
          <Route path="/visitors/register" element={<VisitorRegistrationPage />} />
          
          {/* Security Routes */}
          <Route path="/security" element={<SecurityDashboardPage />} />
          <Route path="/security/access" element={<ScanningPage />} />

          {/* Onboarding Routes */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
