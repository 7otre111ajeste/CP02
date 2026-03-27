import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AuthPage() {
  const { language } = useLanguage();
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const en = language === "en";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (mode === "signup" && !username.trim()) return;

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password, username);
        if (error) {
          toast.error(error);
        } else {
          toast.success(en ? "Account created! You're now logged in." : "Compte créé ! Vous êtes connecté.");
          navigate("/profile");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error);
        } else {
          toast.success(en ? "Welcome back!" : "Bon retour !");
          navigate("/profile");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
          {mode === "login" ? <LogIn className="w-8 h-8 text-primary" /> : <UserPlus className="w-8 h-8 text-primary" />}
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {mode === "login" ? (en ? "Welcome Back" : "Bon Retour") : (en ? "Create Account" : "Créer un Compte")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "login"
            ? (en ? "Sign in to your account" : "Connectez-vous à votre compte")
            : (en ? "Join Cryptopedia today" : "Rejoignez Cryptopedia")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={en ? "Username" : "Pseudo"}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              maxLength={20}
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={en ? "Password" : "Mot de passe"}
            className="w-full pl-10 pr-10 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
            {showPw ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 transition-all"
        >
          {loading
            ? (en ? "Loading..." : "Chargement...")
            : mode === "login"
            ? (en ? "Sign In" : "Se Connecter")
            : (en ? "Create Account" : "Créer le Compte")}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {mode === "login" ? (en ? "Don't have an account?" : "Pas de compte ?") : (en ? "Already have an account?" : "Déjà un compte ?")}
        {" "}
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-medium">
          {mode === "login" ? (en ? "Sign Up" : "S'inscrire") : (en ? "Sign In" : "Se Connecter")}
        </button>
      </p>
    </motion.div>
  );
}
