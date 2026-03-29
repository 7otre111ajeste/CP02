import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { exchangeWalletGuides, type ExchangeWalletGuide } from "@/data/exchangeWalletData";
import { ArrowLeft, ExternalLink, CheckCircle, Circle, ChevronDown, AlertTriangle, ThumbsUp, ThumbsDown, Wallet, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Filter = "all" | "exchange" | "wallet";

export default function ExchangeWalletPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const en = language === "en";
  const { readProject, isProjectRead } = useUserProgress();
  const { incrementQuest } = useDailyQuests();
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean[]>>({});

  const filtered = exchangeWalletGuides.filter((g) => filter === "all" || g.type === filter);

  const toggleStep = (guideId: string, stepIndex: number) => {
    setCompletedSteps((prev) => {
      const steps = [...(prev[guideId] || [])];
      steps[stepIndex] = !steps[stepIndex];
      return { ...prev, [guideId]: steps };
    });
  };

  const handleExpand = (guide: ExchangeWalletGuide) => {
    if (expandedId === guide.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(guide.id);
    const readKey = `guide-${guide.id}`;
    if (!isProjectRead(readKey)) {
      readProject(readKey);
      incrementQuest("term");
      toast.success(en ? "+15 XP earned!" : "+15 XP gagnés !");
    }
  };

  const getStepProgress = (guideId: string, totalSteps: number) => {
    const steps = completedSteps[guideId] || [];
    const done = steps.filter(Boolean).length;
    return { done, total: totalSteps, pct: (done / totalSteps) * 100 };
  };

  const filters: { key: Filter; label: string; icon: typeof Building2 }[] = [
    { key: "all", label: en ? "All" : "Tout", icon: Building2 },
    { key: "exchange", label: "Exchanges", icon: Building2 },
    { key: "wallet", label: "Wallets", icon: Wallet },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-28 max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-card border border-border">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {en ? "Exchanges & Wallets" : "Exchanges & Portefeuilles"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {en ? "Learn how to use them safely" : "Apprenez à les utiliser en sécurité"}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              filter === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            <f.icon className="w-3.5 h-3.5" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Guides */}
      <div className="space-y-3">
        {filtered.map((guide) => {
          const isExpanded = expandedId === guide.id;
          const progress = getStepProgress(guide.id, guide.steps[language].length);
          const readKey = `guide-${guide.id}`;
          const isRead = isProjectRead(readKey);

          return (
            <motion.div
              key={guide.id}
              layout
              className={`bg-card rounded-2xl border overflow-hidden transition-all ${
                isExpanded ? "border-primary/30" : "border-border"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => handleExpand(guide)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <img
                  src={guide.logo}
                  alt={guide.name}
                  className="w-10 h-10 rounded-xl shrink-0 bg-secondary p-1"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">{guide.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {guide.category}
                    </span>
                    {isRead && <CheckCircle className="w-3 h-3 text-success" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{guide.description[language]}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4">
                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {guide.description[language]}
                      </p>

                      {/* Pros */}
                      <div>
                        <h4 className="text-xs font-semibold text-success flex items-center gap-1 mb-2">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          {en ? "Advantages" : "Avantages"}
                        </h4>
                        <ul className="space-y-1">
                          {guide.pros[language].map((pro, i) => (
                            <li key={i} className="text-[11px] text-foreground flex items-start gap-1.5">
                              <span className="text-success mt-0.5">✓</span> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cons */}
                      <div>
                        <h4 className="text-xs font-semibold text-danger flex items-center gap-1 mb-2">
                          <ThumbsDown className="w-3.5 h-3.5" />
                          {en ? "Disadvantages" : "Inconvénients"}
                        </h4>
                        <ul className="space-y-1">
                          {guide.cons[language].map((con, i) => (
                            <li key={i} className="text-[11px] text-foreground flex items-start gap-1.5">
                              <span className="text-danger mt-0.5">✗</span> {con}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Halal Notes */}
                      <div className="bg-warning/10 border border-warning/20 rounded-xl p-3">
                        <h4 className="text-xs font-semibold text-warning flex items-center gap-1 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {en ? "Halal Notes" : "Notes Halal"}
                        </h4>
                        <p className="text-[11px] text-foreground leading-relaxed">{guide.halalNotes[language]}</p>
                      </div>

                      {/* Tutorial Steps with Checklist */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-primary">
                            {en ? "Getting Started" : "Démarrer"}
                          </h4>
                          <span className="text-[10px] text-muted-foreground">
                            {progress.done}/{progress.total}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${progress.pct}%` }}
                          />
                        </div>
                        <ul className="space-y-2">
                          {guide.steps[language].map((step, i) => {
                            const done = completedSteps[guide.id]?.[i] || false;
                            return (
                              <li key={i}>
                                <button
                                  onClick={() => toggleStep(guide.id, i)}
                                  className="flex items-start gap-2 w-full text-left"
                                >
                                  {done ? (
                                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  )}
                                  <span className={`text-[11px] leading-relaxed ${done ? "text-success line-through" : "text-foreground"}`}>
                                    {step}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* Visit button */}
                      <a
                        href={guide.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-semibold hover:bg-primary/15 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {en ? "Visit Website" : "Visiter le site"}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
