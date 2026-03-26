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
  registrationDate: string;
  claimedTimeBadges: string[];
}

const EXP_PER_LEVEL = 200;
const PROJECT_READ_EXP = 15;
const PROJECT_READ_POINTS = 10;

export const TIME_BADGES = [
  { id: "1w", days: 7, label: { en: "1 Week", fr: "1 Semaine" }, emoji: "🌱", exp: 50, points: 25 },
  { id: "1m", days: 30, label: { en: "1 Month", fr: "1 Mois" }, emoji: "🌿", exp: 100, points: 50 },
  { id: "3m", days: 90, label: { en: "3 Months", fr: "3 Mois" }, emoji: "🌳", exp: 200, points: 100 },
  { id: "6m", days: 180, label: { en: "6 Months", fr: "6 Mois" }, emoji: "⭐", exp: 300, points: 150 },
  { id: "1y", days: 365, label: { en: "1 Year", fr: "1 An" }, emoji: "🏅", exp: 500, points: 250 },
  { id: "2y", days: 730, label: { en: "2 Years", fr: "2 Ans" }, emoji: "🏆", exp: 750, points: 400 },
  { id: "3y", days: 1095, label: { en: "3 Years", fr: "3 Ans" }, emoji: "💎", exp: 1000, points: 500 },
  { id: "4y", days: 1460, label: { en: "4 Years", fr: "4 Ans" }, emoji: "👑", exp: 1250, points: 600 },
  { id: "5y", days: 1825, label: { en: "5 Years", fr: "5 Ans" }, emoji: "🐐", exp: 1500, points: 750 },
];

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
        registrationDate: parsed.registrationDate || new Date().toISOString(),
        claimedTimeBadges: parsed.claimedTimeBadges || [],
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
    registrationDate: new Date().toISOString(),
    claimedTimeBadges: [],
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
    let result: { success: boolean; reason?: string } = { success: false, reason: "" };
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

  const claimTimeBadge = useCallback((badgeId: string): boolean => {
    const badge = TIME_BADGES.find((b) => b.id === badgeId);
    if (!badge) return false;
    let success = false;
    setProgress((prev) => {
      if (prev.claimedTimeBadges.includes(badgeId)) return prev;
      const daysSinceReg = (Date.now() - new Date(prev.registrationDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceReg < badge.days) return prev;
      success = true;
      const newExp = prev.exp + badge.exp;
      return {
        ...prev,
        exp: newExp,
        level: calcLevel(newExp),
        points: prev.points + badge.points,
        claimedTimeBadges: [...prev.claimedTimeBadges, badgeId],
      };
    });
    return success;
  }, []);

  const daysSinceRegistration = Math.floor(
    (Date.now() - new Date(progress.registrationDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const expInCurrentLevel = progress.exp % EXP_PER_LEVEL;
  const expPercent = (expInCurrentLevel / EXP_PER_LEVEL) * 100;

  return {
    ...progress,
    expInCurrentLevel,
    expToNextLevel: EXP_PER_LEVEL,
    expPercent,
    daysSinceRegistration,
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
    claimTimeBadge,
    isLessonCompleted: (id: string) => progress.completedLessons.includes(id),
    isTermRead: (id: string) => progress.readTerms.includes(id),
    isProjectRead: (id: string) => progress.readProjects.includes(id),
    canChangeUsernameFree: canChangeFree(progress.lastUsernameChange) || progress.usernameChangesThisPeriod < 2,
    canChangeAvatarFree: canChangeFree(progress.lastAvatarChange) || progress.avatarChangesThisPeriod < 2,
  };
}
