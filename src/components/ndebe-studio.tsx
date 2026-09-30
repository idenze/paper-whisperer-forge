import { BookOpen, Check, ChevronRight, Copy, Delete, Grid3X3, Keyboard, LockKeyhole, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { ndebeModules, ndebeParts, ndebeStems, ndebeTones, ndebeVowels } from "@/lib/ndebe-data";

type Workspace = "type" | "learn" | "script";

export function NdebeStudio() {
  const [workspace, setWorkspace] = useState<Workspace>("type");
  const [stem, setStem] = useState<(typeof ndebeStems)[number]>("B");
  const [vowel, setVowel] = useState<(typeof ndebeVowels)[number]>("A");
  const [tone, setTone] = useState<(typeof ndebeTones)[number]>("High");
  const [tokens, setTokens] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const addToken = () => setTokens((items) => [...items, `[${stem} · ${vowel} · ${tone}]`]);
  const copyPrototype = async () => {
    if (!tokens.length || typeof navigator === "undefined") return;
    await navigator.clipboard.writeText(tokens.join(" "));
    setCopied(true);
  };

  return (
    <section className="rise-in" aria-label="Ndebe learning studio">
      <div className="mb-6 overflow-hidden rounded-lg bg-ink text-primary-foreground shadow-lg">
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-xs font-extrabold uppercase text-highlight">Ndebe learning studio</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Write Igbo in Ndebe</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/75">Learn the structure, practise the input sequence, and prepare to type with your verified Ndebe font and dictionary data.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button className="bg-highlight text-highlight-foreground hover:bg-highlight/90" onClick={() => setWorkspace("type")}><Keyboard className="size-4" /> Start typing</Button>
            <Button className="border border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setWorkspace("learn")}><BookOpen className="size-4" /> Learn Ndebe</Button>
            <Button className="border border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setWorkspace("script")}><Grid3X3 className="size-4" /> Character guide</Button>
          </div>
        </div>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-border" role="tablist" aria-label="Ndebe tools">
        {(["type", "learn", "script"] as const).map((item) => <Button key={item} variant="ghost" role="tab" aria-selected={workspace === item} onClick={() => setWorkspace(item)} className={`rounded-b-none capitalize ${workspace === item ? "border-b-2 border-primary text-primary" : ""}`}>{item === "script" ? "Character guide" : item}</Button>)}
      </div>

      {workspace === "type" && (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
            <div className="border-b border-border p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-extrabold uppercase text-primary">Learning keyboard</p><h3 className="mt-1 font-display text-2xl font-semibold">Build a syllable</h3></div><span className="rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Prototype notation</span></div>
              <div className="mt-5 min-h-36 rounded-md border border-input bg-background p-4" aria-live="polite">
                {tokens.length ? <p className="break-words font-mono text-lg leading-9">{tokens.join(" ")}</p> : <p className="text-sm text-muted-foreground">Your practice sequence will appear here. This prototype deliberately uses labelled parts, not unverified Ndebe characters.</p>}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button variant="secondary" onClick={copyPrototype} disabled={!tokens.length}><Copy className="size-4" /> {copied ? "Copied" : "Copy"}</Button>
                <Button variant="ghost" onClick={() => setTokens((items) => items.slice(0, -1))} disabled={!tokens.length}><Delete className="size-4" /> Backspace</Button>
                <Button variant="ghost" onClick={() => { setTokens([]); setCopied(false); }} disabled={!tokens.length}><RotateCcw className="size-4" /> Clear</Button>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <KeyGroup title="1. Choose a stem" value={stem} values={ndebeStems} onChange={(value) => setStem(value as typeof stem)} columns="grid-cols-5 sm:grid-cols-8" />
              <KeyGroup title="2. Choose a vowel" value={vowel} values={ndebeVowels} onChange={(value) => setVowel(value as typeof vowel)} columns="grid-cols-5 sm:grid-cols-10" />
              <KeyGroup title="3. Choose a tone" value={tone} values={ndebeTones} onChange={(value) => setTone(value as typeof tone)} columns="grid-cols-3" />
              <Button className="w-full" onClick={addToken}>Add practice character <ChevronRight className="size-4" /></Button>
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-md border border-border bg-secondary p-5"><p className="text-xs font-extrabold uppercase text-muted-foreground">Current sequence</p><ol className="mt-4 space-y-3 text-sm font-bold"><li className="flex items-center justify-between"><span>Stem</span><b>{stem}</b></li><li className="flex items-center justify-between"><span>Vowel</span><b>{vowel}</b></li><li className="flex items-center justify-between"><span>Tone</span><b>{tone}</b></li></ol></section>
            <section className="rounded-md border border-border bg-card p-5"><h3 className="font-display text-lg font-semibold">Before real characters</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Add the licensed Ndebe font, verified input mapping, and your dictionary records. Unknown words should remain unresolved rather than guessed.</p></section>
          </aside>
        </div>
      )}

      {workspace === "learn" && <div className="grid gap-3 lg:grid-cols-2">{ndebeModules.map((module) => <article key={module.number} className="flex min-h-32 gap-4 rounded-md border border-border bg-card p-5 shadow-sm"><span className={`grid size-11 shrink-0 place-items-center rounded-md font-black ${module.status === "current" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{module.status === "locked" ? <LockKeyhole className="size-4" /> : module.number}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h3 className="font-display text-lg font-semibold">{module.title}</h3>{module.status === "current" && <span className="text-[10px] font-black uppercase text-primary">Start here</span>}</div><p className="mt-2 text-sm leading-5 text-muted-foreground">{module.detail}</p>{module.status === "current" && <Button variant="ghost" className="mt-2 min-h-8 px-0 text-primary" onClick={() => setWorkspace("type")}>Try it yourself <ChevronRight className="size-4" /></Button>}</div></article>)}</div>}

      {workspace === "script" && <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]"><section><p className="text-xs font-extrabold uppercase text-primary">How a character grows</p><h3 className="mt-1 font-display text-3xl font-semibold">Five parts to recognise</h3><div className="mt-5 space-y-3">{ndebeParts.map((part, index) => <article key={part.name} className="flex gap-4 rounded-md border border-border bg-card p-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-sm font-black">{index + 1}</span><div><h4 className="font-bold">{part.name}</h4><p className="mt-1 text-sm text-muted-foreground">{part.description}</p></div></article>)}</div></section><section className="rounded-md border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="font-display text-xl font-semibold">Stem reading index</h3><span className="text-xs font-bold text-muted-foreground">Sample labels</span></div><div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-7">{ndebeStems.map((item) => <div key={item} className="grid aspect-square place-items-center rounded-md border border-border bg-background text-xs font-black">{item}</div>)}</div><p className="mt-5 text-sm leading-6 text-muted-foreground">The complete 42-stem chart and verified character shapes will use your approved source files.</p></section></div>}
    </section>
  );
}

function KeyGroup({ title, value, values, onChange, columns }: { title: string; value: string; values: readonly string[]; onChange: (value: string) => void; columns: string }) {
  return <fieldset><legend className="mb-3 text-sm font-extrabold">{title}</legend><div className={`grid gap-2 ${columns}`}>{values.map((item) => <Button key={item} type="button" variant="secondary" aria-pressed={value === item} onClick={() => onChange(item)} className={`min-h-11 px-2 ${value === item ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}>{value === item && <Check className="size-3" />}{item}</Button>)}</div></fieldset>;
}