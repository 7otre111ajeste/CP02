import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DailyQuestsProvider } from "@/hooks/useDailyQuests";
import { useProgressSync } from "@/hooks/useProgressSync";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import PageToolbar from "@/components/PageToolbar";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import LessonPage from "./pages/LessonPage";
import MarketPage from "./pages/MarketPage";
import CoinDetailPage from "./pages/CoinDetailPage";
import AIPage from "./pages/AIPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import QuizPage from "./pages/QuizPage";
import NotesPage from "./pages/NotesPage";
import CalculatorPage from "./pages/CalculatorPage";
import HalalMethodologyPage from "./pages/HalalMethodologyPage";
import SafetyMethodologyPage from "./pages/SafetyMethodologyPage";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import PlatformsPage from "./pages/PlatformsPage";
import PortfolioPage from "./pages/PortfolioPage";
import PracticePage from "./pages/PracticePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ExchangeWalletPage from "./pages/ExchangeWalletPage";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProgressSyncer() {
  useProgressSync();
  return null;
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("cryptopedia-splash-seen");
  });

  const handleSplashDone = () => {
    sessionStorage.setItem("cryptopedia-splash-seen", "true");
    setShowSplash(false);
  };

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {showSplash && <SplashScreen onDone={handleSplashDone} />}
        {!showSplash && (
          <div className="min-h-screen bg-background">
            <PageToolbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/project/:id" element={<ProjectDetailPage />} />
              <Route path="/learn/lesson/:id" element={<LessonPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/market/:id" element={<CoinDetailPage />} />
              <Route path="/ai" element={<AIPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/methodology/halal" element={<HalalMethodologyPage />} />
              <Route path="/methodology/safety" element={<SafetyMethodologyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/platforms" element={<PlatformsPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/learn/exchanges-wallets" element={<ExchangeWalletPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        )}
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <DailyQuestsProvider>
          <TooltipProvider>
            <ProgressSyncer />
            <AppContent />
          </TooltipProvider>
        </DailyQuestsProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
