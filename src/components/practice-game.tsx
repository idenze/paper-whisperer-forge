import { Check, RotateCcw, Volume2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import type { PracticeRound } from "@/lib/practice-data";

type PracticeGameProps = {
  rounds: readonly PracticeRound[];
  /** "lesson" is the guided path activity, "free" is a repeatable practise session. */
  mode: "lesson" | "free";
  heading?: string;
  onClose: () => void;
  onComplete: () => void;
};

export function PracticeGame({ rounds, mode, heading, onClose, onComplete }: PracticeGameProps) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [spin, setSpin] = useState(0);
  const isFree = mode === "free";

  // Free practise reshuffles tile order each run so repeats are not memorised by position.
  const views = useMemo(
    () =>
      rounds.map((current, index) => {
        const total = current.options.length;
        const shift = isFree ? (spin + index) % total : 0;
        return {
          prompt: current.prompt,
          hint: current.hint,
          options: current.options.slice(shift).concat(current.options.slice(0, shift)),
          correct: isFree ? (current.correct - shift + total) % total : current.correct,
        };
      }),
    [rounds, spin, isFree],
  );

  const current = views[round] ?? views[0];
  if (!current) return null;
  const isCorrect = selected === current.correct;
  const total = views.length;
  const position = Math.min(round + 1, total);

  const advance = () => {
    if (!checked) {
      setChecked(true);
      return;
    }
    if (round === total - 1) {
      setFinished(true);
      onComplete();
      return;
    }
    setRound((value) => value + 1);
    setSelected(null);
    setChecked(false);
    setAudioPlayed(false);
  };

  const restart = () => {
    setRound(0);
    setSelected(null);
    setChecked(false);
    setAudioPlayed(false);
    setFinished(false);
    setSpin((value) => value + 1);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-foreground/45 sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="practice-title">
      <section className="flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-y-auto rounded-t-lg border border-border bg-card shadow-2xl sm:max-h-[92dvh] sm:rounded-lg">
        <header className="flex items-center gap-4 border-b border-border px-4 py-4 sm:px-7">
          <div className="flex flex-1 gap-1.5" aria-label={`Activity ${position} of ${total}`}>
            {views.map((_, index) => <span key={index} className={`h-2 flex-1 rounded-full transition-colors ${index <= round ? "bg-primary" : "bg-muted"}`} />)}
          </div>
          <span className="text-xs font-extrabold text-muted-foreground">{position} / {total}</span>
          <Button variant="icon" onClick={onClose} aria-label="Close practice"><X className="size-5" /></Button>
        </header>

        {finished ? (
          <div className="grid flex-1 place-items-center px-6 py-14 text-center sm:py-20">
            <div>
              <span className="mx-auto grid size-24 place-items-center rounded-full bg-secondary text-primary"><Check className="size-11" strokeWidth={3} /></span>
              <span className="mt-6 inline-flex rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder content</span>
              <h2 id="practice-title" className="mt-3 font-display text-4xl font-semibold">{isFree ? "Session complete" : "Round complete"}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {isFree
                  ? `${total} short activities done${heading ? ` in ${heading.toLowerCase()}` : ""}. Nothing here moves your path — it just makes the sounds stick.`
                  : "You explored sound, context, and response across three short activities."}
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="secondary" onClick={restart}><RotateCcw className="size-4" /> {isFree ? "Practise again" : "Play again"}</Button>
                <Button onClick={onClose}>{isFree ? "Back to practise" : "Return to journey"} <Check className="size-4" /></Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 pb-7 pt-6 text-center sm:px-8">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder content</span>
                {isFree && heading ? <span className="inline-flex rounded-sm bg-secondary px-2 py-1 text-[10px] font-black uppercase text-secondary-foreground">{heading}</span> : null}
              </div>
              <h2 id="practice-title" className="mx-auto mt-3 max-w-lg font-display text-2xl font-semibold sm:text-3xl">{current.prompt}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{current.hint}</p>
              <div className="relative mx-auto mt-7 grid size-36 place-items-center">
                <span className={`absolute inset-0 rounded-full bg-secondary ${audioPlayed ? "practice-pulse" : ""}`} />
                <Button className="relative size-24 min-h-24 rounded-full border-b-[7px] border-brand px-0 shadow-lg active:translate-y-1 active:border-b-2" onClick={() => setAudioPlayed(true)} aria-label="Play placeholder audio">
                  <Volume2 className="size-9" />
                </Button>
              </div>
              <p className="mt-2 text-xs font-extrabold uppercase text-muted-foreground">{audioPlayed ? "Sample played" : "Tap to listen"}</p>
            </div>

            <div className="rounded-t-lg bg-muted/65 px-4 pb-5 pt-5 sm:px-7 sm:pb-7">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {current.options.map((option, index) => {
                  const chosen = selected === index;
                  const correctChoice = checked && index === current.correct;
                  const wrongChoice = checked && chosen && !isCorrect;
                  return (
                    <Button
                      key={`${option.label}-${index}`}
                      variant="secondary"
                      disabled={checked}
                      onClick={() => setSelected(index)}
                      className={`h-auto min-h-28 flex-col gap-2 border-2 px-3 py-4 shadow-[0_5px_0_var(--color-border)] active:translate-y-1 active:shadow-none sm:min-h-32 ${chosen ? "border-primary bg-secondary text-secondary-foreground" : "bg-card"} ${correctChoice ? "border-primary bg-secondary" : ""} ${wrongChoice ? "border-accent bg-accent/10" : ""}`}
                      aria-pressed={chosen}
                    >
                      <span className="text-3xl" aria-hidden="true">{option.icon}</span>
                      <span className="max-w-full text-center text-xs font-extrabold leading-4 sm:text-sm">{option.label}</span>
                    </Button>
                  );
                })}
              </div>

              {checked && (
                <div className={`mt-4 rounded-md border px-4 py-3 text-sm font-bold ${isCorrect ? "border-primary bg-secondary text-secondary-foreground" : "border-accent bg-accent/10 text-foreground"}`} role="status">
                  {isCorrect ? "Good match. The scene and sample belong together." : "Not this time. The matching tile is highlighted—listen once more before continuing."}
                </div>
              )}

              <Button className="mt-5 w-full border-b-4 border-brand active:translate-y-0.5 active:border-b-2" disabled={selected === null} onClick={advance}>
                {checked ? round === total - 1 ? "Finish session" : "Next activity" : "Check my choice"}
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
