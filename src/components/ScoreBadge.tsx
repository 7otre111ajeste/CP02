import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";

interface ScoreBadgeProps {
  score: number; // 0-10
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-success bg-success/10 border-success/20";
  if (score >= 6) return "text-primary bg-primary/10 border-primary/20";
  if (score >= 4) return "text-warning bg-warning/10 border-warning/20";
  if (score >= 2) return "text-danger bg-danger/10 border-danger/20";
  return "text-destructive bg-destructive/10 border-destructive/20";
}

function getScoreLabel(score: number, lang: string): string {
  if (lang === "fr") {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Très bon";
    if (score >= 5) return "Moyen";
    if (score >= 3) return "Faible";
    return "Dangereux";
  }
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Very Good";
  if (score >= 5) return "Average";
  if (score >= 3) return "Weak";
  return "Dangerous";
}

function getScoreExplanation(score: number, lang: string): string {
  if (lang === "fr") {
    if (score >= 8) return "Ce projet montre de solides fondamentaux, une équipe transparente, une utilité réelle et est considéré comme sûr et conforme. Note basée sur notre analyse interne.";
    if (score >= 6) return "Ce projet a de bons fondamentaux mais présente quelques zones d'incertitude. Faites vos propres recherches avant d'investir.";
    if (score >= 4) return "Ce projet présente des préoccupations modérées. Liquidité limitée, transparence partielle ou utilité discutable.";
    if (score >= 2) return "Ce projet présente des signaux d'alerte importants. Risque élevé de perte. Soyez très prudent.";
    return "Ce projet est très probablement une arnaque ou un projet frauduleux. Évitez-le complètement.";
  }
  if (score >= 8) return "This project shows strong fundamentals, transparent team, real utility, and is considered safe and compliant. Score based on our internal analysis.";
  if (score >= 6) return "This project has good fundamentals but shows some areas of uncertainty. Do your own research before investing.";
  if (score >= 4) return "This project shows moderate concerns. Limited liquidity, partial transparency, or questionable utility.";
  if (score >= 2) return "This project shows significant red flags. High risk of loss. Be very careful.";
  return "This project is very likely a scam or fraudulent project. Avoid completely.";
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score, language);

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border transition-all hover:opacity-80 ${colorClass}`}
      >
        <Star className="w-3 h-3" />
        {score}/10
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-24 max-w-lg mx-auto"
            >
              <div className="bg-card border border-border rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{label}</h3>
                      <p className="text-xs text-muted-foreground">{language === "en" ? "Cryptopedia Score" : "Score Cryptopedia"}: {score}/10</p>
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {getScoreExplanation(score, language)}
                </p>
                <p className="text-[10px] text-muted-foreground/60 italic">
                  {language === "en"
                    ? "⚠️ This score reflects Cryptopedia's internal analysis and is not financial advice. Always do your own research."
                    : "⚠️ Ce score reflète l'analyse interne de Cryptopedia et ne constitue pas un conseil financier. Faites toujours vos propres recherches."}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
