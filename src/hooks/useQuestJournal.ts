import { useState, useEffect, useCallback } from "react";

export interface PersistentQuest {
  id: string;
  category: "practice" | "likes" | "holding";
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  icon: string;
  target: number;
  expReward: number;
  pointsReward: number;
  badgeEmoji: string;
}

interface QuestJournalData {
  progress: Record<string, number>;
  completed: string[];
  claimed: string[];
}

export const PERSISTENT_QUESTS: PersistentQuest[] = [
  // Practice: profitable trades
  { id: "trades-profit-3", category: "practice", title: { en: "First Wins", fr: "Premières victoires" }, description: { en: "Close 3 trades with +10% profit", fr: "Clôturer 3 trades avec +10% de profit" }, icon: "📈", target: 3, expReward: 50, pointsReward: 25, badgeEmoji: "📈" },
  { id: "trades-profit-10", category: "practice", title: { en: "Steady Trader", fr: "Trader régulier" }, description: { en: "Close 10 trades with +10% profit", fr: "Clôturer 10 trades avec +10% de profit" }, icon: "💹", target: 10, expReward: 150, pointsReward: 75, badgeEmoji: "💹" },
  { id: "trades-profit-25", category: "practice", title: { en: "Pro Trader", fr: "Trader Pro" }, description: { en: "Close 25 trades with +10% profit", fr: "Clôturer 25 trades avec +10% de profit" }, icon: "🏆", target: 25, expReward: 400, pointsReward: 200, badgeEmoji: "🏆" },

  // Holding duration
  { id: "hold-1h", category: "holding", title: { en: "Patient Start", fr: "Début patient" }, description: { en: "Hold a position for 1 hour", fr: "Tenir une position pendant 1 heure" }, icon: "⏱️", target: 1, expReward: 20, pointsReward: 10, badgeEmoji: "⏱️" },
  { id: "hold-3h", category: "holding", title: { en: "Steady Hands", fr: "Mains stables" }, description: { en: "Hold a position for 3 hours", fr: "Tenir une position pendant 3 heures" }, icon: "⏳", target: 3, expReward: 40, pointsReward: 20, badgeEmoji: "⏳" },
  { id: "hold-12h", category: "holding", title: { en: "Half Day Holder", fr: "Demi-journée" }, description: { en: "Hold a position for 12 hours", fr: "Tenir une position pendant 12 heures" }, icon: "🕐", target: 12, expReward: 75, pointsReward: 40, badgeEmoji: "🕐" },
  { id: "hold-24h", category: "holding", title: { en: "Day Trader", fr: "Trader journalier" }, description: { en: "Hold a position for 24 hours", fr: "Tenir une position pendant 24 heures" }, icon: "📅", target: 24, expReward: 100, pointsReward: 50, badgeEmoji: "📅" },
  { id: "hold-72h", category: "holding", title: { en: "3 Day Diamond", fr: "Diamant 3 jours" }, description: { en: "Hold a position for 72 hours", fr: "Tenir une position pendant 72 heures" }, icon: "💎", target: 72, expReward: 200, pointsReward: 100, badgeEmoji: "💎" },
  { id: "hold-1w", category: "holding", title: { en: "Weekly Warrior", fr: "Guerrier hebdo" }, description: { en: "Hold a position for 1 week", fr: "Tenir une position pendant 1 semaine" }, icon: "🛡️", target: 168, expReward: 350, pointsReward: 175, badgeEmoji: "🛡️" },
  { id: "hold-1m", category: "holding", title: { en: "Monthly Master", fr: "Maître mensuel" }, description: { en: "Hold a position for 1 month", fr: "Tenir une position pendant 1 mois" }, icon: "👑", target: 720, expReward: 750, pointsReward: 400, badgeEmoji: "👑" },

  // Likes received
  { id: "likes-1", category: "likes", title: { en: "First Like", fr: "Premier like" }, description: { en: "Receive 1 like on your profile", fr: "Recevoir 1 like sur votre profil" }, icon: "❤️", target: 1, expReward: 10, pointsReward: 5, badgeEmoji: "❤️" },
  { id: "likes-5", category: "likes", title: { en: "Getting Noticed", fr: "Se faire remarquer" }, description: { en: "Receive 5 likes", fr: "Recevoir 5 likes" }, icon: "💕", target: 5, expReward: 30, pointsReward: 15, badgeEmoji: "💕" },
  { id: "likes-10", category: "likes", title: { en: "Popular", fr: "Populaire" }, description: { en: "Receive 10 likes", fr: "Recevoir 10 likes" }, icon: "🔥", target: 10, expReward: 75, pointsReward: 40, badgeEmoji: "🔥" },
  { id: "likes-25", category: "likes", title: { en: "Fan Favorite", fr: "Favori du public" }, description: { en: "Receive 25 likes", fr: "Recevoir 25 likes" }, icon: "⭐", target: 25, expReward: 150, pointsReward: 75, badgeEmoji: "⭐" },
  { id: "likes-50", category: "likes", title: { en: "Influencer", fr: "Influenceur" }, description: { en: "Receive 50 likes", fr: "Recevoir 50 likes" }, icon: "🌟", target: 50, expReward: 300, pointsReward: 150, badgeEmoji: "🌟" },
  { id: "likes-100", category: "likes", title: { en: "Legend", fr: "Légende" }, description: { en: "Receive 100 likes", fr: "Recevoir 100 likes" }, icon: "🐐", target: 100, expReward: 500, pointsReward: 250, badgeEmoji: "🐐" },
];

function loadJournal(): QuestJournalData {
  try {
    const saved = localStorage.getItem("cryptopedia-quest-journal");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { progress: {}, completed: [], claimed: [] };
}

function saveJournal(data: QuestJournalData) {
  localStorage.setItem("cryptopedia-quest-journal", JSON.stringify(data));
}

function awardRewards(exp: number, points: number) {
  try {
    const progress = JSON.parse(localStorage.getItem("cryptopedia-progress") || '{"exp":0,"level":1,"points":0}');
    progress.exp += exp;
    progress.points += points;
    progress.level = Math.floor(progress.exp / 200) + 1;
    localStorage.setItem("cryptopedia-progress", JSON.stringify(progress));
  } catch {}
}

export function useQuestJournal() {
  const [journal, setJournal] = useState<QuestJournalData>(loadJournal);

  useEffect(() => {
    saveJournal(journal);
  }, [journal]);

  const incrementQuest = useCallback((questId: string, amount = 1) => {
    setJournal((prev) => {
      if (prev.completed.includes(questId)) return prev;
      const current = (prev.progress[questId] || 0) + amount;
      const quest = PERSISTENT_QUESTS.find((q) => q.id === questId);
      const newCompleted = [...prev.completed];
      if (quest && current >= quest.target && !newCompleted.includes(questId)) {
        newCompleted.push(questId);
      }
      return { ...prev, progress: { ...prev.progress, [questId]: current }, completed: newCompleted };
    });
  }, []);

  const setQuestProgress = useCallback((questId: string, value: number) => {
    setJournal((prev) => {
      if (prev.completed.includes(questId)) return prev;
      const quest = PERSISTENT_QUESTS.find((q) => q.id === questId);
      const newCompleted = [...prev.completed];
      if (quest && value >= quest.target && !newCompleted.includes(questId)) {
        newCompleted.push(questId);
      }
      return { ...prev, progress: { ...prev.progress, [questId]: value }, completed: newCompleted };
    });
  }, []);

  const claimReward = useCallback((questId: string): boolean => {
    const quest = PERSISTENT_QUESTS.find((q) => q.id === questId);
    if (!quest) return false;
    let success = false;
    setJournal((prev) => {
      if (!prev.completed.includes(questId) || prev.claimed.includes(questId)) return prev;
      success = true;
      awardRewards(quest.expReward, quest.pointsReward);
      return { ...prev, claimed: [...prev.claimed, questId] };
    });
    return success;
  }, []);

  const getProgress = useCallback((questId: string) => journal.progress[questId] || 0, [journal.progress]);
  const isCompleted = useCallback((questId: string) => journal.completed.includes(questId), [journal.completed]);
  const isClaimed = useCallback((questId: string) => journal.claimed.includes(questId), [journal.claimed]);

  return {
    journal,
    quests: PERSISTENT_QUESTS,
    incrementQuest,
    setQuestProgress,
    claimReward,
    getProgress,
    isCompleted,
    isClaimed,
  };
}
