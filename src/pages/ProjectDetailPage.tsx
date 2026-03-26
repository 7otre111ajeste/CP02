import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cryptoProjects } from "@/data/mockData";
import { projectExchanges } from "@/data/platformsData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { ArrowLeft, TrendingUp, TrendingDown, Sparkles, BarChart3, CheckCircle, ExternalLink, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import StatusTag from "@/components/StatusTag";
import ScoreBadge from "@/components/ScoreBadge";
import DescriptionToggle from "@/components/DescriptionToggle";
import TermHighlighter from "@/components/TermHighlighter";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { readProject, isProjectRead } = useUserProgress();
  const { incrementQuest } = useDailyQuests();

  const project = cryptoProjects.find((p) => p.id === id);
  if (!project) return <div className="p-4 text-foreground">Project not found</div>;

  const alreadyRead = isProjectRead(project.id);

  const handleMarkRead = () => {
    if (alreadyRead) return;
    readProject(project.id);
    incrementQuest("lesson");
    toast.success(language === "en" ? "+15 XP & +10 Points earned!" : "+15 XP & +10 Points gagnés !");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      <div className="flex items-center gap-4 mb-6">
        <img src={project.logo} alt={project.name} className="w-14 h-14 rounded-2xl shrink-0" loading="lazy" />
        <div>
          <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{project.symbol} • {project.category}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <StatusTag type="halal" status={project.halalStatus} />
        <StatusTag type="safety" status={project.safetyStatus} />
        <ScoreBadge score={project.score} />
        <button
          onClick={() => navigate("/ai", { state: { projectName: project.name } })}
          className="text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 border border-accent/30 bg-accent/10 text-accent"
        >
          <Sparkles className="w-3 h-3" /> AI Analysis
        </button>
      </div>

      <div className="bg-gradient-card rounded-2xl p-5 border border-border mb-4 glow-primary">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">{t("market.price")}</p>
            <p className="text-2xl font-bold text-foreground">${project.price.toLocaleString()}</p>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${project.change24h >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {project.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {project.change24h >= 0 ? "+" : ""}{project.change24h}%
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: t("market.cap"), value: project.marketCap },
            { label: "ATH", value: `$${project.ath.toLocaleString()}` },
            { label: "ATL", value: `$${project.atl}` },
            { label: "Year", value: project.yearCreated },
          ].map((stat) => (
            <div key={stat.label} className="bg-secondary/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Links */}
      <div className="flex gap-2 mb-4">
        <a
          href={project.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-card border border-border text-foreground hover:border-primary/30 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-primary" />
          {language === "en" ? "Official Website" : "Site officiel"}
        </a>
        <a
          href={project.whitepaper}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-card border border-border text-foreground hover:border-primary/30 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-primary" />
          Whitepaper
        </a>
      </div>

      {/* Pro/Bro Description */}
      <div className="bg-card rounded-xl p-4 border border-border mb-3">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          {language === "en" ? "What is it?" : "Qu'est-ce que c'est ?"}
        </h3>
        <DescriptionToggle
          proBro={{
            pro: project.descriptionPro[language],
            bro: project.descriptionBro[language],
          }}
        />
      </div>

      {[
        { title: language === "en" ? "Purpose" : "Objectif", content: project.purpose[language] },
        { title: language === "en" ? "How it works" : "Comment ça marche", content: project.howItWorks[language] },
        { title: language === "en" ? "Use Cases" : "Cas d'utilisation", content: project.useCases[language] },
      ].map((section) => (
        <div key={section.title} className="bg-card rounded-xl p-4 border border-border mb-3">
          <h3 className="text-sm font-semibold text-foreground mb-1">{section.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <TermHighlighter text={section.content} />
          </p>
        </div>
      ))}

      {/* Where to buy */}
      {projectExchanges[project.id] && (
        <div className="bg-card rounded-xl p-4 border border-border mb-3">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            {language === "en" ? `Where to buy ${project.symbol}` : `Où acheter ${project.symbol}`}
          </h3>
          <div className="space-y-1.5">
            {projectExchanges[project.id].map((ex) => (
              <a
                key={ex.exchangeId}
                href={ex.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <span className="text-xs font-medium text-foreground">{ex.name}</span>
                <ExternalLink className="w-3 h-3 text-primary" />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleMarkRead}
        disabled={alreadyRead}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all mb-3 ${
          alreadyRead
            ? "bg-success/15 text-success border border-success/20"
            : "bg-gradient-primary text-primary-foreground hover:opacity-90"
        }`}
      >
        <CheckCircle className="w-4 h-4" />
        {alreadyRead
          ? (language === "en" ? "Read ✓" : "Lu ✓")
          : (language === "en" ? "Mark as Read (+15 XP)" : "Marquer comme lu (+15 XP)")}
      </button>

      <button
        onClick={() => navigate(`/market/${project.id}`)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
      >
        <BarChart3 className="w-4 h-4" />
        {language === "en" ? "View Live Market Data" : "Voir les données du marché"} →
      </button>
    </motion.div>
  );
}
