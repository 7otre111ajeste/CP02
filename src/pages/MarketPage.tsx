import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCryptoMarket, MARKET_CATEGORIES, type MarketCategory } from "@/hooks/useCryptoMarket";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cryptoProjects } from "@/data/mockData";
import { Search, TrendingUp, TrendingDown, RefreshCw, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import StatusTag from "@/components/StatusTag";
import ScoreBadge from "@/components/ScoreBadge";
import SortFilter, { type SortField, type SortDirection } from "@/components/SortFilter";
import MarketSentiment from "@/components/MarketSentiment";

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length === 0) return null;
  const sampled = data.filter((_, i) => i % Math.ceil(data.length / 30) === 0);
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;
  const points = sampled
    .map((v, i) => `${(i / (sampled.length - 1)) * 60},${20 - ((v - min) / range) * 18}`)
    .join(" ");

  return (
    <svg width="60" height="22" viewBox="0 0 60 22" className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "hsl(var(--success))" : "hsl(var(--danger))"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "rank", label: "Rank" },
  { value: "name", label: "A → Z" },
  { value: "price", label: "Price" },
  { value: "change", label: "24h %" },
  { value: "marketCap", label: "Market Cap" },
  { value: "volume", label: "Volume" },
];

export default function MarketPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<MarketCategory>("All");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const { data: coins, isLoading, isError, refetch, isFetching } = useCryptoMarket();
  const { toggleWatchlist, isWatching } = useWatchlist();

  const filtered = useMemo(() => {
    let list = (coins ?? []).filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || c.category === category;
      return matchesSearch && matchesCategory;
    });

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "price": cmp = a.current_price - b.current_price; break;
        case "change": cmp = (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0); break;
        case "marketCap": cmp = (a.market_cap ?? 0) - (b.market_cap ?? 0); break;
        case "volume": cmp = 0; break;
        case "rank": cmp = (a.market_cap_rank ?? 999) - (b.market_cap_rank ?? 999); break;
        default: cmp = 0;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [coins, search, category, sortField, sortDir]);

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">{t("market.title")}</h1>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="mb-4">
        <MarketSentiment />
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("market.search")}
          className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 flex-1">
          {MARKET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <SortFilter
          fields={SORT_FIELDS}
          current={sortField}
          direction={sortDir}
          onChange={(f, d) => { setSortField(f); setSortDir(d); }}
        />
      </div>

      <div className="flex items-center px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase">
        <span className="w-8">#</span>
        <span className="flex-1">Name</span>
        <span className="w-[60px] text-center">7d</span>
        <span className="w-24 text-right">{t("market.price")}</span>
        <span className="w-16 text-right">{t("market.change")}</span>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-card rounded-xl border border-border animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-2">Failed to load market data</p>
          <button onClick={() => refetch()} className="text-primary underline text-sm">Try again</button>
        </div>
      )}

      <div className="space-y-1">
        {filtered.map((coin, i) => {
          const positive = (coin.price_change_percentage_24h ?? 0) >= 0;
          const learnProject = cryptoProjects.find(
            (p) => p.id === coin.id || p.symbol.toLowerCase() === coin.symbol.toLowerCase()
          );
          return (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-card rounded-xl border border-border"
            >
              <div
                onClick={() => navigate(`/market/${coin.id}`)}
                className="flex items-center px-3 py-3 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <span className="w-8 text-xs text-muted-foreground">{coin.market_cap_rank}</span>
                <div className="flex-1 flex items-center gap-2.5 min-w-0">
                  <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full shrink-0" loading="lazy" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{coin.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{coin.symbol}</p>
                  </div>
                </div>
                <div className="w-[60px] flex justify-center">
                  <MiniSparkline data={coin.sparkline_in_7d?.price ?? []} positive={positive} />
                </div>
                <span className="w-24 text-right text-sm font-semibold text-foreground tabular-nums">
                  ${coin.current_price < 1
                    ? coin.current_price.toFixed(4)
                    : coin.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <div className={`w-16 flex items-center justify-end gap-0.5 text-xs font-medium ${positive ? "text-success" : "text-danger"}`}>
                  {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(1)}%
                </div>
              </div>

              {/* Badges + Watchlist row */}
              <div className="flex items-center gap-1.5 px-3 pb-2.5 flex-wrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const projectId = learnProject?.id || coin.id;
                    toggleWatchlist(projectId);
                  }}
                  className="flex-shrink-0"
                >
                  <Star
                    className={`w-4 h-4 transition-colors ${
                      isWatching(learnProject?.id || coin.id) ? "text-warning fill-warning" : "text-muted-foreground"
                    }`}
                  />
                </button>
                {learnProject && (
                  <>
                    <StatusTag type="halal" status={learnProject.halalStatus} />
                    <StatusTag type="safety" status={learnProject.safetyStatus} />
                    <ScoreBadge score={learnProject.score} />
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/ai", { state: { projectName: learnProject?.name || coin.name } });
                  }}
                  className="text-[10px] px-2 py-1 rounded-full font-medium flex items-center gap-1 border border-accent/30 bg-accent/10 text-accent"
                >
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
