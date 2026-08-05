import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  TrendingUp, ShoppingBag, Package, Users, Star, Navigation,
  AlertTriangle, Clock, CheckCircle2, Truck, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type Order = { id: string; subtotal: number; currency: string; status: string; created_at: string };
type Product = { id: string; name: string; active: boolean; featured: boolean; price: number; image_url?: string | null };
type Profile = { id: string };
type NavNode = { id: string; label: string; parent_id: string | null };

const GOLD = "#C9A24B";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(n);
}

function KpiCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string | number; sub?: string;
  icon: typeof TrendingUp; accent?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden border p-5 ${accent ? "border-gold/30 bg-gold/5" : "border-gold/15 bg-background"}`}>
      <div className="absolute right-3 top-3 opacity-8">
        <Icon className="h-10 w-10 text-gold" strokeWidth={1} />
      </div>
      <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{label}</p>
      <p className={`mt-2 font-serif text-3xl ${accent ? "text-gold" : "text-foreground"}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-foreground/40">{sub}</p>}
    </div>
  );
}

export function OverviewPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("id, subtotal, currency, status, created_at").order("created_at", { ascending: false });
      return (data ?? []) as Order[];
    },
    refetchInterval: 60_000,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id, name, active, featured, price, image_url");
      return (data ?? []) as Product[];
    },
  });

  const { data: profileCount = 0 } = useQuery<number>({
    queryKey: ["admin", "profile-count"],
    queryFn: async () => {
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: navCount = 0 } = useQuery<number>({
    queryKey: ["admin", "nav-count"],
    queryFn: async () => {
      const { count } = await supabase.from("nav_nodes").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const qc = useQueryClient();
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "orders"] }); toast.success("Status updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const totalRevenue = useMemo(
    () => orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.subtotal, 0),
    [orders],
  );
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const activeProducts = products.filter(p => p.active).length;

  // Weekly revenue (last 7 days)
  const weeklyData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return { date: d.toLocaleDateString("fr-FR", { weekday: "short" }), revenue: 0, count: 0, _d: d };
    });
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      const od = parseISO(o.created_at);
      const day = days.find(d => d._d.toDateString() === od.toDateString());
      if (day) { day.revenue += o.subtotal; day.count += 1; }
    }
    return days.map(({ _d, ...rest }) => rest);
  }, [orders]);

  const recentOrders = orders.slice(0, 8);
  const STATUS_NEXT: Record<string, string | null> = {
    pending: "confirmed", confirmed: "shipped", shipped: "delivered", delivered: null, cancelled: null,
  };
  const STATUS_COLOR: Record<string, string> = {
    pending: "#F59E0B", confirmed: "#3B82F6", shipped: "#8B5CF6",
    delivered: "#10B981", cancelled: "#EF4444",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Welcome back</p>
        <h1 className="mt-3 font-serif text-4xl italic text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-foreground/40">{new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </header>

      {/* Alert: pending orders */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 border border-amber-400/25 bg-amber-400/5 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 flex-none" />
          <p className="text-sm text-amber-300">
            <strong>{pendingCount}</strong> order{pendingCount !== 1 ? "s" : ""} waiting for confirmation
          </p>
          <button type="button" onClick={() => onNavigate("orders")}
            className="ml-auto flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-amber-400 hover:underline cursor-pointer">
            Review <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={fmt(totalRevenue)} sub={`${orders.filter(o => o.status !== "cancelled").length} completed`} icon={TrendingUp} accent />
        <KpiCard label="All Orders" value={orders.length} sub={`${pendingCount} pending`} icon={ShoppingBag} />
        <KpiCard label="Active Products" value={activeProducts} sub={`${products.filter(p => p.featured).length} featured`} icon={Package} />
        <KpiCard label="Customers" value={profileCount} sub={`${navCount} nav nodes`} icon={Users} />
      </div>

      {/* Revenue Chart */}
      <div className="border border-gold/15 bg-background p-6">
        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-foreground/50">Revenue — Last 7 Days</p>
        <p className="mb-4 font-serif text-2xl italic text-foreground">
          {fmt(weeklyData.reduce((s, d) => s + d.revenue, 0))}
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData} margin={{ top: 4, right: 0, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,75,0.08)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "rgba(251,247,244,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(251,247,244,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => v > 0 ? `${(v/1000).toFixed(0)}k` : "0"} />
            <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
              <div className="border border-gold/20 bg-[#1a0810] px-3 py-2 text-xs">
                <p className="text-foreground/60">{label}</p>
                <p className="font-serif text-gold">{fmt(payload[0].value as number)}</p>
                <p className="text-foreground/40">{(payload[0].payload as any).count} orders</p>
              </div>
            ) : null} />
            <Bar dataKey="revenue" fill={GOLD} opacity={0.75} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { id: "products", label: "Add Product", icon: Package, sub: `${activeProducts} active` },
          { id: "orders", label: "View Orders", icon: ShoppingBag, sub: `${pendingCount} pending` },
          { id: "customers", label: "Customers", icon: Users, sub: `${profileCount} total` },
          { id: "navigation", label: "Edit Nav", icon: Navigation, sub: `${navCount} nodes` },
        ].map((a) => (
          <button key={a.id} type="button" onClick={() => onNavigate(a.id)}
            className="group border border-gold/15 bg-background p-4 text-left hover:border-gold/35 hover:bg-gold/4 transition-all cursor-pointer">
            <a.icon className="mb-2 h-4 w-4 text-gold/50 group-hover:text-gold transition-colors" strokeWidth={1.5} />
            <p className="font-serif text-sm text-foreground">{a.label}</p>
            <p className="text-[10px] text-foreground/40">{a.sub}</p>
          </button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="border border-gold/15 bg-background">
        <div className="flex items-center justify-between border-b border-gold/10 px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Recent Orders</p>
          <button type="button" onClick={() => onNavigate("orders")}
            className="flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-gold/70 hover:text-gold cursor-pointer">
            All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-8 text-sm text-center text-foreground/40">No orders yet</p>
        ) : recentOrders.map((o) => {
          const next = STATUS_NEXT[o.status];
          return (
            <div key={o.id} className="flex items-center gap-4 border-b border-gold/8 px-5 py-3 last:border-0">
              <span className="h-2 w-2 rounded-full flex-none" style={{ background: STATUS_COLOR[o.status] ?? GOLD }} />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] text-foreground/40">#{o.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-[10px] text-foreground/50 capitalize">{o.status} · {format(parseISO(o.created_at), "dd MMM HH:mm")}</p>
              </div>
              <p className="font-serif text-sm text-gold flex-none">{fmt(o.subtotal)}</p>
              {next && (
                <button type="button" onClick={() => updateStatus.mutate({ id: o.id, status: next })}
                  className="flex-none border border-gold/25 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-foreground/60 hover:border-gold hover:text-gold transition-all cursor-pointer">
                  → {next}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Featured Products */}
      {products.filter(p => p.featured).length > 0 && (
        <div className="border border-gold/15 bg-background p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Featured Products</p>
            <button type="button" onClick={() => onNavigate("products")}
              className="text-[10px] uppercase tracking-[0.25em] text-gold/70 hover:text-gold cursor-pointer flex items-center gap-1">
              Manage <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {products.filter(p => p.featured).slice(0, 4).map((p) => (
              <div key={p.id} className="relative">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="aspect-[3/4] w-full object-cover bg-surface-deep" />
                ) : (
                  <div className="aspect-[3/4] w-full flex items-center justify-center bg-surface-deep">
                    <Package className="h-6 w-6 text-foreground/15" />
                  </div>
                )}
                <div className="absolute top-1.5 left-1.5">
                  <Star className="h-3 w-3 text-gold fill-gold" />
                </div>
                <p className="mt-1.5 font-serif text-xs text-foreground truncate">{p.name}</p>
                <p className="text-[10px] text-gold">{fmt(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
