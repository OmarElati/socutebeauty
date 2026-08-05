import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { format, subDays, parseISO, startOfDay } from "date-fns";
import {
  TrendingUp, ShoppingBag, Package, Users, ArrowRight,
  Clock, CheckCircle2, Truck, Star, AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Order = {
  id: string; full_name: string; email: string; subtotal: number;
  currency: string; status: string; items: unknown; created_at: string;
};
type Product = { id: string; name: string; active: boolean; featured: boolean; image_url?: string | null; price: number };

const STATUS_COLOR: Record<string, string> = {
  pending: "#F59E0B", confirmed: "#3B82F6", shipped: "#8B5CF6",
  delivered: "#10B981", cancelled: "#EF4444",
};
const STATUS_ICON: Record<string, typeof Clock> = {
  pending: Clock, confirmed: CheckCircle2, shipped: Truck,
  delivered: CheckCircle2, cancelled: AlertCircle,
};
const GOLD = "#C9A24B";

function fmt(n: number, currency = "MAD") {
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, trend }: {
  label: string; value: string; sub?: string;
  icon: typeof TrendingUp; trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="relative border border-gold/15 bg-background p-5 overflow-hidden">
      <div className="absolute right-4 top-4 opacity-10">
        <Icon className="h-12 w-12 text-gold" strokeWidth={1} />
      </div>
      <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{label}</p>
      <p className="mt-2 font-serif text-3xl text-foreground">{value}</p>
      {sub && <p className="mt-1 text-xs text-foreground/40">{sub}</p>}
      {trend === "up" && <span className="mt-2 inline-block text-[10px] text-emerald-400">↑ Live</span>}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-gold/20 bg-[#1a0810] px-3 py-2 text-xs">
      <p className="text-foreground/60 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-serif">
          {typeof p.value === "number" ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function AnalyticsPage() {
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return (data ?? []) as Order[];
    },
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id, name, active, featured, image_url, price");
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

  // ── Derived metrics ──────────────────────────────────────────────────────
  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.subtotal, 0),
    [orders],
  );
  const activeProducts = products.filter((p) => p.active).length;

  // 30-day daily revenue
  const revenueByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      map.set(format(subDays(new Date(), i), "MMM dd"), 0);
    }
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      const day = format(parseISO(o.created_at), "MMM dd");
      if (map.has(day)) map.set(day, (map.get(day) ?? 0) + o.subtotal);
    }
    return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }));
  }, [orders]);

  // Orders by status
  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders) map[o.status] = (map[o.status] ?? 0) + 1;
    return Object.entries(map).map(([status, count]) => ({ status, count, fill: STATUS_COLOR[status] ?? GOLD }));
  }, [orders]);

  // Top products by frequency in orders
  const topProducts = useMemo(() => {
    const freq: Record<string, { name: string; count: number; revenue: number }> = {};
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      const items = Array.isArray(o.items) ? o.items : [];
      for (const item of items) {
        const t = item as { productId?: string; name?: string; price?: number; quantity?: number };
        const key = t.productId ?? t.name ?? "unknown";
        if (!freq[key]) freq[key] = { name: t.name ?? key, count: 0, revenue: 0 };
        freq[key].count += t.quantity ?? 1;
        freq[key].revenue += (t.price ?? 0) * (t.quantity ?? 1);
      }
    }
    return Object.values(freq).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [orders]);

  // Orders per day (last 14 days)
  const ordersPerDay = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      map.set(format(subDays(new Date(), i), "MMM dd"), 0);
    }
    for (const o of orders) {
      const day = format(parseISO(o.created_at), "MMM dd");
      if (map.has(day)) map.set(day, (map.get(day) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
  }, [orders]);

  // Recent orders last 5
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Insights</p>
        <h1 className="mt-3 font-serif text-4xl italic text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-foreground/40">Live data from your Supabase database</p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={fmt(totalRevenue)} sub={`${orders.filter(o => o.status !== "cancelled").length} orders`} icon={TrendingUp} trend="up" />
        <KpiCard label="All Orders" value={String(orders.length)} sub={`${orders.filter(o => o.status === "pending").length} pending`} icon={ShoppingBag} />
        <KpiCard label="Active Products" value={String(activeProducts)} sub={`${products.filter(p => p.featured).length} featured`} icon={Package} />
        <KpiCard label="Customers" value={String(profileCount)} sub="registered accounts" icon={Users} />
      </div>

      {/* Revenue Chart */}
      <div className="border border-gold/15 bg-background p-6">
        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-foreground/50">Revenue — Last 30 Days</p>
        <p className="mb-5 font-serif text-2xl italic text-foreground">{fmt(totalRevenue)}</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueByDay} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GOLD} stopOpacity={0.25} />
                <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,75,0.08)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "rgba(251,247,244,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: "rgba(251,247,244,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={1.5} fill="url(#goldGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Status + Orders/Day */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Status Donut */}
        <div className="border border-gold/15 bg-background p-6">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-foreground/50">Orders by Status</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={statusData} dataKey="count" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip content={({ active, payload }) => active && payload?.length ? (
                  <div className="border border-gold/20 bg-[#1a0810] px-2 py-1 text-xs capitalize text-foreground/80">
                    {(payload[0].payload as any).status}: {payload[0].value}
                  </div>
                ) : null} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {statusData.map((s) => {
                const Icon = STATUS_ICON[s.status] ?? Clock;
                return (
                  <div key={s.status} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full flex-none" style={{ background: s.fill }} />
                    <Icon className="h-3 w-3" style={{ color: s.fill }} />
                    <span className="capitalize text-xs text-foreground/70">{s.status}</span>
                    <span className="ml-auto font-serif text-sm text-foreground">{s.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders/Day Bar */}
        <div className="border border-gold/15 bg-background p-6">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-foreground/50">Orders — Last 14 Days</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={ordersPerDay} margin={{ top: 4, right: 0, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,75,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "rgba(251,247,244,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: "rgba(251,247,244,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                <div className="border border-gold/20 bg-[#1a0810] px-2 py-1 text-xs text-foreground/80">
                  {label}: <span className="font-serif text-gold">{payload[0].value} orders</span>
                </div>
              ) : null} />
              <Bar dataKey="count" fill={GOLD} opacity={0.7} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="border border-gold/15 bg-background p-6">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-foreground/50">Top Selling Products</p>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="w-5 flex-none font-serif text-sm text-gold/50">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{p.name}</div>
                  <div className="h-1.5 mt-1 bg-gold/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold/60 rounded-full transition-all"
                      style={{ width: `${Math.round((p.count / (topProducts[0]?.count || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-right flex-none">
                  <div className="font-serif text-sm text-gold">{fmt(p.revenue)}</div>
                  <div className="text-[10px] text-foreground/40">{p.count} units</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="border border-gold/15 bg-background">
        <div className="flex items-center justify-between border-b border-gold/10 px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Recent Orders</p>
        </div>
        {recentOrders.map((o) => {
          const Icon = STATUS_ICON[o.status] ?? Clock;
          return (
            <div key={o.id} className="flex items-center gap-4 border-b border-gold/8 px-5 py-3 last:border-0 hover:bg-gold/3 transition-colors">
              <Icon className="h-3.5 w-3.5 flex-none" style={{ color: STATUS_COLOR[o.status] ?? GOLD }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground truncate">{o.full_name}</div>
                <div className="text-[10px] text-foreground/40 truncate">{o.email}</div>
              </div>
              <div className="text-right flex-none">
                <div className="font-serif text-sm text-gold">{fmt(o.subtotal, o.currency)}</div>
                <div className="text-[10px] capitalize text-foreground/40">{o.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
