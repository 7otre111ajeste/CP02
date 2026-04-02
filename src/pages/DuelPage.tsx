
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { allQuizQuestions } from "@/data/quizQuestions";
import { ArrowLeft, Swords, Timer, Trophy, Star, Zap, Crown, Lock, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const QUESTIONS_PER_DUEL = 10;
const TIME_PER_QUESTION = 15;
const MAX_DAILY_DUELS = 3;
const WINNER_EXP = 80;
const WINNER_POINTS = 50;
const PARTICIPANT_EXP = 20;

const DUEL_RANKS = [
  { minWins: 0, label: { en: "Novice", fr: "Novice" }, emoji: "🥉" },
  { minWins: 3, label: { en: "Challenger", fr: "Challenger" }, emoji: "🥈" },
  { minWins: 10, label: { en: "Warrior", fr: "Guerrier" }, emoji: "🥇" },
  { minWins: 25, label: { en: "Champion", fr: "Champion" }, emoji: "🏆" },
  { minWins: 50, label: { en: "Legend", fr: "Légende" }, emoji: "👑" },
  { minWins: 100, label: { en: "GOAT", fr: "GOAT" }, emoji: "🐐" },
];

type DuelPhase = "lobby" | "playing" | "results";

interface DuelResult {
  myScore: number;
  opponentScore: number;
  opponentName: string;
  opponentEmoji: string;
  won: boolean;
  expEarned: number;
  pointsEarned: number;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DuelPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { addExp, addPoints, shopPurchases } = useUserProgress();
  const en = language === "en";

  const [phase, setPhase] = useState<DuelPhase>("lobby");
  const [dailyCount, setDailyCount] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalDuels, setTotalDuels] = useState(0);
  const [duelHistory, setDuelHistory] = useState<any[]>([]);

  // Quiz state
  const [questions, setQuestions] = useState<typeof allQuizQuestions>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState<DuelResult | null>(null);

  // Opponent info
  const [opponent, setOpponent] = useState<{ name: string; emoji: string; level: number } | null>(null);

  const hasExtraChallenges = shopPurchases.includes("extra-challenges");
  const maxDuels = hasExtraChallenges ? MAX_DAILY_DUELS + 2 : MAX_DAILY_DUELS;
  const canDuel = dailyCount < maxDuels;

  const currentRank = [...DUEL_RANKS].reverse().find(r => totalWins >= r.minWins) || DUEL_RANKS[0];
  const nextRank = DUEL_RANKS.find(r => r.minWins > totalWins);

  // Load duel stats
  useEffect(() => {
    if (!user) return;
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];

    const { data: todayDuels } = await supabase
      .from("duels")
      .select("id")
      .eq("challenger_id", user.id)
      .gte("created_at", today + "T00:00:00Z");

    setDailyCount(todayDuels?.length || 0);

    const { data: allDuels } = await supabase
      .from("duels")
      .select("*")
      .or(`challenger_id.eq.${user.id},opponent_id.eq.${user.id}`)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(20);

    if (allDuels) {
      setDuelHistory(allDuels);
      setTotalDuels(allDuels.length);
      setTotalWins(allDuels.filter(d => d.winner_id === user.id).length);
    }
  };

  // Timer
  useEffect(() => {
    if (phase !== "playing" || showAnswer) return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, phase, showAnswer]);

  const startDuel = async () => {
    if (!user || !canDuel) return;

    // Pick random opponent from profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username, avatar_emoji")
      .neq("user_id", user.id)
      .limit(50);

    let opponentInfo = { name: en ? "Mystery Player" : "Joueur Mystère", emoji: "🤖", level: 1 };
    if (profiles && profiles.length > 0) {
      const rnd = profiles[Math.floor(Math.random() * profiles.length)];
      opponentInfo = { name: rnd.username, emoji: rnd.avatar_emoji || "👤", level: 1 };

      const { data: prog } = await supabase
        .from("user_progress")
        .select("level")
        .eq("user_id", rnd.user_id)
        .single();
      if (prog) opponentInfo.level = prog.level;
    }

    setOpponent(opponentInfo);

    // Pick 10 random questions
    const picked = shuffleArray(allQuizQuestions).slice(0, QUESTIONS_PER_DUEL);
    setQuestions(picked);
    setCurrentQ(0);
    setMyScore(0);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setResult(null);
    setPhase("playing");
  };

  const handleAnswer = useCallback((idx: number) => {
    if (showAnswer) return;
    setSelectedAnswer(idx);
    setShowAnswer(true);

    const correct = idx === questions[currentQ]?.correctIndex;
    const newScore = correct ? myScore + 1 : myScore;
    if (correct) setMyScore(newScore);

    setTimeout(() => {
      if (currentQ + 1 >= QUESTIONS_PER_DUEL) {
        finishDuel(newScore);
      } else {
        setCurrentQ(c => c + 1);
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedAnswer(null);
        setShowAnswer(false);
      }
    }, 1200);
  }, [showAnswer, currentQ, myScore, questions]);

  const finishDuel = async (finalScore: number) => {
    if (!user || !opponent) return;

    // Simulate opponent score based on level
    const opBase = Math.min(opponent.level * 0.6, 7);
    const opScore = Math.floor(Math.max(0, Math.min(QUESTIONS_PER_DUEL, opBase + (Math.random() * 4 - 2))));

    const won = finalScore > opScore;
    const tied = finalScore === opScore;
    const expEarned = won ? WINNER_EXP : PARTICIPANT_EXP;
    const pointsEarned = won ? WINNER_POINTS : 0;

    addExp(expEarned);
    if (pointsEarned > 0) addPoints(pointsEarned);

    // Save to DB
    await supabase.from("duels").insert({
      challenger_id: user.id,
      status: "completed",
      challenger_score: finalScore,
      opponent_score: opScore,
      winner_id: won ? user.id : tied ? null : undefined,
      questions: questions.map(q => q.id),
      completed_at: new Date().toISOString(),
    });

    setResult({
      myScore: finalScore,
      opponentScore: opScore,
      opponentName: opponent.name,
      opponentEmoji: opponent.emoji,
      won,
      expEarned,
      pointsEarned,
    });

    setPhase("results");
    setDailyCount(c => c + 1);
    if (won) setTotalWins(w => w + 1);
    setTotalDuels(d => d + 1);
  };

  if (!user) {
    return (
      <div className="px-4 pt-4 pb-28 max-w-lg mx-auto text-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
        </button>
        <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-bold text-foreground mb-2">{en ? "Login Required" : "Connexion requise"}</h2>
        <p className="text-muted-foreground text-sm mb-4">{en ? "Sign in to challenge other players!" : "Connectez-vous pour défier d'autres joueurs !"}</p>
        <button onClick={() => navigate("/auth")} className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-semibold">
          {en ? "Sign In" : "Se connecter"}
        </button>
      </div>
    );
  }

  // PLAYING PHASE
  if (phase === "playing" && questions.length > 0) {
    const q = questions[currentQ];
    const opts = q.options[language] || q.options.en;
    const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚔️</span>
            <span className="text-sm font-semibold text-foreground">
              {en ? "Duel" : "Duel"} — Q{currentQ + 1}/{QUESTIONS_PER_DUEL}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{myScore}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Timer className={`w-4 h-4 ${timeLeft <= 5 ? "text-destructive" : "text-muted-foreground"}`} />
              <span className={`text-sm font-bold ${timeLeft <= 5 ? "text-destructive" : "text-foreground"}`}>{timeLeft}s</span>
            </div>
            <span className="text-xs text-muted-foreground">{en ? "vs" : "vs"} {opponent?.emoji} {opponent?.name}</span>
          </div>
          <Progress value={timerPercent} className="h-2" />
        </div>

        {/* Question */}
        <div className="bg-card rounded-2xl p-4 border border-border mb-4">
          <p className="text-foreground font-semibold text-sm leading-relaxed">
            {q.question[language] || q.question.en}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {opts.map((opt, idx) => {
            const isCorrect = idx === q.correctIndex;
            const isSelected = selectedAnswer === idx;
            let bg = "bg-card border-border";
            if (showAnswer) {
              if (isCorrect) bg = "bg-success/15 border-success";
              else if (isSelected && !isCorrect) bg = "bg-destructive/15 border-destructive";
            } else if (isSelected) {
              bg = "bg-primary/15 border-primary";
            }

            return (
              <motion.button
                key={idx}
                whileTap={!showAnswer ? { scale: 0.98 } : {}}
                onClick={() => !showAnswer && handleAnswer(idx)}
                className={`w-full text-left p-3 rounded-xl border text-sm font-medium text-foreground transition-all ${bg}`}
                disabled={showAnswer}
              >
                <span className="mr-2 text-muted-foreground">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // RESULTS PHASE
  if (phase === "results" && result) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-3"
          >
            {result.won ? "🏆" : "💪"}
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            {result.won
              ? (en ? "Victory!" : "Victoire !")
              : (en ? "Good Fight!" : "Bien joué !")}
          </h1>
        </div>

        {/* Score comparison */}
        <div className="bg-card rounded-2xl p-4 border border-border mb-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">{en ? "You" : "Vous"}</p>
              <p className="text-3xl font-bold text-foreground">{result.myScore}</p>
              <p className="text-xs text-muted-foreground">/{QUESTIONS_PER_DUEL}</p>
            </div>
            <div className="px-4">
              <Swords className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">{result.opponentEmoji} {result.opponentName}</p>
              <p className="text-3xl font-bold text-foreground">{result.opponentScore}</p>
              <p className="text-xs text-muted-foreground">/{QUESTIONS_PER_DUEL}</p>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-card rounded-2xl p-4 border border-border mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">{en ? "Rewards" : "Récompenses"}</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">+{result.expEarned} XP</span>
            </div>
            {result.pointsEarned > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning" />
                <span className="text-sm font-bold text-foreground">+{result.pointsEarned} pts</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {canDuel && (
            <button
              onClick={() => { setPhase("lobby"); }}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold"
            >
              {en ? "New Duel" : "Nouveau Duel"}
            </button>
          )}
          <button
            onClick={() => setPhase("lobby")}
            className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold"
          >
            {en ? "Back to Lobby" : "Retour au Lobby"}
          </button>
        </div>
      </motion.div>
    );
  }

  // LOBBY PHASE
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Swords className="w-6 h-6 text-primary" />
          {en ? "Duel 1v1" : "Duel 1v1"}
        </h1>
        <p className="text-sm text-muted-foreground">{en ? "Challenge players in a quiz battle!" : "Défiez des joueurs dans un quiz !"}</p>
      </div>

      {/* Rank & Stats */}
      <div className="bg-card rounded-2xl p-4 border border-border mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentRank.emoji}</span>
            <div>
              <p className="text-sm font-bold text-foreground">{currentRank.label[language] || currentRank.label.en}</p>
              <p className="text-xs text-muted-foreground">{en ? "Duel Rank" : "Rang de Duel"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">{totalWins}W / {totalDuels - totalWins}L</p>
            <p className="text-xs text-muted-foreground">{totalDuels} {en ? "duels" : "duels"}</p>
          </div>
        </div>
        {nextRank && (
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{en ? "Next rank" : "Prochain rang"}: {nextRank.emoji} {nextRank.label[language] || nextRank.label.en}</span>
              <span>{totalWins}/{nextRank.minWins}</span>
            </div>
            <Progress value={(totalWins / nextRank.minWins) * 100} className="h-2" />
          </div>
        )}
      </div>

      {/* Daily limit */}
      <div className="bg-card rounded-2xl p-4 border border-border mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{en ? "Daily Challenges" : "Défis quotidiens"}</p>
            <p className="text-xs text-muted-foreground">{dailyCount}/{maxDuels} {en ? "used" : "utilisés"}</p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: maxDuels }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${i < dailyCount ? "bg-muted-foreground" : "bg-primary"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={startDuel}
        disabled={!canDuel}
        className={`w-full py-4 rounded-2xl font-bold text-lg mb-4 transition-all ${
          canDuel
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        {canDuel
          ? (en ? "⚔️ Find Opponent" : "⚔️ Trouver un adversaire")
          : (en ? "No challenges left today" : "Plus de défis aujourd'hui")}
      </button>

      {!canDuel && !hasExtraChallenges && (
        <button
          onClick={() => navigate("/shop")}
          className="w-full flex items-center justify-center gap-2 bg-card border border-border rounded-xl py-3 text-sm font-semibold text-foreground mb-4"
        >
          <ShoppingBag className="w-4 h-4" />
          {en ? "Buy Extra Challenges" : "Acheter des défis supplémentaires"}
        </button>
      )}

      {/* History */}
      {duelHistory.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">{en ? "Recent Duels" : "Duels récents"}</h3>
          <div className="space-y-2">
            {duelHistory.slice(0, 5).map(d => {
              const won = d.winner_id === user.id;
              const isTie = !d.winner_id;
              return (
                <div key={d.id} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${won ? "bg-success/15 text-success" : isTie ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>
                      {won ? (en ? "WIN" : "VICTOIRE") : isTie ? (en ? "TIE" : "ÉGALITÉ") : (en ? "LOSS" : "DÉFAITE")}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{d.challenger_score} - {d.opponent_score}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
