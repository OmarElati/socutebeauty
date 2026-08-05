import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import {
  Search, X, Users, ShoppingBag, TrendingUp, Shield, ShieldOff,
  Mail, Calendar, Crown, User as UserIcon, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

type Profile = { id: string; display_name: string | null; created_at: string; updated_at: string };
type UserRole = { id: string; user_id: string; role: "admin" | "customer"; created_at: string };
type Order = { id: string; user_id: string | null; subtotal: number; currency: string; status: string; created_at: string };

function fmt(n: number, currency = "MAD") {
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Customer Detail Panel ────────────────────────────────────────────────────
function CustomerPanel({
  profile, role, orders, onClose, onToggleRole,
}: {
  profile: Profile; role: UserRole | undefined; orders: Order[];
  onClose: () => void; onToggleRole: () => void;
}) {
  const totalSpent = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.subtotal, 0);
  const isAdmin = role?.role === "admin";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-gold/15 bg-[#0d0407] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-5 flex-none">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center border border-gold/25 bg-gold/10 font-serif text-lg text-gold">
              {initials(profile.display_name)}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Customer</p>
              <h2 className="mt-0.5 font-serif text-lg italic text-foreground">{profile.display_name ?? "Anonymous"}</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-foreground/50 hover:text-gold cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gold/10 bg-background/50 p-3 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/50">Total Spent</p>
              <p className="mt-1 font-serif text-xl text-gold">{fmt(totalSpent)}</p>
            </div>
            <div className="border border-gold/10 bg-background/50 p-3 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/50">Orders</p>
              <p className="mt-1 font-serif text-xl text-foreground">{orders.length}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="space-y-2 border border-gold/10 bg-background/50 p-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-3.5 w-3.5 text-foreground/40" />
              <span className="text-foreground/50">Joined</span>
              <span className="ml-auto text-foreground/70">{format(parseISO(profile.created_at), "dd MMM yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Crown className="h-3.5 w-3.5 text-foreground/40" />
              <span className="text-foreground/50">Role</span>
              <span className={`ml-auto font-medium capitalize ${isAdmin ? "text-gold" : "text-foreground/60"}`}>
                {role?.role ?? "customer"}
              </span>
            </div>
          </div>

          {/* Role toggle */}
          <div className="border border-gold/10 bg-background/30 p-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-foreground/50">Access Control</p>
            <button type="button" onClick={onToggleRole}
              className={`flex w-full items-center gap-2 border px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] transition-colors cursor-pointer ${
                isAdmin
                  ? "border-red-500/30 text-red-400 hover:bg-red-900/20"
                  : "border-gold/30 text-gold hover:bg-gold/10"
              }`}>
              {isAdmin ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
              {isAdmin ? "Revoke Admin Access" : "Grant Admin Access"}
            </button>
          </div>

          {/* Orders */}
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-foreground/50">Order History ({orders.length})</p>
            {orders.length === 0 ? (
              <p className="text-xs text-foreground/40">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between border border-gold/8 bg-background/30 px-3 py-2.5">
                    <div>
                      <p className="font-mono text-[10px] text-foreground/40">#{o.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-[10px] text-foreground/50">{format(parseISO(o.created_at), "dd MMM yyyy")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-sm text-gold">{fmt(o.subtotal, o.currency)}</p>
                      <p className="text-[9px] capitalize text-foreground/40">{o.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function CustomersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Profile | null>(null);

  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return (data ?? []) as Profile[];
    },
  });

  const { data: roles = [] } = useQuery<UserRole[]>({
    queryKey: ["admin", "user-roles"],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("*");
      return (data ?? []) as UserRole[];
    },
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("id, user_id, subtotal, currency, status, created_at");
      return (data ?? []) as Order[];
    },
  });

  const toggleRole = useMutation({
    mutationFn: async ({ profile, currentRole }: { profile: Profile; currentRole: UserRole | undefined }) => {
      if (currentRole) {
        const newRole = currentRole.role === "admin" ? "customer" : "admin";
        const { error } = await supabase.from("user_roles").update({ role: newRole }).eq("id", currentRole.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: profile.id, role: "admin" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "user-roles"] });
      toast.success("Role updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return profiles;
    return profiles.filter((p) =>
      (p.display_name ?? "").toLowerCase().includes(needle) ||
      p.id.toLowerCase().includes(needle),
    );
  }, [profiles, q]);

  const roleMap = useMemo(() => new Map(roles.map((r) => [r.user_id, r])), [roles]);
  const ordersByUser = useMemo(() => {
    const map = new Map<string, Order[]>();
    for (const o of orders) {
      if (!o.user_id) continue;
      if (!map.has(o.user_id)) map.set(o.user_id, []);
      map.get(o.user_id)!.push(o);
    }
    return map;
  }, [orders]);

  const selectedRole = selected ? roleMap.get(selected.id) : undefined;
  const selectedOrders = selected ? (ordersByUser.get(selected.id) ?? []) : [];

  if (isLoading) return <div className="p-8 text-sm text-foreground/50">Loading customers…</div>;

  return (
    <div>
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Community</p>
          <h1 className="mt-3 font-serif text-4xl italic text-foreground">Customers</h1>
          <p className="mt-1 text-sm text-foreground/40">
            {profiles.length} accounts · {roles.filter(r => r.role === "admin").length} admins
          </p>
        </div>
      </header>

      <div className="mb-5">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or ID…"
            className="w-full border border-gold/25 bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-gold" />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const role = roleMap.get(p.id);
          const userOrders = ordersByUser.get(p.id) ?? [];
          const spent = userOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.subtotal, 0);
          const isAdmin = role?.role === "admin";
          return (
            <button key={p.id} type="button" onClick={() => setSelected(p)}
              className="group border border-gold/10 bg-background p-4 text-left hover:border-gold/30 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center border font-serif text-sm flex-none ${isAdmin ? "border-gold/40 bg-gold/10 text-gold" : "border-foreground/15 bg-surface-deep/50 text-foreground/60"}`}>
                  {initials(p.display_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-sm text-foreground truncate">{p.display_name ?? "Anonymous"}</span>
                    {isAdmin && <Crown className="h-2.5 w-2.5 text-gold flex-none" />}
                  </div>
                  <div className="text-[10px] text-foreground/40">{format(parseISO(p.created_at), "dd MMM yyyy")}</div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-foreground/20 group-hover:text-gold transition-colors flex-none" />
              </div>
              <div className="mt-3 flex gap-4 border-t border-gold/8 pt-3">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/40">Orders</p>
                  <p className="font-serif text-sm text-foreground">{userOrders.length}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/40">Spent</p>
                  <p className="font-serif text-sm text-gold">{spent > 0 ? fmt(spent) : "—"}</p>
                </div>
                <div className="ml-auto">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/40">Role</p>
                  <p className={`text-xs capitalize ${isAdmin ? "text-gold" : "text-foreground/50"}`}>{role?.role ?? "customer"}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <CustomerPanel
          profile={selected}
          role={selectedRole}
          orders={selectedOrders}
          onClose={() => setSelected(null)}
          onToggleRole={() => toggleRole.mutate({ profile: selected, currentRole: selectedRole })}
        />
      )}
    </div>
  );
}
