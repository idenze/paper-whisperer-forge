import { Check, Copy, Download, Eraser } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/button";
import { normalizeIgboText } from "@/lib/igbo-text";
import { cycleIgboVowel, igboExtraKeys, keyboardLayouts, type KeyboardId, type KeyDef } from "@/lib/keyboard-data";
import { defaultSettings, type LearnerSettings } from "@/lib/settings";
import { useStickyState } from "@/lib/use-sticky-state";

let vocabCache: string[] | null = null;

export function KeyboardView() {
  const [settings, setSettings] = useStickyState<LearnerSettings>("settings", defaultSettings);
  const [text, setText] = useStickyState("keyboard:text", "");
  const [shift, setShift] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suggest, setSuggest] = useStickyState("keyboard:suggest", false);
  const [vocab, setVocab] = useState<string[]>(vocabCache ?? []);
  const ref = useRef<HTMLTextAreaElement>(null);
  const layoutId = settings.keyboard;
  const layout = keyboardLayouts[layoutId];

  useEffect(() => {
    if (!suggest || vocabCache) return;
    fetch("/keyboards/ig-vocab.txt").then((r) => r.text()).then((t) => {
      vocabCache = Array.from(new Set(t.split(/\s+/).map((w) => w.normalize("NFC")).filter(Boolean)));
      setVocab(vocabCache);
    });
  }, [suggest]);

  const currentWord = useMemo(() => (text.split(/\s/).pop() ?? "").toLowerCase(), [text]);
  const suggestions = useMemo(() => {
    if (!suggest || layoutId !== "igbo" || currentWord.length < 2) return [];
    return vocab.filter((w) => w.startsWith(currentWord) && w !== currentWord).slice(0, 8);
  }, [suggest, layoutId, currentWord, vocab]);

  const insertAtCaret = (insert: string, replaceLast = false) => {
    const el = ref.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    let before = text.slice(0, start);
    if (replaceLast) before = [...before].slice(0, -1).join("");
    const next = normalizeIgboText(before + insert + text.slice(end));
    setText(next);
    const pos = normalizeIgboText(before + insert).length;
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(pos, pos); });
  };

  const press = (k: KeyDef) => {
    if (k.action === "shift") return setShift((s) => !s);
    if (k.action === "space") return insertAtCaret(" ");
    if (k.action === "enter") return insertAtCaret("\n");
    if (k.action === "backspace") {
      const el = ref.current; const start = el?.selectionStart ?? text.length; const end = el?.selectionEnd ?? text.length;
      const before = start === end ? [...text.slice(0, start)].slice(0, -1).join("") : text.slice(0, start);
      setText(before + text.slice(end));
      requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(before.length, before.length); });
      return;
    }
    let out = k.insert ?? k.label;
    if (shift && !k.insert) { out = out.toLocaleUpperCase("ig"); setShift(false); }
    insertAtCaret(out);
  };

  // Physical keyboard: Shift + vowel cycles tone/dot forms (Igbo layout).
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (layoutId !== "igbo" || !e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key.toLowerCase();
    if (!"aeioumn".includes(key) || key.length !== 1) return;
    e.preventDefault();
    const el = e.currentTarget;
    const r = cycleIgboVowel(text.slice(0, el.selectionStart), key);
    insertAtCaret(r.insert, r.replaceLast);
  };

  const pickSuggestion = (w: string) => {
    const parts = text.split(/(\s)/); parts[parts.length - 1] = w; setText(normalizeIgboText(parts.join("") + " "));
    requestAnimationFrame(() => ref.current?.focus());
  };

  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" })); a.download = "ozituma-text.txt"; a.click(); };

  return (
    <div className="rise-in mx-auto max-w-4xl">
      <p className="text-xs font-extrabold uppercase text-primary">Keyboard</p>
      <h1 className="mt-1 font-display text-4xl font-semibold">Type in Igbo, Ńdẹ́bẹ́ or English</h1>
      <p className="mt-2 text-muted-foreground">{layout.note}</p>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Keyboard layout">
        {(Object.keys(keyboardLayouts) as KeyboardId[]).map((id) => (
          <Button key={id} role="tab" aria-selected={layoutId === id} variant={layoutId === id ? "primary" : "secondary"} onClick={() => setSettings({ ...settings, keyboard: id })}>{keyboardLayouts[id].name}</Button>
        ))}
      </div>

      <textarea ref={ref} value={text} onChange={(e) => setText(normalizeIgboText(e.target.value))} onKeyDown={onKeyDown} lang={layoutId === "english" ? "en" : "ig"} rows={5} placeholder="Start typing…"
        className="mt-5 w-full rounded-lg border-2 border-input bg-card p-4 text-xl leading-8 outline-none focus:border-primary" />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={copy}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy"}</Button>
        <Button variant="secondary" onClick={download}><Download className="size-4" /> Save as file</Button>
        <Button variant="ghost" onClick={() => setText("")}><Eraser className="size-4" /> Clear</Button>
        {layoutId === "igbo" && (
          <label className="ml-auto flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={suggest} onChange={(e) => setSuggest(e.target.checked)} className="size-4 accent-primary" /> Word suggestions</label>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-black uppercase text-muted-foreground">From the open Edémédé word list · not reviewed by Ozituma</p>
          <div className="mt-1 flex flex-wrap gap-1.5">{suggestions.map((w) => <button key={w} onClick={() => pickSuggestion(w)} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-bold hover:border-primary" lang="ig">{w}</button>)}</div>
        </div>
      )}

      <div className="mt-5 rounded-lg border border-border bg-muted/50 p-3 shadow-inner sm:p-4" aria-label={`${layout.name} on-screen keyboard`}>
        {layout.rows.map((r, i) => (
          <div key={i} className="mb-1.5 flex justify-center gap-1.5 last:mb-0">
            {r.map((k, j) => (
              <button key={`${k.label}-${j}`} type="button" onClick={() => press(k)}
                className={`min-h-12 rounded-md border border-b-4 border-border bg-card px-2 text-base font-bold shadow-sm transition active:translate-y-0.5 active:border-b sm:min-w-11 ${k.wide ? "flex-[4]" : "flex-1 max-w-16"} ${k.action === "shift" && shift ? "border-primary bg-secondary" : ""}`}
                lang={layoutId === "english" ? "en" : "ig"}>
                {shift && !k.action && !k.insert ? k.label.toLocaleUpperCase("ig") : k.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {layoutId === "igbo" && (
        <div className="mt-4">
          <p className="text-xs font-extrabold uppercase text-muted-foreground">Tone-marked letters</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {igboExtraKeys.map((c) => <button key={c} onClick={() => insertAtCaret(c)} className="min-h-10 min-w-10 rounded-md border border-border bg-card px-2 text-lg font-bold hover:border-primary" lang="ig">{c}</button>)}
          </div>
        </div>
      )}

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display text-xl font-semibold">Computer shortcuts</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><b className="text-foreground">Shift + a</b> → ạ, à, á</li><li><b className="text-foreground">Shift + e</b> → ẹ, è, é</li>
            <li><b className="text-foreground">Shift + i</b> → ị, ì, í</li><li><b className="text-foreground">Shift + o</b> → ọ, ò, ó</li>
            <li><b className="text-foreground">Shift + u</b> → ụ, ù, ú</li><li><b className="text-foreground">Shift + n</b> → ṅ, ǹ, ń</li>
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display text-xl font-semibold">Coming to phones and computers</h2>
          <p className="mt-2 text-sm text-muted-foreground">This page is a live demo. The same layouts will become installable keyboards for Windows, Mac, Android and iPhone.</p>
          <p className="mt-3 text-xs text-muted-foreground">Igbo shortcuts and word list adapted from Edémédé by Chris C. Emezue &amp; Handel C. Emezue (Apache-2.0).</p>
        </div>
      </section>
    </div>
  );
}
