import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cryptoProjects } from "@/data/mockData";
import { ArrowLeft, Shield, AlertTriangle, TrendingUp, TrendingDown, Sparkles, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const project = cryptoProjects.find((p) => p.id === id);
  if (!project) return <div className="p-4 text-foreground">Project not found</div>;

  const halalColor = (s: string) =>
    s === "halal" ? "text-success bg-success/10 border-success/20" : s === "notHalal" ? "text-danger bg-danger/10 border-danger/20" : "text-warning bg-warning/10 border-warning/20";

  const safetyColor = (s: string) =>
    s === "safe" ? "text-success bg-success/10 border-success/20" : s === "scam" ? "text-danger bg-danger/10 border-danger/20" : "text-warning bg-warning/10 border-warning/20";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-bold">
          {project.icon}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{project.symbol} • {project.category}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-6">
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 border ${halalColor(project.halalStatus)}`}>
          <Shield className="w-3 h-3" />{t(`tag.${project.halalStatus}`)}
        </span>
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 border ${safetyColor(project.safetyStatus)}`}>
          <AlertTriangle className="w-3 h-3" />{t(`tag.${project.safetyStatus}`)}
        </span>
        <button
          onClick={() => navigate("/ai")}
          className="text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 border border-accent/30 bg-accent/10 text-accent"
        >
          <Sparkles className="w-3 h-3" /> AI Analysis
        </button>
      </div>

      {/* Price */}
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

      {/* Sections */}
      {[
        { title: language === "en" ? "What is it?" : "Qu'est-ce que c'est ?", content: project.description[language] },
        { title: language === "en" ? "Purpose" : "Objectif", content: project.purpose[language] },
        { title: language === "en" ? "How it works" : "Comment ça marche", content: project.howItWorks[language] },
        { title: language === "en" ? "Use Cases" : "Cas d'utilisation", content: project.useCases[language] },
      ].map((section) => (
        <div key={section.title} className="bg-card rounded-xl p-4 border border-border mb-3">
          <h3 className="text-sm font-semibold text-foreground mb-1">{section.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
        </div>
      ))}
    </motion.div>
  );
}
