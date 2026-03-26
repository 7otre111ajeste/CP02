import { useLanguage } from "@/contexts/LanguageContext";
import { User, BookOpen, Brain, Settings, Globe, ChevronRight, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage();

  const userLevel = 3;
  const userExp = 145;
  const nextLevelExp = 200;
  const expPercent = (userExp / nextLevelExp) * 100;

  const stats = [
    { icon: BookOpen, label: t("profile.lessons"), value: "8" },
    { icon: Brain, label: t("profile.quizzes"), value: "3" },
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
        <p className="text-xs text-muted-foreground mb-4">{t("home.level")} {userLevel} • {userExp} {t("home.exp")}</p>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-1">
          <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${expPercent}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground">{userExp} / {nextLevelExp} {t("home.exp")}</p>
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
