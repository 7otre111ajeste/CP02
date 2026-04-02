
CREATE TABLE public.duels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id uuid NOT NULL,
  opponent_id uuid,
  status text NOT NULL DEFAULT 'waiting',
  challenger_score integer NOT NULL DEFAULT 0,
  opponent_score integer NOT NULL DEFAULT 0,
  winner_id uuid,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  challenger_answers jsonb DEFAULT '[]'::jsonb,
  opponent_answers jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.duels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Duels viewable by everyone" ON public.duels FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create duels" ON public.duels FOR INSERT TO authenticated WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Participants can update duels" ON public.duels FOR UPDATE TO authenticated USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);
