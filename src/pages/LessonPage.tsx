import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { trainingLessons } from "@/data/mockData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { completeLesson, isLessonCompleted } = useUserProgress();
  const { incrementQuest } = useDailyQuests();

  const lesson = trainingLessons.find((l) => l.id === id);
  if (!lesson) return <div className="p-4 text-foreground">Lesson not found</div>;

  const completed = isLessonCompleted(lesson.id);

  const handleComplete = () => {
    if (completed) return;
    completeLesson(lesson.id, lesson.expReward);
    incrementQuest("lesson");
    toast.success(
      language === "en"
        ? `+${lesson.expReward} XP & Points earned!`
        : `+${lesson.expReward} XP & Points gagnés !`
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
          {lesson.order}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{lesson.title[language]}</h1>
          <p className="text-xs text-muted-foreground">{lesson.description[language]}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-border mb-6">
        {lesson.content[language].split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-sm text-foreground/90 leading-relaxed mb-3 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>

      <button
        onClick={handleComplete}
        disabled={completed}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
          completed
            ? "bg-success/15 text-success border border-success/20"
            : "bg-gradient-primary text-primary-foreground hover:opacity-90"
        }`}
      >
        {completed ? (
          <>
            <CheckCircle className="w-4 h-4" />
            {language === "en" ? "Completed" : "Terminé"} ✓
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            {language === "en" ? "Complete Lesson" : "Terminer la leçon"} (+{lesson.expReward} XP)
          </>
        )}
      </button>
    </motion.div>
  );
}
