import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, ShieldCheck, AlertTriangle, Eye, Users, Code, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function SafetyMethodologyPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const criteria = language === "en" ? [
    {
      icon: Users,
      title: "Team & Transparency",
      description: "We check if the team is publicly known and verified. Anonymous teams with no track record increase risk significantly.",
    },
    {
      icon: Code,
      title: "Smart Contract Audit",
      description: "We verify whether the project's code has been audited by reputable security firms. Unaudited projects carry higher risk.",
    },
    {
      icon: Activity,
      title: "Market Activity & Liquidity",
      description: "We analyze trading volume, liquidity depth, and market cap. Low liquidity and suspicious trading patterns are red flags.",
    },
    {
      icon: Eye,
      title: "Community & Track Record",
      description: "We evaluate the project's history, community engagement, and whether it has delivered on its promises over time.",
    },
  ] : [
    {
      icon: Users,
      title: "Équipe & Transparence",
      description: "Nous vérifions si l'équipe est publiquement connue et vérifiée. Les équipes anonymes sans historique augmentent considérablement le risque.",
    },
    {
      icon: Code,
      title: "Audit des Smart Contracts",
      description: "Nous vérifions si le code du projet a été audité par des entreprises de sécurité réputées. Les projets non audités présentent un risque plus élevé.",
    },
    {
      icon: Activity,
      title: "Activité du Marché & Liquidité",
      description: "Nous analysons le volume de trading, la profondeur de liquidité et la capitalisation. La faible liquidité et les schémas suspects sont des signaux d'alerte.",
    },
    {
      icon: Eye,
      title: "Communauté & Historique",
      description: "Nous évaluons l'historique du projet, l'engagement de la communauté et s'il a tenu ses promesses au fil du temps.",
    },
  ];

  const statuses = language === "en" ? [
    { label: "Safe", color: "text-success bg-success/10 border-success/20", desc: "Established project with verified team, audited code, strong liquidity, and proven track record." },
    { label: "Risky", color: "text-warning bg-warning/10 border-warning/20", desc: "Project shows some concerns — partial transparency, limited audits, or volatile market activity." },
    { label: "Scam", color: "text-danger bg-danger/10 border-danger/20", desc: "Strong indicators of fraudulent activity — anonymous team, no audit, fake promises, or rug pull history." },
  ] : [
    { label: "Sûr", color: "text-success bg-success/10 border-success/20", desc: "Projet établi avec équipe vérifiée, code audité, forte liquidité et historique prouvé." },
    { label: "Risqué", color: "text-warning bg-warning/10 border-warning/20", desc: "Le projet présente des préoccupations — transparence partielle, audits limités ou activité volatile." },
    { label: "Arnaque", color: "text-danger bg-danger/10 border-danger/20", desc: "Indicateurs forts de fraude — équipe anonyme, pas d'audit, fausses promesses ou historique de rug pull." },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {language === "en" ? "Back" : "Retour"}
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-warning/15 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-warning" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {language === "en" ? "Safety Assessment" : "Évaluation de Sécurité"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "How we evaluate project safety" : "Comment nous évaluons la sécurité"}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {language === "en"
            ? "Our safety assessment evaluates the trustworthiness and risk level of crypto projects. We analyze multiple factors to help you make informed decisions. Always do your own research (DYOR) before investing."
            : "Notre évaluation de sécurité évalue la fiabilité et le niveau de risque des projets crypto. Nous analysons plusieurs facteurs pour vous aider à prendre des décisions éclairées. Faites toujours vos propres recherches (DYOR) avant d'investir."}
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
