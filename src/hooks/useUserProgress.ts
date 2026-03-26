import { useState, useCallback, useEffect } from "react";

interface UserProgress {
  exp: number;
  level: number;
  points: number;
  completedLessons: string[];
  completedQuizzes: string[];
  readTerms: string[];
  readProjects: string[];
  username: string;
  avatarEmoji: string;
  lastUsernameChange: string | null;
  lastAvatarChange: string | null;
  usernameChangesThisPeriod: number;
  avatarChangesThisPeriod: number;
  unlimitedProfileChanges: boolean;
  shopPurchases: string[];
}

const EXP_PER_LEVEL = 200;
const PROJECT_READ_EXP = 15;
const PROJECT_READ_POINTS = 10;

function getInitialProgress(): UserProgress {
  try {
    const saved = localStorage.getItem("cryptopedia-progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        exp: parsed.exp || 0,
        level: parsed.level || 1,
        points: parsed.points || 0,
        completedLessons: parsed.completedLessons || [],
        completedQuizzes: parsed.completedQuizzes || [],
        readTerms: parsed.readTerms || [],
        readProjects: parsed.readProjects || [],
        username: parsed.username || "Guest",
        avatarEmoji: parsed.avatarEmoji || "👤",
        lastUsernameChange: parsed.lastUsernameChange || null,
        lastAvatarChange: parsed.lastAvatarChange || null,
        usernameChangesThisPeriod: parsed.usernameChangesThisPeriod || 0,
        avatarChangesThisPeriod: parsed.avatarChangesThisPeriod || 0,
        unlimitedProfileChanges: parsed.unlimitedProfileChanges || false,
        shopPurchases: parsed.shopPurchases || [],
      };
    }
  } catch {}
  return {
    exp: 0, level: 1, points: 0,
    completedLessons: [], completedQuizzes: [], readTerms: [], readProjects: [],
    username: "Guest", avatarEmoji: "👤",
    lastUsernameChange: null, lastAvatarChange: null,
    usernameChangesThisPeriod: 0, avatarChangesThisPeriod: 0,
    unlimitedProfileChanges: false, shopPurchases: [],
  };
}

function calcLevel(exp: number): number {
  return Math.floor(exp / EXP_PER_LEVEL) + 1;
}

function canChangeFree(lastChange: string | null): boolean {
  if (!lastChange) return true;
  const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(lastChange).getTime() >= sixMonths;
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);

  useEffect(() => {
    localStorage.setItem("cryptopedia-progress", JSON.stringify(progress));
  }, [progress]);

  const addExp = useCallback((amount: number) => {
    setProgress((prev) => {
      const newExp = prev.exp + amount;
      return { ...prev, exp: newExp, level: calcLevel(newExp) };
    });
  }, []);

  const addPoints = useCallback((amount: number) => {
    setProgress((prev) => ({ ...prev, points: prev.points + amount }));
  }, []);

  const spendPoints = useCallback((amount: number): boolean => {
    let success = false;
    setProgress((prev) => {
      if (prev.points < amount) return prev;
      success = true;
      return { ...prev, points: prev.points - amount };
    });
    return success;
  }, []);

  const completeLesson = useCallback((lessonId: string, expReward: number) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const newExp = prev.exp + expReward;
      const pointsEarned = Math.round(expReward * 0.5);
      return {
        ...prev,
        exp: newExp, level: calcLevel(newExp),
        points: prev.points + pointsEarned,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  }, []);

  const completeQuiz = useCallback((quizId: string, expReward: number) => {
    setProgress((prev) => {
      const newExp = prev.exp + expReward;
      const pointsEarned = Math.round(expReward * 0.5);
      return {
        ...prev,
        exp: newExp, level: calcLevel(newExp),
        points: prev.points + pointsEarned,
        completedQuizzes: [...prev.completedQuizzes, quizId],
      };
    });
  }, []);

  const readTerm = useCallback((termId: string) => {
    setProgress((prev) => {
      if (prev.readTerms.includes(termId)) return prev;
      const newExp = prev.exp + 5;
      return {
        ...prev,
        exp: newExp, level: calcLevel(newExp),
        points: prev.points + 3,
        readTerms: [...prev.readTerms, termId],
      };
    });
  }, []);

  const readProject = useCallback((projectId: string) => {
    setProgress((prev) => {
      if (prev.readProjects.includes(projectId)) return prev;
      const newExp = prev.exp + PROJECT_READ_EXP;
      return {
        ...prev,
        exp: newExp, level: calcLevel(newExp),
        points: prev.points + PROJECT_READ_POINTS,
        readProjects: [...prev.readProjects, projectId],
      };
    });
  }, []);

  const setUsername = useCallback((name: string): { success: boolean; reason?: string } => {
    let result: { success: boolean; reason?: string } = { success: false, reason: "" };
    setProgress((prev) => {
      if (!prev.unlimitedProfileChanges && !canChangeFree(prev.lastUsernameChange) && prev.usernameChangesThisPeriod >= 2) {
        result = { success: false, reason: "limit" };
        return prev;
      }
      result = { success: true };
      return {
        ...prev,
        username: name,
        lastUsernameChange: new Date().toISOString(),
        usernameChangesThisPeriod: prev.usernameChangesThisPeriod + 1,
      };
    });
    return result;
  }, []);

  const setAvatarEmoji = useCallback((emoji: string): { success: boolean; reason?: string } => {
    let result = { success: false, reason: "" };
    setProgress((prev) => {
      if (!prev.unlimitedProfileChanges && !canChangeFree(prev.lastAvatarChange) && prev.avatarChangesThisPeriod >= 2) {
        result = { success: false, reason: "limit" };
        return prev;
      }
      result = { success: true };
      return {
        ...prev,
        avatarEmoji: emoji,
        lastAvatarChange: new Date().toISOString(),
        avatarChangesThisPeriod: prev.avatarChangesThisPeriod + 1,
      };
    });
    return result;
  }, []);

  const purchaseShopItem = useCallback((itemId: string, cost: number): boolean => {
    let success = false;
    setProgress((prev) => {
      if (prev.points < cost) return prev;
      success = true;
      const updates: Partial<UserProgress> = {
        points: prev.points - cost,
        shopPurchases: [...prev.shopPurchases, itemId],
      };
      if (itemId === "unlimited-profile") {
        updates.unlimitedProfileChanges = true;
      }
      return { ...prev, ...updates };
    });
    return success;
  }, []);

  const expInCurrentLevel = progress.exp % EXP_PER_LEVEL;
  const expPercent = (expInCurrentLevel / EXP_PER_LEVEL) * 100;

  return {
    ...progress,
    expInCurrentLevel,
    expToNextLevel: EXP_PER_LEVEL,
    expPercent,
    addExp,
    addPoints,
    spendPoints,
    completeLesson,
    completeQuiz,
    readTerm,
    readProject,
    setUsername,
    setAvatarEmoji,
    purchaseShopItem,
    isLessonCompleted: (id: string) => progress.completedLessons.includes(id),
    isTermRead: (id: string) => progress.readTerms.includes(id),
    isProjectRead: (id: string) => progress.readProjects.includes(id),
    canChangeUsernameFree: canChangeFree(progress.lastUsernameChange) || progress.usernameChangesThisPeriod < 2,
    canChangeAvatarFree: canChangeFree(progress.lastAvatarChange) || progress.avatarChangesThisPeriod < 2,
  };
}
