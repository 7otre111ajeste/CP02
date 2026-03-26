import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { User, BookOpen, Brain, Settings, Globe, ChevronRight, LogIn, Award, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface LevelTier {
  name: { en: string; fr: string };
  minLevel: number;
  maxLevel: number;
  emoji: string;
  color: string;
}

const LEVEL_TIERS: LevelTier[] = [
  { name: { en: "Beginner", fr: "Débutant" }, minLevel: 1, maxLevel: 10, emoji: "🌱", color: "bg-success/15 text-success border-success/20" },
  { name: { en: "Apprentice", fr: "Apprenti" }, minLevel: 11, maxLevel: 20, emoji: "📖", color: "bg-primary/15 text-primary border-primary/20" },
  { name: { en: "Intermediate", fr: "Intermédiaire" }, minLevel: 21, maxLevel: 30, emoji: "⚡", color: "bg-warning/15 text-warning border-warning/20" },
  { name: { en: "Advanced", fr: "Avancé" }, minLevel: 31, maxLevel: 40, emoji: "🔥", color: "bg-danger/15 text-danger border-danger/20" },
  { name: { en: "Expert", fr: "Expert" }, minLevel: 41, maxLevel: 50, emoji: "💎", color: "bg-accent/15 text-accent border-accent/20" },
  { name: { en: "Master", fr: "Maître" }, minLevel: 51, maxLevel: 60, emoji: "👑", color: "bg-primary/15 text-primary border-primary/20" },
  { name: { en: "Legend", fr: "Légende" }, minLevel: 61, maxLevel: 999, emoji: "🏆", color: "bg-warning/15 text-warning border-warning/20" },
];

function getCurrentTier(level: number): LevelTier {
  return LEVEL_TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel) || LEVEL_TIERS[0];
}

function getUnlockedTiers(level: number): LevelTier[] {
  return LEVEL_TIERS.filter((t) => level >= t.minLevel);
}

export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage();
  const { level, exp, expInCurrentLevel, expToNextLevel, expPercent, completedLessons, completedQuizzes, readTerms } = useUserProgress();
  const { streak } = useDailyQuests();

  const currentTier = getCurrentTier(level);
  const unlockedTiers = getUnlockedTiers(level);

  const stats = [
    { icon: BookOpen, label: t("profile.lessons"), value: String(completedLessons.length) },
    { icon: Brain, label: t("profile.quizzes"), value: String(completedQuizzes.length) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-foreground">{t("profile.title")}</h1>

      {/* Profile Card */}
      <div className="bg-gradient-card rounded-2xl p-5 border border-border text-center glow-primary">
        <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center mb-3">
          <User className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">
          {language === "en" ? "Guest User" : "Utilisateur Invité"}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${currentTier.color}`}>
            {currentTier.emoji} {currentTier.name[language]}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Flame className="w-3 h-3 text-danger" /> {streak}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{t("home.level")} {level} • {exp} {t("home.exp")}</p>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-1">
          <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${expPercent}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground">{expInCurrentLevel} / {expToNextLevel} {t("home.exp")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-4 border border-border text-center">
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-primary" />
          {language === "en" ? "Badges" : "Badges"}
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {LEVEL_TIERS.map((tier) => {
            const unlocked = level >= tier.minLevel;
            return (
              <div
                key={tier.minLevel}
                className={`rounded-xl border p-3 text-center transition-all ${
                  unlocked
                    ? `bg-card ${tier.color}`
                    : "bg-secondary/30 border-border opacity-40"
                }`}
              >
                <p className="text-2xl mb-1">{unlocked ? tier.emoji : "🔒"}</p>
                <p className="text-[10px] font-medium text-foreground">{tier.name[language]}</p>
                <p className="text-[9px] text-muted-foreground">
                  Lv. {tier.minLevel}-{tier.maxLevel > 100 ? "∞" : tier.maxLevel}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Language Toggle */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setLanguage(language === "en" ? "fr" : "en")}
          className="w-full flex items-center gap-3 p-4"
        >
          <Globe className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">{t("profile.language")}</p>
            <p className="text-xs text-muted-foreground">{language === "en" ? "English" : "Français"}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Login CTA */}
      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm">
        <LogIn className="w-4 h-4" />
        {t("profile.login")}
      </button>
    </motion.div>
  );
}
