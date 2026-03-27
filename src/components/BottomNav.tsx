import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, BarChart3, Bot, User, Lock, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, labelKey: "nav.home", guestAllowed: true },
  { path: "/learn", icon: BookOpen, labelKey: "nav.learn", guestAllowed: false },
  { path: "/market", icon: BarChart3, labelKey: "nav.market", guestAllowed: true },
  { path: "/ai", icon: Bot, labelKey: "nav.ai", guestAllowed: true },
  { path: "/profile", icon: User, labelKey: "nav.profile", guestAllowed: false },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isGuest = !user;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNav = (item: typeof navItems[0]) => {
    if (isGuest && !item.guestAllowed) {
      navigate("/auth");
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const locked = isGuest && !item.guestAllowed;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
            >
              {active && !locked && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {locked ? (
                <Lock className="w-5 h-5 relative z-10 text-muted-foreground/50" />
              ) : (
                <item.icon
                  className={`w-5 h-5 relative z-10 transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              )}
              <span
                className={`text-[10px] font-medium relative z-10 transition-colors ${
                  locked ? "text-muted-foreground/50" : active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
