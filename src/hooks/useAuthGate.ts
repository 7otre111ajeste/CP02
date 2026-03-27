import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

// Pages/features accessible without login
const GUEST_ROUTES = ["/market", "/ai", "/auth"];

export function useAuthGate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const requireAuth = useCallback(
    (callback?: () => void) => {
      if (isLoggedIn) {
        callback?.();
        return true;
      }
      navigate("/auth");
      return false;
    },
    [isLoggedIn, navigate]
  );

  return { isLoggedIn, requireAuth };
}

export function isGuestAllowed(path: string): boolean {
  return GUEST_ROUTES.some((r) => path.startsWith(r));
}
