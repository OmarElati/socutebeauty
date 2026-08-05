
-- Lock down helper function
ALTER FUNCTION public.tg_touch_updated_at() SET search_path = public;

-- has_role: only callable by authenticated (needed by RLS policies), not anon/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- handle_new_user is only called by the auth.users trigger; nobody should invoke it directly
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Tighten guest order insert: require email + non-empty items array + non-negative subtotal
DROP POLICY IF EXISTS "orders_insert_anyone" ON public.orders;
CREATE POLICY "orders_insert_valid" ON public.orders FOR INSERT
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 3
    AND email LIKE '%@%.%'
    AND full_name IS NOT NULL
    AND length(trim(full_name)) > 0
    AND jsonb_typeof(items) = 'array'
    AND jsonb_array_length(items) > 0
    AND subtotal >= 0
    -- when the caller IS signed in, force user_id to match auth.uid()
    AND (user_id IS NULL OR user_id = auth.uid())
  );
