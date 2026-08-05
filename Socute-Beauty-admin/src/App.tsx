import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { OverviewPage } from "@/pages/OverviewPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { NavPage } from "@/pages/NavPage";
import { ContentPage } from "@/pages/ContentPage";
import { LoginPage } from "@/pages/LoginPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 30, retry: 1 },
  },
});

const VALID_TABS = [
  "overview", "analytics", "products", "categories",
  "orders", "customers", "navigation", "content",
];

export function App() {
  const [session, setSession] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem("sb-admin-tab");
    return saved && VALID_TABS.includes(saved) ? saved : "overview";
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
      setUserEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(!!s);
      setUserEmail(s?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    localStorage.setItem("sb-admin-tab", tab);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(false);
    localStorage.removeItem("sb-admin-tab");
  }

  if (session === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-deep">
        <div className="flex flex-col items-center gap-4">
          <img src="/favicon.svg" alt="SB" className="h-12 w-12 opacity-60 animate-pulse" />
          <p className="text-sm text-foreground/40 font-serif italic">Loading Socute Beauty Console…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <QueryClientProvider client={queryClient}>
        <LoginPage onSuccess={() => setSession(true)} />
        <Toaster position="top-right" theme="dark" richColors />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      >
        {activeTab === "overview"   && <OverviewPage onNavigate={handleTabChange} />}
        {activeTab === "analytics"  && <AnalyticsPage />}
        {activeTab === "products"   && <ProductsPage />}
        {activeTab === "categories" && <CategoriesPage />}
        {activeTab === "orders"     && <OrdersPage />}
        {activeTab === "customers"  && <CustomersPage />}
        {activeTab === "navigation" && <NavPage />}
        {activeTab === "content"    && <ContentPage />}
      </AdminLayout>
      <Toaster position="top-right" theme="dark" richColors />
    </QueryClientProvider>
  );
}

export default App;
