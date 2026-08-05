-- Promote elatti.omar@gmail.com and enable all authenticated console users to read orders
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'elatti.omar@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

UPDATE public.user_roles
SET role = 'admin'::public.app_role
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'elatti.omar@gmail.com');

-- Grant SELECT policy on orders for authenticated users
DROP POLICY IF EXISTS "orders_admin_read_all" ON public.orders;
DROP POLICY IF EXISTS "orders_authenticated_read_all" ON public.orders;

CREATE POLICY "orders_authenticated_read_all" ON public.orders FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to claim/update their admin role when signing in to Admin Console
DROP POLICY IF EXISTS "user_roles_own_insert" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_own_update" ON public.user_roles;

CREATE POLICY "user_roles_own_insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_roles_own_update" ON public.user_roles FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
