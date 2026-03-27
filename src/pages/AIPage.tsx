import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "react-router-dom";
import { useWatchlist } from "@/hooks/useWatchlist";
import { supabase } from "@/integrations/supabase/client";
import { Send, Shield, AlertTriangle, Sparkles, Bot, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AnalysisResult {
  status: "halal" | "haram" | "douteux";
  safetyStatus: "safe" | "risky" | "scam";
  score: number;
  explanation: string;
  risks: string;
  conclusion: string;
}

export default function AIPage() {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const { toggleWatchlist, isWatching } = useWatchlist();

  useEffect(() => {
    const state = location.state as { projectName?: string } | null;
    if (state?.projectName) {
      setQuery(state.projectName);
      handleAnalyze(state.projectName);
    }
  }, [location.state]);

  const handleAnalyze = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    setProjectName(q);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-crypto", {
        body: { query: q, language },
      });

      if (error) {
        toast.error(language === "en" ? "Analysis failed. Try again." : "Analyse échouée. Réessayez.");
        console.error("Edge function error:", error);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setResult(data as AnalysisResult);
    } catch (e) {
      console.error("Analysis error:", e);
      toast.error(language === "en" ? "Something went wrong." : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const halalLabel = (s: string) => {
    if (s === "halal") return { label: "Halal ✅", class: "text-success bg-success/10 border-success/20" };
    if (s === "haram") return { label: "Haram ❌", class: "text-danger bg-danger/10 border-danger/20" };
    return { label: language === "en" ? "Doubtful ⚠️" : "Douteux ⚠️", class: "text-warning bg-warning/10 border-warning/20" };
  };

  const safetyLabel = (s: string) => {
    if (s === "safe") return { label: language === "en" ? "Safe" : "Sûr", class: "text-success bg-success/10 border-success/20" };
    if (s === "scam") return { label: "Scam", class: "text-danger bg-danger/10 border-danger/20" };
    return { label: language === "en" ? "Risky" : "Risqué", class: "text-warning bg-warning/10 border-warning/20" };
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center">
          <Bot className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("ai.title")}</h1>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "AI-powered halal & safety analysis" : "Analyse halal & sécurité par IA"}
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          placeholder={t("ai.placeholder")}
          className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
        <button
          onClick={() => handleAnalyze()}
          disabled={loading || !query.trim()}
          className="px-4 py-3 rounded-xl bg-gradient-primary text-primary-foreground disabled:opacity-50 transition-all"
        >
          {loading ? (
            <Sparkles className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Sparkles className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">
            {language === "en" ? `Analyzing ${projectName}...` : `Analyse de ${projectName} en cours...`}
          </p>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-card rounded-2xl p-5 border border-border glow-primary space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground capitalize">{projectName}</h2>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-bold text-primary">{result.score}</span>
                <span className="text-xs text-muted-foreground">/10</span>
              </div>
            </div>

            <div className="flex gap-3">
              {(() => { const h = halalLabel(result.status); return (
                <div className={`flex-1 p-3 rounded-xl border ${h.class}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-medium uppercase">{t("ai.halal")}</span>
                  </div>
                  <p className="text-sm font-bold">{h.label}</p>
                </div>
              ); })()}
              {(() => { const s = safetyLabel(result.safetyStatus); return (
                <div className={`flex-1 p-3 rounded-xl border ${s.class}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-medium uppercase">{t("ai.safety")}</span>
                  </div>
                  <p className="text-sm font-bold">{s.label}</p>
                </div>
              ); })()}
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t("ai.explanation")}</h3>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{result.explanation}</p>
            </div>

            {result.risks && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  {language === "en" ? "Risks" : "Risques"}
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed">{result.risks}</p>
              </div>
            )}

            {result.conclusion && (
              <div className="bg-secondary/50 rounded-xl p-3 border border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                  {language === "en" ? "Conclusion" : "Conclusion"}
                </h3>
                <p className="text-sm text-foreground font-medium">{result.conclusion}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Sparkles className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground">
            {language === "en"
              ? "Type a cryptocurrency name to get an instant AI analysis"
              : "Tapez le nom d'une cryptomonnaie pour obtenir une analyse IA instantanée"}
          </p>
        </div>
      )}
    </div>
  );
}
