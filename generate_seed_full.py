import json

categories = [
  {"id": "cat-best-seller", "name": "Best Seller", "slug": "best-seller"},
  {"id": "cat-promotion", "name": "Promotion", "slug": "promotion"},
  {"id": "cat-professionnels", "name": "Professionnels", "slug": "professionnels"},
  {"id": "cat-produit-cosmetique", "name": "Produit Cosmétique", "slug": "produit-cosmetique"},
  {"id": "cat-produit-cheveux", "name": "Produit Cheveux", "slug": "produit-cheveux"},
  {"id": "cat-produits-parapharmaceutiques", "name": "Produits parapharmaceutiques", "slug": "produits-parapharmaceutiques"},
  {"id": "cat-produit-soin", "name": "Produit Soin", "slug": "produit-soin"},
  {"id": "cat-parfum-et-brume", "name": "Parfum et brume", "slug": "parfum-et-brume"}
]

sql_lines = []
sql_lines.append("-- Clean old data from products and categories")
sql_lines.append("DELETE FROM products;")
sql_lines.append("DELETE FROM categories;")
sql_lines.append("")
sql_lines.append("-- Seed Categories")

for c in categories:
    name_esc = c["name"].replace("'", "''")
    slug_esc = c["slug"].replace("'", "''")
    sql_lines.append(f"INSERT INTO categories (id, name, slug) VALUES ('{c['id']}', '{name_esc}', '{slug_esc}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;")

sql_lines.append("")
sql_lines.append("-- Seed Products")

# Load products from static JS file or predefined list
products_data = [
  # Professionnels
  ("Cap de coiffure Pro", "cap-de-coiffure", "Matériel de Coiffure — Socute Beauty", "cat-professionnels", 65, "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"),
  ("Tapis de coiffure Pro", "tapis-de-coiffure", "Matériel de Coiffure — Socute Beauty", "cat-professionnels", 85, "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80"),
  ("Sac Barber Pro", "sac-barber", "Matériel de Coiffure — Socute Beauty", "cat-professionnels", 120, "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"),
  ("Barber Pole LED Pro", "barber-pole-led", "Matériel de Coiffure — Socute Beauty", "cat-professionnels", 290, "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80"),
  ("Sèches Cheveux Professionnel Pro", "seches-cheveux-professionnel", "Matériel de Coiffure — Socute Beauty", "cat-professionnels", 240, "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"),
  ("Lisseur Cheveux Professionnel Pro", "lisseur-cheveux-professionnel", "Matériel de Coiffure — Socute Beauty", "cat-professionnels", 210, "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"),
  ("Hydrafacial Pro", "hydrafacial", "Matériel Esthétique — Socute Beauty", "cat-professionnels", 450, "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"),
  ("Appareils Vapozone Pro", "appareils-vapozone", "Matériel Esthétique — Socute Beauty", "cat-professionnels", 180, "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"),

  # Produit Cosmetique & Soin
  ("Kit de Pinceaux Maquillage Pro", "kit-de-pinceaux", "Accessoires Maquillage — Socute Beauty", "cat-produit-cosmetique", 95, "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"),
  ("Éponges Maquillage Pro", "eponges", "Accessoires Maquillage — Socute Beauty", "cat-produit-cosmetique", 35, "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"),
  ("Sérum Hydratant Eclat Pro", "serum-hydratant-eclat", "Soin Visage — Socute Beauty", "cat-produit-soin", 165, "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"),
  ("Crème Anti-Âge Immortelle Pro", "creme-anti-age-immortelle", "Soin Visage — Socute Beauty", "cat-produit-soin", 220, "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"),
  ("Huile Précieuse Corps Pro", "huile-precieuse-corps", "Soin Corps — Socute Beauty", "cat-produit-soin", 145, "https://images.unsplash.com/photo-1608248597263-0057e43a4294?auto=format&fit=crop&w=800&q=80"),

  # Produit Cheveux
  ("Shampoing Kératine Pure Pro", "shampoing-keratine-pure", "Soin Capillaire — Socute Beauty", "cat-produit-cheveux", 85, "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80"),
  ("Masque Réparateur Argan Pro", "masque-reparateur-argan", "Soin Capillaire — Socute Beauty", "cat-produit-cheveux", 110, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80"),
  ("Sérum Lissant Anti-Frizz Pro", "serum-lissant-anti-frizz", "Coiffant — Socute Beauty", "cat-produit-cheveux", 130, "https://images.unsplash.com/photo-1608248597263-0057e43a4294?auto=format&fit=crop&w=800&q=80"),

  # Parfum et Brume
  ("Ombre Velours", "ombre-velours", "Eau de Parfum — Socute Beauty", "cat-parfum-et-brume", 245, "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"),
  ("Carel Nocturne", "carel-nocturne", "Eau de Parfum — Socute Beauty", "cat-parfum-et-brume", 260, "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"),
  ("Rubis Sérac", "rubis-serac", "Eau de Parfum — Socute Beauty", "cat-parfum-et-brume", 230, "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"),
  ("Délagée Mattur", "delagee-mattur", "Eau de Parfum — Socute Beauty", "cat-parfum-et-brume", 280, "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"),
  ("Brume Solaire Néroli Pro", "brume-solaire-neroli", "Brume Parfumée — Socute Beauty", "cat-parfum-et-brume", 115, "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"),

  # Best Seller & Promotion
  ("Sérum Élixir Best Seller", "serum-elixir-best-seller", "Incontournable — Socute Beauty", "cat-best-seller", 185, "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"),
  ("Coffret Prestige en Promotion", "coffret-epilation-promotion", "Offre Limitée — Socute Beauty", "cat-promotion", 95, "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"),
]

for idx, (name, slug, sub, cat_id, price, img) in enumerate(products_data, 1):
    name_esc = name.replace("'", "''")
    slug_esc = slug.replace("'", "''")
    sub_esc = sub.replace("'", "''")
    conc_esc = "Eau de Parfum Luxe" if cat_id == "cat-parfum-et-brume" else "Formule Professionnelle"
    desc_esc = f"Soin et création d''exception {name} conçu dans les ateliers Socute Beauty.".replace("'", "''")
    ritual_esc = f"Appliquer délicatement selon votre rituel de beauté pour {name}.".replace("'", "''")
    sizes_json = json.dumps([{"ml": 50, "price": price}, {"ml": 100, "price": int(price * 1.6)}]).replace("'", "''")
    featured = "true" if idx % 3 == 0 or cat_id in ["cat-best-seller", "cat-promotion"] else "false"
    
    top_notes = "ARRAY['Bergamote de Calabre', 'Poivre Rose']"
    heart_notes = "ARRAY['Rose de Mai', 'Iris de Florence']"
    base_notes = "ARRAY['Oud Sombre', 'Santal Crémant', 'Musc Velours']"
    
    sql_lines.append(f"INSERT INTO products (name, slug, subtitle, concentration, price, sizes, notes_top, notes_heart, notes_base, description, ritual, image_url, featured, active, category_id) VALUES ('{name_esc}', '{slug_esc}', '{sub_esc}', '{conc_esc}', {price}, '{sizes_json}'::jsonb, {top_notes}, {heart_notes}, {base_notes}, '{desc_esc}', '{ritual_esc}', '{img}', {featured}, true, '{cat_id}');")

with open("c:/Users/MSI/socute-beauty/seed_products_categories.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

print(f"Successfully written seed_products_categories.sql with {len(products_data)} products and 8 categories.")
