import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { OzitumaMark } from "@/components/ozituma-mark";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Ozituma Learn Igbo" },
      { name: "description", content: "Sign in or create your Ozituma account to save your Igbo learning progress." },
      { property: "og:title", content: "Sign in — Ozituma Learn Igbo" },
      { property: "og:description", content: "Sign in or create your Ozituma account to save your Igbo learning progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adult, setAdult] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/" }); });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => { if (event === "SIGNED_IN") navigate({ to: "/" }); });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        if (!adult) throw new Error("Please confirm you are 13 or older.");
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: name } } });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Check your email to confirm your account, then sign in." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMsg({ kind: "ok", text: "If that email has an account, a reset link is on its way." });
      }
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally { setBusy(false); }
  };

  const google = async () => {
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setMsg({ kind: "err", text: "Google sign-in didn't complete. Please try again." });
  };

  const input = "mt-1 min-h-12 w-full rounded-md border-2 border-input bg-card px-3 outline-none focus:border-primary";

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-block"><OzitumaMark /></Link>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-3xl font-semibold">{mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mode === "forgot" ? "We'll email you a link." : "Save your progress on every device."}</p>

          {mode !== "forgot" && (
            <>
              <Button variant="secondary" className="mt-6 w-full" onClick={google}>Continue with Google</Button>
              <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            </>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && <label className="block text-sm font-bold">Your name<input className={input} value={name} onChange={(e) => setName(e.target.value)} required /></label>}
            <label className="block text-sm font-bold">Email<input type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
            {mode !== "forgot" && <label className="block text-sm font-bold">Password<input type="password" minLength={8} className={input} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={mode === "signup" ? "new-password" : "current-password"} /></label>}
            {mode === "signup" && <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 size-4" checked={adult} onChange={(e) => setAdult(e.target.checked)} />I am 13 or older.</label>}
            {msg && <p role="status" className={`rounded-md p-3 text-sm ${msg.kind === "ok" ? "bg-secondary text-secondary-foreground" : "bg-accent/10 text-foreground"}`}>{msg.text}</p>}
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}</Button>
          </form>

          <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm">
            {mode === "signin" ? <>
              <button className="font-bold text-primary" onClick={() => setMode("signup")}>Create an account</button>
              <button className="text-muted-foreground" onClick={() => setMode("forgot")}>Forgot password?</button>
            </> : <button className="font-bold text-primary" onClick={() => setMode("signin")}>Back to sign in</button>}
          </div>
        </div>
        <p className="mt-4 text-center text-sm"><Link to="/" className="text-muted-foreground">Continue without an account</Link></p>
      </div>
    </main>
  );
}
