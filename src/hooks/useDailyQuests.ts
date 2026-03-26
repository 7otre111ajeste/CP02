import { useState, useCallback, useEffect } from "react";

export interface DailyQuest {
  id: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  target: number;
  expReward: number;
  type: "login" | "quiz" | "lesson" | "term" | "calculator";
}

interface QuestProgress {
  date: string;
  progress: Record<string, number>;
  completed: string[];
  streak: number;
  lastStreakDate: string;
  streakBonusClaimed: boolean;
}

const DAILY_QUESTS: DailyQuest[] = [
  {
    id: "daily-login",
    title: { en: "Daily Check-in", fr: "Connexion quotidienne" },
    description: { en: "Open the app today", fr: "Ouvrir l'app aujourd'hui" },
    target: 1,
    expReward: 10,
    type: "login",
  },
  {
    id: "daily-quiz",
    title: { en: "Quiz Master", fr: "Maître du Quiz" },
    description: { en: "Complete 2 quizzes", fr: "Complétez 2 quiz" },
    target: 2,
    expReward: 20,
    type: "quiz",
  },
  {
    id: "daily-lesson",
    title: { en: "Knowledge Seeker", fr: "Chercheur de savoir" },
    description: { en: "Read 5 lessons or articles", fr: "Lire 5 leçons ou articles" },
    target: 5,
    expReward: 25,
    type: "lesson",
  },
  {
    id: "daily-term",
    title: { en: "Word Explorer", fr: "Explorateur de mots" },
    description: { en: "Read 3 dictionary terms", fr: "Lire 3 termes du dictionnaire" },
    target: 3,
    expReward: 15,
    type: "term",
  },
  {
    id: "daily-calculator",
    title: { en: "Number Cruncher", fr: "Calculateur" },
    description: { en: "Use the calculator once", fr: "Utiliser la calculatrice une fois" },
    target: 1,
    expReward: 5,
    type: "calculator",
  },
];

const STREAK_BONUS_EXP = 50;
const STREAK_REQUIRED = 5;

function getToday(): string {
  return new Date().toDateString();
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toDateString();
}

function loadQuestProgress(): QuestProgress {
  try {
    const saved = JSON.parse(localStorage.getItem("cryptopedia-quests") || "{}");
    const today = getToday();
    if (saved.date === today) return saved;
    // New day — calculate streak
    const yesterday = getYesterday();
    const wasAllComplete = DAILY_QUESTS.every((q) => saved.completed?.includes(q.id));
    let streak = 0;
    if (saved.lastStreakDate === yesterday && wasAllComplete) {
      streak = (saved.streak || 0) + 1;
    } else if (saved.lastStreakDate === today) {
      streak = saved.streak || 0;
    }
    return {
      date: today,
      progress: {},
      completed: [],
      streak,
      lastStreakDate: wasAllComplete ? today : saved.lastStreakDate || "",
      streakBonusClaimed: false,
    };
  } catch {
    return { date: getToday(), progress: {}, completed: [], streak: 0, lastStreakDate: "", streakBonusClaimed: false };
  }
}

function saveQuestProgress(p: QuestProgress) {
  localStorage.setItem("cryptopedia-quests", JSON.stringify(p));
}

export function useDailyQuests() {
  const [questProgress, setQuestProgress] = useState<QuestProgress>(loadQuestProgress);

  // Auto-complete login quest on mount
  useEffect(() => {
    if (!questProgress.completed.includes("daily-login")) {
      incrementQuest("login");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    saveQuestProgress(questProgress);
  }, [questProgress]);

  const incrementQuest = useCallback((type: DailyQuest["type"], amount = 1) => {
    setQuestProgress((prev) => {
      const updated = { ...prev, progress: { ...prev.progress } };
      const newCompleted = [...prev.completed];
      let expToAdd = 0;

      DAILY_QUESTS.filter((q) => q.type === type).forEach((quest) => {
        if (newCompleted.includes(quest.id)) return;
        const current = (updated.progress[quest.id] || 0) + amount;
        updated.progress[quest.id] = current;
        if (current >= quest.target) {
          newCompleted.push(quest.id);
          expToAdd += quest.expReward;
        }
      });

      updated.completed = newCompleted;

      // Check if all quests completed for streak
      const allDone = DAILY_QUESTS.every((q) => newCompleted.includes(q.id));
      if (allDone && updated.lastStreakDate !== getToday()) {
        updated.lastStreakDate = getToday();
        updated.streak = (prev.streak || 0) + 1;
      }

      // Add EXP via localStorage directly (to avoid circular deps with useUserProgress)
      if (expToAdd > 0) {
        try {
          const p = JSON.parse(localStorage.getItem("cryptopedia-progress") || '{"exp":0,"level":1,"completedLessons":[],"completedQuizzes":[],"readTerms":[]}');
          p.exp += expToAdd;
          p.level = Math.floor(p.exp / 200) + 1;
          localStorage.setItem("cryptopedia-progress", JSON.stringify(p));
        } catch {}
      }

      return updated;
    });
  }, []);

  const claimStreakBonus = useCallback(() => {
    setQuestProgress((prev) => {
      if (prev.streakBonusClaimed || prev.streak < STREAK_REQUIRED) return prev;
      try {
        const p = JSON.parse(localStorage.getItem("cryptopedia-progress") || '{"exp":0,"level":1,"completedLessons":[],"completedQuizzes":[],"readTerms":[]}');
        p.exp += STREAK_BONUS_EXP;
        p.level = Math.floor(p.exp / 200) + 1;
        localStorage.setItem("cryptopedia-progress", JSON.stringify(p));
      } catch {}
      return { ...prev, streakBonusClaimed: true, streak: 0 };
    });
  }, []);

  const allCompleted = DAILY_QUESTS.every((q) => questProgress.completed.includes(q.id));
  const canClaimStreak = questProgress.streak >= STREAK_REQUIRED && !questProgress.streakBonusClaimed;

  return {
    quests: DAILY_QUESTS,
    progress: questProgress.progress,
    completed: questProgress.completed,
    streak: questProgress.streak,
    allCompleted,
    canClaimStreak,
    streakRequired: STREAK_REQUIRED,
    streakBonusExp: STREAK_BONUS_EXP,
    incrementQuest,
    claimStreakBonus,
  };
}
