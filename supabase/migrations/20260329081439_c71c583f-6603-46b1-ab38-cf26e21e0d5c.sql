
-- User progress table for leaderboard data
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  exp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 0,
  completed_lessons INTEGER NOT NULL DEFAULT 0,
  completed_quizzes INTEGER NOT NULL DEFAULT 0,
  quizzes_passed INTEGER NOT NULL DEFAULT 0,
  badges_count INTEGER NOT NULL DEFAULT 0,
  read_terms INTEGER NOT NULL DEFAULT 0,
  read_projects INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Profile settings for public/private + displayed badges
CREATE TABLE public.profile_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  displayed_badges TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  top_cryptos TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS for user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Anyone can read public leaderboard data
CREATE POLICY "User progress is viewable by everyone"
  ON public.user_progress FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS for profile_settings
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profile settings viewable by everyone"
  ON public.profile_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own settings"
  ON public.profile_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.profile_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-create progress and settings on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'User'));
  
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.profile_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;
