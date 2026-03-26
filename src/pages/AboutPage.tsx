import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Sparkles, BookOpen, Brain, Star, Shield, AlertTriangle, Gift, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const en = language === "en";

  const sections = [
    {
      icon: Sparkles,
      title: en ? "Our Vision" : "Notre Vision",
      content: en
        ? "Cryptopedia was born from a simple idea: crypto should be accessible to everyone. We believe that understanding digital currencies shouldn't require a finance degree. Our mission is to make crypto education simple, fun, and safe for beginners worldwide."
        : "Cryptopedia est né d'une idée simple : la crypto devrait être accessible à tous. Nous croyons que comprendre les monnaies numériques ne devrait pas nécessiter un diplôme en finance. Notre mission est de rendre l'éducation crypto simple, amusante et sûre pour les débutants du monde entier.",
    },
    {
      icon: BookOpen,
      title: en ? "How EXP Works" : "Comment fonctionnent les EXP",
      content: en
        ? "You earn EXP (experience points) by learning! Here's how:\n\n• Read a lesson: 20-30 EXP\n• Read a project page: 15 EXP\n• Complete a quiz: 10-50 EXP (based on score)\n• Read a dictionary term: 5 EXP\n• Complete daily quests: 5-25 EXP each\n• 5-day quest streak bonus: 50 EXP\n\nEvery 200 EXP, you level up! Higher levels unlock new badges."
        : "Vous gagnez des EXP (points d'expérience) en apprenant ! Voici comment :\n\n• Lire une leçon : 20-30 EXP\n• Lire une page projet : 15 EXP\n• Compléter un quiz : 10-50 EXP (selon le score)\n• Lire un terme du dictionnaire : 5 EXP\n• Quêtes quotidiennes : 5-25 EXP chacune\n• Bonus série de 5 jours : 50 EXP\n\nTous les 200 EXP, vous montez de niveau ! Les niveaux supérieurs débloquent de nouveaux badges.",
    },
    {
      icon: Coins,
      title: en ? "Points & Shop" : "Points & Boutique",
      content: en
        ? "In addition to EXP, you earn Points from the same activities. Points can be spent in the Shop on various perks and advantages. Points are earned at roughly half the rate of EXP.\n\nThe Shop offers items like unlimited profile customization and more features coming soon!"
        : "En plus des EXP, vous gagnez des Points avec les mêmes activités. Les Points peuvent être dépensés dans la Boutique pour divers avantages. Les Points sont gagnés à environ la moitié du taux des EXP.\n\nLa Boutique propose des articles comme la personnalisation illimitée du profil et d'autres fonctionnalités à venir !",
    },
    {
      icon: Brain,
      title: en ? "Quiz Rules" : "Règles des Quiz",
      content: en
        ? "• You can earn EXP from 2 quizzes per day (5 random questions each)\n• Practice quizzes (10 questions) are unlimited but give no EXP\n• Questions are randomly selected and shuffled each time\n• Quiz difficulty adapts to your reading level\n• Questions are based on content available in the app"
        : "• Vous pouvez gagner des EXP de 2 quiz par jour (5 questions aléatoires)\n• Les quiz d'entraînement (10 questions) sont illimités mais ne donnent pas d'EXP\n• Les questions sont sélectionnées aléatoirement et mélangées à chaque fois\n• La difficulté s'adapte à votre niveau de lecture\n• Les questions sont basées sur le contenu de l'application",
    },
    {
      icon: Star,
      title: en ? "Badges & Levels" : "Badges & Niveaux",
      content: en
        ? "Every 10 levels, you unlock a new tier badge:\n\n🌱 Beginner (Lv. 1-10)\n📖 Apprentice (Lv. 11-20)\n⚡ Intermediate (Lv. 21-30)\n🔥 Advanced (Lv. 31-40)\n💎 Expert (Lv. 41-50)\n👑 Master (Lv. 51-60)\n🏆 Legend (Lv. 61+)\n\nBadges are displayed on your profile for everyone to see!"
        : "Tous les 10 niveaux, vous débloquez un nouveau badge :\n\n🌱 Débutant (Nv. 1-10)\n📖 Apprenti (Nv. 11-20)\n⚡ Intermédiaire (Nv. 21-30)\n🔥 Avancé (Nv. 31-40)\n💎 Expert (Nv. 41-50)\n👑 Maître (Nv. 51-60)\n🏆 Légende (Nv. 61+)\n\nLes badges sont affichés sur votre profil !",
    },
  ];

  const disclaimers = [
    {
      icon: Shield,
      title: en ? "Halal Status Disclaimer" : "Avertissement Statut Halal",
      content: en
        ? "The Halal status provided on Cryptopedia is based on our internal analysis and research of Islamic finance principles. This is NOT a fatwa or religious ruling. We are NOT qualified Islamic scholars. Users should consult qualified scholars and do their own research before making any financial decisions based on religious compliance."
        : "Le statut Halal fourni sur Cryptopedia est basé sur notre analyse interne et nos recherches sur les principes de la finance islamique. Ce n'est PAS une fatwa ou un jugement religieux. Nous ne sommes PAS des savants islamiques qualifiés. Les utilisateurs doivent consulter des savants qualifiés et faire leurs propres recherches.",
    },
    {
      icon: AlertTriangle,
      title: en ? "Safety Score Disclaimer" : "Avertissement Score de Sécurité",
      content: en
        ? "Safety scores and scam assessments are based on our analysis of publicly available information including team transparency, smart contract audits, liquidity, and market activity. These assessments may be incomplete or incorrect. We are NOT responsible for any financial losses. Always do your own research (DYOR) before investing."
        : "Les scores de sécurité et les évaluations de scam sont basés sur notre analyse d'informations publiques incluant la transparence de l'équipe, les audits de smart contracts, la liquidité et l'activité du marché. Ces évaluations peuvent être incomplètes ou incorrectes. Nous ne sommes PAS responsables des pertes financières. Faites toujours vos propres recherches (DYOR).",
    },
    {
      icon: Star,
      title: en ? "Score Disclaimer" : "Avertissement Score",
      content: en
        ? "The 0-10 score is Cryptopedia's subjective evaluation combining multiple factors. It is NOT financial advice. Scores can change as new information becomes available. Never invest solely based on our score. Cryptocurrency investments carry significant risk and you may lose your entire investment."
        : "Le score de 0 à 10 est l'évaluation subjective de Cryptopedia combinant plusieurs facteurs. Ce n'est PAS un conseil financier. Les scores peuvent changer à mesure que de nouvelles informations deviennent disponibles. N'investissez jamais uniquement sur la base de notre score. Les investissements en cryptomonnaies comportent des risques importants.",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-1">
        {en ? "About Cryptopedia" : "À propos de Cryptopedia"}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {en ? "Learn about our mission, rules, and how everything works." : "Découvrez notre mission, les règles et comment tout fonctionne."}
      </p>

      <div className="space-y-4 mb-8">
        {sections.map((s) => (
          <div key={s.title} className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-semibold text-foreground">{s.title}</h2>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{s.content}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-warning" />
        {en ? "Important Disclaimers" : "Avertissements Importants"}
      </h2>

      <div className="space-y-4">
        {disclaimers.map((d) => (
          <div key={d.title} className="bg-card rounded-2xl p-5 border border-warning/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <d.icon className="w-4 h-4 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{d.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{d.content}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
