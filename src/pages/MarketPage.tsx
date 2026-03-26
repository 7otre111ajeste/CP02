import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCryptoMarket, formatMarketCap } from "@/hooks/useCryptoMarket";
import { Search, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

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

export default function MarketPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: coins, isLoading, isError, refetch, isFetching } = useCryptoMarket();

  const filtered = (coins ?? []).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Table header */}
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
          <button
            onClick={() => refetch()}
            className="text-primary underline text-sm"
          >
            Try again
          </button>
        </div>
      )}

      <div className="space-y-1">
        {filtered.map((coin, i) => {
          const positive = (coin.price_change_percentage_24h ?? 0) >= 0;
          return (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => navigate(`/market/${coin.id}`)}
              className="flex items-center px-3 py-3 bg-card rounded-xl border border-border cursor-pointer hover:border-primary/30 transition-colors"
            >
              <span className="w-8 text-xs text-muted-foreground">{coin.market_cap_rank}</span>
              <div className="flex-1 flex items-center gap-2.5 min-w-0">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-7 h-7 rounded-full shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{coin.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{coin.symbol}</p>
                </div>
              </div>
              <div className="w-[60px] flex justify-center">
                <MiniSparkline
                  data={coin.sparkline_in_7d?.price ?? []}
                  positive={positive}
                />
              </div>
              <span className="w-24 text-right text-sm font-semibold text-foreground tabular-nums">
                ${coin.current_price < 1
                  ? coin.current_price.toFixed(4)
                  : coin.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <div
                className={`w-16 flex items-center justify-end gap-0.5 text-xs font-medium ${
                  positive ? "text-success" : "text-danger"
                }`}
              >
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(1)}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
