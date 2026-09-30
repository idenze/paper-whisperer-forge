import { ArrowLeft, Check, CornerDownLeft, RotateCcw, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/button";
import { foldIgboText, normalizeIgboText } from "@/lib/igbo-text";
import type { PracticeRound } from "@/lib/practice-data";
import { useStickyState } from "@/lib/use-sticky-state";

type PracticeGameProps = {
  rounds: readonly PracticeRound[];
  /** "lesson" is the guided path activity, "free" is a repeatable practise session. */
  mode: "lesson" | "free";
  heading?: string;
  onClose: () => void;
  onComplete: () => void;
  /** Saves place on this device so learners resume where they stopped. */
  storageKey?: string;
};

type Verdict = "correct" | "tones" | "wrong";

// Igbo letters and combining tone marks that are hard to reach on most keyboards.
const specialKeys = [
  { label: "ị", insert: "ị" }, { label: "ọ", insert: "ọ" }, { label: "ụ", insert: "ụ" }, { label: "ṅ", insert: "ṅ" },
  { label: "´ high", insert: "\u0301" }, { label: "` low", insert: "\u0300" }, { label: "¯ mid", insert: "\u0304" },
];

export function checkTyped(input: string, answer: string): Verdict {
  const a = normalizeIgboText(input.trim()).toLocaleLowerCase("en");
  const b = normalizeIgboText(answer.trim()).toLocaleLowerCase("en");
  if (a === b) return "correct";
  // Diacritic-insensitive match is only a helpful hint, never counted as fully correct.
  if (foldIgboText(a) === foldIgboText(b)) return "tones";
  return "wrong";
}

export function PracticeGame({ rounds, mode, heading, onClose, onComplete, storageKey }: PracticeGameProps) {
  const [round, setRound] = useStickyState(storageKey ? `${storageKey}:round` : null, 0);
  const [selected, setSelected] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [finished, setFinished] = useStickyState(storageKey ? `${storageKey}:finished` : null, false);
  const [score, setScore] = useStickyState(storageKey ? `${storageKey}:score` : null, 0);
  const [spin, setSpin] = useState(0);
  const [confirmExit, setConfirmExit] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFree = mode === "free";

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); return () => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }; }, []);

  const views = useMemo(
    () => rounds.map((r, index) => {
      if (r.kind === "type") return r;
      const total = r.options.length;
      const shift = isFree ? (spin + index) % total : 0;
      return { ...r, options: r.options.slice(shift).concat(r.options.slice(0, shift)), correct: isFree ? (r.correct - shift + total) % total : r.correct };
    }),
    [rounds, spin, isFree],
  );

  const current = views[round] ?? views[0];
  const total = views.length;
  const checked = verdict !== null;

  const exit = () => onClose();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") exit(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!current) return null;
  const isType = current.kind === "type";
  const canCheck = isType ? typed.trim().length > 0 : selected !== null;

  const check = () => {
    if (!canCheck) return;
    const v: Verdict = current.kind === "type" ? checkTyped(typed, current.answer) : selected === current.correct ? "correct" : "wrong";
    setVerdict(v);
    if (v === "correct") setScore((s) => s + 1);
  };

  const next = () => {
    if (round === total - 1) { setFinished(true); onComplete(); return; }
    setRound((v) => v + 1); setSelected(null); setTyped(""); setVerdict(null); setAudioPlayed(false);
  };

  const restart = () => {
    setRound(0); setSelected(null); setTyped(""); setVerdict(null); setAudioPlayed(false); setFinished(false); setScore(0); setSpin((v) => v + 1);
  };

  const insertKey = (text: string) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? typed.length;
    const end = el?.selectionEnd ?? typed.length;
    const value = normalizeIgboText(typed.slice(0, start) + text + typed.slice(end));
    setTyped(value);
    requestAnimationFrame(() => { el?.focus(); const pos = Math.min(value.length, start + 1); el?.setSelectionRange(pos, pos); });
  };

  const backLabel = isFree ? "Back to practise" : "Back to journey";
  const feedback = verdict === "correct" ? "Correct — well done."
    : verdict === "tones" ? "Almost. The letters are right, but check the tone marks."
    : isType ? "Not quite." : "Not this time. The matching tile is highlighted.";

  return (
    <section ref={rootRef} className="rise-in mx-auto max-w-3xl scroll-mt-24" aria-labelledby="practice-title">
      {/* Always-visible top bar with a labelled way out */}
      <div className="sticky top-16 z-30 -mx-1 mb-4 flex items-center gap-3 rounded-md border border-border bg-card/95 px-2 py-2 shadow-sm backdrop-blur sm:top-20">
        <Button variant="ghost" onClick={exit} className="shrink-0"><ArrowLeft className="size-4" /> {backLabel}</Button>
        <div className="flex flex-1 gap-1" aria-label={`Question ${Math.min(round + 1, total)} of ${total}`}>
          {views.map((_, i) => <span key={i} className={`h-2 flex-1 rounded-full ${i < round || finished || (i === round && checked) ? "bg-primary" : i === round ? "bg-primary/40" : "bg-muted"}`} />)}
        </div>
        <span className="shrink-0 px-2 text-xs font-extrabold text-muted-foreground">{finished ? total : round + 1} / {total}</span>
      </div>

      {confirmExit && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-md border border-accent bg-accent/10 p-4" role="alertdialog" aria-label="Leave this session?">
          <p className="flex-1 text-sm font-bold">Leave now? Your place is saved — you’ll pick up from this question next time.</p>
          <Button variant="secondary" onClick={() => setConfirmExit(false)}>Keep going</Button>
          <Button onClick={onClose}><X className="size-4" /> Leave</Button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {finished ? (
          <div className="px-6 py-12 text-center">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-secondary text-primary"><Check className="size-10" strokeWidth={3} /></span>
            <h2 id="practice-title" className="mt-5 font-display text-3xl font-semibold">{isFree ? "Session complete" : "Round complete"}</h2>
            <p className="mt-2 text-lg font-bold">{score} of {total} correct</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{isFree ? "Nothing here moves your path — it just keeps the words warm." : "You worked through sound, context, response and typing."}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" onClick={restart}><RotateCcw className="size-4" /> {isFree ? "Practise again" : "Play again"}</Button>
              <Button onClick={onClose}>{backLabel}</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder content</span>
                  {heading && <span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-black uppercase text-secondary-foreground">{heading}</span>}
                </div>
                <h2 id="practice-title" className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{current.prompt}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{current.hint}</p>
              </div>
              {(!isType || current.hasAudio) && (
                <Button variant="secondary" className={`shrink-0 gap-2 self-start sm:self-center ${audioPlayed ? "border-primary text-primary" : ""}`} onClick={() => setAudioPlayed(true)} aria-label="Play placeholder audio">
                  <Volume2 className="size-5" /> {audioPlayed ? "Play again" : "Listen"}
                </Button>
              )}
            </div>

            <div className="border-t border-border bg-muted/50 p-5 sm:p-7">
              {current.kind === "type" ? (
                <form onSubmit={(e) => { e.preventDefault(); if (checked) next(); else check(); }}>
                  <p className="rounded-md border border-border bg-card p-4 text-base font-semibold leading-7">{current.meaning}</p>
                  <label htmlFor="type-answer" className="mt-4 block text-xs font-extrabold uppercase text-muted-foreground">Type the Igbo</label>
                  <input
                    id="type-answer" ref={inputRef} value={typed} disabled={checked} autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false} lang="ig"
                    onChange={(e) => setTyped(normalizeIgboText(e.target.value))}
                    className={`mt-1 min-h-14 w-full rounded-md border-2 bg-card px-4 text-xl font-semibold outline-none focus:border-primary ${verdict === "correct" ? "border-primary" : verdict ? "border-accent" : "border-input"}`}
                  />
                  {!checked && (
                    <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Igbo letters and tone marks">
                      {specialKeys.map((k) => <button key={k.label} type="button" onClick={() => insertKey(k.insert)} className="min-h-10 min-w-10 rounded-sm border border-border bg-card px-2.5 text-sm font-bold hover:border-primary">{k.label}</button>)}
                    </div>
                  )}
                  {checked && verdict !== "correct" && <p className="mt-3 text-sm">Answer: <b className="text-lg">{current.answer}</b></p>}
                  <button type="submit" hidden />
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {current.options.map((option, index) => {
                    const chosen = selected === index;
                    const right = checked && index === current.correct;
                    const wrong = checked && chosen && verdict === "wrong";
                    return (
                      <button key={`${option.label}-${index}`} type="button" disabled={checked} onClick={() => setSelected(index)} aria-pressed={chosen}
                        className={`flex min-h-24 items-center gap-3 rounded-md border-2 bg-card p-3 text-left transition ${chosen ? "border-primary" : "border-border hover:border-primary/50"} ${right ? "border-primary bg-secondary" : ""} ${wrong ? "border-accent bg-accent/10" : ""}`}>
                        <span className="text-3xl" aria-hidden="true">{option.icon}</span>
                        <span className="text-sm font-extrabold leading-5">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className={`mt-5 flex flex-col gap-3 sm:flex-row sm:items-center ${checked ? "rounded-md border p-3 " + (verdict === "correct" ? "border-primary bg-secondary" : "border-accent bg-accent/10") : ""}`}>
                {checked && <p className="flex-1 text-sm font-bold" role="status">{feedback}</p>}
                {!checked && <p className="hidden flex-1 text-xs text-muted-foreground sm:block">{isType ? <>Press <CornerDownLeft className="inline size-3" /> Enter to check · Esc to leave</> : "Esc to leave"}</p>}
                <Button className="sm:min-w-44" disabled={!checked && !canCheck} onClick={checked ? next : check}>
                  {checked ? (round === total - 1 ? "See results" : "Next") : "Check"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
