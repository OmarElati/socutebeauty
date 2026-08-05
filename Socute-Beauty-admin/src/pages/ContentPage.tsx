import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, Eye, EyeOff, Package, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";

type Product = {
  id: string; name: string; slug: string; active: boolean; featured: boolean;
  price: number; image_url?: string | null; category_id?: string | null;
};
type Category = { id: string; name: string; slug: string };

function fmt(n: number) {
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(n);
}

export function ContentPage() {
  const qc = useQueryClient();
  const [saving, setSaving] = useState<string | null>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data } = await supabase.from("products")
        .select("id, name, slug, active, featured, price, image_url, category_id")
        .order("name");
      return (data ?? []) as Product[];
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return (data ?? []) as Category[];
    },
  });

  // Toggle featured
  const toggleFeatured = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      setSaving(id);
      const { error } = await supabase.from("products").update({ featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { featured }) => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success(featured ? "Marked as featured" : "Removed from featured");
      setSaving(null);
    },
    onError: (e: Error) => { toast.error(e.message); setSaving(null); },
  });

  // Toggle active
  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      setSaving(id);
      const { error } = await supabase.from("products").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { active }) => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success(active ? "Product is now live" : "Product set to draft");
      setSaving(null);
    },
    onError: (e: Error) => { toast.error(e.message); setSaving(null); },
  });

  const featured = products.filter((p) => p.featured);
  const active = products.filter((p) => p.active);
  const draft = products.filter((p) => !p.active);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Storefront</p>
        <h1 className="mt-3 font-serif text-4xl italic text-foreground">Content Control</h1>
        <p className="mt-1 text-sm text-foreground/40">
          Manage what appears on the storefront — featured products, visibility, and catalogue status.
        </p>
      </header>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Products", value: products.length, icon: Package },
          { label: "Featured", value: featured.length, icon: Star, gold: true },
          { label: "Live / Draft", value: `${active.length} / ${draft.length}`, icon: Eye },
        ].map((s) => (
          <div key={s.label} className={`border p-4 flex items-center gap-4 ${s.gold ? "border-gold/30 bg-gold/5" : "border-gold/15 bg-background"}`}>
            <s.icon className={`h-5 w-5 flex-none ${s.gold ? "text-gold" : "text-foreground/40"}`} strokeWidth={1.5} />
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/50">{s.label}</p>
              <p className="font-serif text-2xl text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Homepage</p>
            <h2 className="mt-1 font-serif text-2xl italic text-foreground">Featured Products</h2>
            <p className="mt-0.5 text-xs text-foreground/40">These appear in the hero featured grid on the storefront home page.</p>
          </div>
          <span className="border border-gold/30 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">{featured.length} selected</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => {
            const isFeatured = p.featured;
            const isSaving = saving === p.id;
            return (
              <div key={p.id} className={`group relative border transition-all ${isFeatured ? "border-gold/40 bg-gold/3" : "border-gold/10 bg-background"}`}>
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-deep">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-6 w-6 text-foreground/15" />
                    </div>
                  )}
                  {/* Featured toggle overlay */}
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => toggleFeatured.mutate({ id: p.id, featured: !isFeatured })}
                    className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${isFeatured ? "bg-gold/20" : "bg-black/40"}`}
                  >
                    {isSaving ? (
                      <RefreshCw className="h-5 w-5 text-gold animate-spin" />
                    ) : isFeatured ? (
                      <div className="flex flex-col items-center gap-1">
                        <Check className="h-5 w-5 text-gold" />
                        <span className="text-[9px] uppercase tracking-[0.2em] text-gold">Featured</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Star className="h-5 w-5 text-white/80" />
                        <span className="text-[9px] uppercase tracking-[0.2em] text-white/80">Feature</span>
                      </div>
                    )}
                  </button>

                  {/* Active/Draft toggle */}
                  <button
                    type="button"
                    onClick={() => toggleActive.mutate({ id: p.id, active: !p.active })}
                    className="absolute top-1.5 right-1.5 cursor-pointer"
                    title={p.active ? "Set to draft" : "Publish"}
                  >
                    <span className={`flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.15em] ${p.active ? "bg-emerald-900/80 text-emerald-300" : "bg-foreground/20 text-foreground/50"}`}>
                      {p.active ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
                      {p.active ? "Live" : "Draft"}
                    </span>
                  </button>

                  {/* Featured star */}
                  {isFeatured && (
                    <Star className="absolute top-1.5 left-1.5 h-3.5 w-3.5 fill-gold text-gold" />
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <p className="font-serif text-xs text-foreground truncate leading-tight">{p.name}</p>
                  <p className="text-[10px] text-gold/70">{fmt(p.price)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories overview */}
      <section>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-1">Catalogue</p>
        <h2 className="font-serif text-2xl italic text-foreground mb-4">By Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = products.filter((p) => p.category_id === c.id).length;
            const activeCount = products.filter((p) => p.category_id === c.id && p.active).length;
            return (
              <div key={c.id} className="border border-gold/12 bg-background p-4 flex items-center justify-between">
                <div>
                  <p className="font-serif text-sm text-foreground">{c.name}</p>
                  <p className="font-mono text-[10px] text-foreground/30">{c.slug}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl text-gold">{count}</p>
                  <p className="text-[9px] text-foreground/40">{activeCount} live</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
