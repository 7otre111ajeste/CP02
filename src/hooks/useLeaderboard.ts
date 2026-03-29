import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_emoji: string;
  exp: number;
  level: number;
  completed_lessons: number;
  completed_quizzes: number;
  quizzes_passed: number;
  badges_count: number;
  is_public: boolean;
}

type SortKey = "exp" | "badges_count" | "completed_quizzes";

export function useLeaderboard(sortBy: SortKey = "exp") {
  return useQuery({
    queryKey: ["leaderboard", sortBy],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      // Fetch progress
      const { data: progressData, error: pErr } = await supabase
        .from("user_progress")
        .select("user_id, exp, level, completed_lessons, completed_quizzes, quizzes_passed, badges_count")
        .order(sortBy, { ascending: false })
        .limit(100);

      if (pErr || !progressData) return [];

      const userIds = progressData.map((p) => p.user_id);

      // Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_emoji")
        .in("user_id", userIds);

      // Fetch settings
      const { data: settings } = await supabase
        .from("profile_settings")
        .select("user_id, is_public")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
      const settingsMap = new Map((settings || []).map((s) => [s.user_id, s]));

      return progressData.map((p) => {
        const prof = profileMap.get(p.user_id);
        const sett = settingsMap.get(p.user_id);
        return {
          ...p,
          username: prof?.username || "User",
          avatar_emoji: prof?.avatar_emoji || "👤",
          is_public: sett?.is_public ?? false,
        };
      });
    },
    refetchInterval: 60000, // refresh every minute
  });
}
