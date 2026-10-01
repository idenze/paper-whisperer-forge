import {
  ArrowRight,
  Check,
  Clock3,
  Flame,
  Gauge,
  Headphones,
  Play,
  Shuffle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { PracticeGame } from "@/components/practice-game";
import { mixedRounds, practiceFocuses, type PracticeRound } from "@/lib/practice-data";
import { useStickyState } from "@/lib/use-sticky-state";

type Session = { title: string; rounds: readonly PracticeRound[] };

export function PracticeView() {
  const [lastSession, setLastSession] = useStickyState<string | null>("practise:last", null);
  const [running, setRunning] = useState<string | null>(null);
  const [history, setHistory] = useStickyState<string[]>("practise:history", []);

  const buildSession = (title: string | null): Session | null => {
    if (!title) return null;
    if (title === "Mixed run") return { title, rounds: mixedRounds };
    const focus = practiceFocuses.find((item) => item.name === title);
    return focus ? { title: focus.name, rounds: focus.rounds } : null;
  };

  const session = buildSession(running);
  const start = (title: string) => {
    setLastSession(title);
    setRunning(title);
  };
  const finish = (title: string) => {
    setHistory((items) => [title, ...items.filter((item) => item !== title)].slice(0, 5));
  };

  if (session) {
    return (
      <PracticeGame
        rounds={session.rounds}
        mode="free"
        heading={session.title}
        storageKey={`practise:${session.title}`}
        onClose={() => setRunning(null)}
        onComplete={() => finish(session.title)}
      />
    );
  }

  const completedCount = history.length;
  const weeklyProgress = Math.min(100, completedCount * 20);

  return (
    <div className="rise-in mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-lg bg-brand text-brand-foreground shadow-focus">
        <div className="absolute inset-y-0 right-0 hidden w-2/5 opacity-20 md:block teacher-market-head" aria-hidden="true" />
        <div className="relative grid gap-7 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-sm bg-brand-foreground/10 px-2.5 py-1 text-[11px] font-black uppercase">
              <Sparkles className="size-3.5 text-highlight" /> Free practise
            </div>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">A quick workout for your Igbo.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-foreground/80 sm:text-base">
              Pick one skill, play for a few minutes, and repeat whenever you like. Practise never changes your lesson path.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button className="min-h-12 bg-highlight px-6 text-highlight-foreground hover:bg-highlight/90" onClick={() => start("Mixed run")}>
                <Shuffle className="size-4" /> Surprise me <ArrowRight className="size-4" />
              </Button>
              {lastSession && buildSession(lastSession) ? (
                <Button variant="secondary" className="min-h-12 border-brand-foreground/20 bg-brand-foreground/10 text-brand-foreground hover:bg-brand-foreground/15" onClick={() => start(lastSession)}>
                  <Play className="size-4" /> Continue {lastSession}
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-brand-foreground/15 rounded-md border border-brand-foreground/15 bg-brand-foreground/5 p-4 text-center backdrop-blur-sm">
            <div className="px-2"><p className="font-display text-2xl font-semibold">{completedCount}</p><p className="mt-1 text-[10px] font-bold uppercase text-brand-foreground/65">Played</p></div>
            <div className="px-2"><p className="font-display text-2xl font-semibold">{practiceFocuses.length}</p><p className="mt-1 text-[10px] font-bold uppercase text-brand-foreground/65">Games</p></div>
            <div className="px-2"><p className="font-display text-2xl font-semibold">3–4</p><p className="mt-1 text-[10px] font-bold uppercase text-brand-foreground/65">Minutes</p></div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <section aria-labelledby="practice-pick-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-primary">Choose your game</p>
              <h2 id="practice-pick-heading" className="mt-1 font-display text-3xl font-semibold">What do you want to train?</h2>
            </div>
            <Headphones className="hidden size-7 text-primary sm:block" aria-hidden="true" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {practiceFocuses.map(({ id, name, detail, minutes, icon: Icon, rounds }, index) => {
              const played = history.includes(name);
              return (
                <article key={id} className={`group grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-md border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-focus ${index === 0 ? "sm:col-span-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-rows-1 sm:items-center sm:gap-5" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-3 sm:block">
                    <div className="grid size-12 shrink-0 place-items-center rounded-md bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></div>
                    {played ? <span className="inline-flex items-center gap-1 rounded-sm bg-secondary px-2 py-1 text-[10px] font-black uppercase text-secondary-foreground sm:mt-3"><Check className="size-3" /> Played</span> : null}
                  </div>
                  <div className={index === 0 ? "sm:min-w-0" : "mt-4"}>
                    <h3 className="font-display text-xl font-semibold">{name}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground"><Clock3 className="size-3.5" /> {rounds.length} rounds · about {minutes} min</p>
                  </div>
                  <Button variant={index === 0 ? "primary" : "secondary"} className="mt-5 min-h-11 w-full sm:w-auto" onClick={() => start(name)}>
                    <Play className="size-4" /> {played ? "Play again" : "Start"}
                  </Button>
                </article>
              );
            })}
          </div>
          <p className="mt-4 inline-flex rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder content — sample lines, not verified teaching material</p>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-26">
          <section className="rounded-md border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-md bg-secondary text-primary"><Flame className="size-4" /></span><span className="text-xs font-black text-primary">{weeklyProgress}%</span></div>
            <h2 className="mt-4 font-display text-xl font-semibold">Your weekly rhythm</h2>
            <p className="mt-1 text-sm text-muted-foreground">Five short sessions make a strong week.</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-highlight transition-all" style={{ width: `${weeklyProgress}%` }} /></div>
            <p className="mt-2 text-xs font-bold text-muted-foreground">{completedCount} of 5 games played</p>
          </section>

          <section className="rounded-md border border-border bg-secondary p-5">
            <Gauge className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-xl font-semibold">No pressure</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Repeat a game as often as you need. Your course stays exactly where you left it.</p>
          </section>

          {history.length ? (
            <section className="rounded-md border border-border bg-card p-5">
              <div className="flex items-center gap-2"><Trophy className="size-4 text-highlight" /><h2 className="text-sm font-extrabold uppercase">Recently played</h2></div>
              <ul className="mt-3 space-y-2 text-sm">{history.slice(0, 3).map((item) => <li key={item} className="flex items-center gap-2 font-bold"><Check className="size-4 text-primary" />{item}</li>)}</ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}