// Shared shape used by cards / PDP; DB rows are normalised into this.
export type DisplayProduct = {
  id?: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  concentration: string;
  price: number;
  image: string;
  sizes: { ml: number; price: number }[];
  notes: { top: string[]; heart: string[]; base: string[] };
  description: string;
  ritual: string;
};

export function fromDbRow(row: Record<string, unknown>): DisplayProduct {
  const categories = row.categories as { name?: string } | undefined;
  return {
    id: row.id as string | undefined,
    slug: (row.slug as string) ?? "",
    name: (row.name as string) ?? "",
    subtitle: (row.subtitle as string) ?? "",
    category: categories?.name ?? "",
    concentration: (row.concentration as string) ?? "",
    price: Number(row.price ?? 0),
    image: (row.image_url as string) ?? "",
    sizes: Array.isArray(row.sizes) ? (row.sizes as { ml: number; price: number }[]) : [],
    notes: {
      top: Array.isArray(row.notes_top) ? (row.notes_top as string[]) : [],
      heart: Array.isArray(row.notes_heart) ? (row.notes_heart as string[]) : [],
      base: Array.isArray(row.notes_base) ? (row.notes_base as string[]) : [],
    },
    description: (row.description as string) ?? "",
    ritual: (row.ritual as string) ?? "",
  };
}
