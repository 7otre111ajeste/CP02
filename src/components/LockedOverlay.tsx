import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface LockedOverlayProps {
  children: React.ReactNode;
  locked: boolean;
}

export default function LockedOverlay({ children, locked }: LockedOverlayProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const en = language === "en";

  if (!locked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-30 pointer-events-none select-none">{children}</div>
      <button
        onClick={() => navigate("/auth")}
        className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl z-10"
      >
        <Lock className="w-6 h-6 text-muted-foreground mb-2" />
        <span className="text-xs font-medium text-muted-foreground">
          {en ? "Sign in to unlock" : "Connectez-vous pour débloquer"}
        </span>
      </button>
    </div>
  );
}
