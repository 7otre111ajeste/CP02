import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "fr";

type Translations = Record<string, Record<Language, string>>;

const LANGUAGE_STORAGE_KEY = "cryptopedia-language";

const translations: Translations = {
  // Nav
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.learn": { en: "Learn", fr: "Apprendre" },
  "nav.market": { en: "Market", fr: "Marché" },
  "nav.ai": { en: "AI", fr: "IA" },
  "nav.profile": { en: "Profile", fr: "Profil" },

  // Home
  "home.welcome": { en: "Welcome back", fr: "Bon retour" },
  "home.level": { en: "Level", fr: "Niveau" },
  "home.exp": { en: "EXP", fr: "EXP" },
  "home.continue": { en: "Continue Learning", fr: "Continuer" },
  "home.quiz": { en: "Take a Quiz", fr: "Faire un Quiz" },
  "home.scanner": { en: "AI Scanner", fr: "Scanner IA" },
  "home.popular": { en: "Popular Projects", fr: "Projets Populaires" },
  "home.quickActions": { en: "Quick Actions", fr: "Actions Rapides" },

  // Learn
  "learn.dictionary": { en: "Dictionary", fr: "Dictionnaire" },
  "learn.projects": { en: "Projects", fr: "Projets" },
  "learn.training": { en: "Training", fr: "Formation" },
  "learn.title": { en: "Learn Crypto", fr: "Apprendre la Crypto" },
  "learn.searchTerms": { en: "Search terms...", fr: "Rechercher..." },
  "learn.searchProjects": { en: "Search projects...", fr: "Rechercher des projets..." },

  // Market
  "market.title": { en: "Crypto Market", fr: "Marché Crypto" },
  "market.search": { en: "Search coins...", fr: "Rechercher..." },
  "market.price": { en: "Price", fr: "Prix" },
  "market.change": { en: "24h Change", fr: "Variation 24h" },
  "market.cap": { en: "Market Cap", fr: "Capitalisation" },

  // AI
  "ai.title": { en: "Crypto Analyzer", fr: "Analyseur Crypto" },
  "ai.placeholder": { en: "Type a crypto name or question...", fr: "Tapez un nom de crypto ou une question..." },
  "ai.analyze": { en: "Analyze", fr: "Analyser" },
  "ai.halal": { en: "Halal Status", fr: "Statut Halal" },
  "ai.safety": { en: "Safety Status", fr: "Statut Sécurité" },
  "ai.explanation": { en: "Explanation", fr: "Explication" },

  // Profile
  "profile.title": { en: "My Profile", fr: "Mon Profil" },
  "profile.login": { en: "Log In", fr: "Se Connecter" },
  "profile.signup": { en: "Sign Up", fr: "S'inscrire" },
  "profile.settings": { en: "Settings", fr: "Paramètres" },
  "profile.language": { en: "Language", fr: "Langue" },
  "profile.progress": { en: "My Progress", fr: "Ma Progression" },
  "profile.quizzes": { en: "Quizzes Completed", fr: "Quiz Complétés" },
  "profile.lessons": { en: "Lessons Read", fr: "Leçons Lues" },

  // Tags
  "tag.halal": { en: "Halal", fr: "Halal" },
  "tag.notHalal": { en: "Not Halal", fr: "Non Halal" },
  "tag.uncertain": { en: "Uncertain", fr: "Incertain" },
  "tag.safe": { en: "Safe", fr: "Sûr" },
  "tag.risky": { en: "Risky", fr: "Risqué" },
  "tag.scam": { en: "Scam", fr: "Arnaque" },

  // Quiz
  "quiz.title": { en: "Quiz Time", fr: "Quiz" },
  "quiz.start": { en: "Start Quiz", fr: "Commencer le Quiz" },
  "quiz.remaining": { en: "quizzes remaining today", fr: "quiz restants aujourd'hui" },
  "quiz.correct": { en: "Correct!", fr: "Correct !" },
  "quiz.wrong": { en: "Wrong!", fr: "Faux !" },
  "quiz.next": { en: "Next", fr: "Suivant" },
  "quiz.finish": { en: "Finish", fr: "Terminer" },
  "quiz.score": { en: "Your Score", fr: "Votre Score" },
  "quiz.expEarned": { en: "EXP earned", fr: "EXP gagnés" },

  // Common
  "common.readMore": { en: "Read More", fr: "Lire Plus" },
  "common.back": { en: "Back", fr: "Retour" },
  "common.search": { en: "Search", fr: "Rechercher" },
  "common.loading": { en: "Loading...", fr: "Chargement..." },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return savedLanguage === "fr" || savedLanguage === "en" ? savedLanguage : "en";
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
