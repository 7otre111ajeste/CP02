
-- Profile likes table
CREATE TABLE public.profile_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  liker_id UUID NOT NULL,
  liked_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(liker_id, liked_user_id)
);

ALTER TABLE public.profile_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON public.profile_likes FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can like" ON public.profile_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = liker_id);
CREATE POLICY "Users can unlike" ON public.profile_likes FOR DELETE TO authenticated USING (auth.uid() = liker_id);

-- Clans table
CREATE TABLE public.clans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  emoji TEXT NOT NULL DEFAULT '⚔️',
  leader_id UUID NOT NULL,
  treasury_points INTEGER NOT NULL DEFAULT 0,
  max_members INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clans are viewable by everyone" ON public.clans FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create clans" ON public.clans FOR INSERT TO authenticated WITH CHECK (auth.uid() = leader_id);
CREATE POLICY "Leaders can update their clan" ON public.clans FOR UPDATE TO authenticated USING (auth.uid() = leader_id);

-- Clan members table
CREATE TABLE public.clan_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clan_id UUID NOT NULL REFERENCES public.clans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  points_contributed INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.clan_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clan members viewable by everyone" ON public.clan_members FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can join clans" ON public.clan_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave clans" ON public.clan_members FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own membership" ON public.clan_members FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Add likes_count to user_progress for easy sorting
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS likes_count INTEGER NOT NULL DEFAULT 0;
