import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Monogram } from "@/components/monogram";

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
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
          toast.info("Account created! Check your email or sign in.");
        } else {
          toast.success("Account created!");
          onSuccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in to Atelier Console");
        onSuccess();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-14">
      <div className="mb-8 flex flex-col items-center">
        <Monogram className="h-16 w-16 text-gold" animate={false} strokeWidth={1.6} />
        <span className="mt-3 font-serif text-2xl text-foreground">Maison Lerredo</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.35em] text-gold/70">
          Admin Atelier Console
        </span>
      </div>

      <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
        {mode === "signin" ? "Welcome back" : "Create admin account"}
      </p>
      <h1 className="mt-3 font-serif text-4xl italic text-foreground">
        {mode === "signin" ? "Sign in" : "Register"}
      </h1>

      <form onSubmit={onSubmit} className="mt-10 w-full space-y-5">
        {mode === "signup" && (
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
              Name
            </span>
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
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-gold/25 bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-gold"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-2 w-full bg-gold px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-ink transition-colors hover:bg-gold-soft disabled:opacity-70 cursor-pointer"
        >
          {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-6 text-[11px] uppercase tracking-[0.3em] text-foreground/60 transition-colors hover:text-gold cursor-pointer"
      >
        {mode === "signin" ? "New here? Create an account" : "Have an account? Sign in"}
      </button>

      <p className="mt-8 max-w-xs text-center text-[10px] uppercase tracking-[0.25em] text-foreground/40">
        Standalone Admin Console · Port 8081
      </p>
    </div>
  );
}
