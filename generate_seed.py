import re
import json

# Read new-products-data.ts
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
sql_lines.append("-- Clean existing products and categories")
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

with open("c:/Users/MSI/socute-beauty/SocuteBeauty/src/lib/nav-mega-menu.ts", "r", encoding="utf-8") as f:
    nav_text = f.read()

# Extract items list using regex
items = re.findall(r"\{\s*name:\s*[\"']([^\"']+)[\"'],\s*slug:\s*[\"']([^\"']+)[\"']\s*\}", nav_text)

images_by_cat = {
  "professionnels": [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
  ],
  "produit-cosmetique": [
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
  ],
  "produit-cheveux": [
    "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80"
  ],
  "parfum-et-brume": [
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
  ]
}

seen_slugs = set()
idx = 1

for name, slug in items:
    if slug in seen_slugs:
        continue
    seen_slugs.add(slug)
    
    if "parfum" in slug or "brume" in slug or "senteur" in slug or "bougie" in slug or "coffret-parfum" in slug:
        cat_id = "cat-parfum-et-brume"
        cat_slug = "parfum-et-brume"
        imgs = images_by_cat["parfum-et-brume"]
    elif "cheveu" in slug or "lissage" in slug or "shampoing" in slug or "coiffant" in slug or "masque" in slug:
        cat_id = "cat-produit-cheveux"
        cat_slug = "produit-cheveux"
        imgs = images_by_cat["produit-cheveux"]
    elif "pro" in slug or "fauteuil" in slug or "materiel" in slug or "cire" in slug or "coiffure" in slug or "cabine" in slug:
        cat_id = "cat-professionnels"
        cat_slug = "professionnels"
        imgs = images_by_cat["professionnels"]
    elif "soin" in slug or "visage" in slug or "corps" in slug or "solaire" in slug or "anti-age" in slug:
        cat_id = "cat-produit-soin"
        cat_slug = "produit-soin"
        imgs = images_by_cat["produit-cosmetique"]
    elif "pharma" in slug or "sante" in slug or "vitamine" in slug or "dermato" in slug:
        cat_id = "cat-produits-parapharmaceutiques"
        cat_slug = "produits-parapharmaceutiques"
        imgs = images_by_cat["produit-cosmetique"]
    else:
        cat_id = "cat-produit-cosmetique"
        cat_slug = "produit-cosmetique"
        imgs = images_by_cat["produit-cosmetique"]
        
    img = imgs[idx % len(imgs)]
    price = 45 + ((idx * 17) % 230)
    featured = "true" if idx % 4 == 0 else "false"
    
    name_esc = f"{name} Pro".replace("'", "''")
    slug_esc = slug.replace("'", "''")
    sub_esc = f"{name} — Socute Beauty Edition".replace("'", "''")
    conc_esc = "Formule Luxe" if cat_slug == "parfum-et-brume" else "Formule Professionnelle"
    desc_esc = f"Soin et création haute performance {name} élaboré dans nos ateliers Socute Beauty.".replace("'", "''")
    ritual_esc = f"Appliquer délicatement selon votre rituel de beauté pour {name}.".replace("'", "''")
    sizes_json = json.dumps([{"ml": 50, "price": price}, {"ml": 100, "price": int(price * 1.6)}]).replace("'", "''")
    
    top_notes = "ARRAY['Bergamote', 'Cardamome']"
    heart_notes = "ARRAY['Rose de Mai', 'Iris']"
    base_notes = "ARRAY['Oud Sombre', 'Santal', 'Musc Blanc']"
    
    sql_lines.append(f"INSERT INTO products (name, slug, subtitle, concentration, price, sizes, notes_top, notes_heart, notes_base, description, ritual, image_url, featured, active, category_id) VALUES ('{name_esc}', '{slug_esc}', '{sub_esc}', '{conc_esc}', {price}, '{sizes_json}'::jsonb, {top_notes}, {heart_notes}, {base_notes}, '{desc_esc}', '{ritual_esc}', '{img}', {featured}, true, '{cat_id}');")
    idx += 1

# Extra Bestseller and Promo
sql_lines.append(f"INSERT INTO products (name, slug, subtitle, concentration, price, sizes, notes_top, notes_heart, notes_base, description, ritual, image_url, featured, active, category_id) VALUES ('Sérum Élixir Best Seller', 'serum-elixir-best-seller', 'Incontournable — Socute Beauty', 'Formule Concentrée', 185, '[{{\"ml\": 30, \"price\": 120}}, {{\"ml\": 50, \"price\": 185}}]'::jsonb, ARRAY['Or 24k', 'Extrait de Rose'], ARRAY['Huile d''Argan', 'Rétinol'], ARRAY['Vitamine E', 'Acide Hyaluronique'], 'Le produit emblématique numéro 1 des ventes chez Socute Beauty.', 'Utiliser matin et soir.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80', true, true, 'cat-best-seller');")
sql_lines.append(f"INSERT INTO products (name, slug, subtitle, concentration, price, sizes, notes_top, notes_heart, notes_base, description, ritual, image_url, featured, active, category_id) VALUES ('Coffret Prestige en Promotion', 'coffret-epilation-promotion', 'Offre Limitée — Socute Beauty', 'Coffret Spécial', 95, '[{{\"ml\": 100, \"price\": 95}}]'::jsonb, ARRAY['Huiles Essentielles'], ARRAY['Extrait Botanique'], ARRAY['Douceur Extrême'], 'Profitez de notre promotion exclusive sur ce coffret haut de gamme.', 'Idéal comme cadeau.', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80', true, true, 'cat-promotion');")

with open("c:/Users/MSI/socute-beauty/seed_products_categories.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

print(f"Successfully generated seed_products_categories.sql with {len(seen_slugs) + 2} products across 8 categories.")
