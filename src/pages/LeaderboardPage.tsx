import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLeaderboard, useClanLeaderboard } from "@/hooks/useLeaderboard";
import { Trophy, Medal, Award, Crown, RefreshCw, Lock, Eye, EyeOff, Heart, Swords, Zap, Target, Users } from "lucide-react";
import { motion } from "framer-motion";

type PlayerTab = "exp" | "duel_wins" | "duel_ratio" | "avg_speed" | "accuracy" | "likes_count" | "badges_count" | "completed_quizzes";
type ClanTab = "treasury_points" | "total_wins" | "clan_ratio" | "avg_member_accuracy" | "avg_member_speed";
type MainTab = "players" | "clans";

const PLAYER_TABS: { key: PlayerTab; label: { en: string; fr: string }; icon: typeof Trophy }[] = [
  { key: "exp", label: { en: "XP", fr: "XP" }, icon: Trophy },
  { key: "duel_wins", label: { en: "Wins", fr: "Victoires" }, icon: Swords },
  { key: "duel_ratio", label: { en: "Ratio", fr: "Ratio" }, icon: Target },
  { key: "avg_speed", label: { en: "Speed", fr: "Vitesse" }, icon: Zap },
  { key: "accuracy", label: { en: "Accuracy", fr: "Précision" }, icon: Target },
  { key: "likes_count", label: { en: "Likes", fr: "Likes" }, icon: Heart },
  { key: "badges_count", label: { en: "Badges", fr: "Badges" }, icon: Award },
  { key: "completed_quizzes", label: { en: "Quiz", fr: "Quiz" }, icon: Medal },
];

const CLAN_TABS: { key: ClanTab; label: { en: string; fr: string }; icon: typeof Trophy }[] = [
  { key: "treasury_points", label: { en: "Points", fr: "Points" }, icon: Trophy },
  { key: "total_wins", label: { en: "Wins", fr: "Victoires" }, icon: Swords },
  { key: "clan_ratio", label: { en: "Ratio", fr: "Ratio" }, icon: Target },
  { key: "avg_member_accuracy", label: { en: "Accuracy", fr: "Précision" }, icon: Target },
  { key: "avg_member_speed", label: { en: "Speed", fr: "Vitesse" }, icon: Zap },
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
  const [mainTab, setMainTab] = useState<MainTab>("players");
  const [playerTab, setPlayerTab] = useState<PlayerTab>("exp");
  const [clanTab, setClanTab] = useState<ClanTab>("treasury_points");

  const { data: players, isLoading: playersLoading, refetch: refetchPlayers } = useLeaderboard(playerTab);
  const { data: clans, isLoading: clansLoading, refetch: refetchClans } = useClanLeaderboard(clanTab);

  const en = language === "en";
  const isLoading = mainTab === "players" ? playersLoading : clansLoading;

  const getPlayerValue = (entry: any, tab: PlayerTab) => {
    switch (tab) {
      case "exp": return `${entry.exp} XP`;
      case "duel_wins": return `${entry.duel_wins}W / ${entry.duel_losses}L`;
      case "duel_ratio": return `${entry.duel_ratio}%`;
      case "avg_speed": return entry.avg_speed > 0 ? `${entry.avg_speed}s` : "—";
      case "accuracy": return entry.accuracy > 0 ? `${entry.accuracy}%` : "—";
      case "likes_count": return `${entry.likes_count} ❤️`;
      case "badges_count": return `${entry.badges_count} 🏅`;
      case "completed_quizzes": return `${entry.completed_quizzes} ✅`;
      default: return "";
    }
  };

  const getPlayerSubtext = (entry: any, tab: PlayerTab) => {
    switch (tab) {
      case "duel_wins":
      case "duel_ratio":
        return `${entry.accuracy}% ${en ? "acc" : "préc"} • ${entry.avg_speed > 0 ? entry.avg_speed + "s" : "—"}`;
      case "avg_speed":
        return `${entry.accuracy}% ${en ? "acc" : "préc"} • ${entry.duel_wins}W`;
      case "accuracy":
        return `${entry.avg_speed > 0 ? entry.avg_speed + "s" : "—"} • ${entry.duel_wins}W`;
      default:
        return `Lv. ${entry.level} • ${entry.completed_lessons} ${en ? "lessons" : "leçons"}`;
    }
  };

  const getClanValue = (clan: any, tab: ClanTab) => {
    switch (tab) {
      case "treasury_points": return `${clan.treasury_points} pts`;
      case "total_wins": return `${clan.total_wins}W / ${clan.total_losses}L`;
      case "clan_ratio": return `${clan.clan_ratio}%`;
      case "avg_member_accuracy": return `${clan.avg_member_accuracy}%`;
      case "avg_member_speed": return clan.avg_member_speed > 0 ? `${clan.avg_member_speed}s` : "—";
      default: return "";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-28 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-warning" />
          {en ? "Leaderboard" : "Classement"}
        </h1>
        <button
          onClick={() => mainTab === "players" ? refetchPlayers() : refetchClans()}
          className="p-2 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Main tabs: Players / Clans */}
      <div className="flex gap-2">
        <button
          onClick={() => setMainTab("players")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all ${
            mainTab === "players"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:border-primary/30"
          }`}
        >
          <Swords className="w-4 h-4" />
          {en ? "Players" : "Joueurs"}
        </button>
        <button
          onClick={() => setMainTab("clans")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all ${
            mainTab === "clans"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:border-primary/30"
          }`}
        >
          <Users className="w-4 h-4" />
          {en ? "Clans" : "Clans"}
        </button>
      </div>

      {/* Sub-tabs (filters) */}
      {mainTab === "players" ? (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {PLAYER_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setPlayerTab(t.key)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-semibold border whitespace-nowrap transition-all ${
                playerTab === t.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              <t.icon className="w-3 h-3" />
              {t.label[language]}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {CLAN_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setClanTab(t.key)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-semibold border whitespace-nowrap transition-all ${
                clanTab === t.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              <t.icon className="w-3 h-3" />
              {t.label[language]}
            </button>
          ))}
        </div>
      )}

      {/* Player List */}
      {mainTab === "players" && (
        <>
          {playersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : !players?.length ? (
            <div className="text-center py-16">
              <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {en ? "No data yet. Be the first!" : "Aucune donnée. Soyez le premier !"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((entry, index) => {
                const rank = index + 1;
                const isMe = user?.id === entry.user_id;
                const isPrivate = !entry.is_public;

                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => navigate(`/user/${entry.user_id}`)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${getRankBg(rank)} ${
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
                        {getPlayerSubtext(entry, playerTab)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{getPlayerValue(entry, playerTab)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Clan List */}
      {mainTab === "clans" && (
        <>
          {clansLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : !clans?.length ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {en ? "No clans yet." : "Aucun clan pour le moment."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {clans.map((clan, index) => {
                const rank = index + 1;
                return (
                  <motion.div
                    key={clan.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-3 rounded-xl border transition-all ${getRankBg(rank)}`}
                  >
                    <div className="flex items-center gap-3">
                      {getRankIcon(rank)}

                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-lg flex-shrink-0">
                        {clan.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{clan.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {en ? "Leader" : "Chef"}: {clan.leader_name} • {clan.member_count}/{clan.max_members} {en ? "members" : "membres"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{getClanValue(clan, clanTab)}</p>
                      </div>
                    </div>

                    {/* Extra stats row */}
                    <div className="flex gap-3 mt-2 ml-8 text-[10px] text-muted-foreground">
                      <span>{clan.total_wins}W / {clan.total_losses}L</span>
                      <span>•</span>
                      <span>{en ? "Ratio" : "Ratio"}: {clan.clan_ratio}%</span>
                      <span>•</span>
                      <span>{en ? "Acc" : "Préc"}: {clan.avg_member_accuracy}%</span>
                      {clan.avg_member_speed > 0 && (
                        <>
                          <span>•</span>
                          <span>{clan.avg_member_speed}s/{en ? "q" : "q"}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
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
