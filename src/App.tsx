import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DashboardEnhanced";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import DiseaseDetection from "./pages/DiseaseDetection";
import Chat from "./pages/Chat";
import ExpertConsultation from "./pages/ExpertConsultation";
import AgriCredits from "./pages/AgriCredits";
import Wallet from "./pages/Wallet";
import ServiceConfirmation from "./pages/ServiceConfirmation";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { WalletProvider } from "./contexts/WalletContext";
import Auth from "./pages/AuthEnhanced";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return <Auth onAuth={() => {}} />;
  }

  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/expert-consultation" element={<ExpertConsultation />} />
          <Route path="/agri-credits" element={<AgriCredits />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/service-confirmation" element={<ServiceConfirmation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <UserProvider>
          <WalletProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </TooltipProvider>
            </QueryClientProvider>
          </WalletProvider>
        </UserProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
