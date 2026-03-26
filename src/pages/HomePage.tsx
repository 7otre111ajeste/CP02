import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { cryptoProjects } from "@/data/mockData";
import { BookOpen, Brain, Sparkles, StickyNote, Calculator, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { level, exp, expInCurrentLevel, expToNextLevel, expPercent, completedLessons, completedQuizzes, readTerms } = useUserProgress();

  const quickActions = [
    { icon: BookOpen, label: t("home.continue"), path: "/learn", color: "bg-primary/15 text-primary" },
    { icon: Brain, label: t("home.quiz"), path: "/quiz", color: "bg-accent/15 text-accent" },
    { icon: Sparkles, label: t("home.scanner"), path: "/ai", color: "bg-warning/15 text-warning" },
    { icon: StickyNote, label: language === "en" ? "Notes" : "Notes", path: "/notes", color: "bg-secondary text-foreground" },
    { icon: Calculator, label: language === "en" ? "Calculator" : "Calculatrice", path: "/calculator", color: "bg-success/15 text-success" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-6">
      <motion.div variants={item}>
        <p className="text-muted-foreground text-sm">{t("home.welcome")} 👋</p>
        <h1 className="text-2xl font-bold text-foreground">Cryptopedia</h1>
      </motion.div>

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
          <span>{completedLessons.length} {language === "en" ? "lessons" : "leçons"}</span>
          <span>{completedQuizzes.length} {language === "en" ? "quizzes" : "quiz"}</span>
          <span>{readTerms.length} {language === "en" ? "terms read" : "termes lus"}</span>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">{t("home.quickActions")}</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-foreground text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground">{t("home.popular")}</h2>
          <button onClick={() => navigate("/learn")} className="text-xs text-primary flex items-center gap-1">
            {t("common.readMore")} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {cryptoProjects.slice(0, 3).map((project) => (
            <button
              key={project.id}
              onClick={() => navigate(`/learn/project/${project.id}`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold">
                {project.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{project.name}</p>
                <p className="text-xs text-muted-foreground truncate">{project.description[language]}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">${project.price.toLocaleString()}</p>
                <p className={`text-xs font-medium ${project.change24h >= 0 ? "text-success" : "text-danger"}`}>
                  {project.change24h >= 0 ? "+" : ""}{project.change24h}%
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
