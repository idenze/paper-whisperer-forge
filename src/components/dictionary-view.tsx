import { ExternalLink, Flag, Search, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { supabase } from "@/integrations/supabase/client";
import { foldIgboText, normalizeIgboText } from "@/lib/igbo-text";
import { useAuth } from "@/lib/use-auth";

type Entry = { id: string; headword: string; tone_marked: string | null; part_of_speech: string | null; meaning: string; example_ig: string | null; example_en: string | null; audio_url: string | null; dialect: string | null; source: string | null };

/** In-app dictionary: searches published entries only (Igbo ↔ English, tone-mark forgiving). */
export function DictionaryView() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<Entry | null>(null);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    const term = normalizeIgboText(q.trim());
    const t = setTimeout(async () => {
      setLoading(true);
      let query = supabase.from("lexemes").select("id,headword,tone_marked,part_of_speech,meaning,example_ig,example_en,audio_url,dialect,source").eq("status", "published").order("headword").limit(50);
      if (term) {
        const key = foldIgboText(term).toLowerCase().replace(/[%,]/g, "");
        query = query.or(`search_key.ilike.%${key}%,meaning.ilike.%${key}%`);
      }
      const { data } = await query;
      setRows((data ?? []) as Entry[]);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const report = async (entry: Entry) => {
    if (!user) return;
    await supabase.from("error_reports").insert({ user_id: user.id, target_type: "lexeme", target_id: entry.id, message: "Reported from dictionary" });
    setReported(true);
  };

  return (
    <div className="rise-in mx-auto max-w-4xl">
      <p className="text-xs font-extrabold uppercase text-primary">Dictionary</p>
      <h1 className="mt-1 font-display text-4xl font-semibold">Look up a word</h1>
      <p className="mt-2 text-muted-foreground">Search in Igbo or English. Tone marks are optional when searching.</p>
      <label className="relative mt-6 block">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(normalizeIgboText(e.target.value))} placeholder="Type a word…" lang="ig" className="min-h-14 w-full rounded-md border-2 border-input bg-card pl-12 pr-4 text-lg outline-none focus:border-primary" />
      </label>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_1.2fr]">
        <ul className="space-y-2">
          {loading && <li className="text-sm text-muted-foreground">Searching…</li>}
          {!loading && rows.length === 0 && (
            <li className="rounded-md border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
              No approved entries yet. Words appear here once a linguist publishes them.
              <a href="https://ozituma.com/" target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1 font-bold text-primary">Search the full Ozituma dictionary <ExternalLink className="size-4" /></a>
            </li>
          )}
          {rows.map((r) => (
            <li key={r.id}>
              <button onClick={() => { setOpen(r); setReported(false); }} className={`w-full rounded-md border-2 bg-card p-4 text-left transition hover:border-primary ${open?.id === r.id ? "border-primary" : "border-border"}`}>
                <span className="block font-display text-xl font-semibold" lang="ig">{r.tone_marked || r.headword}</span>
                <span className="text-sm text-muted-foreground">{r.part_of_speech ? `${r.part_of_speech} · ` : ""}{r.meaning}</span>
              </button>
            </li>
          ))}
        </ul>
        {open && (
          <article className="h-fit rounded-lg border border-border bg-card p-6 shadow-sm md:sticky md:top-24">
            <h2 className="font-display text-3xl font-semibold" lang="ig">{open.tone_marked || open.headword}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{[open.part_of_speech, open.dialect].filter(Boolean).join(" · ")}</p>
            <p className="mt-4 text-lg">{open.meaning}</p>
            {open.audio_url && <Button variant="secondary" className="mt-4" onClick={() => new Audio(open.audio_url!).play()}><Volume2 className="size-4" /> Listen</Button>}
            {open.example_ig && <div className="mt-5 rounded-md bg-muted p-4"><p className="font-bold" lang="ig">{open.example_ig}</p><p className="text-sm text-muted-foreground">{open.example_en}</p></div>}
            {open.source && <p className="mt-4 text-xs text-muted-foreground">Source: {open.source}</p>}
            <div className="mt-5 border-t border-border pt-4">
              {user ? <Button variant="ghost" disabled={reported} onClick={() => report(open)}><Flag className="size-4" /> {reported ? "Thanks — reported" : "Report a problem"}</Button>
                : <p className="text-xs text-muted-foreground">Sign in to report a problem with this entry.</p>}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
