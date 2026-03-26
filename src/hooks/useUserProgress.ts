import { useState, useCallback, useEffect } from "react";

interface UserProgress {
  exp: number;
  level: number;
  completedLessons: string[];
  completedQuizzes: string[];
  readTerms: string[];
}

const EXP_PER_LEVEL = 200;

function getInitialProgress(): UserProgress {
  try {
    const saved = localStorage.getItem("cryptopedia-progress");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { exp: 0, level: 1, completedLessons: [], completedQuizzes: [], readTerms: [] };
}

function calcLevel(exp: number): number {
  return Math.floor(exp / EXP_PER_LEVEL) + 1;
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

  const completeLesson = useCallback((lessonId: string, expReward: number) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const newExp = prev.exp + expReward;
      return {
        ...prev,
        exp: newExp,
        level: calcLevel(newExp),
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  }, []);

  const completeQuiz = useCallback((quizId: string, expReward: number) => {
    setProgress((prev) => {
      const newExp = prev.exp + expReward;
      return {
        ...prev,
        exp: newExp,
        level: calcLevel(newExp),
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
        exp: newExp,
        level: calcLevel(newExp),
        readTerms: [...prev.readTerms, termId],
      };
    });
  }, []);

  const expInCurrentLevel = progress.exp % EXP_PER_LEVEL;
  const expPercent = (expInCurrentLevel / EXP_PER_LEVEL) * 100;

  return {
    ...progress,
    expInCurrentLevel,
    expToNextLevel: EXP_PER_LEVEL,
    expPercent,
    addExp,
    completeLesson,
    completeQuiz,
    readTerm,
    isLessonCompleted: (id: string) => progress.completedLessons.includes(id),
    isTermRead: (id: string) => progress.readTerms.includes(id),
  };
}
