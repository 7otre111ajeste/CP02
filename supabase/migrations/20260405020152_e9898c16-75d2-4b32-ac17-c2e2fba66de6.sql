
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
END;
$$;
