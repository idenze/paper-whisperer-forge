import { Check, RotateCcw, Volume2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";

type PracticeGameProps = {
  onClose: () => void;
  onComplete: () => void;
};

const rounds = [
  {
    prompt: "Which scene matches what you hear?",
    options: [
      { icon: "👋", label: "PLACEHOLDER greeting" },
      { icon: "🏃", label: "PLACEHOLDER movement" },
      { icon: "🍲", label: "PLACEHOLDER meal" },
      { icon: "🏠", label: "PLACEHOLDER home" },
    ],
    correct: 0,
  },
  {
    prompt: "Choose the response that belongs next.",
    options: [
      { icon: "☀️", label: "PLACEHOLDER response A" },
      { icon: "🤝", label: "PLACEHOLDER response B" },
      { icon: "🌙", label: "PLACEHOLDER response C" },
      { icon: "🧭", label: "PLACEHOLDER response D" },
    ],
    correct: 1,
  },
  {
    prompt: "Find the sound used in this exchange.",
    options: [
      { icon: "🥁", label: "PLACEHOLDER sound A" },
      { icon: "🗣️", label: "PLACEHOLDER sound B" },
      { icon: "🎶", label: "PLACEHOLDER sound C" },
      { icon: "👂", label: "PLACEHOLDER sound D" },
    ],
    correct: 3,
  },
] as const;

export function PracticeGame({ onClose, onComplete }: PracticeGameProps) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [finished, setFinished] = useState(false);
  const current = rounds[round] ?? rounds[0];
  const isCorrect = selected === current.correct;

  const advance = () => {
    if (!checked) {
      setChecked(true);
      return;
    }
    if (round === rounds.length - 1) {
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
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-foreground/45 sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="practice-title">
      <section className="flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-y-auto rounded-t-lg border border-border bg-card shadow-2xl sm:max-h-[92dvh] sm:rounded-lg">
        <header className="flex items-center gap-4 border-b border-border px-4 py-4 sm:px-7">
          <div className="flex flex-1 gap-1.5" aria-label={`Round ${Math.min(round + 1, rounds.length)} of ${rounds.length}`}>
            {rounds.map((_, index) => <span key={index} className={`h-2 flex-1 rounded-full transition-colors ${index <= round ? "bg-primary" : "bg-muted"}`} />)}
          </div>
          <span className="text-xs font-extrabold text-muted-foreground">{Math.min(round + 1, rounds.length)} / {rounds.length}</span>
          <Button variant="icon" onClick={onClose} aria-label="Close practice"><X className="size-5" /></Button>
        </header>

        {finished ? (
          <div className="grid flex-1 place-items-center px-6 py-14 text-center sm:py-20">
            <div>
              <span className="mx-auto grid size-24 place-items-center rounded-full bg-secondary text-primary"><Check className="size-11" strokeWidth={3} /></span>
              <span className="mt-6 inline-flex rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder content</span>
              <h2 id="practice-title" className="mt-3 font-display text-4xl font-semibold">Round complete</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">You explored sound, context, and response across three short activities.</p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="secondary" onClick={restart}><RotateCcw className="size-4" /> Play again</Button>
                <Button onClick={onClose}>Return to journey <Check className="size-4" /></Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 pb-7 pt-6 text-center sm:px-8">
              <span className="inline-flex rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder content</span>
              <h2 id="practice-title" className="mx-auto mt-3 max-w-lg font-display text-2xl font-semibold sm:text-3xl">{current.prompt}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Listen first, then choose a scene tile.</p>
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
                      key={option.label}
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
                {checked ? round === rounds.length - 1 ? "Finish round" : "Next challenge" : "Check my choice"}
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}