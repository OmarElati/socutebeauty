-- Ensure orders can be read from the admin dashboard
DROP POLICY IF EXISTS "orders_admin_read_all" ON public.orders;
DROP POLICY IF EXISTS "orders_authenticated_read_all" ON public.orders;
DROP POLICY IF EXISTS "orders_public_select" ON public.orders;

CREATE POLICY "orders_public_select" ON public.orders FOR SELECT
  USING (true);
