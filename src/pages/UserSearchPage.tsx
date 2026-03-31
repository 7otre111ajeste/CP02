import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search, Heart, Eye, EyeOff, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface UserResult {
  user_id: string;
  username: string;
  avatar_emoji: string | null;
  is_public: boolean;
  level: number;
  exp: number;
  likes_count: number;
}

export default function UserSearchPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const en = language === "en";

  const searchUsers = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username, avatar_emoji")
      .ilike("username", `%${q}%`)
      .limit(20);

    if (!profiles?.length) { setResults([]); setLoading(false); return; }

    const userIds = profiles.map((p) => p.user_id);
    const [{ data: progress }, { data: settings }] = await Promise.all([
      supabase.from("user_progress").select("user_id, level, exp, likes_count").in("user_id", userIds),
      supabase.from("profile_settings").select("user_id, is_public").in("user_id", userIds),
    ]);

    const progressMap = new Map((progress || []).map((p) => [p.user_id, p]));
    const settingsMap = new Map((settings || []).map((s) => [s.user_id, s]));

    setResults(
      profiles.map((p) => {
        const prog = progressMap.get(p.user_id);
        const sett = settingsMap.get(p.user_id);
        return {
          user_id: p.user_id,
          username: p.username,
          avatar_emoji: p.avatar_emoji,
          is_public: sett?.is_public ?? false,
          level: prog?.level ?? 1,
          exp: prog?.exp ?? 0,
          likes_count: prog?.likes_count ?? 0,
        };
      })
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchUsers(query), 400);
    return () => clearTimeout(timer);
  }, [query, searchUsers]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-1">
        {en ? "Find Users" : "Trouver des utilisateurs"} 🔍
      </h1>
      <p className="text-xs text-muted-foreground mb-5">
        {en ? "Search by username and visit profiles" : "Recherchez par pseudo et visitez les profils"}
      </p>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={en ? "Search username..." : "Rechercher un pseudo..."}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">{en ? "No users found" : "Aucun utilisateur trouvé"}</p>
        </div>
      )}

      <div className="space-y-2">
        {results.map((u) => (
          <button
            key={u.user_id}
            onClick={() => navigate(`/user/${u.user_id}`)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-lg flex-shrink-0">
              {u.is_public ? (u.avatar_emoji || "👤") : "🔒"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-foreground truncate">
                  {u.is_public ? u.username : (en ? "Private" : "Privé")}
                </p>
                {u.is_public ? <Eye className="w-3 h-3 text-success" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Lv. {u.level} • {u.exp} XP
                {u.likes_count > 0 && ` • ${u.likes_count} ❤️`}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
