import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

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
    description: { en: "Complete 2 quizzes (EXP or Practice)", fr: "Complétez 2 quiz (EXP ou Entraînement)" },
    target: 2,
    expReward: 20,
    type: "quiz",
  },
  {
    id: "daily-lesson",
    title: { en: "Knowledge Seeker", fr: "Chercheur de savoir" },
    description: { en: "Complete 5 lessons or read project pages", fr: "Complétez 5 leçons ou lisez des pages projets" },
    target: 5,
    expReward: 25,
    type: "lesson",
  },
  {
    id: "daily-term",
    title: { en: "Word Explorer", fr: "Explorateur de mots" },
    description: { en: "Read 3 dictionary terms to learn new words", fr: "Lisez 3 termes du dictionnaire pour apprendre" },
    target: 3,
    expReward: 15,
    type: "term",
  },
  {
    id: "daily-calculator",
    title: { en: "Number Cruncher", fr: "Calculateur" },
    description: { en: "Use the calculator at least once", fr: "Utilisez la calculatrice au moins une fois" },
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

function awardExp(expToAdd: number) {
  if (expToAdd <= 0) return;

  try {
    const progress = JSON.parse(
      localStorage.getItem("cryptopedia-progress") ||
        '{"exp":0,"level":1,"completedLessons":[],"completedQuizzes":[],"readTerms":[]}'
    );
    progress.exp += expToAdd;
    progress.level = Math.floor(progress.exp / 200) + 1;
    localStorage.setItem("cryptopedia-progress", JSON.stringify(progress));
  } catch {}
}

function loadQuestProgress(): QuestProgress {
  try {
    const saved = JSON.parse(localStorage.getItem("cryptopedia-quests") || "{}");
    const today = getToday();

    if (saved.date === today) {
      return {
        date: today,
        progress: saved.progress || {},
        completed: saved.completed || [],
        streak: saved.streak || 0,
        lastStreakDate: saved.lastStreakDate || "",
        streakBonusClaimed: Boolean(saved.streakBonusClaimed),
      };
    }

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
    return {
      date: getToday(),
      progress: {},
      completed: [],
      streak: 0,
      lastStreakDate: "",
      streakBonusClaimed: false,
    };
  }
}

function saveQuestProgress(progress: QuestProgress) {
  localStorage.setItem("cryptopedia-quests", JSON.stringify(progress));
}

interface DailyQuestsContextType {
  quests: DailyQuest[];
  progress: Record<string, number>;
  completed: string[];
  streak: number;
  allCompleted: boolean;
  canClaimStreak: boolean;
  streakRequired: number;
  streakBonusExp: number;
  incrementQuest: (type: DailyQuest["type"], amount?: number) => void;
  claimStreakBonus: () => void;
}

function buildFallbackContext(): DailyQuestsContextType {
  const questProgress = loadQuestProgress();

  return {
    quests: DAILY_QUESTS,
    progress: questProgress.progress,
    completed: questProgress.completed,
    streak: questProgress.streak,
    allCompleted: DAILY_QUESTS.every((q) => questProgress.completed.includes(q.id)),
    canClaimStreak: questProgress.streak >= STREAK_REQUIRED && !questProgress.streakBonusClaimed,
    streakRequired: STREAK_REQUIRED,
    streakBonusExp: STREAK_BONUS_EXP,
    incrementQuest: (type, amount = 1) => {
      const current = loadQuestProgress();
      const updated = { ...current, progress: { ...current.progress } };
      const newCompleted = [...current.completed];
      let expToAdd = 0;

      DAILY_QUESTS.filter((q) => q.type === type).forEach((quest) => {
        if (newCompleted.includes(quest.id)) return;
        const nextValue = (updated.progress[quest.id] || 0) + amount;
        updated.progress[quest.id] = nextValue;

        if (nextValue >= quest.target) {
          newCompleted.push(quest.id);
          expToAdd += quest.expReward;
        }
      });

      updated.completed = newCompleted;
      saveQuestProgress(updated);
      awardExp(expToAdd);
    },
    claimStreakBonus: () => {
      const current = loadQuestProgress();
      if (current.streakBonusClaimed || current.streak < STREAK_REQUIRED) return;
      awardExp(STREAK_BONUS_EXP);
      saveQuestProgress({ ...current, streakBonusClaimed: true, streak: 0 });
    },
  };
}

const DailyQuestsContext = createContext<DailyQuestsContextType>(buildFallbackContext());

export function DailyQuestsProvider({ children }: { children: ReactNode }) {
  const [questProgress, setQuestProgress] = useState<QuestProgress>(loadQuestProgress);

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

      const allDone = DAILY_QUESTS.every((q) => newCompleted.includes(q.id));
      if (allDone && updated.lastStreakDate !== getToday()) {
        updated.lastStreakDate = getToday();
        updated.streak = (prev.streak || 0) + 1;
      }

      awardExp(expToAdd);
      return updated;
    });
  }, []);

  const claimStreakBonus = useCallback(() => {
    setQuestProgress((prev) => {
      if (prev.streakBonusClaimed || prev.streak < STREAK_REQUIRED) return prev;
      awardExp(STREAK_BONUS_EXP);
      return { ...prev, streakBonusClaimed: true, streak: 0 };
    });
  }, []);

  useEffect(() => {
    if (!questProgress.completed.includes("daily-login")) {
      incrementQuest("login");
    }
  }, [incrementQuest, questProgress.completed]);

  useEffect(() => {
    saveQuestProgress(questProgress);
  }, [questProgress]);

  const value: DailyQuestsContextType = {
    quests: DAILY_QUESTS,
    progress: questProgress.progress,
    completed: questProgress.completed,
    streak: questProgress.streak,
    allCompleted: DAILY_QUESTS.every((q) => questProgress.completed.includes(q.id)),
    canClaimStreak: questProgress.streak >= STREAK_REQUIRED && !questProgress.streakBonusClaimed,
    streakRequired: STREAK_REQUIRED,
    streakBonusExp: STREAK_BONUS_EXP,
    incrementQuest,
    claimStreakBonus,
  };

  return <DailyQuestsContext.Provider value={value}>{children}</DailyQuestsContext.Provider>;
}

export function useDailyQuests() {
  return useContext(DailyQuestsContext);
}
