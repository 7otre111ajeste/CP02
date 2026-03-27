import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Eye, Globe } from "lucide-react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const { language } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const en = language === "en";

  const [phase, setPhase] = useState<"splash" | "buttons">("splash");

  useEffect(() => {
    // If user is already logged in, skip splash
    if (!loading && user) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setPhase("buttons"), 3000);
    return () => clearTimeout(timer);
  }, [loading, user, onDone]);

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      <AnimatePresence mode="wait">
        {phase === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl font-bold text-foreground mb-2"
            >
              Cryptopedia
            </motion.div>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              {en ? "Learn Crypto the Halal Way" : "Apprenez la Crypto de manière Halal"}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-6"
            >
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </motion.div>
          </motion.div>
        )}

        {phase === "buttons" && (
          <motion.div
            key="buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center px-8 w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-4xl font-bold text-foreground mb-2"
            >
              Cryptopedia
            </motion.div>
            <p className="text-sm text-muted-foreground mb-10">
              {en ? "Your crypto education companion" : "Votre compagnon d'éducation crypto"}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => { navigate("/auth"); onDone(); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
              >
                <UserPlus className="w-4 h-4" />
                {en ? "Create Account" : "Créer un Compte"}
              </button>

              <button
                onClick={() => { navigate("/auth"); onDone(); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:border-primary/30 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {en ? "Sign In" : "Se Connecter"}
              </button>

              <button
                onClick={onDone}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                <Eye className="w-4 h-4" />
                {en ? "Continue as Guest" : "Continuer en tant qu'invité"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
