import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, Users } from "lucide-react";
import TermHighlighter from "./TermHighlighter";

interface DescriptionToggleProps {
  proBro: { pro: string; bro: string };
  className?: string;
}

export default function DescriptionToggle({ proBro, className = "" }: DescriptionToggleProps) {
  const [mode, setMode] = useState<"bro" | "pro">("bro");
  const { language } = useLanguage();

  return (
    <div className={className}>
      <div className="flex gap-1 mb-2">
        <button
          onClick={() => setMode("bro")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            mode === "bro"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-secondary text-muted-foreground border border-transparent"
          }`}
        >
          <Users className="w-3 h-3" />
          {language === "en" ? "For Bros 🤙" : "Pour les Bros 🤙"}
        </button>
        <button
          onClick={() => setMode("pro")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            mode === "pro"
              ? "bg-accent/15 text-accent border border-accent/30"
              : "bg-secondary text-muted-foreground border border-transparent"
          }`}
        >
          <GraduationCap className="w-3 h-3" />
          {language === "en" ? "For Pros 🎓" : "Pour les Pros 🎓"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        <TermHighlighter text={mode === "bro" ? proBro.bro : proBro.pro} />
      </p>
    </div>
  );
}
