import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
] as const;

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`flex items-center gap-1 rounded-lg border border-border bg-card p-1 ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <Globe className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
      {languages.map((option) => {
        const isActive = language === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            aria-pressed={isActive}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={option.value === "en" ? "English" : "Français"}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
