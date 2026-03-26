import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { getQuizQuestions, ShuffledQuizQuestion } from "@/data/quizQuestions";
import { ArrowLeft, CheckCircle, XCircle, Trophy, Zap, Dumbbell, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const DAILY_EXP_LIMIT = 2;
const EXP_QUIZ_COUNT = 5;
const PRACTICE_QUIZ_COUNT = 10;

function getDailyQuizCount(): number {
  try {
    const data = JSON.parse(localStorage.getItem("cryptopedia-daily-quiz") || "{}");
    const today = new Date().toDateString();
    if (data.date === today) return data.count || 0;
  } catch {}
  return 0;
}

function incrementDailyQuiz() {
  const today = new Date().toDateString();
  try {
    const data = JSON.parse(localStorage.getItem("cryptopedia-daily-quiz") || "{}");
    if (data.date === today) {
      data.count = (data.count || 0) + 1;
    } else {
      data.date = today;
      data.count = 1;
    }
    localStorage.setItem("cryptopedia-daily-quiz", JSON.stringify(data));
  } catch {
    localStorage.setItem("cryptopedia-daily-quiz", JSON.stringify({ date: today, count: 1 }));
  }
}

function getUserDifficulty(): number {
  try {
    const progress = JSON.parse(localStorage.getItem("cryptopedia-progress") || "{}");
    const lessons = progress.completedLessons?.length || 0;
    const terms = progress.readTerms?.length || 0;
    const total = lessons + terms;
    if (total >= 10) return 3;
    if (total >= 4) return 2;
    return 1;
  } catch { return 1; }
}

type QuizMode = null | "exp" | "practice";

export default function QuizPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { completeQuiz } = useUserProgress();
  const [mode, setMode] = useState<QuizMode>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const dailyCount = getDailyQuizCount();
  const remaining = Math.max(0, DAILY_EXP_LIMIT - dailyCount);
  const maxDifficulty = getUserDifficulty();

  const startQuiz = (m: QuizMode) => {
    const count = m === "exp" ? EXP_QUIZ_COUNT : PRACTICE_QUIZ_COUNT;
    const diff = m === "exp" ? maxDifficulty : 3;
    setQuestions(getQuizQuestions(count, diff));
    setMode(m);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  const q = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      if (mode === "exp") {
        const expEarned = score * 10;
        const quizId = `quiz-${Date.now()}`;
        completeQuiz(quizId, expEarned);
        incrementDailyQuiz();
        toast.success(
          language === "en" ? `+${expEarned} XP earned!` : `+${expEarned} XP gagnés !`
        );
      }
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  // Menu screen
  if (mode === null) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-24 max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> {language === "en" ? "Back" : "Retour"}
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-2">{language === "en" ? "Quiz Time" : "Quiz"}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {language === "en" ? "Test your crypto knowledge!" : "Testez vos connaissances crypto !"}
        </p>

        {/* EXP Quiz */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground">{language === "en" ? "EXP Quiz" : "Quiz EXP"}</h2>
              <p className="text-xs text-muted-foreground">
                {EXP_QUIZ_COUNT} {language === "en" ? "questions • +10 XP per correct answer" : "questions • +10 XP par bonne réponse"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">
              {remaining} {language === "en" ? "remaining today" : "restants aujourd'hui"}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
              {language === "en" ? `Difficulty ${maxDifficulty}/3` : `Difficulté ${maxDifficulty}/3`}
            </span>
          </div>
          <button
            onClick={() => remaining > 0 && startQuiz("exp")}
            disabled={remaining <= 0}
            className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              remaining > 0
                ? "bg-gradient-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {remaining <= 0 ? (
              <>
                <Lock className="w-4 h-4" />
                {language === "en" ? "Come back tomorrow" : "Revenez demain"}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                {language === "en" ? "Start EXP Quiz" : "Commencer le Quiz EXP"}
              </>
            )}
          </button>
        </div>

        {/* Practice Quiz */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground">{language === "en" ? "Practice Mode" : "Mode Entraînement"}</h2>
              <p className="text-xs text-muted-foreground">
                {PRACTICE_QUIZ_COUNT} {language === "en" ? "questions • All difficulties • No XP" : "questions • Toutes difficultés • Sans XP"}
              </p>
            </div>
          </div>
          <button
            onClick={() => startQuiz("practice")}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-accent/15 text-accent border border-accent/20 flex items-center justify-center gap-2"
          >
            <Dumbbell className="w-4 h-4" />
            {language === "en" ? "Start Practice" : "Commencer l'entraînement"}
          </button>
        </div>
      </motion.div>
    );
  }

  // Finished screen
  if (finished) {
    const expEarned = mode === "exp" ? score * 10 : 0;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-24 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Trophy className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">{language === "en" ? "Your Score" : "Votre Score"}</h1>
        <p className="text-4xl font-bold text-gradient-primary mb-2">{score}/{questions.length}</p>
        {mode === "exp" && (
          <p className="text-sm text-muted-foreground mb-2">+{expEarned} XP</p>
        )}
        {mode === "practice" && (
          <p className="text-sm text-muted-foreground mb-2">{language === "en" ? "Practice mode — no XP" : "Mode entraînement — sans XP"}</p>
        )}
        <div className="flex gap-3 mt-6">
          <button onClick={() => setMode(null)} className="px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm">
            {language === "en" ? "New Quiz" : "Nouveau Quiz"}
          </button>
          <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm">
            {language === "en" ? "Home" : "Accueil"}
          </button>
        </div>
      </motion.div>
    );
  }

  // Quiz screen
  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <button onClick={() => setMode(null)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {language === "en" ? "Quit" : "Quitter"}
      </button>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted-foreground">{currentQ + 1}/{questions.length}</span>
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
        {mode === "exp" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">+XP</span>}
        {mode === "practice" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-medium">{language === "en" ? "Practice" : "Entraîn."}</span>}
      </div>
      {q && (
        <span className="text-[10px] text-muted-foreground mb-4 block">
          {language === "en" ? `Difficulty ${q.difficulty}/3` : `Difficulté ${q.difficulty}/3`}
        </span>
      )}

      <AnimatePresence mode="wait">
        {q && (
          <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-lg font-bold text-foreground mb-6">{q.question[language]}</h2>

            <div className="space-y-3 mb-6">
              {q.options[language].map((option, idx) => {
                let borderClass = "border-border";
                if (answered) {
                  if (idx === q.correctIndex) borderClass = "border-success bg-success/10";
                  else if (idx === selected) borderClass = "border-danger bg-danger/10";
                } else if (idx === selected) {
                  borderClass = "border-primary";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${borderClass} bg-card`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm text-foreground flex-1">{option}</span>
                    {answered && idx === q.correctIndex && <CheckCircle className="w-5 h-5 text-success" />}
                    {answered && idx === selected && idx !== q.correctIndex && <XCircle className="w-5 h-5 text-danger" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className={`text-sm font-semibold mb-4 ${selected === q.correctIndex ? "text-success" : "text-danger"}`}>
                  {selected === q.correctIndex
                    ? (language === "en" ? "Correct!" : "Correct !")
                    : (language === "en" ? "Wrong!" : "Faux !")}
                </p>
                <button onClick={handleNext} className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm">
                  {currentQ + 1 >= questions.length
                    ? (language === "en" ? "Finish" : "Terminer")
                    : (language === "en" ? "Next" : "Suivant")}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
