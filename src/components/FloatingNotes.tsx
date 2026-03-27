import { StickyNote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FloatingNotes() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <button
      onClick={() => navigate("/notes")}
      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      title={language === "en" ? "My Notes" : "Mes Notes"}
    >
      <StickyNote className="w-3 h-3" />
    </button>
  );
}
