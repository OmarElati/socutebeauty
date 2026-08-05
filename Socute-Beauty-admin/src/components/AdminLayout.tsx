import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Monogram } from "./monogram";
import {
  LayoutGrid, Package, Tag, ShoppingBag, Users, Navigation,
  BarChart2, Settings, ExternalLink, LogOut, Menu, X, Bell,
} from "lucide-react";

type NavItem = { id: string; label: string; icon: typeof LayoutGrid; badge?: string };

const NAV: NavItem[] = [
  { id: "overview",   label: "Dashboard",   icon: LayoutGrid  },
  { id: "analytics",  label: "Analytics",   icon: BarChart2   },
  { id: "products",   label: "Products",    icon: Package     },
  { id: "categories", label: "Categories",  icon: Tag         },
  { id: "orders",     label: "Orders",      icon: ShoppingBag },
  { id: "customers",  label: "Customers",   icon: Users       },
  { id: "navigation", label: "Navigation",  icon: Navigation  },
  { id: "content",    label: "Content",     icon: Settings    },
];

export function AdminLayout({
  activeTab,
  onTabChange,
  userEmail,
  onSignOut,
  children,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userEmail?: string | null;
  onSignOut: () => void;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Live pending order count for badge
  const { data: pendingCount = 0 } = useQuery<number>({
    queryKey: ["admin", "pending-count"],
    queryFn: async () => {
      const { count } = await supabase.from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      return count ?? 0;
    },
    refetchInterval: 30_000,
  });

  const navWithBadge: NavItem[] = NAV.map((item) =>
    item.id === "orders" && pendingCount > 0
      ? { ...item, badge: String(pendingCount) }
      : item,
  );

  function NavButton({ item, onClick }: { item: NavItem; onClick?: () => void }) {
    const active = activeTab === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => { onTabChange(item.id); onClick?.(); }}
        className={`group relative flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.25em] transition-all cursor-pointer ${
          active
            ? "border-gold bg-gold/8 text-gold"
            : "border-transparent text-foreground/50 hover:border-gold/30 hover:bg-gold/3 hover:text-foreground/80"
        }`}
      >
        <item.icon className="h-3.5 w-3.5 flex-none" strokeWidth={1.5} />
        {item.label}
        {item.badge && (
          <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-bold text-ink">
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface-deep">
      {/* ── Mobile Header ── */}
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-surface-deep/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Monogram className="h-8 w-8 text-gold" animate={true} />
            <div>
              <div className="font-serif text-sm text-foreground">Socute Beauty</div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-gold/70">Admin Console</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-ink px-1">
                {pendingCount}
              </span>
            )}
            <button type="button" onClick={() => setMobileOpen((v) => !v)}
              className="p-2 text-foreground/70 hover:text-gold cursor-pointer">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="border-t border-gold/15 px-2 py-3">
            {navWithBadge.map((item) => (
              <NavButton key={item.id} item={item} onClick={() => setMobileOpen(false)} />
            ))}
          </nav>
        )}
      </header>

      <div className="mx-auto flex max-w-screen-xl gap-0 md:gap-0">
        {/* ── Desktop Sidebar ── */}
        <aside className="sticky top-0 hidden h-screen w-56 flex-none flex-col border-r border-gold/15 bg-surface-deep md:flex">
          {/* Brand */}
          <div className="flex items-center gap-3 border-b border-gold/15 px-5 py-6">
            <Monogram className="h-9 w-9 text-gold" animate={true} />
            <div>
              <div className="font-serif text-sm text-foreground">Socute Beauty</div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Admin Console</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="mb-1 px-5 text-[9px] uppercase tracking-[0.35em] text-foreground/25">Overview</div>
            {navWithBadge.slice(0, 2).map((item) => <NavButton key={item.id} item={item} />)}
            <div className="mt-4 mb-1 px-5 text-[9px] uppercase tracking-[0.35em] text-foreground/25">Catalogue</div>
            {navWithBadge.slice(2, 5).map((item) => <NavButton key={item.id} item={item} />)}
            <div className="mt-4 mb-1 px-5 text-[9px] uppercase tracking-[0.35em] text-foreground/25">Community</div>
            {navWithBadge.slice(5, 6).map((item) => <NavButton key={item.id} item={item} />)}
            <div className="mt-4 mb-1 px-5 text-[9px] uppercase tracking-[0.35em] text-foreground/25">Storefront</div>
            {navWithBadge.slice(6, 8).map((item) => <NavButton key={item.id} item={item} />)}
          </nav>

          {/* Footer */}
          <div className="border-t border-gold/15 px-5 py-5 text-[10px]">
            <p className="truncate font-serif text-foreground/70">{userEmail ?? "admin"}</p>
            <div className="mt-4 space-y-2">
              <a href="http://localhost:3000" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-foreground/40 uppercase tracking-[0.2em] hover:text-gold transition-colors">
                <ExternalLink className="h-3 w-3" /> Storefront
              </a>
              <button type="button" onClick={onSignOut}
                className="flex items-center gap-2 text-foreground/40 uppercase tracking-[0.2em] hover:text-gold transition-colors cursor-pointer">
                <LogOut className="h-3 w-3" /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="min-h-screen min-w-0 flex-1 px-4 py-8 md:px-8 md:py-10">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-foreground/30">
            <span>Socute Beauty</span>
            <span>/</span>
            <span className="text-gold/70">{NAV.find(n => n.id === activeTab)?.label ?? activeTab}</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
