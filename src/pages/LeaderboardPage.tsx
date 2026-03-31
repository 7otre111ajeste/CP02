import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Trophy, Medal, Award, Crown, RefreshCw, Lock, Eye, EyeOff, Heart } from "lucide-react";
import { motion } from "framer-motion";

type Tab = "exp" | "badges_count" | "completed_quizzes" | "likes_count";

const TABS: { key: Tab; label: { en: string; fr: string }; icon: typeof Trophy }[] = [
  { key: "exp", label: { en: "Top XP", fr: "Top XP" }, icon: Trophy },
  { key: "likes_count", label: { en: "Top Likes", fr: "Top Likes" }, icon: Heart },
  { key: "badges_count", label: { en: "Badges", fr: "Badges" }, icon: Award },
  { key: "completed_quizzes", label: { en: "Quiz", fr: "Quiz" }, icon: Medal },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-warning" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-warning/60" />;
  return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">{rank}</span>;
}

function getRankBg(rank: number) {
  if (rank === 1) return "bg-warning/10 border-warning/30";
  if (rank === 2) return "bg-muted/50 border-border";
  if (rank === 3) return "bg-warning/5 border-warning/20";
  return "bg-card border-border";
}

export default function LeaderboardPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("exp");
  const { data: entries, isLoading, refetch } = useLeaderboard(tab);
  const en = language === "en";

  const getValueForTab = (entry: any) => {
    if (tab === "exp") return `${entry.exp} XP`;
    if (tab === "badges_count") return `${entry.badges_count} 🏅`;
    if (tab === "likes_count") return `${entry.likes_count} ❤️`;
    return `${entry.completed_quizzes} ✅`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-28 max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-warning" />
          {en ? "Leaderboard" : "Classement"}
        </h1>
        <button onClick={() => refetch()} className="p-2 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              tab === t.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label[language]}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : !entries?.length ? (
        <div className="text-center py-16">
          <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {en ? "No data yet. Be the first!" : "Aucune donnée. Soyez le premier !"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const isMe = user?.id === entry.user_id;
            const isPrivate = !entry.is_public;

            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${getRankBg(rank)} ${
                  isMe ? "ring-2 ring-primary/40" : ""
                }`}
              >
                {getRankIcon(rank)}

                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-lg flex-shrink-0">
                  {isPrivate ? "🔒" : entry.avatar_emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {isPrivate ? (en ? "Private" : "Privé") : entry.username}
                    </p>
                    {isMe && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-bold">
                        {en ? "YOU" : "VOUS"}
                      </span>
                    )}
                    {isPrivate ? (
                      <EyeOff className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Eye className="w-3 h-3 text-success" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Lv. {entry.level} • {entry.completed_lessons} {en ? "lessons" : "leçons"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{getValueForTab(entry)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!user && (
        <div className="text-center py-6 bg-card rounded-xl border border-border">
          <Lock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            {en ? "Sign in to appear on the leaderboard" : "Connectez-vous pour apparaître au classement"}
          </p>
        </div>
      )}
    </motion.div>
  );
}
