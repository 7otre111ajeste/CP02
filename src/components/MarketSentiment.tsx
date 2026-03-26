import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info } from "lucide-react";

interface FearGreedData {
  value: string;
  value_classification: string;
}

async function fetchFearGreed(): Promise<FearGreedData> {
  const res = await fetch("https://api.alternative.me/fng/?limit=1");
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data[0];
}

function getExplanation(value: number, type: "fear" | "bull", language: string) {
  if (type === "fear") {
    if (value <= 25) return language === "en"
      ? "Extreme Fear: Most investors are very scared. This often means prices are low and it could be a good time to buy — but be careful!"
      : "Peur extrême : La plupart des investisseurs ont très peur. Les prix sont souvent bas, ça pourrait être un bon moment pour acheter — mais sois prudent !";
    if (value <= 45) return language === "en"
      ? "Fear: Investors are nervous. The market is uncertain. Many are selling or hesitating to buy."
      : "Peur : Les investisseurs sont nerveux. Le marché est incertain. Beaucoup vendent ou hésitent à acheter.";
    if (value <= 55) return language === "en"
      ? "Neutral: The market is balanced. No strong emotion — investors are cautious but not panicking."
      : "Neutre : Le marché est équilibré. Pas d'émotion forte — les investisseurs sont prudents mais pas en panique.";
    if (value <= 75) return language === "en"
      ? "Greed: Investors are excited and buying a lot. Prices are rising, but be careful of buying at the top!"
      : "Avidité : Les investisseurs sont enthousiastes et achètent beaucoup. Les prix montent, mais attention à ne pas acheter au sommet !";
    return language === "en"
      ? "Extreme Greed: Everyone is buying! Prices are very high. History shows this can be risky — a correction may come."
      : "Avidité extrême : Tout le monde achète ! Les prix sont très élevés. L'histoire montre que c'est risqué — une correction peut arriver.";
  }
  // bull/bear
  if (value <= 25) return language === "en"
    ? "Strong Bear Market: Prices are falling significantly. The overall trend is downward. Investors are cautious."
    : "Marché très baissier : Les prix chutent fortement. La tendance générale est à la baisse.";
  if (value <= 45) return language === "en"
    ? "Bear Market: Prices are generally declining. Confidence is low but not at its worst."
    : "Marché baissier : Les prix baissent généralement. La confiance est faible mais pas au plus bas.";
  if (value <= 55) return language === "en"
    ? "Transitioning: The market is between bull and bear. Could go either way — watch for signals."
    : "Transition : Le marché est entre haussier et baissier. Ça peut aller dans les deux sens.";
  if (value <= 75) return language === "en"
    ? "Bull Market: Prices are generally rising. Confidence is growing and more people are investing."
    : "Marché haussier : Les prix montent généralement. La confiance grandit et plus de gens investissent.";
  return language === "en"
    ? "Strong Bull Market: Prices are surging! Great momentum, but remember — what goes up fast can come down fast too."
    : "Marché très haussier : Les prix explosent ! Super dynamique, mais rappelle-toi — ce qui monte vite peut redescendre vite.";
}

function Thermometer({ value, label, colors, type, language }: {
  value: number; label: string; colors: string[]; type: "fear" | "bull"; language: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();
  const pct = Math.max(0, Math.min(100, value));
  const colorIdx = Math.min(Math.floor(pct / 25), colors.length - 1);

  return (
    <div className="flex-1 relative">
      <div
        className="cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <p className="text-[10px] text-muted-foreground mb-1.5 text-center flex items-center justify-center gap-1">
          {label} <Info className="w-2.5 h-2.5" />
        </p>
        <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: colors[colorIdx] }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-muted-foreground">0</span>
          <span className="text-xs font-bold" style={{ color: colors[colorIdx] }}>
            {pct}
          </span>
          <span className="text-[9px] text-muted-foreground">100</span>
        </div>
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-0 right-0 top-full mt-2 z-50 p-3 rounded-lg bg-popover border border-border shadow-lg"
          >
            <p className="text-[11px] text-foreground leading-relaxed mb-2">
              {getExplanation(pct, type, language)}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/ai");
              }}
              className="w-full text-[10px] py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              {language === "en" ? "Ask AI for more details" : "Demander plus de détails à l'IA"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MarketSentiment() {
  const { language } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ["fear-greed"],
    queryFn: fetchFearGreed,
    staleTime: 300_000,
    refetchInterval: 300_000,
  });

  const fearValue = data ? parseInt(data.value) : 50;
  const classification = data?.value_classification ?? "Neutral";
  const bullBear = Math.min(100, Math.max(0, fearValue * 1.1));

  if (isLoading) {
    return <div className="h-20 bg-card rounded-xl border border-border animate-pulse" />;
  }

  const fearColors = [
    "hsl(0, 72%, 55%)",
    "hsl(38, 92%, 55%)",
    "hsl(145, 65%, 45%)",
    "hsl(166, 100%, 42%)",
  ];

  const bullColors = [
    "hsl(0, 72%, 55%)",
    "hsl(38, 92%, 55%)",
    "hsl(145, 65%, 45%)",
    "hsl(166, 100%, 42%)",
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground">
          {language === "en" ? "Market Sentiment" : "Sentiment du marché"}
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
          {classification}
        </span>
      </div>
      <div className="flex gap-4">
        <Thermometer
          value={fearValue}
          label={language === "en" ? "Fear & Greed" : "Peur & Avidité"}
          colors={fearColors}
          type="fear"
          language={language}
        />
        <Thermometer
          value={bullBear}
          label={language === "en" ? "Bear ← → Bull" : "Bear ← → Bull"}
          colors={bullColors}
          type="bull"
          language={language}
        />
      </div>
    </div>
  );
}
