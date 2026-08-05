import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgressBar } from "@/components/scroll-progress-bar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-serif text-sm uppercase tracking-[0.4em] text-gold">Socute Beauty</p>
        <h1 className="mt-6 font-serif text-6xl text-foreground">Lost in the atelier</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for has drifted away like a fading base note.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-serif text-sm uppercase tracking-[0.4em] text-gold">A moment</p>
        <h1 className="mt-6 font-serif text-4xl text-foreground">The bottle wouldn't open</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Something went wrong. Try again or return to the entrance.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center border border-gold bg-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-ink transition-colors hover:bg-transparent hover:text-gold"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-gold/40 px-6 py-3 text-xs uppercase tracking-[0.3em] text-foreground/80 transition-colors hover:border-gold hover:text-gold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Socute Beauty — Velvet Aura | Haute Parfumerie & Cosmétique" },
      {
        name: "description",
        content:
          "Une maison de haute parfumerie et cosmétique d'exception. Explorez nos créations olfactives, soins précieux et accessoires.",
      },
      { name: "author", content: "Socute Beauty" },
      { property: "og:title", content: "Socute Beauty — Velvet Aura" },
      {
        property: "og:description",
        content: "An editorial parfumerie of rare, character-driven fragrances.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const GA_MEASUREMENT_ID = "G-NFKT7VKYS0";

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Google Tag (gtag.js) - Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  // Send real-time pageview events to Google Analytics on route navigation
  useEffect(() => {
    return router.subscribe("onResolved", (event) => {
      const win = window as unknown as {
        gtag?: (command: string, id: string, config: { page_path: string }) => void;
      };
      if (typeof window !== "undefined" && win.gtag) {
        win.gtag("config", GA_MEASUREMENT_ID, {
          page_path: event.toLocation.href,
        });
      }
    });
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <ScrollProgressBar />
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
        <CartDrawer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
