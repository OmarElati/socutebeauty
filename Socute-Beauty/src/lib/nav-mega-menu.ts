import { createClient } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubCategory {
  name: string;
  slug: string;
}

export interface CategoryGroup {
  title: string;
  slug?: string;
  items: SubCategory[];
}

export interface MegaMenuItem {
  id: string;
  name: string;
  slug: string;
  hasDropdown: boolean;
  groups?: CategoryGroup[];
  productIds?: string[];
  categoryId?: string | null;
}

// ─── DB row shape ─────────────────────────────────────────────────────────────

export interface NavNodeRow {
  id: string;
  label: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  active: boolean;
  category_id: string | null;
  product_ids: string[];
}

// ─── Live fetch from Supabase ─────────────────────────────────────────────────

function getSupabase() {
  const url =
    typeof window !== "undefined"
      ? (import.meta as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL ??
        "https://oczlqoqrfsldhfvhaumh.supabase.co"
      : process.env.SUPABASE_URL ?? "https://oczlqoqrfsldhfvhaumh.supabase.co";
  const key =
    typeof window !== "undefined"
      ? (import.meta as { env?: Record<string, string> }).env
          ?.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""
      : process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ─── Static fallback nav (used when nav_nodes table is empty) ─────────────────

const STATIC_NAV_ITEMS: MegaMenuItem[] = [
  { id: "best-seller",              name: "Best Seller",                   slug: "best-seller",                  hasDropdown: false },
  { id: "promotion",                name: "Promotion",                     slug: "promotion",                    hasDropdown: false },
  { id: "professionnels",           name: "Professionnels",                slug: "professionnels",               hasDropdown: true  },
  { id: "produit-cosmetique",       name: "Produit Cosmétique",            slug: "produit-cosmetique",           hasDropdown: true  },
  { id: "produit-cheveux",          name: "Produit Cheveux",               slug: "produit-cheveux",              hasDropdown: true  },
  { id: "produits-parapharmaceutiques", name: "Produits parapharmaceutiques", slug: "produits-parapharmaceutiques", hasDropdown: true  },
  { id: "produit-soin",             name: "Produit Soin",                  slug: "produit-soin",                 hasDropdown: true  },
  { id: "parfum-et-brume",          name: "Parfum et brume",               slug: "parfum-et-brume",              hasDropdown: true  },
];

/**
 * Fetch all active nav_nodes from Supabase and transform them into the
 * MegaMenuItem[] shape consumed by SiteHeader and MobileNavDrawer.
 * Falls back to the hardcoded static nav if the table is empty.
 */
export async function fetchNavTree(): Promise<MegaMenuItem[]> {
  try {
    const { data, error } = await getSupabase()
      .from("nav_nodes")
      .select("id, label, slug, parent_id, sort_order, active, category_id, product_ids")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return buildStaticFallback();
    return buildNavTree(data as NavNodeRow[]);
  } catch {
    return buildStaticFallback();
  }
}

/** Convert STATIC_NAV_ITEMS + MEGA_MENU_DATA into MegaMenuItem[] format */
function buildStaticFallback(): MegaMenuItem[] {
  return STATIC_NAV_ITEMS.map((item) => {
    const rawGroups = MEGA_MENU_DATA[item.slug] ?? [];
    const groups: CategoryGroup[] = rawGroups.map((g) => ({
      title: g.title,
      slug: slugify(g.title),
      items: g.items,
    }));
    return { ...item, groups };
  });
}

export function buildNavTree(nodes: NavNodeRow[]): MegaMenuItem[] {
  const sorted = [...nodes].sort((a, b) => a.sort_order - b.sort_order);
  const childrenMap = new Map<string | null, NavNodeRow[]>();

  for (const node of sorted) {
    const key = node.parent_id ?? null;
    if (!childrenMap.has(key)) childrenMap.set(key, []);
    childrenMap.get(key)!.push(node);
  }

  const titles = childrenMap.get(null) ?? [];

  return titles.map((title) => {
    const subtitles = childrenMap.get(title.id) ?? [];
    const groups: CategoryGroup[] = subtitles.map((subtitle) => {
      const subItems = childrenMap.get(subtitle.id) ?? [];
      return {
        title: subtitle.label,
        slug: subtitle.slug,
        items: subItems.map((item) => ({ name: item.label, slug: item.slug })),
      };
    });

    return {
      id: title.id,
      name: title.label,
      slug: title.slug,
      hasDropdown: groups.length > 0,
      groups,
      productIds: title.product_ids ?? [],
      categoryId: title.category_id,
    };
  });
}

/**
 * Resolve a slug to a human-readable title using the DB tree.
 * Falls back gracefully to the slug itself.
 */
export function getLabelFromTree(nodes: NavNodeRow[], slug: string): string {
  const found = nodes.find((n) => n.slug === slug);
  return found?.label ?? slug.replace(/-/g, " ");
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function getCategoryTitleBySlug(slug: string): string {
  if (slug === "all") return "All Collections";
  if (slug === "best-seller") return "Best Seller";
  if (slug === "promotion") return "Promotion";
  if (slug === "professionnels") return "Professionnels";
  if (slug === "produit-cosmetique") return "Produit Cosmétique";
  if (slug === "produit-cheveux") return "Produit Cheveux";
  if (slug === "produits-parapharmaceutiques") return "Produits parapharmaceutiques";
  if (slug === "produit-soin") return "Produit Soin";
  if (slug === "parfum-et-brume") return "Parfum et brume";

  for (const mainCat of Object.values(MEGA_MENU_DATA)) {
    for (const group of mainCat) {
      if (slugify(group.title) === slug) {
        return group.title;
      }
      for (const item of group.items) {
        if (item.slug === slug) {
          return item.name;
        }
      }
    }
  }

  return slug.replace(/-/g, " ");
}

export const MEGA_MENU_DATA: Record<string, CategoryGroup[]> = {
  professionnels: [
    {
      title: "Matériel de Coiffure",
      items: [
        "Cap de coiffure",
        "Tapis de coiffure",
        "Sac Barber",
        "Barber Pole LED",
        "Sèches Cheveux Professionnel",
        "Lisseur Cheveux Professionnel",
        "Fer à boucler",
        "Brosse Chauffante",
        "Tondeuses",
        "Autres Accessoires Hommes",
        "Equipement de désinfection",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Matériel esthétique",
      items: [
        "Hydrafacial",
        "Machine Cavitation",
        "Appareils de Laser",
        "Appareils Vapozone",
        "Appareils Diagnostic de Peau",
        "Appareils Lampe Loupe",
        "Appareils Épilation",
        "Appareils OxyGeneo Esthétique",
        "Haute Frequence",
        "Plasma Pen",
        "Masque Led",
        "Guéridons",
        "Tabouret à Gaz",
        "Autres Accessoires Salon Esthétique",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Matériel Onglerie",
      items: [
        "Stations de Pédicure",
        "Sèche-à-ongles",
        "Aspirateur à poussières",
        "Ponceuses à ongles",
        "Bain de pieds",
        "Accessoires Ongulaires",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Équipement Salon Hommes",
      items: [
        "Chaises de Coiffure Hommes",
        "Postes de Lavage Hommes",
        "Autres Accessoires Équipement",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Équipement Salon Femmes",
      items: [
        "Tables de Massage",
        "Fauteuils de coupe Femmes",
        "Poste de Lavage Femme",
        "Chaises de Maquillage",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
  ],

  "produit-cosmetique": [
    {
      title: "Accessoires Maquillage",
      items: ["Kit de Pinceaux", "Éponges", "Miroir"].map((name) => ({
        name,
        slug: slugify(name),
      })),
    },
    {
      title: "Teint",
      items: [
        "Palettes Teint",
        "Base & Sérum & Fixateur",
        "Fond de Teint",
        "Fond de Teint Compact",
        "Poudre Libre",
        "Anticernes",
        "Fards à Joues",
        "Highlighter",
        "Accessoires Teint",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Yeux",
      items: [
        "Palette Yeux",
        "Crayons Yeux",
        "Mascaras",
        "Eyeliners",
        "Fards à Paupières",
        "Sourcils",
        "Faux Cils",
        "Colle pour Faux Cils",
        "Colle Cils à Cils",
        "Cils à Cils",
        "Accessoires pour les Yeux",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Lèvres",
      items: [
        "Crayon à Lèvres",
        "Rouge à Lèvres",
        "Rouge à Lèvres Liquide GLOSS",
        "Rouge à Lèvres Liquide Matte",
        "Contour des Lèvres",
        "Baume à Lèvres",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
  ],

  "produit-cheveux": [
    {
      title: "Accessoires pour Cheveux",
      items: [
        "Brosses",
        "Ciseaux de Coiffure",
        "Brosses de Massage",
        "Autres Accessoires Cheveux",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Lissage de Cheveux",
      items: ["Protein", "Kératine", "Tanino", "Collagène", "Caviar", "Botox", "Défrisage"].map(
        (name) => ({ name, slug: slugify(name) }),
      ),
    },
    {
      title: "Teinture Capillaire",
      items: [
        "Teinture pour Cheveux",
        "Crème Oxydante",
        "Shampoing Colorant",
        "Spray Retouche",
        "Masque Colorant",
        "Poudre Mèche",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Soins de Cheveux",
      items: [
        "Ampoules Capillaires",
        "Spray Antichute",
        "Cheveux",
        "Shampooings",
        "Après-Shampooing",
        "Masques",
        "Mousse coiffante",
        "Lotion Capillaire",
        "Crème Bouclante",
        "Huiles et Sérums",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
  ],

  "produits-parapharmaceutiques": [
    {
      title: "Solaire",
      items: [
        "Protection Solaire Corps",
        "Protection Solaire Enfant & Bébé",
        "Protection Solaire Cheveux",
        "Protection Solaire visage",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Type de peaux",
      items: [
        "Tout type de peaux",
        "Peaux sèches",
        "Peaux mixtes à grasses",
        "Peaux Sensibles",
        "Autres",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Compléments Alimentaires",
      items: ["Compléments Alimentaires"].map((name) => ({
        name,
        slug: slugify(name),
      })),
    },
    {
      title: "Soin Intime",
      items: ["Soin Intime"].map((name) => ({ name, slug: slugify(name) })),
    },
  ],

  "produit-soin": [
    {
      title: "Coffrets Soin",
      items: ["Coffrets Soin"].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Soin du Visage",
      items: [
        "Soin Hydratant",
        "Masques pour le Visage",
        "Gommage Visage",
        "Crème Soin de Visage",
        "Démaquillant Visage",
        "Gel Nettoyant",
        "Gel Exfoliant",
        "Lotion Tonique",
        "Eau Micellaire",
        "Sérums Visage",
        "Accessoires visage",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Soin du corps",
      items: [
        "Lait Hydratant",
        "Rasoir",
        "Gel douche",
        "Huile lavante",
        "Sels de bain",
        "Huile de Massage",
        "Huiles pour Épilation",
        "Gommage",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Soin des Mains",
      items: ["Masque pour les Mains", "Gommage pour les Mains", "Crème pour les mains"].map(
        (name) => ({ name, slug: slugify(name) }),
      ),
    },
    {
      title: "Ongles",
      items: [
        "Vernis à Ongles",
        "Vernis Permanent",
        "Gel à Ongles",
        "Soin des Ongles",
        "Colle à ongles",
      ].map((name) => ({ name, slug: slugify(name) })),
    },
    {
      title: "Soin des pieds",
      items: ["Masque des pieds", "Gommage des pieds", "Crème des pieds", "Bain des pieds"].map(
        (name) => ({ name, slug: slugify(name) }),
      ),
    },
  ],

  "parfum-et-brume": [
    {
      title: "Unisexe",
      items: ["Déodorant Unisexe", "Brume Unisexe", "Parfum Unisexe"].map((name) => ({
        name,
        slug: slugify(name),
      })),
    },
    {
      title: "Homme",
      items: ["Déodorant Homme", "Brume pour Homme", "Parfum Homme"].map((name) => ({
        name,
        slug: slugify(name),
      })),
    },
    {
      title: "Femme",
      items: ["Déodorant Femme", "Brume pour Femme", "Parfum Femme"].map((name) => ({
        name,
        slug: slugify(name),
      })),
    },
  ],
};
