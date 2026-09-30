import { Bot, Flag, Mic, Send, Sparkles, Volume2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/button";

type Message = { id: number; from: "tutor" | "learner"; text: string };

const starters = [
  "Help me review today’s lesson",
  "Give me a pronunciation exercise",
  "Quiz me with approved words",
] as const;

export function TutorView() {
  const [draft, setDraft] = useState("");
  const [reported, setReported] = useState(false);
  const [audioNotice, setAudioNotice] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "tutor", text: "Welcome back, Chidi. Choose a learning goal or ask a question to preview the tutoring flow." },
  ]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((items) => [
      ...items,
      { id: Date.now(), from: "learner", text: clean },
      { id: Date.now() + 1, from: "tutor", text: "Your question is ready. A verified answer will appear here after your approved curriculum and audio are connected." },
    ]);
    setDraft("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    send(draft);
  };

  return (
    <section className="rise-in grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]" aria-label="Tutor preview">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-border bg-brand px-5 py-4 text-brand-foreground sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-highlight text-highlight-foreground"><Bot className="size-5" /></span>
            <div><h2 className="font-display text-xl font-semibold">Ozituma Tutor</h2><p className="text-xs text-brand-foreground/75">Learning preview · not live AI</p></div>
          </div>
          <span className="flex items-center gap-2 text-xs font-bold"><span className="size-2 rounded-full bg-highlight" /> Ready</span>
        </div>

        <div className="min-h-[360px] space-y-5 px-4 py-6 sm:px-6" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.from === "learner" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[86%] rounded-lg px-4 py-3 text-sm leading-6 sm:max-w-[72%] ${message.from === "learner" ? "bg-primary text-primary-foreground" : "border border-border bg-secondary text-secondary-foreground"}`}>
                <p>{message.text}</p>
                {message.from === "tutor" && (
                  <div className="mt-3 flex items-center gap-1 border-t border-border/70 pt-2">
                    <Button variant="ghost" className="min-h-8 px-2 text-xs" onClick={() => setAudioNotice(true)}><Volume2 className="size-3.5" /> Listen</Button>
                    <Button variant="ghost" className="min-h-8 px-2 text-xs" onClick={() => setReported(true)}><Flag className="size-3.5" /> Report</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border bg-background p-4 sm:p-5">
          <form onSubmit={submit} className="flex items-end gap-2">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Ask your tutor</span>
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={2} placeholder="Ask about an approved lesson…" className="w-full resize-none rounded-md border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </label>
            <Button type="button" variant="icon" aria-label="Voice input preview" onClick={() => setAudioNotice(true)}><Mic className="size-5" /></Button>
            <Button type="submit" variant="icon" aria-label="Send question" disabled={!draft.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90"><Send className="size-5" /></Button>
          </form>
          {(audioNotice || reported) && <p className="mt-3 text-xs font-semibold text-muted-foreground">{reported ? "Thanks. The sample response has been marked for review." : "Audio will activate when approved recordings are added."}</p>}
        </div>
      </div>

      <aside className="space-y-5">
        <section className="rounded-md border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2"><Sparkles className="size-4 text-primary" /><h2 className="font-display text-xl font-semibold">Choose a goal</h2></div>
          <div className="mt-4 space-y-2">
            {starters.map((starter) => <Button key={starter} variant="secondary" className="h-auto w-full justify-start py-3 text-left" onClick={() => send(starter)}>{starter}</Button>)}
          </div>
        </section>
        <section className="rounded-md border border-border bg-secondary p-5">
          <p className="text-xs font-extrabold uppercase text-muted-foreground">Content status</p>
          <h2 className="mt-2 font-display text-xl font-semibold">Safe by design</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">This screen demonstrates the tutoring experience only. It does not invent translations or language instruction.</p>
          <span className="mt-4 inline-flex rounded-sm bg-card px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder responses</span>
        </section>
      </aside>
    </section>
  );
}