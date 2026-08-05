import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import {
  Search, ChevronRight, X, Package, Clock, CheckCircle2,
  Truck, AlertCircle, Printer, Hash, Mail, User, StickyNote,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderItem = { productId?: string; name?: string; slug?: string; price?: number; quantity?: number; size?: string | number };
type Order = {
  id: string; full_name: string; email: string; subtotal: number;
  currency: string; status: string; items: unknown; notes: string | null;
  user_id: string | null; created_at: string;
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
type Status = typeof STATUSES[number];

const STATUS_META: Record<Status, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending:   { label: "Pending",   color: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/30",   icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-400",    bg: "bg-blue-400/10 border-blue-400/30",     icon: CheckCircle2 },
  shipped:   { label: "Shipped",   color: "text-violet-400",  bg: "bg-violet-400/10 border-violet-400/30", icon: Truck },
  delivered: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30",icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400",     bg: "bg-red-400/10 border-red-400/30",       icon: AlertCircle },
};

function fmt(n: number, currency = "MAD") {
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as Status] ?? { label: status, color: "text-foreground/60", bg: "bg-foreground/10 border-foreground/20", icon: Clock };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 border px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] ${meta.color} ${meta.bg}`}>
      <Icon className="h-2.5 w-2.5" />
      {meta.label}
    </span>
  );
}

// ─── Order Detail Panel ───────────────────────────────────────────────────────
function OrderPanel({ order, onClose }: { order: Order; onClose: () => void }) {
  const qc = useQueryClient();
  const items: OrderItem[] = Array.isArray(order.items) ? (order.items as OrderItem[]) : [];

  const updateStatus = useMutation({
    mutationFn: async (status: Status) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
      if (error) throw error;
    },
    onSuccess: (_, status) => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success(`Status → ${status}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const nextStatus: Record<Status, Status | null> = {
    pending: "confirmed", confirmed: "shipped", shipped: "delivered", delivered: null, cancelled: null,
  };
  const next = nextStatus[order.status as Status];
  const meta = STATUS_META[order.status as Status];
  const Icon = meta?.icon ?? Clock;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-xl flex-col border-l border-gold/15 bg-[#0d0407] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gold/15 px-6 py-5 flex-none">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Order Detail</p>
            <h2 className="mt-1 font-serif text-xl italic text-foreground flex items-center gap-2">
              {order.full_name}
            </h2>
            <p className="mt-0.5 font-mono text-[10px] text-foreground/30">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <button type="button" onClick={onClose} className="text-foreground/50 hover:text-gold transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status Pipeline */}
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-foreground/50">Status Pipeline</p>
            <div className="flex items-center gap-1 flex-wrap">
              {STATUSES.filter(s => s !== "cancelled").map((s, i, arr) => {
                const m = STATUS_META[s];
                const isActive = order.status === s;
                const isPast = STATUSES.indexOf(order.status as Status) > i && order.status !== "cancelled";
                return (
                  <div key={s} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateStatus.mutate(s)}
                      className={`px-2.5 py-1.5 text-[9px] uppercase tracking-[0.2em] border transition-all cursor-pointer ${
                        isActive ? `${m.bg} ${m.color} font-medium` :
                        isPast ? "border-gold/20 text-gold/40" :
                        "border-foreground/10 text-foreground/30 hover:border-gold/30 hover:text-foreground/60"
                      }`}
                    >
                      {m.label}
                    </button>
                    {i < arr.length - 1 && <ArrowRight className="h-2.5 w-2.5 text-foreground/20 flex-none" />}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => updateStatus.mutate("cancelled")}
                className={`ml-1 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.2em] border transition-all cursor-pointer ${
                  order.status === "cancelled"
                    ? "border-red-400/30 bg-red-400/10 text-red-400"
                    : "border-foreground/10 text-foreground/30 hover:border-red-400/30 hover:text-red-400"
                }`}
              >
                Cancel
              </button>
            </div>
            {next && (
              <button
                type="button"
                onClick={() => updateStatus.mutate(next)}
                disabled={updateStatus.isPending}
                className="mt-3 flex items-center gap-2 border border-gold bg-gold px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-gold/90 disabled:opacity-50 cursor-pointer"
              >
                <Icon className="h-3 w-3" />
                Advance → {STATUS_META[next].label}
              </button>
            )}
          </div>

          {/* Customer Info */}
          <div className="border border-gold/10 bg-background/50 p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-3">Customer</p>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-3.5 w-3.5 text-foreground/40 flex-none" />
              <span className="text-foreground">{order.full_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 text-foreground/40 flex-none" />
              <span className="text-foreground/70">{order.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-foreground/40 flex-none" />
              <span className="text-foreground/50">{format(parseISO(order.created_at), "dd MMM yyyy, HH:mm")}</span>
            </div>
            {order.notes && (
              <div className="flex items-start gap-2 text-sm pt-1">
                <StickyNote className="h-3.5 w-3.5 text-foreground/40 flex-none mt-0.5" />
                <span className="text-foreground/60 italic">{order.notes}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-foreground/50">
              Items ({items.length})
            </p>
            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="text-xs text-foreground/40">No item details available</p>
              ) : items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 border border-gold/8 bg-background/30 p-3">
                  <div className="flex h-10 w-8 items-center justify-center bg-surface-deep flex-none">
                    <Package className="h-4 w-4 text-foreground/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground truncate">{item.name ?? item.productId ?? "—"}</div>
                    {item.size && <div className="text-[10px] text-foreground/40">{item.size} ml</div>}
                  </div>
                  <div className="text-right flex-none">
                    <div className="font-serif text-sm text-gold">{fmt((item.price ?? 0) * (item.quantity ?? 1), order.currency)}</div>
                    <div className="text-[10px] text-foreground/40">× {item.quantity ?? 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border border-gold/15 bg-background p-4">
            <div className="flex justify-between text-sm text-foreground/60">
              <span>Subtotal</span>
              <span className="font-serif text-foreground">{fmt(order.subtotal, order.currency)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-gold/10 pt-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Total</span>
              <span className="font-serif text-lg text-gold">{fmt(order.subtotal, order.currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function OrdersPage() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Order[];
    },
    refetchInterval: 30_000, // Live refresh every 30s
  });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!needle) return true;
      return o.full_name.toLowerCase().includes(needle) ||
        o.email.toLowerCase().includes(needle) ||
        o.id.toLowerCase().includes(needle);
    });
  }, [orders, q, statusFilter]);

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.subtotal, 0);

  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Commerce</p>
          <h1 className="mt-3 font-serif text-4xl italic text-foreground">Orders</h1>
          <p className="mt-1 text-sm text-foreground/40">
            {orders.length} total · {fmt(totalRevenue)} revenue
          </p>
        </div>
        {/* Status pill counts */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          {STATUSES.map((s) => {
            const count = orders.filter(o => o.status === s).length;
            const m = STATUS_META[s];
            return count > 0 ? (
              <button key={s} type="button" onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                className={`flex items-center gap-1 border px-2 py-1 text-[9px] uppercase tracking-[0.2em] cursor-pointer transition-all ${statusFilter === s ? `${m.bg} ${m.color}` : "border-gold/10 text-foreground/40 hover:border-gold/25"}`}>
                {count} {m.label}
              </button>
            ) : null;
          })}
        </div>
      </header>

      {/* Filters */}
      <div className="mb-5 flex gap-3">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, order ID…"
            className="w-full border border-gold/25 bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-gold" />
        </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
          className="border border-gold/25 bg-background px-3 py-2.5 text-[11px] uppercase tracking-[0.2em] text-foreground outline-none focus:border-gold">
          <option value="all">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 border border-gold/8 bg-background animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-gold/15 p-12 text-center">
          <p className="font-serif text-xl italic text-foreground/40">No orders match</p>
        </div>
      ) : (
        <div className="border border-gold/15 bg-background overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="border-b border-gold/15 text-[10px] uppercase tracking-[0.3em] text-foreground/50">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-gold/8 last:border-0 hover:bg-gold/3 transition-colors cursor-pointer" onClick={() => setSelected(o)}>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] text-foreground/40">#{o.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-serif text-sm text-foreground">{o.full_name}</div>
                    <div className="text-[10px] text-foreground/40">{o.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/50">
                    {format(parseISO(o.created_at), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-serif text-gold">
                    {fmt(o.subtotal, o.currency)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-foreground/30" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <OrderPanel order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
