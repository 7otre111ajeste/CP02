import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, RefreshCw, ExternalLink, TrendingUp, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
  category: string;
}

const CATEGORIES = [
  { key: "all", label: { en: "All", fr: "Tout" } },
  { key: "bitcoin", label: { en: "Bitcoin", fr: "Bitcoin" } },
  { key: "ethereum", label: { en: "Ethereum", fr: "Ethereum" } },
  { key: "altcoins", label: { en: "Altcoins", fr: "Altcoins" } },
  { key: "defi", label: { en: "DeFi", fr: "DeFi" } },
  { key: "regulation", label: { en: "Regulation", fr: "Régulation" } },
];

// Generate mock news since we don't have a news API connected yet
function generateMockNews(): NewsItem[] {
  const items: NewsItem[] = [
    {
      id: "1", title: "Bitcoin Hits New All-Time High Above $100K",
      description: "Bitcoin has surged past the $100,000 mark for the first time, driven by institutional adoption and ETF inflows.",
      url: "#", image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop",
      source: "CryptoNews", publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(), category: "bitcoin",
    },
    {
      id: "2", title: "Ethereum 2.0 Staking Reaches Record High",
      description: "Over 30 million ETH is now staked on the Beacon Chain, showing strong network confidence.",
      url: "#", image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop",
      source: "ETH Daily", publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(), category: "ethereum",
    },
    {
      id: "3", title: "Solana DeFi TVL Surpasses $15 Billion",
      description: "The Solana DeFi ecosystem continues to grow with new protocols launching daily.",
      url: "#", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
      source: "DeFi Pulse", publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(), category: "defi",
    },
    {
      id: "4", title: "EU Finalizes MiCA Crypto Regulation Framework",
      description: "The European Union has finalized its Markets in Crypto-Assets regulation, providing clarity for the industry.",
      url: "#", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=200&fit=crop",
      source: "Regulation Watch", publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(), category: "regulation",
    },
    {
      id: "5", title: "Cardano Releases Major Smart Contract Update",
      description: "Cardano's latest hard fork brings improved smart contract capabilities and lower transaction fees.",
      url: "#", image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&h=200&fit=crop",
      source: "ADA News", publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(), category: "altcoins",
    },
    {
      id: "6", title: "Bitcoin Mining Difficulty Reaches New Record",
      description: "As hashrate continues to climb, Bitcoin mining difficulty has adjusted to its highest level ever.",
      url: "#", image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=400&h=200&fit=crop",
      source: "Mining Journal", publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(), category: "bitcoin",
    },
    {
      id: "7", title: "New DeFi Protocol Offers Halal Yield Farming",
      description: "A new Shariah-compliant DeFi protocol launches, offering profit-sharing instead of interest-based yields.",
      url: "#", image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=200&fit=crop",
      source: "Islamic Finance", publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(), category: "defi",
    },
    {
      id: "8", title: "Polygon zkEVM Processes 10 Million Transactions",
      description: "Polygon's zero-knowledge EVM solution reaches a major milestone with growing adoption.",
      url: "#", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
      source: "Layer2 Weekly", publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(), category: "altcoins",
    },
  ];
  return items;
}

function timeAgo(dateStr: string, en: boolean): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return en ? "Just now" : "À l'instant";
  if (hours < 24) return en ? `${hours}h ago` : `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return en ? `${days}d ago` : `Il y a ${days}j`;
}

export default function NewsPage() {
  const { language } = useLanguage();
  const en = language === "en";
  const [category, setCategory] = useState("all");

  const { data: news, isLoading, refetch } = useQuery({
    queryKey: ["crypto-news"],
    queryFn: async () => generateMockNews(),
    refetchInterval: 300000, // 5 min
  });

  const filtered = (news || []).filter((n) => category === "all" || n.category === category);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-28 max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" />
          {en ? "Crypto News" : "Actualités Crypto"}
        </h1>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              category === cat.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            {cat.label[language]}
          </button>
        ))}
      </div>

      {/* News list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {en ? "No news in this category" : "Aucune actualité dans cette catégorie"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Featured (first item) */}
          {filtered.length > 0 && (
            <motion.a
              href={filtered[0].url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="block rounded-2xl border border-border overflow-hidden bg-card hover:border-primary/30 transition-all"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={filtered[0].image}
                  alt={filtered[0].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm font-bold text-white leading-tight">{filtered[0].title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-white/70">{filtered[0].source}</span>
                    <span className="text-[10px] text-white/50">•</span>
                    <span className="text-[10px] text-white/70">{timeAgo(filtered[0].publishedAt, en)}</span>
                  </div>
                </div>
                <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground font-medium capitalize">
                  {filtered[0].category}
                </span>
              </div>
            </motion.a>
          )}

          {/* Rest */}
          {filtered.slice(1).map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 1) * 0.05 }}
              className="flex gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-foreground leading-tight line-clamp-2 mb-1">
                  {item.title}
                </h3>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-1.5">
                  {item.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground">{item.source}</span>
                  <span className="text-[9px] text-muted-foreground">•</span>
                  <span className="text-[9px] text-muted-foreground">{timeAgo(item.publishedAt, en)}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize ml-auto">
                    {item.category}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      <div className="text-center pt-2">
        <p className="text-[10px] text-muted-foreground">
          {en ? "News updates every 5 minutes • Mock data for demo" : "Actualités mises à jour toutes les 5 min • Données de démo"}
        </p>
      </div>
    </motion.div>
  );
}
