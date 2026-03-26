import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { quizQuestions } from "@/data/mockData";
import { ArrowLeft, CheckCircle, XCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = quizQuestions.slice(0, 5);
  const q = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const expEarned = score * 10;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-24 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Trophy className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("quiz.score")}</h1>
        <p className="text-4xl font-bold text-gradient-primary mb-2">{score}/{questions.length}</p>
        <p className="text-sm text-muted-foreground mb-6">+{expEarned} {t("quiz.expEarned")}</p>
        <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm">
          {t("common.back")}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-muted-foreground">{currentQ + 1}/{questions.length}</span>
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
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
                {selected === q.correctIndex ? t("quiz.correct") : t("quiz.wrong")}
              </p>
              <button onClick={handleNext} className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm">
                {currentQ + 1 >= questions.length ? t("quiz.finish") : t("quiz.next")}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
