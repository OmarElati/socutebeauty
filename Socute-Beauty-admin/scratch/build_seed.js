const fs = require('fs');
const path = require('path');

// We will read new-products-data.ts, parse the products array, and construct the SQL
const tsContent = fs.readFileSync('c:/Users/MSI/socute-beauty/SocuteBeauty/src/lib/new-products-data.ts', 'utf8');

// Categories
const categories = [
  { id: 'cat-best-seller', name: 'Best Seller', slug: 'best-seller' },
  { id: 'cat-promotion', name: 'Promotion', slug: 'promotion' },
  { id: 'cat-professionnels', name: 'Professionnels', slug: 'professionnels' },
  { id: 'cat-produit-cosmetique', name: 'Produit Cosmétique', slug: 'produit-cosmetique' },
  { id: 'cat-produit-cheveux', name: 'Produit Cheveux', slug: 'produit-cheveux' },
  { id: 'cat-produits-parapharmaceutiques', name: 'Produits parapharmaceutiques', slug: 'produits-parapharmaceutiques' },
  { id: 'cat-produit-soin', name: 'Produit Soin', slug: 'produit-soin' },
  { id: 'cat-parfum-et-brume', name: 'Parfum et brume', slug: 'parfum-et-brume' }
];

let sql = `-- Clear old products and categories
DELETE FROM products;
DELETE FROM categories;

-- Seed Categories
`;

for (const c of categories) {
  const name = c.name.replace(/'/g, "''");
  const slug = c.slug.replace(/'/g, "''");
  sql += `INSERT INTO categories (id, name, slug) VALUES ('${c.id}', '${name}', '${slug}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;\n`;
}

sql += `\n-- Seed Products\n`;

// Execute typescript compilation via tsx or node script to get exact NEW_MOCK_PRODUCTS
console.log('Categories SQL generated.');
fs.writeFileSync('c:/Users/MSI/socute-beauty/seed_categories.sql', sql);
