import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { dictionaryTerms, cryptoProjects, trainingLessons } from "@/data/mockData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import StatusTag from "@/components/StatusTag";
import ScoreBadge from "@/components/ScoreBadge";
import SortFilter, { type SortField, type SortDirection } from "@/components/SortFilter";
import DescriptionToggle from "@/components/DescriptionToggle";
import TermHighlighter from "@/components/TermHighlighter";
import { Search, BookOpen, Layers, GraduationCap, ChevronRight, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Tab = "dictionary" | "projects" | "training";

const PROJECT_SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "name", label: "A → Z" },
  { value: "price", label: "Price" },
  { value: "year", label: "Year" },
];

export default function LearnPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { readTerm, isTermRead, isLessonCompleted } = useUserProgress();
  const { incrementQuest } = useDailyQuests();
  const [activeTab, setActiveTab] = useState<Tab>("dictionary");
  const [search, setSearch] = useState("");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const tabs = [
    { id: "dictionary" as Tab, label: t("learn.dictionary"), icon: BookOpen },
    { id: "projects" as Tab, label: t("learn.projects"), icon: Layers },
    { id: "training" as Tab, label: t("learn.training"), icon: GraduationCap },
  ];

  const filteredTerms = dictionaryTerms.filter((term) =>
    term.term[language].toLowerCase().includes(search.toLowerCase())
  );

  const filteredProjects = useMemo(() => {
    let list = cryptoProjects.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "price": cmp = a.price - b.price; break;
        case "year": cmp = a.yearCreated - b.yearCreated; break;
        default: cmp = 0;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [search, sortField, sortDir]);

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
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === "dictionary" ? t("learn.searchTerms") : t("learn.searchProjects")}
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          {activeTab === "projects" && (
            <SortFilter
              fields={PROJECT_SORT_FIELDS}
              current={sortField}
              direction={sortDir}
              onChange={(f, d) => { setSortField(f); setSortDir(d); }}
            />
          )}
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
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <TermHighlighter text={term.definition[language]} />
                        </p>
                      </motion.div>
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
                  <img src={project.logo} alt={project.name} className="w-10 h-10 rounded-xl shrink-0" loading="lazy" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-foreground">{project.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{project.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{project.symbol} • {project.yearCreated}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{project.descriptionBro[language]}</p>
                <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                  <StatusTag type="halal" status={project.halalStatus} />
                  <StatusTag type="safety" status={project.safetyStatus} />
                  <ScoreBadge score={project.score} />
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
