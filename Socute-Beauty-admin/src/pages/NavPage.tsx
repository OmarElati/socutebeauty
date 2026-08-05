import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Navigation,
  Tag,
  Link2,
  Package,
  X,
  Check,
  Search,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavNode = Tables<"nav_nodes">;
type ProductRow = Tables<"products">;
type CategoryRow = Tables<"categories">;

type Level = 0 | 1 | 2; // 0=title, 1=subtitle, 2=sub-subtitle

interface DialogState {
  open: boolean;
  mode: "add" | "edit";
  level: Level;
  parentId: string | null;
  node: NavNode | null;
}

interface FormState {
  label: string;
  slug: string;
  active: boolean;
  category_id: string;
  product_ids: string[];
}

const LEVEL_LABEL: Record<Level, string> = {
  0: "Title",
  1: "Subtitle",
  2: "Sub-subtitle",
};

const LEVEL_INDENT: Record<Level, string> = {
  0: "",
  1: "ml-6",
  2: "ml-12",
};

const LEVEL_DOT: Record<Level, string> = {
  0: "bg-gold",
  1: "bg-gold/60",
  2: "bg-gold/30",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function autoSlug(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getLevel(node: NavNode, allNodes: NavNode[]): Level {
  if (node.parent_id === null) return 0;
  const parent = allNodes.find((n) => n.id === node.parent_id);
  if (!parent || parent.parent_id === null) return 1;
  return 2;
}

// ─── Product Picker Dialog ────────────────────────────────────────────────────

function ProductPicker({
  products,
  selected,
  onClose,
  onConfirm,
}: {
  products: ProductRow[];
  selected: string[];
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<string[]>(selected);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.slug.toLowerCase().includes(q.toLowerCase()),
  );

  const toggle = (id: string) =>
    setDraft((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg border border-gold/20 bg-[#0d0407] shadow-2xl">
        <div className="flex items-center justify-between border-b border-gold/15 px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Link Products</p>
            <h3 className="mt-0.5 font-serif text-lg text-foreground">
              Select Products ({draft.length} selected)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-foreground/50 hover:text-gold transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 border-b border-gold/10">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full border border-gold/25 bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-gold"
            />
          </div>
        </div>

        <ul className="max-h-72 overflow-y-auto divide-y divide-gold/8">
          {filtered.length === 0 ? (
            <li className="p-6 text-center text-sm text-foreground/50">No products found</li>
          ) : (
            filtered.map((p) => {
              const checked = draft.includes(p.id);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-gold/5 transition-colors cursor-pointer"
                  >
                    <span
                      className={`flex h-4 w-4 flex-none items-center justify-center border transition-colors ${
                        checked ? "border-gold bg-gold/20" : "border-foreground/20"
                      }`}
                    >
                      {checked && <Check className="h-2.5 w-2.5 text-gold" />}
                    </span>
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt=""
                        className="h-8 w-7 flex-none object-cover bg-surface-deep"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="font-serif text-sm text-foreground truncate">{p.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 truncate">
                        {p.slug}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex items-center justify-end gap-3 border-t border-gold/15 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="border border-foreground/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground/70 hover:border-gold/40 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(draft)}
            className="border border-gold bg-gold px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-gold/90 transition-colors cursor-pointer"
          >
            Confirm ({draft.length})
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main NavPage ─────────────────────────────────────────────────────────────

export function NavPage() {
  const qc = useQueryClient();

  const { data: nodes = [], isLoading } = useQuery({
    queryKey: ["admin", "nav-nodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nav_nodes")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as NavNode[];
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").order("name");
      return (data ?? []) as ProductRow[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return (data ?? []) as CategoryRow[];
    },
  });

  const [expandedTitles, setExpandedTitles] = useState<Set<string>>(new Set());
  const [expandedSubtitles, setExpandedSubtitles] = useState<Set<string>>(new Set());
  const [pickerForField, setPickerForField] = useState(false);

  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    mode: "add",
    level: 0,
    parentId: null,
    node: null,
  });
  const [form, setForm] = useState<FormState>({
    label: "",
    slug: "",
    active: true,
    category_id: "",
    product_ids: [],
  });

  // ─── Tree structure ──────────────────────────────────────────────────────
  const { titles, childrenOf } = useMemo(() => {
    const sorted = [...nodes].sort((a, b) => a.sort_order - b.sort_order);
    const childrenOf = new Map<string | null, NavNode[]>();
    for (const n of sorted) {
      const key = n.parent_id ?? null;
      if (!childrenOf.has(key)) childrenOf.set(key, []);
      childrenOf.get(key)!.push(n);
    }
    return { titles: childrenOf.get(null) ?? [], childrenOf };
  }, [nodes]);

  // ─── Mutations ───────────────────────────────────────────────────────────
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "nav-nodes"] });
    qc.invalidateQueries({ queryKey: ["nav-tree"] });
  };

  const createNode = useMutation({
    mutationFn: async (input: {
      label: string;
      slug: string;
      active: boolean;
      parent_id: string | null;
      sort_order: number;
      category_id: string | null;
      product_ids: string[];
    }) => {
      const { error } = await supabase.from("nav_nodes").insert(input);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Node created"); closeDialog(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateNode = useMutation({
    mutationFn: async (input: {
      id: string;
      label: string;
      slug: string;
      active: boolean;
      category_id: string | null;
      product_ids: string[];
    }) => {
      const { error } = await supabase
        .from("nav_nodes")
        .update({ label: input.label, slug: input.slug, active: input.active, category_id: input.category_id, product_ids: input.product_ids })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Node updated"); closeDialog(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteNode = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("nav_nodes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Deleted (children removed too)"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: "up" | "down" }) => {
      const node = nodes.find((n) => n.id === id)!;
      const siblings = (childrenOf.get(node.parent_id ?? null) ?? []).sort(
        (a, b) => a.sort_order - b.sort_order,
      );
      const idx = siblings.findIndex((n) => n.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= siblings.length) return;
      const sibling = siblings[swapIdx];
      await supabase
        .from("nav_nodes")
        .update({ sort_order: sibling.sort_order })
        .eq("id", node.id);
      await supabase
        .from("nav_nodes")
        .update({ sort_order: node.sort_order })
        .eq("id", sibling.id);
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  // ─── Dialog helpers ──────────────────────────────────────────────────────
  function openAdd(level: Level, parentId: string | null) {
    setForm({ label: "", slug: "", active: true, category_id: "", product_ids: [] });
    setDialog({ open: true, mode: "add", level, parentId, node: null });
  }

  function openEdit(node: NavNode, level: Level) {
    setForm({
      label: node.label,
      slug: node.slug,
      active: node.active ?? true,
      category_id: node.category_id ?? "",
      product_ids: Array.isArray(node.product_ids) ? (node.product_ids as string[]) : [],
    });
    setDialog({ open: true, mode: "edit", level, parentId: node.parent_id, node });
  }

  function closeDialog() {
    setDialog((d) => ({ ...d, open: false }));
    setPickerForField(false);
  }

  function handleLabelChange(val: string) {
    setForm((f) => ({
      ...f,
      label: val,
      slug: f.slug === autoSlug(f.label) || f.slug === "" ? autoSlug(val) : f.slug,
    }));
  }

  function handleSubmit() {
    if (!form.label.trim() || !form.slug.trim()) {
      toast.error("Label and slug are required");
      return;
    }
    const siblings = childrenOf.get(dialog.parentId ?? null) ?? [];
    const maxOrder = siblings.reduce((m, n) => Math.max(m, n.sort_order), 0);

    if (dialog.mode === "add") {
      createNode.mutate({
        label: form.label.trim(),
        slug: form.slug.trim(),
        active: form.active,
        parent_id: dialog.parentId,
        sort_order: maxOrder + 1,
        category_id: form.category_id || null,
        product_ids: form.product_ids,
      });
    } else if (dialog.node) {
      updateNode.mutate({
        id: dialog.node.id,
        label: form.label.trim(),
        slug: form.slug.trim(),
        active: form.active,
        category_id: form.category_id || null,
        product_ids: form.product_ids,
      });
    }
  }

  function confirmDelete(node: NavNode) {
    const childCount = (childrenOf.get(node.id) ?? []).length;
    const msg = childCount > 0
      ? `Delete "${node.label}" and all its ${childCount} child node(s)?`
      : `Delete "${node.label}"?`;
    if (window.confirm(msg)) deleteNode.mutate(node.id);
  }

  // ─── Row renderer ────────────────────────────────────────────────────────
  function NodeRow({
    node,
    level,
    siblings,
  }: {
    node: NavNode;
    level: Level;
    siblings: NavNode[];
  }) {
    const children = childrenOf.get(node.id) ?? [];
    const isExpandedT = expandedTitles.has(node.id);
    const isExpandedS = expandedSubtitles.has(node.id);
    const isExpanded = level === 0 ? isExpandedT : isExpandedS;
    const toggleExpand = () => {
      if (level === 0)
        setExpandedTitles((s) => {
          const n = new Set(s);
          n.has(node.id) ? n.delete(node.id) : n.add(node.id);
          return n;
        });
      else
        setExpandedSubtitles((s) => {
          const n = new Set(s);
          n.has(node.id) ? n.delete(node.id) : n.add(node.id);
          return n;
        });
    };

    const nodeProductIds: string[] = Array.isArray(node.product_ids)
      ? (node.product_ids as string[])
      : [];
    const idx = siblings.findIndex((n) => n.id === node.id);

    return (
      <>
        <div
          className={`flex items-center gap-2 border-b border-gold/8 py-2.5 px-3 hover:bg-gold/4 transition-colors group ${LEVEL_INDENT[level]}`}
        >
          {/* Expand toggle */}
          {children.length > 0 ? (
            <button
              type="button"
              onClick={toggleExpand}
              className="flex-none text-foreground/40 hover:text-gold transition-colors cursor-pointer"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          ) : (
            <span className="w-3.5 flex-none" />
          )}

          {/* Level indicator dot */}
          <span className={`h-1.5 w-1.5 rounded-full flex-none ${LEVEL_DOT[level]}`} />

          {/* Label + slug */}
          <div className="flex-1 min-w-0">
            <span className="font-serif text-sm text-foreground truncate">{node.label}</span>
            <span className="ml-2 font-mono text-[9px] text-foreground/30">{node.slug}</span>
          </div>

          {/* Badges */}
          <div className="hidden sm:flex items-center gap-1.5 flex-none">
            {node.category_id && (
              <span className="flex items-center gap-1 border border-gold/20 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-gold/70">
                <Tag className="h-2.5 w-2.5" />
                cat
              </span>
            )}
            {nodeProductIds.length > 0 && (
              <span className="flex items-center gap-1 border border-gold/20 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-gold/70">
                <Package className="h-2.5 w-2.5" />
                {nodeProductIds.length}
              </span>
            )}
            {children.length > 0 && (
              <span className="border border-foreground/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-foreground/40">
                {children.length} child{children.length !== 1 ? "ren" : ""}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 flex-none opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Reorder */}
            <button
              type="button"
              onClick={() => reorder.mutate({ id: node.id, direction: "up" })}
              disabled={idx === 0}
              className="p-1 text-foreground/40 hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Move up"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => reorder.mutate({ id: node.id, direction: "down" })}
              disabled={idx === siblings.length - 1}
              className="p-1 text-foreground/40 hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Move down"
            >
              <ArrowDown className="h-3 w-3" />
            </button>

            {/* Add child (not for sub-subtitles) */}
            {level < 2 && (
              <button
                type="button"
                onClick={() => openAdd((level + 1) as Level, node.id)}
                className="p-1 text-foreground/40 hover:text-gold transition-colors cursor-pointer"
                title={`Add ${LEVEL_LABEL[(level + 1) as Level]}`}
              >
                <Plus className="h-3 w-3" />
              </button>
            )}

            {/* Edit */}
            <button
              type="button"
              onClick={() => openEdit(node, level)}
              className="p-1 text-foreground/40 hover:text-gold transition-colors cursor-pointer"
              title="Edit"
            >
              <Pencil className="h-3 w-3" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => confirmDelete(node)}
              className="p-1 text-foreground/40 hover:text-red-400 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Recursive children */}
        {isExpanded && children.length > 0 && (
          <>
            {children.map((child) => (
              <NodeRow
                key={child.id}
                node={child}
                level={(level + 1) as Level}
                siblings={children}
              />
            ))}
            {/* Add child button at the bottom of expanded list */}
            {level < 1 && (
              <div className={LEVEL_INDENT[(level + 1) as Level]}>
                <button
                  type="button"
                  onClick={() => openAdd((level + 1) as Level, node.id)}
                  className="flex w-full items-center gap-2 border-b border-gold/8 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-foreground/35 hover:text-gold hover:bg-gold/4 transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  Add {LEVEL_LABEL[(level + 1) as Level]} under "{node.label}"
                </button>
              </div>
            )}
          </>
        )}
      </>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  if (isLoading) return <div className="p-8 text-sm text-foreground/50">Loading nav tree…</div>;

  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Storefront</p>
          <h1 className="mt-3 font-serif text-4xl italic text-foreground">Navigation</h1>
          <p className="mt-2 text-sm text-foreground/50">
            Build the storefront navbar tree. Changes are live immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openAdd(0, null)}
          className="flex items-center gap-2 border border-gold bg-gold px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] text-ink hover:bg-gold/90 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Title
        </button>
      </header>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-5 border border-gold/10 bg-surface-deep/50 px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-foreground/50">
        {([0, 1, 2] as Level[]).map((l) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${LEVEL_DOT[l]}`} />
            {LEVEL_LABEL[l]}
            <span className="text-foreground/30">
              {l === 0 ? "(top bar)" : l === 1 ? "(dropdown group)" : "(dropdown item)"}
            </span>
          </span>
        ))}
      </div>

      {/* Tree */}
      {titles.length === 0 ? (
        <div className="border border-gold/15 bg-background p-12 text-center">
          <Navigation className="mx-auto h-8 w-8 text-gold/20" strokeWidth={1} />
          <p className="mt-4 font-serif text-xl italic text-foreground/60">No navigation yet</p>
          <p className="mt-2 text-sm text-foreground/40">
            Add a Title to start building the storefront navbar.
          </p>
          <button
            type="button"
            onClick={() => openAdd(0, null)}
            className="mt-6 border border-gold/40 px-6 py-2.5 text-[10px] uppercase tracking-[0.3em] text-gold hover:bg-gold/10 transition-colors cursor-pointer"
          >
            Add first title
          </button>
        </div>
      ) : (
        <div className="border border-gold/15 bg-background">
          {titles.map((title) => (
            <NodeRow key={title.id} node={title} level={0} siblings={titles} />
          ))}
          <button
            type="button"
            onClick={() => openAdd(0, null)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-[10px] uppercase tracking-[0.25em] text-foreground/35 hover:text-gold hover:bg-gold/4 transition-colors cursor-pointer border-t border-gold/10"
          >
            <Plus className="h-3 w-3" />
            Add Title
          </button>
        </div>
      )}

      <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-foreground/30">
        {nodes.length} nodes total · Changes reflect on storefront within 60 s (query cache)
      </p>

      {/* ── Add / Edit Dialog ─────────────────────────────────────────────── */}
      {dialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md border border-gold/20 bg-[#0d0407] shadow-2xl">
            {/* Dialog header */}
            <div className="flex items-center justify-between border-b border-gold/15 px-5 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
                  {dialog.mode === "add" ? "Add" : "Edit"} {LEVEL_LABEL[dialog.level]}
                </p>
                <h3 className="mt-0.5 font-serif text-lg text-foreground">
                  {dialog.mode === "add"
                    ? `New ${LEVEL_LABEL[dialog.level]}`
                    : `Edit "${dialog.node?.label}"`}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                className="text-foreground/50 hover:text-gold transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form body */}
            <div className="space-y-4 px-5 py-5">
              {/* Label */}
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                  Label *
                </label>
                <input
                  value={form.label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="e.g. Produit Cosmétique"
                  className="w-full border border-gold/25 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                  Slug * (URL segment)
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="e.g. produit-cosmetique"
                  className="w-full border border-gold/25 bg-background px-3 py-2.5 font-mono text-xs text-foreground/80 outline-none focus:border-gold"
                />
                <p className="mt-1 text-[10px] text-foreground/40">
                  Auto-generated from label. Must be unique.
                </p>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between border border-gold/15 bg-background/50 p-3">
                <div>
                  <span className="text-xs text-foreground font-medium">Active / Published</span>
                  <p className="text-[10px] text-foreground/40">Inactive nodes are hidden on storefront.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    form.active ? "bg-gold" : "bg-foreground/20"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                      form.active ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Category link */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                  <Tag className="h-3 w-3" />
                  Link Category (optional)
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                  className="w-full border border-gold/25 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
                >
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-foreground/40">
                  All products in this category will appear under this nav node automatically.
                </p>
              </div>

              {/* Product pins */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                    <Package className="h-3 w-3" />
                    Pin Products ({form.product_ids.length} selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPickerForField(true)}
                    className="text-[10px] uppercase tracking-[0.2em] text-gold hover:underline cursor-pointer"
                  >
                    {form.product_ids.length > 0 ? "Edit Selection" : "Pick Products"}
                  </button>
                </div>
                {form.product_ids.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 border border-gold/15 bg-background/50 p-2">
                    {form.product_ids.map((id) => {
                      const p = products.find((x) => x.id === id);
                      return (
                        <span
                          key={id}
                          className="flex items-center gap-1 border border-gold/20 px-2 py-0.5 text-[9px] text-gold/80"
                        >
                          {p?.name ?? id.slice(0, 8)}
                          <button
                            type="button"
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                product_ids: f.product_ids.filter((x) => x !== id),
                              }))
                            }
                            className="text-foreground/40 hover:text-red-400 cursor-pointer"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[10px] text-foreground/40 border border-gold/10 px-3 py-2">
                    No products pinned. Visitors see all products (or category products if linked).
                  </p>
                )}
              </div>
            </div>

            {/* Dialog footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gold/15 px-5 py-4">
              <button
                type="button"
                onClick={closeDialog}
                className="border border-foreground/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground/70 hover:border-gold/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createNode.isPending || updateNode.isPending}
                className="border border-gold bg-gold px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-gold/90 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {dialog.mode === "add" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product picker */}
      {pickerForField && (
        <ProductPicker
          products={products}
          selected={form.product_ids}
          onClose={() => setPickerForField(false)}
          onConfirm={(ids) => {
            setForm((f) => ({ ...f, product_ids: ids }));
            setPickerForField(false);
          }}
        />
      )}
    </div>
  );
}
