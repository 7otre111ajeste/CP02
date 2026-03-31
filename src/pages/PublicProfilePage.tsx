import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Heart, BookOpen, Brain, Award, Eye, EyeOff, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface PublicProfile {
  user_id: string;
  username: string;
  avatar_emoji: string;
  is_public: boolean;
  bio: string;
  displayed_badges: string[];
  top_cryptos: string[];
  level: number;
  exp: number;
  completed_lessons: number;
  completed_quizzes: number;
  badges_count: number;
  likes_count: number;
  created_at: string;
}

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const en = language === "en";

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      const [{ data: prof }, { data: progress }, { data: settings }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase.from("user_progress").select("*").eq("user_id", userId).single(),
        supabase.from("profile_settings").select("*").eq("user_id", userId).single(),
      ]);

      if (!prof) { setLoading(false); return; }

      setProfile({
        user_id: prof.user_id,
        username: prof.username,
        avatar_emoji: prof.avatar_emoji || "👤",
        is_public: settings?.is_public ?? false,
        bio: settings?.bio || "",
        displayed_badges: (settings?.displayed_badges as string[]) || [],
        top_cryptos: (settings?.top_cryptos as string[]) || [],
        level: progress?.level ?? 1,
        exp: progress?.exp ?? 0,
        completed_lessons: progress?.completed_lessons ?? 0,
        completed_quizzes: progress?.completed_quizzes ?? 0,
        badges_count: progress?.badges_count ?? 0,
        likes_count: progress?.likes_count ?? 0,
        created_at: prof.created_at,
      });
      setLikesCount(progress?.likes_count ?? 0);

      // Check if current user liked
      if (user) {
        const { data: likeData } = await supabase
          .from("profile_likes")
          .select("id")
          .eq("liker_id", user.id)
          .eq("liked_user_id", userId)
          .maybeSingle();
        setHasLiked(!!likeData);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId, user]);

  const toggleLike = async () => {
    if (!user || !userId) {
      toast.error(en ? "Sign in to like" : "Connectez-vous pour liker");
      return;
    }
    if (user.id === userId) {
      toast.error(en ? "Can't like yourself!" : "Vous ne pouvez pas vous liker !");
      return;
    }
    setLikeLoading(true);

    if (hasLiked) {
      await supabase.from("profile_likes").delete().eq("liker_id", user.id).eq("liked_user_id", userId);
      setHasLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));
      // Update liked user's likes_count
      await supabase.from("user_progress").update({ likes_count: Math.max(0, likesCount - 1) }).eq("user_id", userId);
    } else {
      await supabase.from("profile_likes").insert({ liker_id: user.id, liked_user_id: userId });
      setHasLiked(true);
      setLikesCount((c) => c + 1);
      await supabase.from("user_progress").update({ likes_count: likesCount + 1 }).eq("user_id", userId);
      toast.success(en ? "Liked! ❤️" : "Liké ! ❤️");
    }
    setLikeLoading(false);
  };

  if (loading) {
    return (
      <div className="px-4 pt-4 pb-28 max-w-lg mx-auto">
        <div className="h-64 rounded-xl bg-card border border-border animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-4 pt-4 pb-28 max-w-lg mx-auto text-center py-20">
        <p className="text-muted-foreground">{en ? "User not found" : "Utilisateur introuvable"}</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-sm text-primary">{en ? "Go back" : "Retour"}</button>
      </div>
    );
  }

  const isPrivate = !profile.is_public;
  const isMe = user?.id === profile.user_id;
  const regDate = new Date(profile.created_at).toLocaleDateString(en ? "en-US" : "fr-FR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      {/* Profile Header */}
      <div className="bg-gradient-card rounded-2xl p-6 border border-border text-center glow-primary">
        <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center text-3xl mb-3">
          {isPrivate && !isMe ? "🔒" : profile.avatar_emoji}
        </div>
        <h1 className="text-xl font-bold text-foreground">
          {isPrivate && !isMe ? (en ? "Private Profile" : "Profil Privé") : profile.username}
        </h1>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          {profile.is_public ? <Eye className="w-3.5 h-3.5 text-success" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
          <span className="text-xs text-muted-foreground">
            {profile.is_public ? (en ? "Public" : "Public") : (en ? "Private" : "Privé")}
          </span>
        </div>

        {/* Like Button */}
        {!isMe && (
          <button
            onClick={toggleLike}
            disabled={likeLoading}
            className={`mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              hasLiked
                ? "bg-danger/15 text-danger border border-danger/30"
                : "bg-card border border-border text-muted-foreground hover:border-danger/30 hover:text-danger"
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
            {likesCount}
          </button>
        )}
        {isMe && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-danger font-semibold">
            <Heart className="w-4 h-4 fill-current" /> {likesCount} {en ? "likes" : "likes"}
          </div>
        )}

        {profile.bio && profile.is_public && (
          <p className="mt-3 text-xs text-muted-foreground italic">{profile.bio}</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-2">{en ? "Member since" : "Membre depuis"} {regDate}</p>
      </div>

      {/* Stats - only if public */}
      {(profile.is_public || isMe) ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <Trophy className="w-4 h-4 text-warning mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">Lv.{profile.level}</p>
              <p className="text-[9px] text-muted-foreground">{profile.exp} XP</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{profile.completed_lessons}</p>
              <p className="text-[9px] text-muted-foreground">{en ? "Lessons" : "Leçons"}</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <Brain className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{profile.completed_quizzes}</p>
              <p className="text-[9px] text-muted-foreground">Quiz</p>
            </div>
          </div>

          {profile.displayed_badges.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary" />
                {en ? "Badges" : "Badges"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.displayed_badges.map((badge, i) => (
                  <span key={i} className="text-2xl">{badge}</span>
                ))}
              </div>
            </div>
          )}

          {profile.top_cryptos.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                {en ? "Favorite Cryptos" : "Cryptos Favorites"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.top_cryptos.map((c, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{c}</span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-card rounded-xl border border-border">
          <EyeOff className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {en ? "This profile is private" : "Ce profil est privé"}
          </p>
        </div>
      )}
    </motion.div>
  );
}
