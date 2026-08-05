import { MEGA_MENU_DATA, slugify } from "./nav-mega-menu";

export interface MockProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  concentration: string;
  price: number;
  sizes: { ml: number; price: number }[];
  notes_top: string[];
  notes_heart: string[];
  notes_base: string[];
  description: string;
  ritual: string;
  image_url: string;
  featured: boolean;
  active: boolean;
  category_id: string;
  category_slug: string;
  group_slug: string;
  sub_category_slug: string;
  categories: { name: string; slug: string };
}

// Visual Unsplash image presets per category group
const IMAGE_PRESETS: Record<string, string[]> = {
  professionnels: [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80",
  ],
  "produit-cosmetique": [
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80",
  ],
  "produit-cheveux": [
    "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1608248597263-0057e43a4294?auto=format&fit=crop&w=800&q=80",
  ],
  "produits-parapharmaceutiques": [
    "https://images.unsplash.com/photo-1608248597263-0057e43a4294?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
  ],
  "produit-soin": [
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1608248597263-0057e43a4294?auto=format&fit=crop&w=800&q=80",
  ],
  "parfum-et-brume": [
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
  ],
};

function generateAllProducts(): MockProduct[] {
  const products: MockProduct[] = [];
  let index = 1;

  // Track categories
  const categoryKeys = Object.keys(MEGA_MENU_DATA);

  for (const mainCatSlug of categoryKeys) {
    const groups = MEGA_MENU_DATA[mainCatSlug];
    const imageList = IMAGE_PRESETS[mainCatSlug] || IMAGE_PRESETS["produit-cosmetique"];

    groups.forEach((group, groupIdx) => {
      const groupSlug = slugify(group.title);

      group.items.forEach((subItem, itemIdx) => {
        const itemSlug = subItem.slug;
        const itemName = subItem.name;
        const img = imageList[(index + itemIdx) % imageList.length];

        // Give price based on category
        const basePrice = 35 + ((index * 13) % 220);
        const isFeatured = index % 5 === 0;
        const isBestSeller = index % 3 === 0;
        const isPromotion = index % 4 === 0;

        // Dynamic category-tailored olfactive/formula notes
        const noteIdx = (index + groupIdx + itemIdx) % 6;
        let topNotes = ["Saffron", "Bergamot"];
        let heartNotes = ["Turkish Rose", "Iris"];
        let baseNotes = ["Indonesian Patchouli", "Oud", "Sandalwood"];

        if (mainCatSlug === "parfum-et-brume") {
          const topPool = [
            ["Bergamote de Calabre", "Poivre Rose"],
            ["Saffran Doré", "Mandarine Verte"],
            ["Fleur d'Oranger", "Cardamome Impertinente"],
            ["Feuille de Figuier", "Néroli Solaire"],
            ["Jasmin d'Eau", "Pamplemousse Rose"],
            ["Essence de Citron", "Gingembre Frais"],
          ];
          const heartPool = [
            ["Rose de Turquie", "Iris de Florence"],
            ["Ylang-Ylang des Comores", "Jasmin Sambac"],
            ["Orris Butter", "Bois de Cèdre Atlas"],
            ["Fleur de Vanille", "Lavande Fine"],
            ["Géranium d'Égypte", "Magnolia Blanc"],
            ["Thé Blanc", "Orchidée Noire"],
          ];
          const basePool = [
            ["Indonesian Patchouli", "Oud Sombre", "Santal Crémant"],
            ["Ambre Gris", "Musc Blanc", "Gousse de Vanille"],
            ["Bois de Guaiac", "Vétiver d'Haïti", "Cèdre de Virginie"],
            ["Fève Tonka", "Benjoin de Siam", "Cuir Doux"],
            ["Résine d'Encens", "Labdanum Gold", "Mousse de Chêne"],
            ["Ambre Sombre", "Bois Blond", "Musc Velours"],
          ];
          topNotes = topPool[noteIdx % topPool.length];
          heartNotes = heartPool[noteIdx % heartPool.length];
          baseNotes = basePool[noteIdx % basePool.length];
        } else if (mainCatSlug === "produit-cheveux") {
          topNotes = [
            ["Kératine Pure", "Huile d'Argan Bio"],
            ["Huile de Jojoba", "Extrait d'Oranger"],
            ["Ricain Naturel", "Néroli Capillaire"],
          ][noteIdx % 3];
          heartNotes = [
            ["Pro-Vitamine B5", "Protéines de Soie"],
            ["Complexe Fortifiant", "Fleur de Coton"],
            ["Acide Hyaluronique Capillaire", "Lotus"],
          ][noteIdx % 3];
          baseNotes = [
            ["Beurre de Karité", "Finition Brillance Miroir", "Protection Thermique"],
            ["Huile d'Avocat", "Nutrition Intense", "Toucher Soyeux"],
            ["Huile de Camélia", "Anti-Frizz 48h", "Soin Cuir Chevelu"],
          ][noteIdx % 3];
        } else {
          topNotes = [
            ["Vitamine C Purifiée", "Eau Cellulaire"],
            ["Sérum Acide Hyaluronique", "Extraits Botaniques"],
            ["Niacinamide 5%", "Micro-Gouttes d'Or"],
            ["Rose Sauvage", "Complexe Éclat"],
          ][noteIdx % 4];
          heartNotes = [
            ["Peptides Régénérants", "Céramides Essentiels"],
            ["Fleur d'Immortelle", "Squalane Végétal"],
            ["Collagène Naturel", "Fleur de Lotus"],
            ["Huile de Jojoba BIO", "Actifs Jeunesse"],
          ][noteIdx % 4];
          baseNotes = [
            ["Beurre de Karité Brut", "Finition Velours Non Grasse", "Barrière Hydratante"],
            ["Huile d'Argan Rare", "Hydratation Longue Durée 72h", "Éclat Sublimé"],
            ["Squalane Protecteur", "Film Hydrolipidique", "Tolérance Optimale Monastir"],
          ][noteIdx % 4];
        }

        products.push({
          id: `prod-${index}`,
          slug: itemSlug,
          name: `${itemName} Pro`,
          subtitle: `${group.title} — Socute Beauty`,
          concentration:
            mainCatSlug === "parfum-et-brume" ? "Eau de Parfum Luxe" : "Formule Professionnelle",
          price: basePrice,
          sizes: [
            { ml: 50, price: basePrice },
            { ml: 100, price: Math.round(basePrice * 1.6) },
          ],
          notes_top: topNotes,
          notes_heart: heartNotes,
          notes_base: baseNotes,
          description: `Formulation professionnelle premium d'exception pour ${itemName.toLowerCase()} dans la gamme ${group.title}. Conçu avec les exigences des experts et de Socute Beauty.`,
          ritual: `Appliquer délicatement selon la routine recommandée pour ${itemName.toLowerCase()}.`,
          image_url: img,
          featured: isFeatured || isBestSeller,
          active: true,
          category_id: `cat-${mainCatSlug}`,
          category_slug: mainCatSlug,
          group_slug: groupSlug,
          sub_category_slug: itemSlug,
          categories: {
            name: mainCatSlug.replace(/-/g, " "),
            slug: mainCatSlug,
          },
        });

        index++;
      });
    });
  }

  // Also add dedicated items for Best Seller & Promotion so they have full coverage
  const bestSellerImg = IMAGE_PRESETS["parfum-et-brume"][0];
  products.push({
    id: `prod-bs-1`,
    slug: "serum-elixir-best-seller",
    name: "Sérum Élixir Best Seller",
    subtitle: "Incontournable — Socute Beauty",
    concentration: "Formule Concentrée",
    price: 185,
    sizes: [
      { ml: 30, price: 120 },
      { ml: 50, price: 185 },
    ],
    notes_top: ["Or 24k", "Extrait de Rose"],
    notes_heart: ["Huile d'Argan", "Rétinol"],
    notes_base: ["Vitamine E", "Acide Hyaluronique"],
    description: "Le produit emblématique numéro 1 des ventes chez Socute Beauty.",
    ritual: "Utiliser matin et soir pour des résultats éclatants.",
    image_url: bestSellerImg,
    featured: true,
    active: true,
    category_id: "cat-best-seller",
    category_slug: "best-seller",
    group_slug: "best-seller",
    sub_category_slug: "best-seller",
    categories: { name: "Best Seller", slug: "best-seller" },
  });

  const promoImg = IMAGE_PRESETS["produit-cosmetique"][1];
  products.push({
    id: `prod-promo-1`,
    slug: "coffret-epilation-promotion",
    name: "Coffret Prestige en Promotion",
    subtitle: "Offre Limitée — Socute Beauty",
    concentration: "Coffret Spécial",
    price: 95,
    sizes: [{ ml: 100, price: 95 }],
    notes_top: ["Huiles Essentielles"],
    notes_heart: ["Extrait Botanique"],
    notes_base: ["Douceur Extrême"],
    description: "Profitez de notre promotion exclusive sur ce coffret haut de gamme.",
    ritual: "Idéal comme cadeau ou rituel beauté complet.",
    image_url: promoImg,
    featured: true,
    active: true,
    category_id: "cat-promotion",
    category_slug: "promotion",
    group_slug: "promotion",
    sub_category_slug: "promotion",
    categories: { name: "Promotion", slug: "promotion" },
  });

  return products;
}

export const NEW_MOCK_PRODUCTS: MockProduct[] = generateAllProducts();

export const NEW_MOCK_CATEGORIES = [
  { id: "cat-best-seller", name: "Best Seller", slug: "best-seller" },
  { id: "cat-promotion", name: "Promotion", slug: "promotion" },
  { id: "cat-professionnels", name: "Professionnels", slug: "professionnels" },
  { id: "cat-produit-cosmetique", name: "Produit Cosmétique", slug: "produit-cosmetique" },
  { id: "cat-produit-cheveux", name: "Produit Cheveux", slug: "produit-cheveux" },
  {
    id: "cat-produits-parapharmaceutiques",
    name: "Produits parapharmaceutiques",
    slug: "produits-parapharmaceutiques",
  },
  { id: "cat-produit-soin", name: "Produit Soin", slug: "produit-soin" },
  { id: "cat-parfum-et-brume", name: "Parfum et brume", slug: "parfum-et-brume" },
];
