import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, Shield, AlertTriangle, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResult {
  name: string;
  halalStatus: "halal" | "notHalal" | "uncertain";
  safetyStatus: "safe" | "risky" | "scam";
  explanation: string;
}

const mockAnalyze = (query: string, lang: string): AnalysisResult => ({
  name: query,
  halalStatus: "uncertain",
  safetyStatus: "safe",
  explanation: lang === "en"
    ? `Based on our analysis, ${query} appears to have a legitimate use case. However, always do your own research and consult a qualified scholar for halal verification. The project shows standard safety indicators, but crypto investments always carry risk.`
    : `Selon notre analyse, ${query} semble avoir un cas d'utilisation légitime. Cependant, faites toujours vos propres recherches et consultez un savant qualifié pour la vérification halal. Le projet montre des indicateurs de sécurité standards, mais les investissements crypto comportent toujours des risques.`,
});

export default function AIPage() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(mockAnalyze(query, language));
      setLoading(false);
    }, 1500);
  };

  const halalColor = (s: string) =>
    s === "halal" ? "text-success bg-success/10 border-success/20" : s === "notHalal" ? "text-danger bg-danger/10 border-danger/20" : "text-warning bg-warning/10 border-warning/20";

  const safetyColor = (s: string) =>
    s === "safe" ? "text-success bg-success/10 border-success/20" : s === "scam" ? "text-danger bg-danger/10 border-danger/20" : "text-warning bg-warning/10 border-warning/20";

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center">
          <Bot className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("ai.title")}</h1>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Get instant halal & safety analysis" : "Obtenez une analyse halal & sécurité instantanée"}
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
          onClick={handleAnalyze}
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

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-card rounded-2xl p-5 border border-border glow-primary"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 capitalize">{result.name}</h2>

            <div className="flex gap-3 mb-4">
              <div className={`flex-1 p-3 rounded-xl border ${halalColor(result.halalStatus)}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-medium uppercase">{t("ai.halal")}</span>
                </div>
                <p className="text-sm font-bold">{t(`tag.${result.halalStatus}`)}</p>
              </div>
              <div className={`flex-1 p-3 rounded-xl border ${safetyColor(result.safetyStatus)}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-medium uppercase">{t("ai.safety")}</span>
                </div>
                <p className="text-sm font-bold">{t(`tag.${result.safetyStatus}`)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t("ai.explanation")}</h3>
              <p className="text-sm text-foreground/90 leading-relaxed">{result.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Sparkles className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground">
            {language === "en"
              ? "Type a cryptocurrency name to get an instant analysis"
              : "Tapez le nom d'une cryptomonnaie pour obtenir une analyse instantanée"}
          </p>
        </div>
      )}
    </div>
  );
}
