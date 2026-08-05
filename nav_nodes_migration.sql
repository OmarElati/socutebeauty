-- Create nav_nodes table with active column and RLS policies
CREATE TABLE IF NOT EXISTS public.nav_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  slug TEXT NOT NULL,
  parent_id UUID REFERENCES public.nav_nodes(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  product_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.nav_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to nav_nodes" ON public.nav_nodes;
CREATE POLICY "Allow public read access to nav_nodes" 
  ON public.nav_nodes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin write access to nav_nodes" ON public.nav_nodes;
CREATE POLICY "Allow admin write access to nav_nodes" 
  ON public.nav_nodes FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Clear existing data
TRUNCATE TABLE public.nav_nodes CASCADE;

-- Insert Seed Hierarchy

INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-a000-000000000010', 'Best Seller', 'best-seller', NULL, 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-a000-000000000020', 'Promotion', 'promotion', NULL, 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-a000-000000000030', 'Professionnels', 'professionnels', NULL, 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b030-000000000010', 'Matériel de Coiffure', 'materiel-de-coiffure', '00000000-0000-4000-a000-000000000030', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001010', 'Cap de coiffure', 'cap-de-coiffure', '00000000-0000-4000-b030-000000000010', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001020', 'Tapis de coiffure', 'tapis-de-coiffure', '00000000-0000-4000-b030-000000000010', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001030', 'Sac Barber', 'sac-barber', '00000000-0000-4000-b030-000000000010', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001040', 'Barber Pole LED', 'barber-pole-led', '00000000-0000-4000-b030-000000000010', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001050', 'Sèches Cheveux Professionnel', 'seches-cheveux-professionnel', '00000000-0000-4000-b030-000000000010', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001060', 'Lisseur Cheveux Professionnel', 'lisseur-cheveux-professionnel', '00000000-0000-4000-b030-000000000010', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001070', 'Fer à boucler', 'fer-a-boucler', '00000000-0000-4000-b030-000000000010', 70, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001080', 'Brosse Chauffante', 'brosse-chauffante', '00000000-0000-4000-b030-000000000010', 80, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001090', 'Tondeuses', 'tondeuses', '00000000-0000-4000-b030-000000000010', 90, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001100', 'Autres Accessoires Hommes', 'autres-accessoires-hommes', '00000000-0000-4000-b030-000000000010', 100, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000001110', 'Equipement de désinfection', 'equipement-de-desinfection', '00000000-0000-4000-b030-000000000010', 110, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b030-000000000020', 'Matériel esthétique', 'materiel-esthetique', '00000000-0000-4000-a000-000000000030', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002010', 'Hydrafacial', 'hydrafacial', '00000000-0000-4000-b030-000000000020', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002020', 'Machine Cavitation', 'machine-cavitation', '00000000-0000-4000-b030-000000000020', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002030', 'Appareils de Laser', 'appareils-de-laser', '00000000-0000-4000-b030-000000000020', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002040', 'Appareils Vapozone', 'appareils-vapozone', '00000000-0000-4000-b030-000000000020', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002050', 'Appareils Diagnostic de Peau', 'appareils-diagnostic-de-peau', '00000000-0000-4000-b030-000000000020', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002060', 'Appareils Lampe Loupe', 'appareils-lampe-loupe', '00000000-0000-4000-b030-000000000020', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002070', 'Appareils Épilation', 'appareils-epilation', '00000000-0000-4000-b030-000000000020', 70, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002080', 'Appareils OxyGeneo Esthétique', 'appareils-oxygeneo-esthetique', '00000000-0000-4000-b030-000000000020', 80, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002090', 'Haute Frequence', 'haute-frequence', '00000000-0000-4000-b030-000000000020', 90, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002100', 'Plasma Pen', 'plasma-pen', '00000000-0000-4000-b030-000000000020', 100, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002110', 'Masque Led', 'masque-led', '00000000-0000-4000-b030-000000000020', 110, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002120', 'Guéridons', 'gueridons', '00000000-0000-4000-b030-000000000020', 120, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002130', 'Tabouret à Gaz', 'tabouret-a-gaz', '00000000-0000-4000-b030-000000000020', 130, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000002140', 'Autres Accessoires Salon Esthétique', 'autres-accessoires-salon-esthetique', '00000000-0000-4000-b030-000000000020', 140, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b030-000000000030', 'Matériel Onglerie', 'materiel-onglerie', '00000000-0000-4000-a000-000000000030', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000003010', 'Stations de Pédicure', 'stations-de-pedicure', '00000000-0000-4000-b030-000000000030', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000003020', 'Sèche-à-ongles', 'seche-a-ongles', '00000000-0000-4000-b030-000000000030', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000003030', 'Aspirateur à poussières', 'aspirateur-a-poussieres', '00000000-0000-4000-b030-000000000030', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000003040', 'Ponceuses à ongles', 'ponceuses-a-ongles', '00000000-0000-4000-b030-000000000030', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000003050', 'Bain de pieds', 'bain-de-pieds', '00000000-0000-4000-b030-000000000030', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000003060', 'Accessoires Ongulaires', 'accessoires-ongulaires', '00000000-0000-4000-b030-000000000030', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b030-000000000040', 'Équipement Salon Hommes', 'equipement-salon-hommes', '00000000-0000-4000-a000-000000000030', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000004010', 'Chaises de Coiffure Hommes', 'chaises-de-coiffure-hommes', '00000000-0000-4000-b030-000000000040', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000004020', 'Postes de Lavage Hommes', 'postes-de-lavage-hommes', '00000000-0000-4000-b030-000000000040', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000004030', 'Autres Accessoires Équipement', 'autres-accessoires-equipement', '00000000-0000-4000-b030-000000000040', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b030-000000000050', 'Équipement Salon Femmes', 'equipement-salon-femmes', '00000000-0000-4000-a000-000000000030', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000005010', 'Tables de Massage', 'tables-de-massage', '00000000-0000-4000-b030-000000000050', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000005020', 'Fauteuils de coupe Femmes', 'fauteuils-de-coupe-femmes', '00000000-0000-4000-b030-000000000050', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000005030', 'Poste de Lavage Femme', 'poste-de-lavage-femme', '00000000-0000-4000-b030-000000000050', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c030-000000005040', 'Chaises de Maquillage', 'chaises-de-maquillage', '00000000-0000-4000-b030-000000000050', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-a000-000000000040', 'Produit Cosmétique', 'produit-cosmetique', NULL, 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b040-000000000010', 'Accessoires Maquillage', 'accessoires-maquillage', '00000000-0000-4000-a000-000000000040', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000001010', 'Kit de Pinceaux', 'kit-de-pinceaux', '00000000-0000-4000-b040-000000000010', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000001020', 'Éponges', 'eponges', '00000000-0000-4000-b040-000000000010', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000001030', 'Miroir', 'miroir', '00000000-0000-4000-b040-000000000010', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b040-000000000020', 'Teint', 'teint', '00000000-0000-4000-a000-000000000040', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000002010', 'Palettes Teint', 'palettes-teint', '00000000-0000-4000-b040-000000000020', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000002020', 'Base & Sérum & Fixateur', 'base-serum-fixateur', '00000000-0000-4000-b040-000000000020', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000002030', 'Fond de Teint', 'fond-de-teint', '00000000-0000-4000-b040-000000000020', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000002040', 'Fond de Teint Compact', 'fond-de-teint-compact', '00000000-0000-4000-b040-000000000020', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000002050', 'Poudre Libre', 'poudre-libre', '00000000-0000-4000-b040-000000000020', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000002060', 'Anticernes', 'anticernes', '00000000-0000-4000-b040-000000000020', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000002070', 'Fards à Joues', 'fards-a-joues', '00000000-0000-4000-b040-000000000020', 70, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000002080', 'Highlighter', 'highlighter', '00000000-0000-4000-b040-000000000020', 80, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000002090', 'Accessoires Teint', 'accessoires-teint', '00000000-0000-4000-b040-000000000020', 90, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b040-000000000030', 'Yeux', 'yeux', '00000000-0000-4000-a000-000000000040', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003010', 'Palette Yeux', 'palette-yeux', '00000000-0000-4000-b040-000000000030', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003020', 'Crayons Yeux', 'crayons-yeux', '00000000-0000-4000-b040-000000000030', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003030', 'Mascaras', 'mascaras', '00000000-0000-4000-b040-000000000030', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003040', 'Eyeliners', 'eyeliners', '00000000-0000-4000-b040-000000000030', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003050', 'Fards à Paupières', 'fards-a-paupieres', '00000000-0000-4000-b040-000000000030', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003060', 'Sourcils', 'sourcils', '00000000-0000-4000-b040-000000000030', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003070', 'Faux Cils', 'faux-cils', '00000000-0000-4000-b040-000000000030', 70, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003080', 'Colle pour Faux Cils', 'colle-pour-faux-cils', '00000000-0000-4000-b040-000000000030', 80, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003090', 'Colle Cils à Cils', 'colle-cils-a-cils', '00000000-0000-4000-b040-000000000030', 90, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003100', 'Cils à Cils', 'cils-a-cils', '00000000-0000-4000-b040-000000000030', 100, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000003110', 'Accessoires pour les Yeux', 'accessoires-pour-les-yeux', '00000000-0000-4000-b040-000000000030', 110, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b040-000000000040', 'Lèvres', 'levres', '00000000-0000-4000-a000-000000000040', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000004010', 'Crayon à Lèvres', 'crayon-a-levres', '00000000-0000-4000-b040-000000000040', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000004020', 'Rouge à Lèvres', 'rouge-a-levres', '00000000-0000-4000-b040-000000000040', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000004030', 'Rouge à Lèvres Liquide GLOSS', 'rouge-a-levres-liquide-gloss', '00000000-0000-4000-b040-000000000040', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000004040', 'Rouge à Lèvres Liquide Matte', 'rouge-a-levres-liquide-matte', '00000000-0000-4000-b040-000000000040', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000004050', 'Contour des Lèvres', 'contour-des-levres', '00000000-0000-4000-b040-000000000040', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c040-000000004060', 'Baume à Lèvres', 'baume-a-levres', '00000000-0000-4000-b040-000000000040', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-a000-000000000050', 'Produit Cheveux', 'produit-cheveux', NULL, 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b050-000000000010', 'Accessoires pour Cheveux', 'accessoires-pour-cheveux', '00000000-0000-4000-a000-000000000050', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000001010', 'Brosses', 'brosses', '00000000-0000-4000-b050-000000000010', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000001020', 'Ciseaux de Coiffure', 'ciseaux-de-coiffure', '00000000-0000-4000-b050-000000000010', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000001030', 'Brosses de Massage', 'brosses-de-massage', '00000000-0000-4000-b050-000000000010', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000001040', 'Autres Accessoires Cheveux', 'autres-accessoires-cheveux', '00000000-0000-4000-b050-000000000010', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b050-000000000020', 'Lissage de Cheveux', 'lissage-de-cheveux', '00000000-0000-4000-a000-000000000050', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000002010', 'Protein', 'protein', '00000000-0000-4000-b050-000000000020', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000002020', 'Kératine', 'keratine', '00000000-0000-4000-b050-000000000020', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000002030', 'Tanino', 'tanino', '00000000-0000-4000-b050-000000000020', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000002040', 'Collagène', 'collagene', '00000000-0000-4000-b050-000000000020', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000002050', 'Caviar', 'caviar', '00000000-0000-4000-b050-000000000020', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000002060', 'Botox', 'botox', '00000000-0000-4000-b050-000000000020', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000002070', 'Défrisage', 'defrisage', '00000000-0000-4000-b050-000000000020', 70, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b050-000000000030', 'Teinture Capillaire', 'teinture-capillaire', '00000000-0000-4000-a000-000000000050', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000003010', 'Teinture pour Cheveux', 'teinture-pour-cheveux', '00000000-0000-4000-b050-000000000030', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000003020', 'Crème Oxydante', 'creme-oxydante', '00000000-0000-4000-b050-000000000030', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000003030', 'Shampoing Colorant', 'shampoing-colorant', '00000000-0000-4000-b050-000000000030', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000003040', 'Spray Retouche', 'spray-retouche', '00000000-0000-4000-b050-000000000030', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000003050', 'Masque Colorant', 'masque-colorant', '00000000-0000-4000-b050-000000000030', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000003060', 'Poudre Mèche', 'poudre-meche', '00000000-0000-4000-b050-000000000030', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b050-000000000040', 'Soins de Cheveux', 'soins-de-cheveux', '00000000-0000-4000-a000-000000000050', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004010', 'Ampoules Capillaires', 'ampoules-capillaires', '00000000-0000-4000-b050-000000000040', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004020', 'Spray Antichute', 'spray-antichute', '00000000-0000-4000-b050-000000000040', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004030', 'Cheveux', 'cheveux', '00000000-0000-4000-b050-000000000040', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004040', 'Shampooings', 'shampooings', '00000000-0000-4000-b050-000000000040', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004050', 'Après-Shampooing', 'apres-shampooing', '00000000-0000-4000-b050-000000000040', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004060', 'Masques', 'masques', '00000000-0000-4000-b050-000000000040', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004070', 'Mousse coiffante', 'mousse-coiffante', '00000000-0000-4000-b050-000000000040', 70, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004080', 'Lotion Capillaire', 'lotion-capillaire', '00000000-0000-4000-b050-000000000040', 80, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004090', 'Crème Bouclante', 'creme-bouclante', '00000000-0000-4000-b050-000000000040', 90, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c050-000000004100', 'Huiles et Sérums', 'huiles-et-serums', '00000000-0000-4000-b050-000000000040', 100, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-a000-000000000060', 'Produits parapharmaceutiques', 'produits-parapharmaceutiques', NULL, 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b060-000000000010', 'Solaire', 'solaire', '00000000-0000-4000-a000-000000000060', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000001010', 'Protection Solaire Corps', 'protection-solaire-corps', '00000000-0000-4000-b060-000000000010', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000001020', 'Protection Solaire Enfant & Bébé', 'protection-solaire-enfant-bebe', '00000000-0000-4000-b060-000000000010', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000001030', 'Protection Solaire Cheveux', 'protection-solaire-cheveux', '00000000-0000-4000-b060-000000000010', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000001040', 'Protection Solaire visage', 'protection-solaire-visage', '00000000-0000-4000-b060-000000000010', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b060-000000000020', 'Type de peaux', 'type-de-peaux', '00000000-0000-4000-a000-000000000060', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000002010', 'Tout type de peaux', 'tout-type-de-peaux', '00000000-0000-4000-b060-000000000020', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000002020', 'Peaux sèches', 'peaux-seches', '00000000-0000-4000-b060-000000000020', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000002030', 'Peaux mixtes à grasses', 'peaux-mixtes-a-grasses', '00000000-0000-4000-b060-000000000020', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000002040', 'Peaux Sensibles', 'peaux-sensibles', '00000000-0000-4000-b060-000000000020', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000002050', 'Autres', 'autres', '00000000-0000-4000-b060-000000000020', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b060-000000000030', 'Compléments Alimentaires', 'complements-alimentaires', '00000000-0000-4000-a000-000000000060', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000003010', 'Compléments Alimentaires', 'complements-alimentaires', '00000000-0000-4000-b060-000000000030', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b060-000000000040', 'Soin Intime', 'soin-intime', '00000000-0000-4000-a000-000000000060', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c060-000000004010', 'Soin Intime', 'soin-intime', '00000000-0000-4000-b060-000000000040', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-a000-000000000070', 'Produit Soin', 'produit-soin', NULL, 70, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b070-000000000010', 'Coffrets Soin', 'coffrets-soin', '00000000-0000-4000-a000-000000000070', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000001010', 'Coffrets Soin', 'coffrets-soin', '00000000-0000-4000-b070-000000000010', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b070-000000000020', 'Soin du Visage', 'soin-du-visage', '00000000-0000-4000-a000-000000000070', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002010', 'Soin Hydratant', 'soin-hydratant', '00000000-0000-4000-b070-000000000020', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002020', 'Masques pour le Visage', 'masques-pour-le-visage', '00000000-0000-4000-b070-000000000020', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002030', 'Gommage Visage', 'gommage-visage', '00000000-0000-4000-b070-000000000020', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002040', 'Crème Soin de Visage', 'creme-soin-de-visage', '00000000-0000-4000-b070-000000000020', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002050', 'Démaquillant Visage', 'demaquillant-visage', '00000000-0000-4000-b070-000000000020', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002060', 'Gel Nettoyant', 'gel-nettoyant', '00000000-0000-4000-b070-000000000020', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002070', 'Gel Exfoliant', 'gel-exfoliant', '00000000-0000-4000-b070-000000000020', 70, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002080', 'Lotion Tonique', 'lotion-tonique', '00000000-0000-4000-b070-000000000020', 80, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002090', 'Eau Micellaire', 'eau-micellaire', '00000000-0000-4000-b070-000000000020', 90, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002100', 'Sérums Visage', 'serums-visage', '00000000-0000-4000-b070-000000000020', 100, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000002110', 'Accessoires visage', 'accessoires-visage', '00000000-0000-4000-b070-000000000020', 110, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b070-000000000030', 'Soin du corps', 'soin-du-corps', '00000000-0000-4000-a000-000000000070', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000003010', 'Lait Hydratant', 'lait-hydratant', '00000000-0000-4000-b070-000000000030', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000003020', 'Rasoir', 'rasoir', '00000000-0000-4000-b070-000000000030', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000003030', 'Gel douche', 'gel-douche', '00000000-0000-4000-b070-000000000030', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000003040', 'Huile lavante', 'huile-lavante', '00000000-0000-4000-b070-000000000030', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000003050', 'Sels de bain', 'sels-de-bain', '00000000-0000-4000-b070-000000000030', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000003060', 'Huile de Massage', 'huile-de-massage', '00000000-0000-4000-b070-000000000030', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000003070', 'Huiles pour Épilation', 'huiles-pour-epilation', '00000000-0000-4000-b070-000000000030', 70, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000003080', 'Gommage', 'gommage', '00000000-0000-4000-b070-000000000030', 80, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b070-000000000040', 'Soin des Mains', 'soin-des-mains', '00000000-0000-4000-a000-000000000070', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000004010', 'Masque pour les Mains', 'masque-pour-les-mains', '00000000-0000-4000-b070-000000000040', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000004020', 'Gommage pour les Mains', 'gommage-pour-les-mains', '00000000-0000-4000-b070-000000000040', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000004030', 'Crème pour les mains', 'creme-pour-les-mains', '00000000-0000-4000-b070-000000000040', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b070-000000000050', 'Ongles', 'ongles', '00000000-0000-4000-a000-000000000070', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000005010', 'Vernis à Ongles', 'vernis-a-ongles', '00000000-0000-4000-b070-000000000050', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000005020', 'Vernis Permanent', 'vernis-permanent', '00000000-0000-4000-b070-000000000050', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000005030', 'Gel à Ongles', 'gel-a-ongles', '00000000-0000-4000-b070-000000000050', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000005040', 'Soin des Ongles', 'soin-des-ongles', '00000000-0000-4000-b070-000000000050', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000005050', 'Colle à ongles', 'colle-a-ongles', '00000000-0000-4000-b070-000000000050', 50, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b070-000000000060', 'Soin des pieds', 'soin-des-pieds', '00000000-0000-4000-a000-000000000070', 60, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000006010', 'Masque des pieds', 'masque-des-pieds', '00000000-0000-4000-b070-000000000060', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000006020', 'Gommage des pieds', 'gommage-des-pieds', '00000000-0000-4000-b070-000000000060', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000006030', 'Crème des pieds', 'creme-des-pieds', '00000000-0000-4000-b070-000000000060', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c070-000000006040', 'Bain des pieds', 'bain-des-pieds', '00000000-0000-4000-b070-000000000060', 40, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-a000-000000000080', 'Parfum et brume', 'parfum-et-brume', NULL, 80, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b080-000000000010', 'Unisexe', 'unisexe', '00000000-0000-4000-a000-000000000080', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c080-000000001010', 'Déodorant Unisexe', 'deodorant-unisexe', '00000000-0000-4000-b080-000000000010', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c080-000000001020', 'Brume Unisexe', 'brume-unisexe', '00000000-0000-4000-b080-000000000010', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c080-000000001030', 'Parfum Unisexe', 'parfum-unisexe', '00000000-0000-4000-b080-000000000010', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b080-000000000020', 'Homme', 'homme', '00000000-0000-4000-a000-000000000080', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c080-000000002010', 'Déodorant Homme', 'deodorant-homme', '00000000-0000-4000-b080-000000000020', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c080-000000002020', 'Brume pour Homme', 'brume-pour-homme', '00000000-0000-4000-b080-000000000020', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c080-000000002030', 'Parfum Homme', 'parfum-homme', '00000000-0000-4000-b080-000000000020', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-b080-000000000030', 'Femme', 'femme', '00000000-0000-4000-a000-000000000080', 30, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c080-000000003010', 'Déodorant Femme', 'deodorant-femme', '00000000-0000-4000-b080-000000000030', 10, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c080-000000003020', 'Brume pour Femme', 'brume-pour-femme', '00000000-0000-4000-b080-000000000030', 20, true);
INSERT INTO public.nav_nodes (id, label, slug, parent_id, sort_order, active) VALUES ('00000000-0000-4000-c080-000000003030', 'Parfum Femme', 'parfum-femme', '00000000-0000-4000-b080-000000000030', 30, true);