import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { dictionaryTerms, cryptoProjects, trainingLessons } from "@/data/mockData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import StatusTag from "@/components/StatusTag";
import { Search, BookOpen, Layers, GraduationCap, ChevronRight, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Tab = "dictionary" | "projects" | "training";

export default function LearnPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { readTerm, isTermRead, isLessonCompleted } = useUserProgress();
  const { incrementQuest } = useDailyQuests();
  const [activeTab, setActiveTab] = useState<Tab>("dictionary");
  const [search, setSearch] = useState("");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

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

  const handleTermClick = (termId: string) => {
    if (expandedTerm === termId) {
      setExpandedTerm(null);
      return;
    }
    setExpandedTerm(termId);
    if (!isTermRead(termId)) {
      readTerm(termId);
      incrementQuest("term");
      toast.success(language === "en" ? "+5 XP earned!" : "+5 XP gagnés !");
    }
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-4">{t("learn.title")}</h1>

      <div className="flex gap-1 p-1 bg-card rounded-xl border border-border mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(""); setExpandedTerm(null); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

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
            {filteredTerms.map((term) => {
              const read = isTermRead(term.id);
              const expanded = expandedTerm === term.id;
              return (
                <button
                  key={term.id}
                  onClick={() => handleTermClick(term.id)}
                  className={`w-full text-left p-4 bg-card rounded-xl border transition-all ${expanded ? "border-primary/30" : "border-border"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-foreground">{term.term[language]}</h3>
                      {read && <CheckCircle className="w-3 h-3 text-success" />}
                    </div>
                    <div className="flex items-center gap-2">
                      {!read && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">+5 XP</span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{term.category}</span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-xs text-muted-foreground leading-relaxed overflow-hidden"
                      >
                        {term.definition[language]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {!expanded && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">{term.definition[language]}</p>
                  )}
                </button>
              );
            })}
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
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <StatusTag type="halal" status={project.halalStatus} />
                  <StatusTag type="safety" status={project.safetyStatus} />
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {activeTab === "training" && (
          <motion.div key="train" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {trainingLessons.map((lesson, i) => {
              const completed = isLessonCompleted(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => navigate(`/learn/lesson/${lesson.id}`)}
                  className="w-full text-left p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                      completed ? "bg-success/15 text-success" : "bg-gradient-primary text-primary-foreground"
                    }`}>
                      {completed ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{lesson.title[language]}</h3>
                      <p className="text-xs text-muted-foreground">{lesson.description[language]}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {completed ? (
                        <span className="text-[10px] text-success font-medium">✓</span>
                      ) : (
                        <span className="text-xs font-medium text-primary">+{lesson.expReward} XP</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
