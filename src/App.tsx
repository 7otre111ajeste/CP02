import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import LessonPage from "./pages/LessonPage";
import MarketPage from "./pages/MarketPage";
import CoinDetailPage from "./pages/CoinDetailPage";
import AIPage from "./pages/AIPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import NotesPage from "./pages/NotesPage";
import CalculatorPage from "./pages/CalculatorPage";
import HalalMethodologyPage from "./pages/HalalMethodologyPage";
import SafetyMethodologyPage from "./pages/SafetyMethodologyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/project/:id" element={<ProjectDetailPage />} />
              <Route path="/learn/lesson/:id" element={<LessonPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/market/:id" element={<CoinDetailPage />} />
              <Route path="/ai" element={<AIPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/methodology/halal" element={<HalalMethodologyPage />} />
              <Route path="/methodology/safety" element={<SafetyMethodologyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
