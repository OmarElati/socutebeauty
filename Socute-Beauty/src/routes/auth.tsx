import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Monogram } from "@/components/monogram";
import { getMe } from "@/lib/admin.functions";

type AuthSearch = { redirect?: string };

function safeRedirect(path?: string) {
  if (!path) return null;
  try {
    // Absolute same-origin URL from location.href
    if (path.startsWith("http")) {
      const url = new URL(path);
      if (url.origin === window.location.origin) return `${url.pathname}${url.search}`;
      return null;
    }
    if (path.startsWith("/")) return path;
  } catch {
    return null;
  }
  return null;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Socute Beauty" },
      { name: "description", content: "Sign in to Socute Beauty to manage your compositions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

async function destinationAfterAuth(preferred?: string) {
  const redirectTo = safeRedirect(preferred);
  if (redirectTo) return redirectTo;
  try {
    const me = await getMe();
    if (me.isAdmin) return "/admin";
  } catch {
    // not signed in / network — fall through
  }
  return "/";
}

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { redirect: redirectParam } = Route.useSearch();

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session || cancelled) return;
      const to = await destinationAfterAuth(redirectParam);
      if (!cancelled) window.location.href = to;
    });
    return () => {
      cancelled = true;
    };
  }, [redirectParam]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "reset") {
        if (!email) {
          toast.error("Please enter your email address.");
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Password reset link has been sent to your email.");
        setMode("signin");
        return;
      }

      if (mode === "signup") {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (!signUpData.session) {
          toast.info(
            "Account created! If email confirmation is enabled on your Supabase project, check your inbox to confirm.",
          );
        } else {
          toast.success("Account created and signed in!");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("invalid login credentials")) {
            throw new Error(
              "Invalid email or password. If you haven't created an account yet, click 'New here? Create an account' below.",
            );
          }
          throw error;
        }
      }
      const to = await destinationAfterAuth(redirectParam);
      window.location.href = to;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-6 py-14">
      <Link to="/" className="mb-8">
        <Monogram className="h-16 w-16 text-gold" animate={false} strokeWidth={1.6} />
      </Link>
      <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
        {mode === "signin"
          ? "Welcome back"
          : mode === "reset"
            ? "Reset password"
            : "Create an account"}
      </p>
      <h1 className="mt-3 font-serif text-4xl italic text-foreground">
        {mode === "signin" ? "Sign in" : mode === "reset" ? "Reset Password" : "Register"}
      </h1>

      <form onSubmit={onSubmit} className="mt-10 w-full space-y-5">
        {mode === "signup" && (
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">Name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-2 w-full border border-gold/25 bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-gold"
            />
          </label>
        )}
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-gold/25 bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-gold"
          />
        </label>
        {mode !== "reset" && (
          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                Password
              </span>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="text-[10px] uppercase tracking-[0.2em] text-gold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-gold/25 bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-gold"
            />
          </label>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-2 w-full bg-gold px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-ink transition-colors hover:bg-gold-soft disabled:opacity-70 cursor-pointer"
        >
          {busy
            ? "…"
            : mode === "signin"
              ? "Sign in"
              : mode === "reset"
                ? "Send Reset Link"
                : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-6 text-[11px] uppercase tracking-[0.3em] text-foreground/60 transition-colors hover:text-gold cursor-pointer"
      >
        {mode === "signin"
          ? "New here? Create an account"
          : mode === "reset"
            ? "Back to Sign in"
            : "Have an account? Sign in"}
      </button>
    </div>
  );
}
