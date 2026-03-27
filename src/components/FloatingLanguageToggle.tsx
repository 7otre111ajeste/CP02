import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FloatingLanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "fr" : "en")}
      className="fixed top-3 right-3 z-50 flex items-center gap-1 px-2 py-1 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      title={language === "en" ? "Switch to French" : "Passer en anglais"}
    >
      <Globe className="w-3 h-3" />
      {language === "en" ? "FR" : "EN"}
    </button>
  );
}
