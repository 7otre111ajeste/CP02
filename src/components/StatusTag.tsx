import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, AlertTriangle, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StatusTagProps {
  type: "halal" | "safety";
  status: string;
}

const HALAL_EXPLANATIONS: Record<string, Record<string, string>> = {
  halal: {
    en: "This project's activity, revenue model, and utility align with Islamic finance principles based on our analysis.",
    fr: "L'activité, le modèle de revenus et l'utilité de ce projet sont conformes aux principes de la finance islamique selon notre analyse.",
  },
  notHalal: {
    en: "This project involves activities considered prohibited in Islamic finance, such as interest-based lending or gambling.",
    fr: "Ce projet implique des activités considérées comme interdites en finance islamique, comme le prêt à intérêt ou les jeux d'argent.",
  },
  uncertain: {
    en: "Islamic scholars have differing opinions on this project. There isn't enough consensus for a definitive ruling.",
    fr: "Les savants islamiques ont des opinions divergentes sur ce projet. Il n'y a pas assez de consensus pour un jugement définitif.",
  },
};

const SAFETY_EXPLANATIONS: Record<string, Record<string, string>> = {
  safe: {
    en: "This project has a verified team, audited smart contracts, strong liquidity, and a proven track record.",
    fr: "Ce projet a une équipe vérifiée, des smart contracts audités, une forte liquidité et un historique prouvé.",
  },
  risky: {
    en: "This project shows some concerns — partial transparency, limited audits, or volatile market activity.",
    fr: "Ce projet présente des préoccupations — transparence partielle, audits limités ou activité de marché volatile.",
  },
  scam: {
    en: "Strong indicators of fraudulent activity — anonymous team, no audit, fake promises, or rug pull history.",
    fr: "Indicateurs forts de fraude — équipe anonyme, pas d'audit, fausses promesses ou historique de rug pull.",
  },
};

export default function StatusTag({ type, status }: StatusTagProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const isHalal = type === "halal";
  const colorClass = isHalal
    ? status === "halal" ? "text-success bg-success/10 border-success/20" : status === "notHalal" ? "text-danger bg-danger/10 border-danger/20" : "text-warning bg-warning/10 border-warning/20"
    : status === "safe" ? "text-success bg-success/10 border-success/20" : status === "scam" ? "text-danger bg-danger/10 border-danger/20" : "text-warning bg-warning/10 border-warning/20";

  const Icon = isHalal ? Shield : AlertTriangle;
  const label = t(`tag.${status}`);
  const explanation = isHalal
    ? HALAL_EXPLANATIONS[status]?.[language] ?? ""
    : SAFETY_EXPLANATIONS[status]?.[language] ?? "";
  const methodologyPath = isHalal ? "/methodology/halal" : "/methodology/safety";

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 border transition-all hover:opacity-80 ${colorClass}`}
      >
        <Icon className="w-3 h-3" />
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 max-w-lg mx-auto"
            >
              <div className="bg-card border border-border rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-foreground">{label}</h3>
                  </div>
                  <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {explanation}
                </p>

                <button
                  onClick={() => { setOpen(false); navigate(methodologyPath); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {language === "en" ? "Learn about our methodology" : "Découvrir notre méthodologie"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
