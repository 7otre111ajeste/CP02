import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Shield, Scale, Search, AlertTriangle, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HalalMethodologyPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const criteria = language === "en" ? [
    {
      icon: Search,
      title: "Nature of the Project",
      description: "We analyze whether the project's core activity is permissible in Islamic finance. Projects involving gambling, interest-based lending (riba), or haram industries are flagged.",
    },
    {
      icon: Scale,
      title: "Revenue Model",
      description: "We examine how the project generates revenue. If earnings come from interest, speculation without underlying assets, or prohibited activities, it may be deemed not halal.",
    },
    {
      icon: Shield,
      title: "Underlying Asset & Utility",
      description: "We assess whether the token has real utility or represents tangible value. Pure speculation tokens with no utility raise concerns.",
    },
    {
      icon: CheckCircle,
      title: "Scholarly Consensus",
      description: "We reference opinions from recognized Islamic finance scholars and institutions. Where scholars disagree, the status is marked as 'Uncertain'.",
    },
  ] : [
    {
      icon: Search,
      title: "Nature du Projet",
      description: "Nous analysons si l'activité principale du projet est permise en finance islamique. Les projets impliquant les jeux d'argent, le prêt à intérêt (riba) ou des industries haram sont signalés.",
    },
    {
      icon: Scale,
      title: "Modèle de Revenus",
      description: "Nous examinons comment le projet génère des revenus. Si les gains proviennent d'intérêts, de spéculation sans actifs sous-jacents ou d'activités interdites, il peut être jugé non halal.",
    },
    {
      icon: Shield,
      title: "Actif Sous-jacent & Utilité",
      description: "Nous évaluons si le token a une utilité réelle ou représente une valeur tangible. Les tokens purement spéculatifs sans utilité soulèvent des préoccupations.",
    },
    {
      icon: CheckCircle,
      title: "Consensus des Savants",
      description: "Nous référençons les avis de savants et institutions reconnus en finance islamique. Lorsque les savants divergent, le statut est marqué 'Incertain'.",
    },
  ];

  const statuses = language === "en" ? [
    { label: "Halal", color: "text-success bg-success/10 border-success/20", desc: "The project's activity, revenue model, and utility align with Islamic finance principles." },
    { label: "Not Halal", color: "text-danger bg-danger/10 border-danger/20", desc: "The project involves activities clearly prohibited in Islamic finance (riba, gambling, etc.)." },
    { label: "Uncertain", color: "text-warning bg-warning/10 border-warning/20", desc: "Scholars disagree or there isn't enough information to make a definitive ruling." },
  ] : [
    { label: "Halal", color: "text-success bg-success/10 border-success/20", desc: "L'activité, le modèle de revenus et l'utilité du projet sont conformes aux principes de la finance islamique." },
    { label: "Non Halal", color: "text-danger bg-danger/10 border-danger/20", desc: "Le projet implique des activités clairement interdites en finance islamique (riba, jeux d'argent, etc.)." },
    { label: "Incertain", color: "text-warning bg-warning/10 border-warning/20", desc: "Les savants divergent ou il n'y a pas assez d'informations pour un jugement définitif." },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {language === "en" ? "Back" : "Retour"}
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-success/15 flex items-center justify-center">
          <Shield className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {language === "en" ? "Halal Assessment" : "Évaluation Halal"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "How we evaluate crypto projects" : "Comment nous évaluons les projets crypto"}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {language === "en"
            ? "Our halal assessment is based on Islamic finance principles. We evaluate each project on multiple criteria to determine its compliance. This is for informational purposes only — always consult a qualified scholar for personal rulings."
            : "Notre évaluation halal est basée sur les principes de la finance islamique. Nous évaluons chaque projet selon plusieurs critères. Ceci est à titre informatif uniquement — consultez toujours un savant qualifié pour des avis personnels."}
        </p>
      </div>

      <h2 className="text-sm font-semibold text-foreground mb-3">
        {language === "en" ? "Our Criteria" : "Nos Critères"}
      </h2>
      <div className="space-y-3 mb-6">
        {criteria.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <c.icon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-foreground mb-3">
        {language === "en" ? "Status Meanings" : "Signification des Statuts"}
      </h2>
      <div className="space-y-2">
        {statuses.map((s, i) => (
          <div key={i} className={`rounded-xl p-3 border ${s.color}`}>
            <p className="text-sm font-semibold mb-1">{s.label}</p>
            <p className="text-xs opacity-80 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
