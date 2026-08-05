import { queryOptions } from "@tanstack/react-query";
import {
  listActiveProducts,
  listActiveCategories,
  getActiveProductBySlug,
} from "@/lib/products.functions";
import {
  adminListProducts,
  adminListCategories,
  adminListOrders,
  getMe,
} from "@/lib/admin.functions";

export const productsQuery = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: () => listActiveProducts(),
    staleTime: 60_000,
  });

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: () => listActiveCategories(),
    staleTime: 60_000,
  });

export const productBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getActiveProductBySlug({ data: { slug } }),
    staleTime: 60_000,
  });

export const meQuery = () =>
  queryOptions({
    queryKey: ["me"],
    queryFn: () => getMe(),
    staleTime: 30_000,
    retry: false,
  });

export const adminProductsQuery = () =>
  queryOptions({
    queryKey: ["admin", "products"],
    queryFn: () => adminListProducts(),
  });

export const adminCategoriesQuery = () =>
  queryOptions({
    queryKey: ["admin", "categories"],
    queryFn: () => adminListCategories(),
  });

export const adminOrdersQuery = () =>
  queryOptions({
    queryKey: ["admin", "orders"],
    queryFn: () => adminListOrders(),
  });
