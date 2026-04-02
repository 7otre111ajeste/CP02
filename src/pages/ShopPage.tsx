import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { ArrowLeft, Coins, ShoppingBag, Check, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ShopItem {
  id: string;
  name: { en: string; fr: string };
  description: { en: string; fr: string };
  cost: number;
  emoji: string;
  oneTime: boolean;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "unlimited-profile",
    name: { en: "Unlimited Profile Changes", fr: "Changements de Profil Illimités" },
    description: {
      en: "Change your username and avatar as many times as you want, forever!",
      fr: "Changez votre pseudo et avatar autant de fois que vous voulez, pour toujours !",
    },
    cost: 500,
    emoji: "✏️",
    oneTime: true,
  },
  {
    id: "bonus-exp-boost",
    name: { en: "EXP Boost Token", fr: "Jeton Boost EXP" },
    description: {
      en: "Get a one-time bonus of +100 EXP instantly!",
      fr: "Obtenez un bonus unique de +100 EXP instantanément !",
    },
    cost: 200,
    emoji: "⚡",
    oneTime: false,
  },
  {
    id: "mystery-badge",
    name: { en: "Mystery Badge", fr: "Badge Mystère" },
    description: {
      en: "A special badge that shows your dedication. Coming soon!",
      fr: "Un badge spécial qui montre votre dévouement. Bientôt disponible !",
    },
    cost: 1000,
    emoji: "🎭",
    oneTime: true,
  },
  {
    id: "extra-quiz",
    name: { en: "Extra Quiz Pass", fr: "Pass Quiz Supplémentaire" },
    description: {
      en: "Get one extra EXP quiz for today! Coming soon.",
      fr: "Obtenez un quiz EXP supplémentaire pour aujourd'hui ! Bientôt disponible.",
    },
    cost: 150,
    emoji: "🎫",
    oneTime: false,
  },
  {
    id: "extra-challenges",
    name: { en: "Extra Duel Challenges", fr: "Défis de Duel Supplémentaires" },
    description: {
      en: "Get 2 extra duel challenges per day, permanently!",
      fr: "Obtenez 2 défis de duel supplémentaires par jour, pour toujours !",
    },
    cost: 300,
    emoji: "⚔️",
    oneTime: true,
  },
  {
    id: "create-clan",
    name: { en: "Create a Clan", fr: "Créer un Clan" },
    description: {
      en: "Start your own clan with 5 member slots. Recruit allies!",
      fr: "Créez votre propre clan avec 5 places. Recrutez des alliés !",
    },
    cost: 200,
    emoji: "⚔️",
    oneTime: true,
  },
];

export default function ShopPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { points, shopPurchases, purchaseShopItem, addExp } = useUserProgress();
  const en = language === "en";

  const handlePurchase = (item: ShopItem) => {
    if (item.oneTime && shopPurchases.includes(item.id)) {
      toast.error(en ? "Already purchased!" : "Déjà acheté !");
      return;
    }
    if (points < item.cost) {
      toast.error(en ? "Not enough points!" : "Pas assez de points !");
      return;
    }
    const success = purchaseShopItem(item.id, item.cost);
    if (success) {
      if (item.id === "bonus-exp-boost") {
        addExp(100);
      }
      toast.success(en ? `${item.name.en} purchased!` : `${item.name.fr} acheté !`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            {en ? "Shop" : "Boutique"}
          </h1>
          <p className="text-sm text-muted-foreground">{en ? "Spend your points on perks" : "Dépensez vos points en avantages"}</p>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center gap-2">
          <Coins className="w-4 h-4 text-warning" />
          <span className="font-bold text-foreground">{points}</span>
          <span className="text-xs text-muted-foreground">pts</span>
        </div>
      </div>

      <div className="space-y-3">
        {SHOP_ITEMS.map((item) => {
          const owned = item.oneTime && shopPurchases.includes(item.id);
          const canAfford = points >= item.cost;

          return (
            <div key={item.id} className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{item.name[language]}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description[language]}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Coins className="w-3.5 h-3.5 text-warning" />
                      <span className="font-bold text-foreground">{item.cost}</span>
                      <span className="text-xs text-muted-foreground">pts</span>
                    </div>
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={owned || !canAfford}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        owned
                          ? "bg-success/10 text-success border border-success/20"
                          : canAfford
                          ? "bg-gradient-primary text-primary-foreground hover:opacity-90"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {owned ? (
                        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> {en ? "Owned" : "Possédé"}</span>
                      ) : canAfford ? (
                        en ? "Buy" : "Acheter"
                      ) : (
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> {item.cost} pts</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
