import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";

/**
 * Syncs local user progress to the database for leaderboard.
 * Runs on mount and whenever progress changes.
 */
export function useProgressSync() {
  const { user } = useAuth();
  const {
    exp, level, points,
    completedLessons, completedQuizzes, readTerms, readProjects,
    claimedTimeBadges,
  } = useUserProgress();

  const lastSync = useRef("");

  useEffect(() => {
    if (!user) return;

    const key = `${exp}-${completedLessons.length}-${completedQuizzes.length}-${readTerms.length}-${claimedTimeBadges.length}`;
    if (key === lastSync.current) return;
    lastSync.current = key;

    const sync = async () => {
      await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          exp,
          level,
          points,
          completed_lessons: completedLessons.length,
          completed_quizzes: completedQuizzes.length,
          quizzes_passed: completedQuizzes.length,
          badges_count: claimedTimeBadges.length,
          read_terms: readTerms.length,
          read_projects: readProjects.length,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
    };

    const timer = setTimeout(sync, 1000); // debounce
    return () => clearTimeout(timer);
  }, [user, exp, level, points, completedLessons, completedQuizzes, readTerms, readProjects, claimedTimeBadges]);
}
