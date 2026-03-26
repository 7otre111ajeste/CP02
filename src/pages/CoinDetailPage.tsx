import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCoinDetail, useCoinChart, formatMarketCap } from "@/hooks/useCryptoMarket";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cryptoProjects } from "@/data/mockData";
import { projectExchanges } from "@/data/platformsData";
import StatusTag from "@/components/StatusTag";
import ScoreBadge from "@/components/ScoreBadge";
import DescriptionToggle from "@/components/DescriptionToggle";
import TermHighlighter from "@/components/TermHighlighter";
import { ArrowLeft, TrendingUp, TrendingDown, BookOpen, Sparkles, Star, ExternalLink, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

const TIME_RANGES = [
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "1Y", days: 365 },
];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-[10px] text-muted-foreground uppercase mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function CoinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [days, setDays] = useState(7);
  const { toggleWatchlist, isWatching } = useWatchlist();

  const { data: coin, isLoading, isError } = useCoinDetail(id ?? "");
  const { data: chart } = useCoinChart(id ?? "", days);

  const learnProject = cryptoProjects.find(
    (p) => p.id === id || p.symbol.toLowerCase() === coin?.symbol
  );

  const watchlistId = learnProject?.id || id || "";

  const chartData = (chart?.prices ?? []).map(([time, price]) => ({ time, price }));
  const md = coin?.market_data;
  const positive = (md?.price_change_percentage_24h ?? 0) >= 0;
  const chartColor = positive ? "hsl(145, 65%, 45%)" : "hsl(0, 72%, 55%)";

  if (isLoading) {
    return (
      <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-4">
        <div className="h-8 w-32 bg-card rounded-lg animate-pulse" />
        <div className="h-48 bg-card rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !coin) {
    return (
      <div className="px-4 pt-6 pb-24 max-w-lg mx-auto text-center">
        <p className="text-muted-foreground mb-4">Failed to load coin data</p>
        <button onClick={() => navigate("/market")} className="text-primary underline text-sm">Back to Market</button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <button onClick={() => navigate("/market")} className="flex items-center gap-1.5 text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{t("market.title")}</span>
        </button>

        <div className="flex items-center gap-3">
          <img src={coin.image.large} alt={coin.name} className="w-10 h-10 rounded-full" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">{coin.name}</h1>
            <p className="text-xs text-muted-foreground uppercase">{coin.symbol} · #{coin.market_cap_rank}</p>
          </div>
          <button onClick={() => toggleWatchlist(watchlistId)} className="p-2">
            <Star className={`w-5 h-5 transition-colors ${isWatching(watchlistId) ? "text-warning fill-warning" : "text-muted-foreground"}`} />
          </button>
          {learnProject && <ScoreBadge score={learnProject.score} />}
        </div>

        {learnProject && (
          <div className="flex flex-wrap gap-2 mt-3">
            <StatusTag type="halal" status={learnProject.halalStatus} />
            <StatusTag type="safety" status={learnProject.safetyStatus} />
            <button
              onClick={() => navigate("/ai", { state: { projectName: learnProject.name } })}
              className="text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 border border-accent/30 bg-accent/10 text-accent"
            >
              <Sparkles className="w-3 h-3" /> AI Analysis
            </button>
          </div>
        )}

        <div className="flex items-end gap-3 mt-3">
          <span className="text-3xl font-bold text-foreground tabular-nums">
            ${md?.current_price.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span className={`flex items-center gap-0.5 text-sm font-medium pb-1 ${positive ? "text-success" : "text-danger"}`}>
            {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(md?.price_change_percentage_24h ?? 0).toFixed(2)}%
          </span>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="flex gap-1 mb-3">
            {TIME_RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setDays(r.days)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  days === r.days ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={["auto", "auto"]} hide />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 11%)",
                  border: "1px solid hsl(220, 14%, 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(210, 20%, 95%)",
                }}
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, "Price"]}
                labelFormatter={(label: number) => new Date(label).toLocaleDateString()}
              />
              <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fill="url(#chartGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-2.5 mb-5">
        <StatCard label={t("market.price")} value={`$${md?.current_price.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <StatCard label="Market Cap" value={formatMarketCap(md?.market_cap.usd ?? 0)} />
        <StatCard label="24h Volume" value={formatMarketCap(md?.total_volume.usd ?? 0)} />
        <StatCard label="24h High" value={`$${md?.high_24h.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <StatCard label="24h Low" value={`$${md?.low_24h.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <StatCard label="ATH" value={`$${md?.ath.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <StatCard label="ATL" value={`$${md?.atl.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <StatCard label="Circulating" value={md?.circulating_supply ? `${(md.circulating_supply / 1e6).toFixed(1)}M` : "N/A"} />
      </motion.div>

      {/* Official Links */}
      {learnProject && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="flex gap-2 mb-4">
          <a
            href={learnProject.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-card border border-border text-foreground hover:border-primary/30 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
            {language === "en" ? "Official Website" : "Site officiel"}
          </a>
          <a
            href={learnProject.whitepaper}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-card border border-border text-foreground hover:border-primary/30 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-primary" />
            Whitepaper
          </a>
        </motion.div>
      )}

      {/* Pro/Bro Description */}
      {learnProject && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-border rounded-xl p-4 mb-4">
          <h2 className="text-sm font-semibold text-foreground mb-2">
            {language === "en" ? `What is ${learnProject.name}?` : `Qu'est-ce que ${learnProject.name} ?`}
          </h2>
          <DescriptionToggle
            proBro={{
              pro: learnProject.descriptionPro[language],
              bro: learnProject.descriptionBro[language],
            }}
          />
        </motion.div>
      )}

      {/* CoinGecko description fallback */}
      {!learnProject && coin.description.en && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-xl p-4 mb-4">
          <h2 className="text-sm font-semibold text-foreground mb-2">About {coin.name}</h2>
          <p
            className="text-xs text-muted-foreground leading-relaxed line-clamp-6"
            dangerouslySetInnerHTML={{ __html: coin.description.en.replace(/<a /g, '<a class="text-primary underline" ') }}
          />
        </motion.div>
      )}

      {/* Learn cross-link */}
      {learnProject && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <button
            onClick={() => navigate(`/learn/project/${learnProject.id}`)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors mb-3"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {language === "en" ? "View Full Analysis" : "Voir l'analyse complète"} →
          </button>
        </motion.div>
      )}
    </div>
  );
}
