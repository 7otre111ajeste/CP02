import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

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

function Thermometer({ value, label, colors }: { value: number; label: string; colors: string[] }) {
  const pct = Math.max(0, Math.min(100, value));
  const colorIdx = Math.min(Math.floor(pct / 25), colors.length - 1);

  return (
    <div className="flex-1">
      <p className="text-[10px] text-muted-foreground mb-1.5 text-center">{label}</p>
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

  // Estimate bull/bear from fear/greed (simplified heuristic)
  const bullBear = Math.min(100, Math.max(0, fearValue * 1.1));

  if (isLoading) {
    return <div className="h-20 bg-card rounded-xl border border-border animate-pulse" />;
  }

  const fearColors = [
    "hsl(0, 72%, 55%)",     // Extreme Fear
    "hsl(38, 92%, 55%)",    // Fear
    "hsl(145, 65%, 45%)",   // Greed
    "hsl(166, 100%, 42%)",  // Extreme Greed
  ];

  const bullColors = [
    "hsl(0, 72%, 55%)",     // Strong Bear
    "hsl(38, 92%, 55%)",    // Bear
    "hsl(145, 65%, 45%)",   // Bull
    "hsl(166, 100%, 42%)",  // Strong Bull
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
        />
        <Thermometer
          value={bullBear}
          label={language === "en" ? "Bear ← → Bull" : "Bear ← → Bull"}
          colors={bullColors}
        />
      </div>
    </div>
  );
}
