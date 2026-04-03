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
  likes_count: number;
  is_public: boolean;
  // Duel stats
  duel_wins: number;
  duel_losses: number;
  duel_ratio: number;
  duel_points: number;
  avg_speed: number; // seconds per correct answer
  accuracy: number; // % correct answers
}

export interface ClanLeaderboardEntry {
  id: string;
  name: string;
  emoji: string;
  leader_id: string;
  leader_name: string;
  member_count: number;
  max_members: number;
  treasury_points: number;
  total_wins: number;
  total_losses: number;
  clan_ratio: number;
  avg_member_accuracy: number;
  avg_member_speed: number;
}

type PlayerSortKey = "exp" | "badges_count" | "completed_quizzes" | "likes_count" | "duel_wins" | "duel_ratio" | "avg_speed" | "accuracy";
type ClanSortKey = "treasury_points" | "total_wins" | "clan_ratio" | "avg_member_accuracy" | "avg_member_speed";

export function useLeaderboard(sortBy: PlayerSortKey = "exp") {
  return useQuery({
    queryKey: ["leaderboard", sortBy],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      // Fetch progress
      const { data: progressData, error: pErr } = await supabase
        .from("user_progress")
        .select("user_id, exp, level, completed_lessons, completed_quizzes, quizzes_passed, badges_count, likes_count")
        .order(sortBy === "exp" || sortBy === "badges_count" || sortBy === "completed_quizzes" || sortBy === "likes_count" ? sortBy : "exp", { ascending: false })
        .limit(100);

      if (pErr || !progressData) return [];

      const userIds = progressData.map((p) => p.user_id);

      // Fetch profiles, settings, and duels in parallel
      const [profilesRes, settingsRes, duelsRes] = await Promise.all([
        supabase.from("profiles").select("user_id, username, avatar_emoji").in("user_id", userIds),
        supabase.from("profile_settings").select("user_id, is_public").in("user_id", userIds),
        supabase.from("duels").select("challenger_id, opponent_id, winner_id, challenger_score, opponent_score, status, challenger_answers, opponent_answers, questions").eq("status", "completed"),
      ]);

      const profileMap = new Map((profilesRes.data || []).map((p) => [p.user_id, p]));
      const settingsMap = new Map((settingsRes.data || []).map((s) => [s.user_id, s]));

      // Compute duel stats per user
      const duelStatsMap = new Map<string, { wins: number; losses: number; points: number; totalCorrect: number; totalQuestions: number; totalTimeSec: number; correctWithTime: number }>();
      
      for (const d of duelsRes.data || []) {
        for (const role of ["challenger", "opponent"] as const) {
          const uid = role === "challenger" ? d.challenger_id : d.opponent_id;
          if (!uid || !userIds.includes(uid)) continue;
          
          if (!duelStatsMap.has(uid)) {
            duelStatsMap.set(uid, { wins: 0, losses: 0, points: 0, totalCorrect: 0, totalQuestions: 0, totalTimeSec: 0, correctWithTime: 0 });
          }
          const s = duelStatsMap.get(uid)!;
          
          const score = role === "challenger" ? d.challenger_score : d.opponent_score;
          const isWinner = d.winner_id === uid;
          if (isWinner) { s.wins++; s.points += 50; } else { s.losses++; }
          s.points += 20; // participation

          // Parse answers for accuracy & speed
          const answers = role === "challenger" ? d.challenger_answers : d.opponent_answers;
          const questions = d.questions as any[];
          if (Array.isArray(answers) && Array.isArray(questions)) {
            s.totalQuestions += questions.length;
            for (const ans of answers as any[]) {
              if (ans && typeof ans === "object") {
                if (ans.correct) {
                  s.totalCorrect++;
                  if (typeof ans.time === "number") {
                    s.totalTimeSec += ans.time;
                    s.correctWithTime++;
                  }
                }
              }
            }
          } else {
            // Fallback: use score
            s.totalQuestions += 10;
            s.totalCorrect += score;
          }
        }
      }

      const entries: LeaderboardEntry[] = progressData.map((p) => {
        const prof = profileMap.get(p.user_id);
        const sett = settingsMap.get(p.user_id);
        const ds = duelStatsMap.get(p.user_id);
        const wins = ds?.wins || 0;
        const losses = ds?.losses || 0;
        const total = wins + losses;
        return {
          ...p,
          username: prof?.username || "User",
          avatar_emoji: prof?.avatar_emoji || "👤",
          is_public: sett?.is_public ?? false,
          duel_wins: wins,
          duel_losses: losses,
          duel_ratio: total > 0 ? Math.round((wins / total) * 100) : 0,
          duel_points: ds?.points || 0,
          avg_speed: ds && ds.correctWithTime > 0 ? Math.round((ds.totalTimeSec / ds.correctWithTime) * 10) / 10 : 0,
          accuracy: ds && ds.totalQuestions > 0 ? Math.round((ds.totalCorrect / ds.totalQuestions) * 100) : 0,
        };
      });

      // Sort by the requested key
      if (["duel_wins", "duel_ratio", "accuracy", "duel_points"].includes(sortBy)) {
        entries.sort((a, b) => (b[sortBy as keyof LeaderboardEntry] as number) - (a[sortBy as keyof LeaderboardEntry] as number));
      } else if (sortBy === "avg_speed") {
        // Lower speed is better, but 0 means no data → push to end
        entries.sort((a, b) => {
          if (a.avg_speed === 0 && b.avg_speed === 0) return 0;
          if (a.avg_speed === 0) return 1;
          if (b.avg_speed === 0) return -1;
          return a.avg_speed - b.avg_speed;
        });
      }

      return entries;
    },
    refetchInterval: 60000,
  });
}

export function useClanLeaderboard(sortBy: ClanSortKey = "treasury_points") {
  return useQuery({
    queryKey: ["clan-leaderboard", sortBy],
    queryFn: async (): Promise<ClanLeaderboardEntry[]> => {
      const [clansRes, membersRes, profilesRes, duelsRes] = await Promise.all([
        supabase.from("clans").select("*"),
        supabase.from("clan_members").select("clan_id, user_id, points_contributed"),
        supabase.from("profiles").select("user_id, username"),
        supabase.from("duels").select("challenger_id, opponent_id, winner_id, challenger_score, opponent_score, challenger_answers, opponent_answers, questions, status").eq("status", "completed"),
      ]);

      const clans = clansRes.data || [];
      const members = membersRes.data || [];
      const profiles = profilesRes.data || [];
      const duels = duelsRes.data || [];

      const profileMap = new Map(profiles.map(p => [p.user_id, p.username]));

      // Group members by clan
      const clanMembersMap = new Map<string, string[]>();
      for (const m of members) {
        if (!clanMembersMap.has(m.clan_id)) clanMembersMap.set(m.clan_id, []);
        clanMembersMap.get(m.clan_id)!.push(m.user_id);
      }

      // Compute per-user duel stats
      const userStats = new Map<string, { wins: number; losses: number; correct: number; total: number; timeSec: number; correctWithTime: number }>();
      for (const d of duels) {
        for (const role of ["challenger", "opponent"] as const) {
          const uid = role === "challenger" ? d.challenger_id : d.opponent_id;
          if (!uid) continue;
          if (!userStats.has(uid)) userStats.set(uid, { wins: 0, losses: 0, correct: 0, total: 0, timeSec: 0, correctWithTime: 0 });
          const s = userStats.get(uid)!;
          if (d.winner_id === uid) s.wins++; else s.losses++;

          const answers = role === "challenger" ? d.challenger_answers : d.opponent_answers;
          const questions = d.questions as any[];
          if (Array.isArray(answers) && Array.isArray(questions)) {
            s.total += questions.length;
            for (const ans of answers as any[]) {
              if (ans?.correct) {
                s.correct++;
                if (typeof ans.time === "number") { s.timeSec += ans.time; s.correctWithTime++; }
              }
            }
          } else {
            s.total += 10;
            s.correct += (role === "challenger" ? d.challenger_score : d.opponent_score);
          }
        }
      }

      const entries: ClanLeaderboardEntry[] = clans.map(clan => {
        const memberIds = clanMembersMap.get(clan.id) || [];
        let totalWins = 0, totalLosses = 0, totalCorrect = 0, totalTotal = 0, totalTime = 0, totalCorrectWithTime = 0;

        for (const uid of memberIds) {
          const s = userStats.get(uid);
          if (s) {
            totalWins += s.wins;
            totalLosses += s.losses;
            totalCorrect += s.correct;
            totalTotal += s.total;
            totalTime += s.timeSec;
            totalCorrectWithTime += s.correctWithTime;
          }
        }

        const totalDuels = totalWins + totalLosses;
        return {
          id: clan.id,
          name: clan.name,
          emoji: clan.emoji,
          leader_id: clan.leader_id,
          leader_name: profileMap.get(clan.leader_id) || "Leader",
          member_count: memberIds.length,
          max_members: clan.max_members,
          treasury_points: clan.treasury_points,
          total_wins: totalWins,
          total_losses: totalLosses,
          clan_ratio: totalDuels > 0 ? Math.round((totalWins / totalDuels) * 100) : 0,
          avg_member_accuracy: totalTotal > 0 ? Math.round((totalCorrect / totalTotal) * 100) : 0,
          avg_member_speed: totalCorrectWithTime > 0 ? Math.round((totalTime / totalCorrectWithTime) * 10) / 10 : 0,
        };
      });

      if (sortBy === "avg_member_speed") {
        entries.sort((a, b) => {
          if (a.avg_member_speed === 0 && b.avg_member_speed === 0) return 0;
          if (a.avg_member_speed === 0) return 1;
          if (b.avg_member_speed === 0) return -1;
          return a.avg_member_speed - b.avg_member_speed;
        });
      } else {
        entries.sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
      }

      return entries;
    },
    refetchInterval: 60000,
  });
}
