import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { dictionaryTerms, cryptoProjects, trainingLessons } from "@/data/mockData";
import { Search, BookOpen, Layers, GraduationCap, ChevronRight, Shield, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "dictionary" | "projects" | "training";

export default function LearnPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("dictionary");
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "dictionary" as Tab, label: t("learn.dictionary"), icon: BookOpen },
    { id: "projects" as Tab, label: t("learn.projects"), icon: Layers },
    { id: "training" as Tab, label: t("learn.training"), icon: GraduationCap },
  ];

  const filteredTerms = dictionaryTerms.filter((term) =>
    term.term[language].toLowerCase().includes(search.toLowerCase())
  );

  const filteredProjects = cryptoProjects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const halalColor = (s: string) =>
    s === "halal" ? "text-success bg-success/10" : s === "notHalal" ? "text-danger bg-danger/10" : "text-warning bg-warning/10";

  const safetyColor = (s: string) =>
    s === "safe" ? "text-success bg-success/10" : s === "scam" ? "text-danger bg-danger/10" : "text-warning bg-warning/10";

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-4">{t("learn.title")}</h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-card rounded-xl border border-border mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(""); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      {activeTab !== "training" && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "dictionary" ? t("learn.searchTerms") : t("learn.searchProjects")}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === "dictionary" && (
          <motion.div key="dict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {filteredTerms.map((term) => (
              <div key={term.id} className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-foreground">{term.term[language]}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{term.category}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{term.definition[language]}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "projects" && (
          <motion.div key="proj" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => navigate(`/learn/project/${project.id}`)}
                className="w-full text-left p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold">
                    {project.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-foreground">{project.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{project.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{project.symbol} • {project.yearCreated}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{project.description[language]}</p>
                <div className="flex gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${halalColor(project.halalStatus)}`}>
                    <Shield className="w-2.5 h-2.5" />{t(`tag.${project.halalStatus}`)}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${safetyColor(project.safetyStatus)}`}>
                    <AlertTriangle className="w-2.5 h-2.5" />{t(`tag.${project.safetyStatus}`)}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {activeTab === "training" && (
          <motion.div key="train" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {trainingLessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => navigate(`/learn/lesson/${lesson.id}`)}
                className="w-full text-left p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground">{lesson.title[language]}</h3>
                    <p className="text-xs text-muted-foreground">{lesson.description[language]}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="text-xs font-medium">+{lesson.expReward} XP</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
