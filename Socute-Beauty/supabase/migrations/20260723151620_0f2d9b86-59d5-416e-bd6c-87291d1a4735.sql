
-- ============ ENUM ============
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

-- ============ CATEGORIES ============
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  subtitle text,
  concentration text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes_top text[] NOT NULL DEFAULT '{}',
  notes_heart text[] NOT NULL DEFAULT '{}',
  notes_base text[] NOT NULL DEFAULT '{}',
  description text,
  ritual text,
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ============ ORDERS ============
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  items jsonb NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT INSERT ON public.orders TO anon;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ============ USER_ROLES ============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ SECURITY DEFINER: has_role ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ POLICIES ============

-- categories: everyone reads, only admins write
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_insert" ON public.categories FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "categories_admin_update" ON public.categories FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "categories_admin_delete" ON public.categories FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- products: everyone reads active, admins read/write all
CREATE POLICY "products_public_read_active" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "products_admin_read_all" ON public.products FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "products_admin_insert" ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "products_admin_update" ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "products_admin_delete" ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- orders: anyone can INSERT (guest checkout), admin reads all, user reads their own
CREATE POLICY "orders_insert_anyone" ON public.orders FOR INSERT
  WITH CHECK (true);
CREATE POLICY "orders_admin_read_all" ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "orders_own_read" ON public.orders FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "orders_admin_update" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- user_roles: user reads their own, admin reads all, only admin writes
CREATE POLICY "user_roles_own_read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "user_roles_admin_read" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_admin_insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_admin_update" ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_admin_delete" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- profiles: user reads/updates own; admin reads all
CREATE POLICY "profiles_own_read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "profiles_own_update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_own_insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_admin_read" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ TRIGGERS ============
-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER products_touch_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER profiles_touch_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- On new user: create profile + grant admin to the first ever user, customer to the rest
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_first boolean;
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO is_first;

  IF is_first THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SEED CATEGORIES + PRODUCTS ============
INSERT INTO public.categories (name, slug) VALUES
  ('Amber','amber'), ('Leather','leather'), ('Floral','floral'),
  ('Musk','musk'), ('Green','green'), ('Gourmand','gourmand');

INSERT INTO public.products
  (slug, name, subtitle, concentration, category_id, price, sizes, notes_top, notes_heart, notes_base, description, ritual, image_url, featured, active)
VALUES
  ('ombre-velours','Ombre Velours','No. 01 — Amber Woods','Eau de Parfum',
    (SELECT id FROM public.categories WHERE slug='amber'), 245,
    '[{"ml":30,"price":145},{"ml":50,"price":245},{"ml":100,"price":385}]'::jsonb,
    ARRAY['Amber','Smoked papyrus','Pink pepper'],
    ARRAY['Turkish rose','Iris','Saffron'],
    ARRAY['Oud','Benzoin','Tonka bean'],
    'A velvet dusk on the skin. Ombre Velours opens with warm amber and smoked papyrus, unfolding into a heart of Turkish rose and iris, resting on a base of oud, benzoin, and tonka.',
    'Apply to pulse points at the throat and inside of the wrists. Best worn as evening light softens.',
    '/products/product-1.jpg', true, true),
  ('carel-nocturne','Carel Nocturne','No. 02 — Leather & Ink','Extrait de Parfum',
    (SELECT id FROM public.categories WHERE slug='leather'), 320,
    '[{"ml":30,"price":195},{"ml":50,"price":320}]'::jsonb,
    ARRAY['Bergamot','Black pepper','Elemi'],
    ARRAY['Suede','Violet leaf','Cardamom'],
    ARRAY['Birch tar','Vetiver','Vanilla absolute'],
    'An unhurried composition of soft suede, ink, and a curl of smoke — the memory of a library at midnight, curtains drawn.',
    'One spray at the base of the neck. Two, if the night calls for it.',
    '/products/product-2.jpg', true, true),
  ('rubis-serac','Rubis Sérac','No. 03 — Crimson Rose','Eau de Parfum',
    (SELECT id FROM public.categories WHERE slug='floral'), 265,
    '[{"ml":30,"price":155},{"ml":50,"price":265},{"ml":100,"price":410}]'::jsonb,
    ARRAY['Raspberry','Sichuan pepper','Cassis'],
    ARRAY['Damask rose','Peony','Osmanthus'],
    ARRAY['Patchouli','Labdanum','Musk'],
    'A rose steeped in raspberry liqueur and warm resins. Rubis Sérac is sensual, unashamed, and lingers long after the room has emptied.',
    'Layer over freshly moisturised skin. A single spray to the décolleté.',
    '/products/product-3.jpg', true, true),
  ('delagee-mattur','Délagée Mattur','No. 04 — Marble & Musk','Eau de Parfum',
    (SELECT id FROM public.categories WHERE slug='musk'), 225,
    '[{"ml":30,"price":135},{"ml":50,"price":225},{"ml":100,"price":360}]'::jsonb,
    ARRAY['Bergamot','Aldehydes','Green mandarin'],
    ARRAY['Orris butter','Jasmine sambac','Rose oxide'],
    ARRAY['White musk','Cashmeran','Sandalwood'],
    'Cool marble warmed by afternoon light. White musks, cashmeran, and a shimmer of orris — a fragrance that reads as skin, only better.',
    'A trio of sprays across the shoulders and inner elbow.',
    '/products/product-4.jpg', false, true),
  ('vert-de-serre','Vert de Serre','No. 05 — Green Chypre','Eau de Parfum',
    (SELECT id FROM public.categories WHERE slug='green'), 235,
    '[{"ml":30,"price":140},{"ml":50,"price":235},{"ml":100,"price":370}]'::jsonb,
    ARRAY['Galbanum','Fig leaf','Tomato vine'],
    ARRAY['Neroli','Narcissus','Violet leaf'],
    ARRAY['Oakmoss','Vetiver','Cedar'],
    'The greenhouse at dawn. Crushed fig leaf, tomato vine, and galbanum over a shadowed base of oakmoss and vetiver.',
    'Apply generously. Best worn against linen or cotton.',
    '/products/product-5.jpg', false, true),
  ('laxte-blanche','Laxte Blanche','No. 06 — White Gourmand','Eau de Parfum',
    (SELECT id FROM public.categories WHERE slug='gourmand'), 215,
    '[{"ml":30,"price":130},{"ml":50,"price":215},{"ml":100,"price":340}]'::jsonb,
    ARRAY['Almond milk','Orange blossom','Neroli'],
    ARRAY['Heliotrope','Tuberose','Fig'],
    ARRAY['Blond woods','Vanilla pod','Sandalwood'],
    'Warm almond milk, orange blossom, and blond woods. Laxte Blanche is tenderness in a bottle — quietly addictive.',
    'One spray behind each ear. Reapply in the evening.',
    '/products/product-6.jpg', false, true);
