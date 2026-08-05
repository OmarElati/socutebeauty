import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, Pencil } from "lucide-react";

type CategoryRow = { id: string; name: string; slug: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CategoriesPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const qc = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (input: { id?: string; name: string; slug: string }) => {
      const { id, ...rest } = input;
      if (id) {
        const { error } = await supabase.from("categories").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      resetForm();
      toast(editing ? "Category updated" : "Category added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast("Category removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function resetForm() {
    setEditing(null);
    setName("");
    setSlug("");
    setSlugTouched(false);
  }

  function startEdit(c: CategoryRow) {
    setEditing(c);
    setName(c.name);
    setSlug(c.slug);
    setSlugTouched(true);
  }

  if (isLoading) {
    return <div className="p-8 text-sm text-foreground/50">Loading categories…</div>;
  }

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Taxonomy & Navigation</p>
        <h1 className="mt-3 font-serif text-4xl italic text-foreground">Categories & Collections</h1>
        <p className="mt-2 text-sm text-foreground/50">
          Manage product categories. Categories automatically populate the storefront top navigation dropdown.
        </p>
      </header>

      {/* Quick Category Presets */}
      <div className="mb-6 border border-gold/15 bg-background p-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold">Quick Presets</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { name: "Amber", slug: "amber" },
            { name: "Leather", slug: "leather" },
            { name: "Floral", slug: "floral" },
            { name: "Musk", slug: "musk" },
            { name: "Green", slug: "green" },
            { name: "Gourmand", slug: "gourmand" },
          ].map((preset) => {
            const exists = (categories as CategoryRow[]).some((c) => c.slug === preset.slug);
            return (
              <button
                key={preset.slug}
                type="button"
                disabled={exists || save.isPending}
                onClick={() => save.mutate({ name: preset.name, slug: preset.slug })}
                className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer ${
                  exists
                    ? "border-foreground/10 text-foreground/30 cursor-not-allowed"
                    : "border-gold/30 text-gold hover:bg-gold/10"
                }`}
              >
                + {preset.name} {exists ? "(Added)" : ""}
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const nextName = name.trim();
          const nextSlug = slug.trim().toLowerCase();
          if (!nextName || !nextSlug) return;
          save.mutate({
            ...(editing ? { id: editing.id } : {}),
            name: nextName,
            slug: nextSlug,
          });
        }}
        className="mb-8 border border-gold/15 bg-background p-5"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg text-foreground">
            {editing ? "Edit category" : "New custom category"}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 hover:text-gold cursor-pointer"
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => {
              const v = e.target.value;
              setName(v);
              if (!slugTouched) setSlug(slugify(v));
            }}
            placeholder="Name (e.g. Skin Care)"
            className="flex-1 border border-gold/25 bg-transparent px-3 py-2.5 text-foreground outline-none focus:border-gold"
            required
          />
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="slug (e.g. skin-care)"
            className="flex-1 border border-gold/25 bg-transparent px-3 py-2.5 text-foreground outline-none focus:border-gold"
            required
          />
          <button
            type="submit"
            disabled={save.isPending}
            className="flex items-center justify-center gap-2 bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] text-ink hover:bg-gold-soft disabled:opacity-70 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            {editing ? "Update" : "Add Category"}
          </button>
        </div>
      </form>

      <div className="border border-gold/15 bg-background">
        {(categories as CategoryRow[]).length === 0 ? (
          <p className="p-8 text-sm text-foreground/50">No categories yet. Use the presets above or create a new one.</p>
        ) : (
          <ul className="divide-y divide-gold/10">
            {(categories as CategoryRow[]).map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-foreground text-base">{c.name}</span>
                    <a
                      href={`http://localhost:8080/collections/${c.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9px] uppercase tracking-[0.2em] text-gold hover:underline"
                    >
                      Preview on storefront ↗
                    </a>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                    /collections/{c.slug}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(c)}
                    className="p-2 text-foreground/60 hover:text-gold cursor-pointer"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete ${c.name}?`)) del.mutate(c.id);
                    }}
                    className="p-2 text-foreground/60 hover:text-destructive cursor-pointer"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
