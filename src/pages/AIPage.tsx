import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "react-router-dom";
import { cryptoProjects } from "@/data/mockData";
import { Send, Shield, AlertTriangle, Sparkles, Bot, ExternalLink, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StatusTag from "@/components/StatusTag";
import ScoreBadge from "@/components/ScoreBadge";

interface AnalysisResult {
  name: string;
  halalStatus: "halal" | "notHalal" | "uncertain";
  safetyStatus: "safe" | "risky" | "scam";
  score: number;
  explanation: string;
  website?: string;
  whitepaper?: string;
}

const mockAnalyze = (query: string, lang: string): AnalysisResult => {
  const project = cryptoProjects.find(
    (p) => p.name.toLowerCase() === query.toLowerCase() || p.symbol.toLowerCase() === query.toLowerCase()
  );

  if (project) {
    return {
      name: project.name,
      halalStatus: project.halalStatus,
      safetyStatus: project.safetyStatus,
      score: project.score,
      website: project.website,
      whitepaper: project.whitepaper,
      explanation: lang === "en"
        ? `Based on our Cryptopedia analysis, ${project.name} has a score of ${project.score}/10. Halal status: ${project.halalStatus}. Safety status: ${project.safetyStatus}. ${project.descriptionPro.en} Always do your own research (DYOR) and consult a qualified scholar for halal verification.`
        : `Selon notre analyse Cryptopedia, ${project.name} a un score de ${project.score}/10. Statut halal : ${project.halalStatus}. Statut sécurité : ${project.safetyStatus}. ${project.descriptionPro.fr} Faites toujours vos propres recherches (DYOR) et consultez un savant qualifié pour la vérification halal.`,
    };
  }

  return {
    name: query,
    halalStatus: "uncertain",
    safetyStatus: "risky",
    score: 0,
    explanation: lang === "en"
      ? `We don't have a detailed analysis for "${query}" yet. This project is not in our database, which means we haven't verified its halal status or safety. Be extra cautious with unknown projects. Always do your own research (DYOR).`
      : `Nous n'avons pas encore d'analyse détaillée pour "${query}". Ce projet n'est pas dans notre base de données, ce qui signifie que nous n'avons pas vérifié son statut halal ou sa sécurité. Soyez très prudent avec les projets inconnus. Faites toujours vos propres recherches (DYOR).`,
  };
};

export default function AIPage() {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-fill from navigation state
  useEffect(() => {
    const state = location.state as { projectName?: string } | null;
    if (state?.projectName) {
      setQuery(state.projectName);
      // Auto-analyze
      setLoading(true);
      setResult(null);
      setTimeout(() => {
        setResult(mockAnalyze(state.projectName!, language));
        setLoading(false);
      }, 1000);
    }
  }, [location.state]);

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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground capitalize">{result.name}</h2>
              <ScoreBadge score={result.score} />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <StatusTag type="halal" status={result.halalStatus} />
              <StatusTag type="safety" status={result.safetyStatus} />
            </div>

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

            {/* Official links */}
            {(result.website || result.whitepaper) && (
              <div className="flex gap-2 mb-4">
                {result.website && (
                  <a href={result.website} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-secondary/50 border border-border text-foreground hover:border-primary/30 transition-colors">
                    <ExternalLink className="w-3 h-3 text-primary" />
                    {language === "en" ? "Website" : "Site"}
                  </a>
                )}
                {result.whitepaper && (
                  <a href={result.whitepaper} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-secondary/50 border border-border text-foreground hover:border-primary/30 transition-colors">
                    <FileText className="w-3 h-3 text-primary" />
                    Whitepaper
                  </a>
                )}
              </div>
            )}

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
