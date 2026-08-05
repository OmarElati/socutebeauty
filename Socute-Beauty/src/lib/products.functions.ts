import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { NEW_MOCK_PRODUCTS, NEW_MOCK_CATEGORIES } from "@/lib/new-products-data";

const MOCK_CATEGORIES = NEW_MOCK_CATEGORIES;
const MOCK_PRODUCTS = NEW_MOCK_PRODUCTS;

function serverPublicClient(authHeader?: string) {
  const url = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || "placeholder-key";
  const headers: Record<string, string> = {};
  if (authHeader && authHeader.startsWith("Bearer ")) {
    headers["Authorization"] = authHeader;
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      headers,
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listActiveProducts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = serverPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories!category_id(name, slug)")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // Fall back to local mock products
  }
  return NEW_MOCK_PRODUCTS;
});

export const listActiveCategories = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = serverPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // Fall back to local mock categories
  }
  return MOCK_CATEGORIES;
});

export const getActiveProductBySlug = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    try {
      const supabase = serverPublicClient();
      const { data: row, error } = await supabase
        .from("products")
        .select("*, categories!category_id(name, slug)")
        .eq("slug", data.slug)
        .maybeSingle();
      if (!error && row) {
        return row;
      }
    } catch {
      // Fall back
    }
    return NEW_MOCK_PRODUCTS.find((p) => p.slug === data.slug) ?? NEW_MOCK_PRODUCTS[0];
  });

const orderItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  subtitle: z.string().optional(),
  ml: z.number().int().positive(),
  price: z.number().nonnegative(),
  qty: z.number().int().positive(),
  image: z.string().optional(),
});

const createOrderSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  user_id: z.string().uuid().nullable().optional(),
  notes: z.string().max(500).optional(),
  items: z.array(orderItemSchema).min(1),
});

export const createOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) => createOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const subtotal = data.items.reduce((s, i) => s + i.price * i.qty, 0);
    if (!process.env.SUPABASE_URL) {
      return { id: "order-" + Date.now(), subtotal };
    }
    try {
      const req = getRequest();
      const authHeader = req?.headers?.get("authorization") || undefined;
      const supabase = serverPublicClient(authHeader);
      const targetUserId = authHeader ? (data.user_id ?? null) : null;

      const { data: row, error } = await supabase
        .from("orders")
        .insert({
          user_id: targetUserId,
          email: data.email,
          full_name: data.full_name,
          subtotal,
          currency: "USD",
          status: "pending",
          items: data.items,
          notes: data.notes ?? null,
        })
        .select("id")
        .single();
      if (error || !row) return { id: "order-" + Date.now(), subtotal };
      return { id: row.id, subtotal };
    } catch {
      return { id: "order-" + Date.now(), subtotal };
    }
  });
