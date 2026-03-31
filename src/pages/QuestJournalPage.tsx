import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuestJournal, PERSISTENT_QUESTS, PersistentQuest } from "@/hooks/useQuestJournal";
import { ArrowLeft, Gift, CheckCircle, Lock, TrendingUp, Heart, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Category = "all" | "practice" | "holding" | "likes";

const CATEGORY_CONFIG: Record<Category, { label: { en: string; fr: string }; icon: typeof TrendingUp }> = {
  all: { label: { en: "All", fr: "Toutes" }, icon: Gift },
  practice: { label: { en: "Practice", fr: "Pratique" }, icon: TrendingUp },
  holding: { label: { en: "Holding", fr: "Holding" }, icon: Clock },
  likes: { label: { en: "Likes", fr: "Likes" }, icon: Heart },
};

export default function QuestJournalPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { quests, claimReward, getProgress, isCompleted, isClaimed } = useQuestJournal();
  const [category, setCategory] = useState<Category>("all");
  const en = language === "en";

  // Auto-check holding quests based on practice trades
  useEffect(() => {
    try {
      const practiceData = JSON.parse(localStorage.getItem("cryptopedia-practice") || '{"trades":[]}');
      const trades = practiceData.trades || [];
      if (trades.length === 0) return;

      const buyTrades = trades.filter((t: any) => t.type === "buy");
      const now = Date.now();

      const journal = JSON.parse(localStorage.getItem("cryptopedia-quest-journal") || '{"progress":{},"completed":[],"claimed":[]}');
      let changed = false;

      // Check holding quests - find longest held position
      const holdingQuests = PERSISTENT_QUESTS.filter((q) => q.category === "holding");
      if (buyTrades.length > 0) {
        const oldestBuy = buyTrades.reduce((oldest: any, t: any) => {
          const time = new Date(t.date).getTime();
          return time < oldest ? time : oldest;
        }, now);
        const hoursHeld = (now - oldestBuy) / (1000 * 60 * 60);

        holdingQuests.forEach((quest) => {
          if (!journal.completed.includes(quest.id) && hoursHeld >= quest.target) {
            journal.progress[quest.id] = quest.target;
            if (!journal.completed.includes(quest.id)) {
              journal.completed.push(quest.id);
              changed = true;
            }
          } else if (!journal.completed.includes(quest.id)) {
            journal.progress[quest.id] = Math.min(Math.floor(hoursHeld), quest.target);
            changed = true;
          }
        });
      }

      // Check profitable trades
      const profitQuests = PERSISTENT_QUESTS.filter((q) => q.category === "practice");
      const sellTrades = trades.filter((t: any) => t.type === "sell");
      // Count sells where the sell price was > buy price (simplified: count all sells as potential profits)
      let profitableCount = 0;
      const buyPrices: Record<string, number[]> = {};
      trades.forEach((t: any) => {
        if (t.type === "buy") {
          if (!buyPrices[t.coinId]) buyPrices[t.coinId] = [];
          buyPrices[t.coinId].push(t.pricePerToken);
        } else if (t.type === "sell") {
          const avgBuy = buyPrices[t.coinId]?.length ? buyPrices[t.coinId].reduce((a: number, b: number) => a + b, 0) / buyPrices[t.coinId].length : 0;
          if (avgBuy > 0 && t.pricePerToken >= avgBuy * 1.1) {
            profitableCount++;
          }
        }
      });

      profitQuests.forEach((quest) => {
        if (!journal.completed.includes(quest.id)) {
          journal.progress[quest.id] = Math.min(profitableCount, quest.target);
          if (profitableCount >= quest.target && !journal.completed.includes(quest.id)) {
            journal.completed.push(quest.id);
          }
          changed = true;
        }
      });

      if (changed) {
        localStorage.setItem("cryptopedia-quest-journal", JSON.stringify(journal));
      }
    } catch {}
  }, []);

  const filtered = category === "all" ? quests : quests.filter((q) => q.category === category);

  const completedCount = filtered.filter((q) => isCompleted(q.id)).length;
  const totalCount = filtered.length;

  const handleClaim = (quest: PersistentQuest) => {
    const success = claimReward(quest.id);
    if (success) {
      toast.success(
        en
          ? `${quest.badgeEmoji} +${quest.expReward} XP & +${quest.pointsReward} Points!`
          : `${quest.badgeEmoji} +${quest.expReward} XP & +${quest.pointsReward} Points !`
      );
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-1">
        {en ? "Quest Journal" : "Journal de Quêtes"} 📜
      </h1>
      <p className="text-xs text-muted-foreground mb-5">
        {en ? "Complete quests to earn badges, XP & points" : "Complétez des quêtes pour gagner badges, XP & points"}
      </p>

      {/* Overall progress */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-foreground">{en ? "Progress" : "Progression"}</p>
          <p className="text-xs text-primary font-bold">{completedCount}/{totalCount}</p>
        </div>
        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const Icon = config.icon;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {config.label[language]}
            </button>
          );
        })}
      </div>

      {/* Quest list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((quest) => {
            const progress = getProgress(quest.id);
            const completed = isCompleted(quest.id);
            const claimed = isClaimed(quest.id);
            const pct = Math.min(100, (progress / quest.target) * 100);

            return (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`bg-card border rounded-2xl p-4 transition-colors ${
                  claimed ? "border-success/30 bg-success/5" : completed ? "border-primary/30" : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0 mt-0.5">{quest.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-semibold ${claimed ? "text-success" : "text-foreground"}`}>
                        {quest.title[language]}
                      </p>
                      {claimed && <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-2">{quest.description[language]}</p>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-1.5">
                      <motion.div
                        className={`h-full rounded-full ${claimed ? "bg-success" : completed ? "bg-primary" : "bg-primary/60"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground">
                        {Math.min(progress, quest.target)}/{quest.target}
                        {quest.category === "holding" && ` ${en ? "hours" : "heures"}`}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-primary font-semibold">+{quest.expReward} XP</span>
                        <span className="text-[10px] text-warning font-semibold">+{quest.pointsReward} pts</span>
                      </div>
                    </div>

                    {/* Claim button */}
                    {completed && !claimed && (
                      <button
                        onClick={() => handleClaim(quest)}
                        className="mt-3 w-full py-2 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        {en ? "Claim Reward" : "Réclamer la récompense"}
                      </button>
                    )}

                    {!completed && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        {en ? "In progress..." : "En cours..."}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
