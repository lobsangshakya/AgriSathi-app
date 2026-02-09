import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DashboardClean";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import DiseaseDetection from "./pages/DiseaseDetectionEnhanced";
import Chat from "./pages/ChatEnhanced";
import ExpertConsultation from "./pages/ExpertConsultation";
import AgriCredits from "./pages/AgriCredits";
import Wallet from "./pages/Wallet";
import ServiceConfirmation from "./pages/ServiceConfirmation";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";
import { BottomNavigationEnhanced } from "./components/BottomNavigationEnhanced";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { WalletProvider } from "./contexts/WalletContext";
import Auth from "./pages/AuthEnhanced";
import ErrorBoundary from "./components/ErrorBoundary";
import { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal';
import { useLanguage } from './contexts/LanguageContext';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoggedIn } = useUser();
  const { language } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // Show auth modal if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <div className="mb-8">
              <img 
                src="/src/assets/AgriSathi Logo.png" 
                alt="AgriSathi" 
                className="w-24 h-24 mx-auto rounded-2xl shadow-lg"
              />
              <h1 className="text-3xl font-bold text-gray-900 mt-4">
                {language === 'hindi' ? 'AgriSaathi' : 'AgriSathi'}
              </h1>
              <p className="text-gray-600 mt-2">
                {language === 'hindi' 
                  ? 'आपका स्मार्ट फार्मिंग सहायक' 
                  : 'Your Smart Farming Assistant'}
              </p>
            </div>
            <AuthModal 
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              initialView={authView}
            />
          </div>
        </div>
      </div>
    );
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
