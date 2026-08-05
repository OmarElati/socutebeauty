import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus, Pencil, Trash2, Search, X, ChevronRight, ChevronDown,
  Star, Eye, EyeOff, Package, Navigation, Tag, Check, ImageOff,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  concentration?: string | null;
  category_id?: string | null;
  price: number;
  sizes?: { ml: number; price: number }[] | null;
  notes_top?: string[];
  notes_heart?: string[];
  notes_base?: string[];
  description?: string | null;
  ritual?: string | null;
  image_url?: string | null;
  featured?: boolean;
  active?: boolean;
  categories?: { name: string; slug: string } | null;
};

type CategoryRow = { id: string; name: string; slug: string };

type NavNode = {
  id: string;
  label: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  product_ids: string[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(t: string) {
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function defaultForm(p: ProductRow | null) {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    subtitle: p?.subtitle ?? "",
    concentration: p?.concentration ?? "Eau de Parfum",
    category_id: p?.category_id ?? "",
    price: String(p?.price ?? 0),
    sizesText: (p?.sizes ?? []).map((s) => `${s.ml},${s.price}`).join("\n"),
    notes_top: (p?.notes_top ?? []).join(", "),
    notes_heart: (p?.notes_heart ?? []).join(", "),
    notes_base: (p?.notes_base ?? []).join(", "),
    description: p?.description ?? "",
    ritual: p?.ritual ?? "",
    image_url: p?.image_url ?? "",
    featured: !!p?.featured,
    active: p?.active ?? true,
  };
}

function parseSizes(text: string) {
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    .map((l) => { const [ml, price] = l.split(",").map((x) => Number(x.trim())); return { ml, price }; })
    .filter((s) => Number.isFinite(s.ml) && Number.isFinite(s.price));
}

function splitList(t: string) { return t.split(",").map((x) => x.trim()).filter(Boolean); }

// ─── Nav Tree Picker ──────────────────────────────────────────────────────────

function NavTreePicker({
  nodes,
  productId,
  selected,
  onChange,
}: {
  nodes: NavNode[];
  productId: string | null;
  selected: Set<string>;
  onChange: (nodeId: string, checked: boolean) => void;
}) {
  const [expandedTitles, setExpandedTitles] = useState<Set<string>>(new Set());
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());

  const childrenOf = useMemo(() => {
    const map = new Map<string | null, NavNode[]>();
    for (const n of [...nodes].sort((a, b) => a.sort_order - b.sort_order)) {
      const k = n.parent_id ?? null;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(n);
    }
    return map;
  }, [nodes]);

  const titles = childrenOf.get(null) ?? [];

  function NodeRow({ node, level }: { node: NavNode; level: 0 | 1 | 2 }) {
    const children = childrenOf.get(node.id) ?? [];
    const isExpT = expandedTitles.has(node.id);
    const isExpS = expandedSubs.has(node.id);
    const isExp = level === 0 ? isExpT : isExpS;
    const toggle = () => {
      if (level === 0) setExpandedTitles((s) => { const n = new Set(s); n.has(node.id) ? n.delete(node.id) : n.add(node.id); return n; });
      else setExpandedSubs((s) => { const n = new Set(s); n.has(node.id) ? n.delete(node.id) : n.add(node.id); return n; });
    };
    const checked = selected.has(node.id);
    const indent = level === 0 ? "" : level === 1 ? "pl-5" : "pl-10";
    const dotColor = level === 0 ? "bg-gold" : level === 1 ? "bg-gold/60" : "bg-gold/30";

    return (
      <>
        <div className={`flex items-center gap-2 py-1.5 px-2 hover:bg-gold/5 rounded transition-colors ${indent}`}>
          {children.length > 0 ? (
            <button type="button" onClick={toggle} className="text-foreground/40 hover:text-gold flex-none cursor-pointer">
              {isExp ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          ) : <span className="w-3 flex-none" />}
          <span className={`h-1.5 w-1.5 rounded-full flex-none ${dotColor}`} />
          <button
            type="button"
            onClick={() => onChange(node.id, !checked)}
            className={`flex flex-1 items-center gap-2 text-left text-xs cursor-pointer ${checked ? "text-gold" : "text-foreground/70 hover:text-foreground"}`}
          >
            <span className={`flex h-3.5 w-3.5 flex-none items-center justify-center border transition-colors ${checked ? "border-gold bg-gold/20" : "border-foreground/20"}`}>
              {checked && <Check className="h-2 w-2 text-gold" />}
            </span>
            {node.label}
            {node.product_ids?.includes(productId ?? "") && !checked && (
              <span className="text-[9px] text-foreground/30">(was linked)</span>
            )}
          </button>
        </div>
        {isExp && children.map((c) => (
          <NodeRow key={c.id} node={c} level={(level + 1) as 0 | 1 | 2} />
        ))}
      </>
    );
  }

  if (titles.length === 0) {
    return (
      <p className="text-xs text-foreground/40 border border-gold/10 px-3 py-2">
        Navigation not set up yet. Create nav nodes in the Navigation tab first.
      </p>
    );
  }

  return (
    <div className="border border-gold/15 bg-background/50 max-h-48 overflow-y-auto p-1">
      {titles.map((t) => <NodeRow key={t.id} node={t} level={0} />)}
    </div>
  );
}

// ─── Product Form Panel ───────────────────────────────────────────────────────

function ProductPanel({
  open,
  product,
  categories,
  navNodes,
  onClose,
}: {
  open: boolean;
  product: ProductRow | null;
  categories: CategoryRow[];
  navNodes: NavNode[];
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState(() => defaultForm(product));
  const [navSelected, setNavSelected] = useState<Set<string>>(new Set());

  // When panel opens, initialise form + nav selection
  useEffect(() => {
    if (!open) return;
    setForm(defaultForm(product));
    // Find all nav nodes that already contain this product
    if (product?.id) {
      const initial = new Set(
        navNodes.filter((n) => Array.isArray(n.product_ids) && n.product_ids.includes(product.id))
          .map((n) => n.id),
      );
      setNavSelected(initial);
    } else {
      setNavSelected(new Set());
    }
  }, [open, product, navNodes]);

  // Toggle a nav node selection
  function toggleNav(nodeId: string, checked: boolean) {
    setNavSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(nodeId) : next.delete(nodeId);
      return next;
    });
  }

  // Persist product + update nav_node.product_ids
  const save = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      let productId = product?.id ?? null;

      // 1. Upsert the product
      if (productId) {
        const { id: _id, ...rest } = payload as { id?: string } & Record<string, unknown>;
        const { error } = await supabase.from("products").update(rest).eq("id", productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        productId = data.id;
      }

      // 2. Sync nav assignments
      // Nodes that previously had this product
      const prevNodeIds = new Set(
        navNodes.filter((n) => Array.isArray(n.product_ids) && n.product_ids.includes(productId!))
          .map((n) => n.id),
      );
      const toAdd = [...navSelected].filter((id) => !prevNodeIds.has(id));
      const toRemove = [...prevNodeIds].filter((id) => !navSelected.has(id));

      for (const nodeId of toAdd) {
        const node = navNodes.find((n) => n.id === nodeId);
        if (!node) continue;
        const updated = Array.from(new Set([...(node.product_ids ?? []), productId!]));
        await supabase.from("nav_nodes").update({ product_ids: updated }).eq("id", nodeId);
      }
      for (const nodeId of toRemove) {
        const node = navNodes.find((n) => n.id === nodeId);
        if (!node) continue;
        const updated = (node.product_ids ?? []).filter((id) => id !== productId);
        await supabase.from("nav_nodes").update({ product_ids: updated }).eq("id", nodeId);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "nav-nodes"] });
      qc.invalidateQueries({ queryKey: ["nav-tree"] });
      toast.success(product ? "Product updated" : "Product created");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate({
      ...(product?.id ? { id: product.id } : {}),
      slug: form.slug.trim().toLowerCase() || slugify(form.name),
      name: form.name.trim(),
      subtitle: form.subtitle || null,
      concentration: form.concentration || null,
      category_id: form.category_id || null,
      price: Number(form.price) || 0,
      sizes: parseSizes(form.sizesText),
      notes_top: splitList(form.notes_top),
      notes_heart: splitList(form.notes_heart),
      notes_base: splitList(form.notes_base),
      description: form.description || null,
      ritual: form.ritual || null,
      image_url: form.image_url || null,
      featured: form.featured,
      active: form.active,
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Side panel */}
      <div className="relative flex h-full w-full max-w-xl flex-col border-l border-gold/15 bg-[#0d0407] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-5 flex-none">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Catalogue</p>
            <h2 className="mt-1 font-serif text-2xl italic text-foreground">
              {product ? "Edit Product" : "New Product"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-foreground/50 hover:text-gold transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Image preview */}
          {form.image_url ? (
            <div className="relative">
              <img src={form.image_url} alt="" className="h-48 w-full object-cover bg-surface-deep" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/60">Cover Image</p>
              </div>
            </div>
          ) : (
            <div className="flex h-28 items-center justify-center border border-dashed border-gold/20 bg-surface-deep/50">
              <ImageOff className="h-6 w-6 text-foreground/20" />
            </div>
          )}

          {/* ── Core fields ── */}
          <section>
            <SectionTitle>Identity</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name *" value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v, slug: f.slug || slugify(v) }))} required />
              <Field label="Slug" value={form.slug}
                onChange={(v) => setForm((f) => ({ ...f, slug: v }))} mono />
            </div>
            <div className="mt-3">
              <Field label="Subtitle" value={form.subtitle}
                onChange={(v) => setForm((f) => ({ ...f, subtitle: v }))} />
            </div>
          </section>

          {/* ── Pricing & Classification ── */}
          <section>
            <SectionTitle>Classification</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Concentration" value={form.concentration}
                onChange={(v) => setForm((f) => ({ ...f, concentration: v }))} />
              <Field label="Price (MAD)" value={form.price}
                onChange={(v) => setForm((f) => ({ ...f, price: v }))} type="number" />
            </div>
            <div className="mt-3">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">Category</span>
                <select value={form.category_id}
                  onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                  className="mt-2 w-full border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold">
                  <option value="">— None —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-3">
              <Field label="Image URL" value={form.image_url}
                onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
                placeholder="https://… or /products/name.jpg" />
            </div>
          </section>

          {/* ── Nav Assignment ── */}
          <section>
            <SectionTitle icon={<Navigation className="h-3 w-3" />}>
              Navigation Placement
              {navSelected.size > 0 && (
                <span className="ml-2 border border-gold/30 px-1.5 py-0.5 text-[9px] text-gold">
                  {navSelected.size} node{navSelected.size !== 1 ? "s" : ""}
                </span>
              )}
            </SectionTitle>
            <p className="mb-2 text-[10px] text-foreground/40">
              Select which nav levels show this product. Works alongside category.
            </p>
            <NavTreePicker
              nodes={navNodes}
              productId={product?.id ?? null}
              selected={navSelected}
              onChange={toggleNav}
            />
          </section>

          {/* ── Sizes ── */}
          <section>
            <SectionTitle>Sizes & Pricing</SectionTitle>
            <Field label="Sizes (one per line: ml,price)" value={form.sizesText}
              onChange={(v) => setForm((f) => ({ ...f, sizesText: v }))}
              placeholder={"30,145\n50,245\n100,395"} textarea rows={3} mono />
          </section>

          {/* ── Olfactive notes ── */}
          <section>
            <SectionTitle>Olfactive Pyramid</SectionTitle>
            <div className="space-y-3">
              <Field label="Top Notes (comma-separated)" value={form.notes_top}
                onChange={(v) => setForm((f) => ({ ...f, notes_top: v }))}
                placeholder="Bergamote, Citron, Poivre rose" />
              <Field label="Heart Notes" value={form.notes_heart}
                onChange={(v) => setForm((f) => ({ ...f, notes_heart: v }))}
                placeholder="Rose, Jasmin, Iris" />
              <Field label="Base Notes" value={form.notes_base}
                onChange={(v) => setForm((f) => ({ ...f, notes_base: v }))}
                placeholder="Oud, Musc blanc, Ambre" />
            </div>
          </section>

          {/* ── Descriptions ── */}
          <section>
            <SectionTitle>Description</SectionTitle>
            <div className="space-y-3">
              <Field label="Description" value={form.description}
                onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                textarea rows={4} />
              <Field label="Application Ritual" value={form.ritual}
                onChange={(v) => setForm((f) => ({ ...f, ritual: v }))}
                textarea rows={2} />
            </div>
          </section>

          {/* ── Toggles ── */}
          <section className="flex gap-6">
            <Toggle label="Featured" value={form.featured}
              onChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
            <Toggle label="Active / Live" value={form.active}
              onChange={(v) => setForm((f) => ({ ...f, active: v }))} />
          </section>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gold/15 px-6 py-4 flex-none">
          <button type="button" onClick={onClose}
            className="border border-foreground/20 px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] text-foreground/70 hover:border-gold/40 transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" form="product-form" disabled={save.isPending}
            onClick={onSubmit as unknown as React.MouseEventHandler}
            className="border border-gold bg-gold px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-gold/90 disabled:opacity-50 transition-colors cursor-pointer">
            {save.isPending ? "Saving…" : product ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  navNodes,
  onEdit,
  onDelete,
}: {
  product: ProductRow;
  navNodes: NavNode[];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const nodeCount = navNodes.filter((n) =>
    Array.isArray(n.product_ids) && n.product_ids.includes(product.id)
  ).length;

  return (
    <div className="group relative border border-gold/10 bg-background hover:border-gold/30 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-deep flex-none">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-10 w-10 text-foreground/15" strokeWidth={1} />
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="flex items-center gap-1 bg-gold px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-ink font-medium">
              <Star className="h-2.5 w-2.5" fill="currentColor" /> Featured
            </span>
          )}
          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] ${product.active ? "bg-emerald-900/80 text-emerald-300" : "bg-foreground/10 text-foreground/50"}`}>
            {product.active ? "Live" : "Draft"}
          </span>
        </div>

        {/* Action overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={onEdit}
            className="flex items-center gap-1.5 border border-gold bg-gold px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-gold/90 cursor-pointer">
            <Pencil className="h-3 w-3" /> Edit
          </button>
          <button type="button" onClick={onDelete}
            className="flex items-center gap-1.5 border border-red-500/60 bg-red-900/40 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-red-300 hover:bg-red-900/60 cursor-pointer">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-1">
        <div className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 truncate">
          {product.categories?.name ?? "—"} {product.concentration ? `· ${product.concentration}` : ""}
        </div>
        <div className="font-serif text-sm text-foreground leading-tight truncate">{product.name}</div>
        {product.subtitle && (
          <div className="text-[10px] italic text-foreground/50 truncate">{product.subtitle}</div>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-serif text-gold text-sm">
            {Number(product.price).toLocaleString("fr-MA")} MAD
          </span>
          {nodeCount > 0 && (
            <span className="flex items-center gap-1 text-[9px] text-gold/60">
              <Navigation className="h-2.5 w-2.5" />{nodeCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ProductsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products")
        .select("*, categories!category_id(name, slug)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return (data ?? []) as CategoryRow[];
    },
  });

  const { data: navNodes = [] } = useQuery({
    queryKey: ["admin", "nav-nodes"],
    queryFn: async () => {
      const { data } = await supabase.from("nav_nodes")
        .select("id, label, slug, parent_id, sort_order, product_ids")
        .order("sort_order");
      return (data ?? []) as NavNode[];
    },
  });

  const rows = products as unknown as ProductRow[];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((p) => {
      if (statusFilter === "active" && !p.active) return false;
      if (statusFilter === "draft" && p.active) return false;
      if (categoryFilter !== "all" && p.category_id !== categoryFilter) return false;
      if (!needle) return true;
      return p.name.toLowerCase().includes(needle) || p.slug.toLowerCase().includes(needle) ||
        (p.categories?.name ?? "").toLowerCase().includes(needle);
    });
  }, [rows, q, statusFilter, categoryFilter]);

  const del = useMutation({
    mutationFn: async (p: ProductRow) => {
      // Remove from nav_nodes first
      for (const node of navNodes) {
        if (Array.isArray(node.product_ids) && node.product_ids.includes(p.id)) {
          const updated = node.product_ids.filter((id) => id !== p.id);
          await supabase.from("nav_nodes").update({ product_ids: updated }).eq("id", node.id);
        }
      }
      const { error } = await supabase.from("products").delete().eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "nav-nodes"] });
      toast.success("Product deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openNew() { setEditing(null); setPanelOpen(true); }
  function openEdit(p: ProductRow) { setEditing(p); setPanelOpen(true); }
  function closePanel() { setPanelOpen(false); setEditing(null); }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] border border-gold/10 bg-surface-deep/30 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Catalogue</p>
          <h1 className="mt-3 font-serif text-4xl italic text-foreground">Products</h1>
          <p className="mt-1 text-sm text-foreground/40">
            {filtered.length} of {rows.length} · {navNodes.length} nav nodes
          </p>
        </div>
        <button type="button" onClick={openNew}
          className="flex items-center gap-2 border border-gold bg-gold px-5 py-3 text-[11px] uppercase tracking-[0.3em] text-ink hover:bg-gold/90 transition-colors cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> New Product
        </button>
      </header>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, slug, category…"
            className="w-full border border-gold/25 bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-gold" />
        </label>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gold/25 bg-background px-3 py-2.5 text-[11px] uppercase tracking-[0.2em] text-foreground outline-none focus:border-gold">
          <option value="all">All Categories</option>
          {(categories as CategoryRow[]).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="border border-gold/25 bg-background px-3 py-2.5 text-[11px] uppercase tracking-[0.2em] text-foreground outline-none focus:border-gold">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="border border-gold/15 bg-background p-16 text-center">
          <Package className="mx-auto h-10 w-10 text-gold/20" strokeWidth={1} />
          <p className="mt-4 font-serif text-xl italic text-foreground/50">No products found</p>
          <button type="button" onClick={openNew}
            className="mt-5 border border-gold/40 px-6 py-2.5 text-[10px] uppercase tracking-[0.3em] text-gold hover:bg-gold/10 transition-colors cursor-pointer">
            Create first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              navNodes={navNodes}
              onEdit={() => openEdit(p)}
              onDelete={() => { if (confirm(`Delete "${p.name}"? This removes it from all nav nodes too.`)) del.mutate(p); }}
            />
          ))}
        </div>
      )}

      {/* Slide-over panel */}
      <ProductPanel
        open={panelOpen}
        product={editing}
        categories={categories as CategoryRow[]}
        navNodes={navNodes}
        onClose={closePanel}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gold/10">
      {icon && <span className="text-gold/60">{icon}</span>}
      <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/50 font-medium">{children}</span>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", textarea = false, rows = 2,
  required, placeholder, mono,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  textarea?: boolean; rows?: number; required?: boolean; placeholder?: string; mono?: boolean;
}) {
  const cls = `mt-2 w-full border border-gold/25 bg-background px-3 py-2 text-foreground outline-none focus:border-gold ${mono ? "font-mono text-xs text-foreground/80" : "text-sm"}`;
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
          placeholder={placeholder} className={cls} />
      ) : (
        <input type={type} value={value} required={required} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <div
        onClick={() => onChange(!value)}
        className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${value ? "bg-gold" : "bg-foreground/20"}`}
      >
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/70">{label}</span>
    </label>
  );
}
