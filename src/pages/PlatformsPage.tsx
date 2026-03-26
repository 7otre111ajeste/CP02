import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { trustedPlatforms, type TrustedPlatform } from "@/data/platformsData";
import { ArrowLeft, ExternalLink, Star, Shield, AlertTriangle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 8 ? "bg-success" : score >= 6 ? "bg-warning" : "bg-danger";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score * 10}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-foreground w-6 text-right">{score}</span>
    </div>
  );
}

function PlatformCard({ platform }: { platform: TrustedPlatform }) {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const en = language === "en";

  return (
    <motion.div
      layout
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">{platform.logo}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm">{platform.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">{platform.type}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{platform.description[language]}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-sm font-bold text-primary">{platform.score}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 space-y-3"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">{platform.description[language]}</p>

            <div className="space-y-1.5">
              <ScoreBar score={platform.gasFees.score} label={en ? "Fees" : "Frais"} />
              <ScoreBar score={platform.userFriendly.score} label={en ? "Easy to use" : "Facilité"} />
              <ScoreBar score={platform.liquidity.score} label={en ? "Liquidity" : "Liquidité"} />
              <ScoreBar score={platform.insurance.score} label={en ? "Insurance" : "Assurance"} />
              <ScoreBar score={platform.transactionSpeed.score} label={en ? "Speed" : "Vitesse"} />
              <ScoreBar score={platform.security.score} label={en ? "Security" : "Sécurité"} />
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs">
              <div className="bg-secondary/50 rounded-xl p-3">
                <p className="text-muted-foreground font-medium mb-1">{en ? "🎁 Referral Bonus" : "🎁 Bonus de parrainage"}</p>
                <p className="text-foreground">{platform.referralBonus[language]}</p>
              </div>

              {platform.unavailableCountries.length > 0 && (
                <div className="bg-danger/5 border border-danger/10 rounded-xl p-3">
                  <p className="text-danger font-medium mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {en ? "Not available in" : "Non disponible dans"}
                  </p>
                  <p className="text-muted-foreground">{platform.unavailableCountries.join(", ")}</p>
                </div>
              )}
            </div>

            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {en ? "Visit Platform" : "Visiter la plateforme"}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PlatformsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [filter, setFilter] = useState<"all" | "exchange" | "wallet">("all");
  const en = language === "en";

  const filtered = trustedPlatforms.filter(
    (p) => filter === "all" || p.type === filter || (filter === "exchange" && p.type === "both") || (filter === "wallet" && p.type === "both")
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          {en ? "Trusted Platforms" : "Plateformes de confiance"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {en ? "Verified exchanges & wallets rated by our team" : "Exchanges & wallets vérifiés notés par notre équipe"}
        </p>
      </div>

      <div className="bg-warning/5 border border-warning/20 rounded-xl p-3 mb-5 text-xs text-muted-foreground">
        <p className="font-medium text-warning mb-1">⚠️ Disclaimer</p>
        <p>{en
          ? "These ratings reflect our analysis and are not financial advice. Always do your own research (DYOR) before using any platform."
          : "Ces notes reflètent notre analyse et ne constituent pas un conseil financier. Faites toujours vos propres recherches (DYOR) avant d'utiliser une plateforme."
        }</p>
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "exchange", "wallet"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {f === "all" ? (en ? "All" : "Tout") : f === "exchange" ? "Exchanges" : "Wallets"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <PlatformCard key={p.id} platform={p} />
        ))}
      </div>
    </motion.div>
  );
}
