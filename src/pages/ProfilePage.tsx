import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProgress, TIME_BADGES } from "@/hooks/useUserProgress";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, Brain, Globe, ChevronRight, LogIn, LogOut, Award, Flame, Coins, ShoppingBag, Info, Edit2, Clock, Calendar, Sun, Moon, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import UserTierBadge from "@/components/UserTierBadge";
import { motion } from "framer-motion";
import { toast } from "sonner";

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

const AVATAR_EMOJIS = ["👤", "🦊", "🐱", "🐶", "🦁", "🐻", "🐼", "🦉", "🐉", "🚀", "💎", "⚡", "🔥", "🌟", "👑", "🎯"];

function getCurrentTier(level: number): LevelTier {
  return LEVEL_TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel) || LEVEL_TIERS[0];
}

export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const {
    level, exp, expInCurrentLevel, expToNextLevel, expPercent,
    completedLessons, completedQuizzes, readTerms, readProjects,
    points, username, avatarEmoji,
    setUsername, setAvatarEmoji,
    canChangeUsernameFree, canChangeAvatarFree, unlimitedProfileChanges,
    registrationDate, daysSinceRegistration, claimedTimeBadges, claimTimeBadge,
  } = useUserProgress();
  const { streak } = useDailyQuests();
  const { theme, toggleTheme } = useTheme();
  const { user, profile: authProfile, signOut } = useAuth();
  const userTier: "free" | "premium" | "vip" = "free";

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(username);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const currentTier = getCurrentTier(level);
  const en = language === "en";

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const canFree = canChangeUsernameFree || unlimitedProfileChanges;
    if (!canFree) {
      toast.error(en ? "Buy unlimited changes in the Shop!" : "Achetez les changements illimités dans la Boutique !");
      return;
    }
    const result = setUsername(nameInput.trim());
    if (result.success) {
      toast.success(en ? "Username updated!" : "Pseudo mis à jour !");
      setEditingName(false);
    } else {
      toast.error(en ? "Change limit reached. Buy unlimited in Shop!" : "Limite atteinte. Achetez l'illimité dans la Boutique !");
    }
  };

  const handlePickAvatar = (emoji: string) => {
    const canFree = canChangeAvatarFree || unlimitedProfileChanges;
    if (!canFree) {
      toast.error(en ? "Buy unlimited changes in the Shop!" : "Achetez les changements illimités dans la Boutique !");
      return;
    }
    const result = setAvatarEmoji(emoji);
    if (result.success) {
      toast.success(en ? "Avatar updated!" : "Avatar mis à jour !");
      setShowAvatarPicker(false);
    }
  };

  const handleClaimTimeBadge = (badgeId: string) => {
    const badge = TIME_BADGES.find((b) => b.id === badgeId);
    if (!badge) return;
    const success = claimTimeBadge(badgeId);
    if (success) {
      toast.success(en ? `${badge.emoji} +${badge.exp} XP & +${badge.points} Points!` : `${badge.emoji} +${badge.exp} XP & +${badge.points} Points !`);
    }
  };

  const regDate = new Date(registrationDate);
  const formattedRegDate = regDate.toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
    year: "numeric", month: "long", day: "numeric",
  });

  const stats = [
    { icon: BookOpen, label: t("profile.lessons"), value: String(completedLessons.length) },
    { icon: Brain, label: t("profile.quizzes"), value: String(completedQuizzes.length) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-28 max-w-lg mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-foreground">{t("profile.title")}</h1>

      {/* Profile Card */}
      <div className="bg-gradient-card rounded-2xl p-5 border border-border text-center glow-primary">
        <button onClick={() => setShowAvatarPicker(!showAvatarPicker)} className="relative mx-auto mb-3 group">
          <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center text-2xl">
            {avatarEmoji}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center">
            <Edit2 className="w-2.5 h-2.5 text-muted-foreground" />
          </div>
        </button>

        {showAvatarPicker && (
          <div className="grid grid-cols-8 gap-2 mb-3 bg-secondary/50 rounded-xl p-3">
            {AVATAR_EMOJIS.map((e) => (
              <button key={e} onClick={() => handlePickAvatar(e)} className={`text-xl p-1 rounded-lg hover:bg-primary/10 ${avatarEmoji === e ? "bg-primary/20 ring-1 ring-primary" : ""}`}>
                {e}
              </button>
            ))}
          </div>
        )}

        {editingName ? (
          <div className="flex items-center gap-2 justify-center mb-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="bg-secondary border border-border rounded-lg px-3 py-1 text-sm text-foreground text-center w-40 focus:outline-none focus:ring-1 focus:ring-primary"
              maxLength={20}
              autoFocus
            />
            <button onClick={handleSaveName} className="text-xs px-3 py-1 rounded-lg bg-primary text-primary-foreground font-medium">OK</button>
            <button onClick={() => setEditingName(false)} className="text-xs px-2 py-1 text-muted-foreground">✕</button>
          </div>
        ) : (
          <button onClick={() => { setNameInput(username); setEditingName(true); }} className="flex items-center gap-1 mx-auto mb-1">
            <h2 className="text-lg font-bold text-foreground">{username}</h2>
            <Edit2 className="w-3 h-3 text-muted-foreground" />
          </button>
        )}

        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${currentTier.color}`}>
            {currentTier.emoji} {currentTier.name[language]}
          </span>
          <UserTierBadge tier={userTier} />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Flame className="w-3 h-3 text-danger" /> {streak}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{t("home.level")} {level} • {exp} {t("home.exp")}</p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coins className="w-3.5 h-3.5 text-warning" />
          <span className="text-sm font-bold text-foreground">{points}</span>
          <span className="text-xs text-muted-foreground">points</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-1">
          <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${expPercent}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground">{expInCurrentLevel} / {expToNextLevel} {t("home.exp")}</p>

        {/* Registration date */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {en ? `Member since ${formattedRegDate}` : `Membre depuis le ${formattedRegDate}`}
          <span className="text-primary font-medium">({daysSinceRegistration} {en ? "days" : "jours"})</span>
        </div>
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

      {/* Time Badges */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" />
          {en ? "Loyalty Badges" : "Badges de fidélité"}
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {TIME_BADGES.map((badge) => {
            const unlocked = daysSinceRegistration >= badge.days;
            const claimed = claimedTimeBadges.includes(badge.id);
            return (
              <button
                key={badge.id}
                onClick={() => unlocked && !claimed && handleClaimTimeBadge(badge.id)}
                disabled={!unlocked || claimed}
                className={`rounded-xl border p-3 text-center transition-all ${
                  claimed
                    ? "bg-success/10 border-success/20 text-success"
                    : unlocked
                    ? "bg-primary/10 border-primary/20 text-primary animate-pulse"
                    : "bg-secondary/30 border-border opacity-40"
                }`}
              >
                <p className="text-2xl mb-1">{unlocked ? badge.emoji : "🔒"}</p>
                <p className="text-[10px] font-medium text-foreground">{badge.label[language]}</p>
                {unlocked && !claimed && (
                  <p className="text-[9px] text-primary font-semibold mt-0.5">+{badge.exp} XP</p>
                )}
                {claimed && (
                  <p className="text-[9px] text-success font-semibold mt-0.5">✓</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate("/shop")} className="bg-card rounded-xl p-4 border border-border text-center hover:border-primary/30 transition-colors">
          <ShoppingBag className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">{en ? "Shop" : "Boutique"}</p>
          <p className="text-[10px] text-muted-foreground">{points} pts</p>
        </button>
        <button onClick={() => navigate("/about")} className="bg-card rounded-xl p-4 border border-border text-center hover:border-primary/30 transition-colors">
          <Info className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">{en ? "About & Rules" : "À propos & Règles"}</p>
        </button>
      </div>

      {/* Level Badges */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-primary" />
          {en ? "Level Badges" : "Badges de niveau"}
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {LEVEL_TIERS.map((tier) => {
            const unlocked = level >= tier.minLevel;
            return (
              <div
                key={tier.minLevel}
                className={`rounded-xl border p-3 text-center transition-all ${
                  unlocked ? `bg-card ${tier.color}` : "bg-secondary/30 border-border opacity-40"
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

      {/* Settings */}
      <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
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
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 p-4"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-accent" />}
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">{en ? "Theme" : "Thème"}</p>
            <p className="text-xs text-muted-foreground">{theme === "dark" ? (en ? "Dark Mode" : "Mode sombre") : (en ? "Light Mode" : "Mode clair")}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={() => navigate("/platforms")}
          className="w-full flex items-center gap-3 p-4"
        >
          <Shield className="w-5 h-5 text-primary" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">{en ? "Trusted Platforms" : "Plateformes de confiance"}</p>
            <p className="text-xs text-muted-foreground">{en ? "Exchanges & Wallets" : "Exchanges & Portefeuilles"}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Login / Logout CTA */}
      {user ? (
        <button
          onClick={async () => { await signOut(); toast.success(en ? "Logged out" : "Déconnecté"); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-danger/10 text-danger border border-danger/20 font-semibold text-sm"
        >
          <LogOut className="w-4 h-4" />
          {en ? "Log Out" : "Se Déconnecter"}
        </button>
      ) : (
        <button
          onClick={() => navigate("/auth")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
        >
          <LogIn className="w-4 h-4" />
          {t("profile.login")}
        </button>
      )}
  );
}
