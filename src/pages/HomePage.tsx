import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useCryptoMarket } from "@/hooks/useCryptoMarket";
import { useAuth } from "@/contexts/AuthContext";
import { cryptoProjects } from "@/data/mockData";
import { BookOpen, Brain, Sparkles, Calculator, ChevronRight, ChevronDown, Flame, CheckCircle, Circle, Gift, Star, Eye, Info, Shield, PieChart, Lock, Gamepad2, Trophy, Newspaper, Wallet, ScrollText, Swords } from "lucide-react";
import StatusTag from "@/components/StatusTag";
import ScoreBadge from "@/components/ScoreBadge";
import MarketSentiment from "@/components/MarketSentiment";
import LockedOverlay from "@/components/LockedOverlay";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const PROJECT_TO_COINGECKO: Record<string, string> = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  solana: "solana",
  cardano: "cardano",
  bnb: "binancecoin",
};

export default function HomePage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuest = !user;
  const { level, exp, expInCurrentLevel, expToNextLevel, expPercent, completedLessons, completedQuizzes, readTerms } = useUserProgress();
  const { quests, progress, completed, streak, allCompleted, canClaimStreak, streakRequired, streakBonusExp, claimStreakBonus } = useDailyQuests();
  const { watchlist, toggleWatchlist, isWatching } = useWatchlist();
  const { data: marketCoins } = useCryptoMarket();
  const [hoveredQuest, setHoveredQuest] = useState<string | null>(null);
  const [showAllWatchlist, setShowAllWatchlist] = useState(false);

  const en = language === "en";

  const quickActions = [
    { icon: BookOpen, label: t("home.continue"), path: "/learn", color: "bg-primary/15 text-primary", locked: isGuest },
    { icon: Brain, label: t("home.quiz"), path: "/quiz", color: "bg-accent/15 text-accent", locked: isGuest },
    { icon: Sparkles, label: t("home.scanner"), path: "/ai", color: "bg-warning/15 text-warning", locked: false },
    { icon: Calculator, label: en ? "Calculator" : "Calculatrice", path: "/calculator", color: "bg-success/15 text-success", locked: isGuest },
    { icon: PieChart, label: "Portfolio", path: "/portfolio", color: "bg-primary/15 text-primary", locked: isGuest },
    { icon: Trophy, label: en ? "Leaderboard" : "Classement", path: "/leaderboard", color: "bg-warning/15 text-warning", locked: false },
    { icon: Gamepad2, label: en ? "Practice" : "Pratique", path: "/practice", color: "bg-accent/15 text-accent", locked: isGuest },
    { icon: Wallet, label: en ? "Exchanges" : "Exchanges", path: "/learn/exchanges-wallets", color: "bg-success/15 text-success", locked: isGuest },
    { icon: ScrollText, label: en ? "Quests" : "Quêtes", path: "/quests", color: "bg-primary/15 text-primary", locked: isGuest },
    { icon: Swords, label: en ? "Duel 1v1" : "Duel 1v1", path: "/duel", color: "bg-destructive/15 text-destructive", locked: isGuest },
    { icon: Newspaper, label: en ? "News" : "Actualités", path: "/news", color: "bg-danger/15 text-danger", locked: false },
  ];

  const getProjectWithLivePrice = (project: typeof cryptoProjects[0]) => {
    const geckoId = PROJECT_TO_COINGECKO[project.id];
    const liveCoin = marketCoins?.find((c) => c.id === geckoId);
    if (liveCoin) {
      return {
        ...project,
        price: liveCoin.current_price,
        change24h: parseFloat(liveCoin.price_change_percentage_24h?.toFixed(2) || "0"),
      };
    }
    return project;
  };

  const watchedProjects = cryptoProjects.filter((p) => watchlist.includes(p.id)).map(getProjectWithLivePrice);
  const otherProjects = cryptoProjects.filter((p) => !watchlist.includes(p.id)).map(getProjectWithLivePrice);

  const hasWatchlist = watchedProjects.length > 0;
  const displayProjects = hasWatchlist
    ? (showAllWatchlist ? watchedProjects : watchedProjects.slice(0, 5))
    : [...watchedProjects, ...otherProjects].slice(0, 5);

  const handleClaimStreak = () => {
    claimStreakBonus();
    toast.success(en ? `+${streakBonusExp} XP streak bonus!` : `+${streakBonusExp} XP bonus de série !`);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-6">
      <motion.div variants={item}>
        <p className="text-muted-foreground text-sm">{t("home.welcome")} 👋</p>
        <h1 className="text-2xl font-bold text-foreground">Cryptopedia</h1>
        {isGuest && (
          <button
            onClick={() => navigate("/auth")}
            className="mt-2 text-xs text-primary font-medium flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            {en ? "Sign in to unlock all features" : "Connectez-vous pour tout débloquer"}
          </button>
        )}
      </motion.div>

      {/* Level Card */}
      <LockedOverlay locked={isGuest}>
        <motion.div variants={item} className="bg-gradient-card rounded-2xl p-5 border border-border glow-primary">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {level}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("home.level")} {level}</p>
                <p className="text-xs text-muted-foreground">{expInCurrentLevel} / {expToNextLevel} {t("home.exp")}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{exp}</p>
              <p className="text-[10px] text-muted-foreground">Total XP</p>
            </div>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${expPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
            <span>{completedLessons.length} {en ? "lessons" : "leçons"}</span>
            <span>{completedQuizzes.length} {en ? "quizzes" : "quiz"}</span>
            <span>{readTerms.length} {en ? "terms read" : "termes lus"}</span>
          </div>
        </motion.div>
      </LockedOverlay>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">{t("home.quickActions")}</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => action.locked ? navigate("/auth") : navigate(action.path)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border transition-all ${
                action.locked ? "opacity-50" : "hover:border-primary/30"
              }`}
            >
              {action.locked && (
                <Lock className="absolute top-1.5 right-1.5 w-3 h-3 text-muted-foreground" />
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-foreground text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>


      {/* Daily Quests */}
      <LockedOverlay locked={isGuest}>
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-warning" />
              {en ? "Daily Quests" : "Quêtes quotidiennes"}
            </h2>
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-danger" />
              <span className="text-xs font-bold text-foreground">{streak}</span>
              <span className="text-[10px] text-muted-foreground">/ {streakRequired}</span>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            {quests.map((quest) => {
              const isDone = completed.includes(quest.id);
              const current = progress[quest.id] || 0;
              const pct = Math.min(100, (current / quest.target) * 100);
              const isHovered = hoveredQuest === quest.id;
              return (
                <div
                  key={quest.id}
                  className="relative"
                  onMouseEnter={() => setHoveredQuest(quest.id)}
                  onMouseLeave={() => setHoveredQuest(null)}
                  onClick={() => setHoveredQuest(isHovered ? null : quest.id)}
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-xs font-medium flex items-center gap-1 ${isDone ? "text-success line-through" : "text-foreground"}`}>
                          {quest.title[language]}
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </p>
                        <span className="text-[10px] text-primary font-semibold">+{quest.expReward} XP</span>
                      </div>
                      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isDone ? "bg-success" : "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        {Math.min(current, quest.target)}/{quest.target}
                      </p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-1.5 ml-8 p-2.5 rounded-lg bg-secondary/80 border border-border"
                      >
                        <p className="text-[11px] text-foreground">{quest.description[language]}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            {canClaimStreak && (
              <button
                onClick={handleClaimStreak}
                className="w-full mt-2 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                {en ? `Claim ${streakBonusExp} XP Streak Bonus!` : `Réclamez ${streakBonusExp} XP Bonus de série !`}
              </button>
            )}
            {allCompleted && !canClaimStreak && (
              <p className="text-center text-xs text-success font-medium pt-1">
                {en ? "✅ All quests completed today!" : "✅ Toutes les quêtes sont complétées !"}
              </p>
            )}
          </div>
        </motion.div>
      </LockedOverlay>

      <motion.div variants={item}>
        <MarketSentiment />
      </motion.div>

      {/* Watchlist / Popular Projects */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            {hasWatchlist && <Eye className="w-3.5 h-3.5 text-primary" />}
            {hasWatchlist
              ? (en ? "My Watchlist" : "Ma Watchlist")
              : t("home.popular")}
          </h2>
          {!hasWatchlist && (
            <button onClick={() => navigate("/learn")} className="text-xs text-primary flex items-center gap-1">
              {t("common.readMore")} <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="space-y-2">
          {displayProjects.map((project) => (
            <div
              key={project.id}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-left"
            >
              <button
                onClick={() => toggleWatchlist(project.id)}
                className="flex-shrink-0"
              >
                <Star
                  className={`w-4 h-4 transition-colors ${isWatching(project.id) ? "text-warning fill-warning" : "text-muted-foreground"}`}
                />
              </button>
              <button
                onClick={() => navigate(`/learn/project/${project.id}`)}
                className="flex-1 flex items-center gap-3 min-w-0"
              >
                <img src={project.logo} alt={project.name} className="w-10 h-10 rounded-xl shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-foreground">{project.name}</p>
                    <ScoreBadge score={project.score} />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <StatusTag type="halal" status={project.halalStatus} />
                    <StatusTag type="safety" status={project.safetyStatus} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/ai", { state: { projectName: project.name } });
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border border-accent/30 bg-accent/10 text-accent"
                    >
                      <Sparkles className="w-2.5 h-2.5" /> AI
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">${project.price.toLocaleString()}</p>
                  <p className={`text-xs font-medium ${project.change24h >= 0 ? "text-success" : "text-danger"}`}>
                    {project.change24h >= 0 ? "+" : ""}{project.change24h}%
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>

        {hasWatchlist && watchedProjects.length > 5 && (
          <button
            onClick={() => setShowAllWatchlist(!showAllWatchlist)}
            className="w-full mt-2 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium text-primary bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
          >
            {showAllWatchlist
              ? (en ? "Show less" : "Voir moins")
              : (en ? `See all (${watchedProjects.length})` : `Voir tout (${watchedProjects.length})`)}
            <ChevronDown className={`w-3 h-3 transition-transform ${showAllWatchlist ? "rotate-180" : ""}`} />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
