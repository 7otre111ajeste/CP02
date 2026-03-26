import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { marketData } from "@/data/mockData";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function MarketPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = marketData.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-4">{t("market.title")}</h1>

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
        <span className="w-24 text-right">{t("market.price")}</span>
        <span className="w-16 text-right">{t("market.change")}</span>
      </div>

      <div className="space-y-1">
        {filtered.map((coin, i) => (
          <motion.div
            key={coin.symbol}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center px-3 py-3 bg-card rounded-xl border border-border"
          >
            <span className="w-8 text-xs text-muted-foreground">{coin.rank}</span>
            <div className="flex-1 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold">
                {coin.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{coin.name}</p>
                <p className="text-[10px] text-muted-foreground">{coin.symbol}</p>
              </div>
            </div>
            <span className="w-24 text-right text-sm font-semibold text-foreground">
              ${coin.price < 1 ? coin.price.toFixed(2) : coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <div className={`w-16 flex items-center justify-end gap-0.5 text-xs font-medium ${coin.change24h >= 0 ? "text-success" : "text-danger"}`}>
              {coin.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(coin.change24h)}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
