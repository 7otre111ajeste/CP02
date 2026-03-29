import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileSettings {
  is_public: boolean;
  displayed_badges: string[];
  bio: string;
  top_cryptos: string[];
}

const DEFAULT_SETTINGS: ProfileSettings = {
  is_public: false,
  displayed_badges: [],
  bio: "",
  top_cryptos: [],
};

export function useProfileSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ProfileSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      const { data } = await supabase
        .from("profile_settings")
        .select("is_public, displayed_badges, bio, top_cryptos")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setSettings({
          is_public: data.is_public ?? false,
          displayed_badges: (data.displayed_badges as string[]) || [],
          bio: data.bio || "",
          top_cryptos: (data.top_cryptos as string[]) || [],
        });
      }
      setLoading(false);
    };

    fetch();
  }, [user]);

  const updateSettings = useCallback(
    async (updates: Partial<ProfileSettings>) => {
      if (!user) return;
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);

      await supabase
        .from("profile_settings")
        .update({
          is_public: newSettings.is_public,
          displayed_badges: newSettings.displayed_badges,
          bio: newSettings.bio,
          top_cryptos: newSettings.top_cryptos,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    },
    [user, settings]
  );

  return { settings, loading, updateSettings };
}
