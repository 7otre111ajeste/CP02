
-- Fix 1: Profile settings - respect is_public flag
DROP POLICY "Profile settings viewable by everyone" ON profile_settings;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profile_settings FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Users can view their own settings"
  ON profile_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix 2: Clan members - prevent role escalation
DROP POLICY "Users can update own membership" ON clan_members;

CREATE POLICY "Users can update own membership"
  ON clan_members FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = 'member');
