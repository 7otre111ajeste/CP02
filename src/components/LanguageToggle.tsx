import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "fr" : "en")}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ${className}`}
      title={language === "en" ? "Switch to French" : "Passer en anglais"}
    >
      <Globe className="w-3.5 h-3.5" />
      {language === "en" ? "FR" : "EN"}
    </button>
  );
}
