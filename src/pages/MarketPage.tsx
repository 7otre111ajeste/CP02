import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCryptoMarket, MARKET_CATEGORIES, type MarketCategory } from "@/hooks/useCryptoMarket";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cryptoProjects } from "@/data/mockData";
import { Search, TrendingUp, TrendingDown, RefreshCw, Sparkles, Star, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StatusTag from "@/components/StatusTag";
import ScoreBadge from "@/components/ScoreBadge";
import SortFilter, { type SortField, type SortDirection } from "@/components/SortFilter";
import MarketSentiment from "@/components/MarketSentiment";
import { Slider } from "@/components/ui/slider";

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

// Sort fields are defined inside the component to access language

type HalalFilter = "all" | "halal" | "uncertain" | "notHalal";
type SafetyFilter = "all" | "safe" | "risky" | "scam";

export default function MarketPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const en = language === "en";
  const [search, setSearch] = useState("");

  const SORT_FIELDS: { value: SortField; label: string }[] = [
    { value: "rank", label: "Rank" },
    { value: "name", label: "A → Z" },
    { value: "price", label: en ? "Price" : "Prix" },
    { value: "change", label: "24h %" },
    { value: "marketCap", label: en ? "Market Cap" : "Capitalisation" },
    { value: "volume", label: "Volume" },
  ];
  const [category, setCategory] = useState<MarketCategory>("All");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [halalFilter, setHalalFilter] = useState<HalalFilter>("all");
  const [safetyFilter, setSafetyFilter] = useState<SafetyFilter>("all");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 10]);
  const { data: coins, isLoading, isError, refetch, isFetching } = useCryptoMarket();
  const { toggleWatchlist, isWatching } = useWatchlist();

  const activeFilterCount = (category !== "All" ? 1 : 0) + (halalFilter !== "all" ? 1 : 0) + (safetyFilter !== "all" ? 1 : 0) + (scoreRange[0] > 0 || scoreRange[1] < 10 ? 1 : 0);

  const clearFilters = () => {
    setCategory("All");
    setHalalFilter("all");
    setSafetyFilter("all");
    setScoreRange([0, 10]);
  };

  const filtered = useMemo(() => {
    let list = (coins ?? []).filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || c.category === category;

      // Halal & Safety & Score filters
      const learnProject = cryptoProjects.find(
        (p) => p.id === c.id || p.symbol.toLowerCase() === c.symbol.toLowerCase()
      );

      const matchesHalal = halalFilter === "all" || (learnProject && learnProject.halalStatus === halalFilter);
      const matchesSafety = safetyFilter === "all" || (learnProject && learnProject.safetyStatus === safetyFilter);
      const matchesScore = !learnProject || (learnProject.score >= scoreRange[0] && learnProject.score <= scoreRange[1]);

      return matchesSearch && matchesCategory && matchesHalal && matchesSafety && matchesScore;
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
  }, [coins, search, category, sortField, sortDir, halalFilter, safetyFilter, scoreRange]);

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

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-primary/15 border border-primary/30 text-primary"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {language === "fr" ? "Filtres" : "Filters"}
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <SortFilter
            fields={SORT_FIELDS}
            current={sortField}
            direction={sortDir}
            onChange={(f, d) => { setSortField(f); setSortDir(d); }}
          />
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-card border border-border rounded-xl p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {language === "fr" ? "Filtres avancés" : "Advanced Filters"}
                </span>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <X className="w-3 h-3" /> {language === "fr" ? "Réinitialiser" : "Clear all"}
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <span className="text-[10px] font-medium text-muted-foreground uppercase mb-1.5 block">
                  {language === "fr" ? "Catégorie" : "Category"}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {MARKET_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        category === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Halal Filter */}
              <div>
                <span className="text-[10px] font-medium text-muted-foreground uppercase mb-1.5 block">
                  {language === "fr" ? "Statut Halal" : "Halal Status"}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {([
                    { value: "all", label: language === "fr" ? "Tous" : "All" },
                    { value: "halal", label: "Halal ✅" },
                    { value: "uncertain", label: language === "fr" ? "Incertain ⚠️" : "Uncertain ⚠️" },
                    { value: "notHalal", label: language === "fr" ? "Non Halal ❌" : "Not Halal ❌" },
                  ] as { value: HalalFilter; label: string }[]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setHalalFilter(opt.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        halalFilter === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety Filter */}
              <div>
                <span className="text-[10px] font-medium text-muted-foreground uppercase mb-1.5 block">
                  {language === "fr" ? "Statut Sécurité" : "Safety Status"}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {([
                    { value: "all", label: language === "fr" ? "Tous" : "All" },
                    { value: "safe", label: language === "fr" ? "Sûr ✅" : "Safe ✅" },
                    { value: "risky", label: language === "fr" ? "Risqué ⚠️" : "Risky ⚠️" },
                    { value: "scam", label: "Scam ❌" },
                  ] as { value: SafetyFilter; label: string }[]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSafetyFilter(opt.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        safetyFilter === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Score Filter */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">
                    Score
                  </span>
                  <span className="text-[11px] font-semibold text-foreground">
                    {scoreRange[0]} — {scoreRange[1]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={scoreRange}
                    onValueChange={(val) => setScoreRange(val as [number, number])}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase">
        <span className="w-8">#</span>
        <span className="flex-1">{en ? "Name" : "Nom"}</span>
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
          <p className="mb-2">{en ? "Failed to load market data" : "Échec du chargement des données"}</p>
          <button onClick={() => refetch()} className="text-primary underline text-sm">{en ? "Try again" : "Réessayer"}</button>
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
