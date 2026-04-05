
-- Clan deposit history
CREATE TABLE public.clan_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id uuid NOT NULL,
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  deposited_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clan_deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clan deposits viewable by everyone"
  ON public.clan_deposits FOR SELECT
  TO public USING (true);

CREATE POLICY "System inserts deposits"
  ON public.clan_deposits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Clan chat messages
CREATE TABLE public.clan_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id uuid NOT NULL,
  user_id uuid NOT NULL,
  message text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clan_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clan messages viewable by members"
  ON public.clan_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM clan_members cm WHERE cm.clan_id = clan_messages.clan_id AND cm.user_id = auth.uid())
  );

CREATE POLICY "Members can send messages"
  ON public.clan_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM clan_members cm WHERE cm.clan_id = clan_messages.clan_id AND cm.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own messages"
  ON public.clan_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update deposit function to also log the deposit
CREATE OR REPLACE FUNCTION public.deposit_to_clan_treasury(p_clan_id uuid, p_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_is_member boolean;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM clan_members WHERE clan_id = p_clan_id AND user_id = v_user_id
  ) INTO v_is_member;

  IF NOT v_is_member THEN
    RAISE EXCEPTION 'Not a member of this clan';
  END IF;

  UPDATE clans SET treasury_points = treasury_points + p_amount WHERE id = p_clan_id;
  UPDATE clan_members SET points_contributed = points_contributed + p_amount WHERE clan_id = p_clan_id AND user_id = v_user_id;
  INSERT INTO clan_deposits (clan_id, user_id, amount) VALUES (p_clan_id, v_user_id, p_amount);
END;
$$;

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.clan_messages;
