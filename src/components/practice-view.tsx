import { ArrowRight, Check, Clock, Flame, Layers, Shuffle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { PracticeGame } from "@/components/practice-game";
import { mixedRounds, practiceFocuses, type PracticeRound } from "@/lib/practice-data";
import { learner } from "@/lib/learning-data";

type Session = { title: string; rounds: readonly PracticeRound[] };

export function PracticeView() {
  const [session, setSession] = useState<Session | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const finish = (title: string) => setHistory((items) => [title, ...items.filter((item) => item !== title)].slice(0, 3));

  return (
    <div className="rise-in">
      <section className="overflow-hidden rounded-lg bg-ink text-primary-foreground shadow-lg">
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase text-primary-foreground/60">Practise · your choice</p>
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">Sharpen the ears.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/75">
              Short sessions you pick yourself, any time. These drills sit apart from your lessons — finishing one never
              unlocks a unit, it just keeps the sounds warm.
            </p>
          </div>
          <Button
            className="border-b-4 border-highlight bg-highlight text-highlight-foreground hover:bg-highlight/90 active:translate-y-0.5 active:border-b-2"
            onClick={() => setSession({ title: "Mixed run", rounds: mixedRounds })}
          >
            <Shuffle className="size-4" /> Mixed run <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      <div className="mt-7 grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="focus-heading">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">Choose a focus</p>
            <h2 id="focus-heading" className="mt-1 font-display text-2xl font-semibold">Four ways to warm up</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {practiceFocuses.map(({ id, name, detail, minutes, icon: Icon, rounds }) => {
              const played = history.includes(name);
              return (
                <article key={id} className="flex flex-col justify-between rounded-md border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid size-11 place-items-center rounded-md bg-secondary text-secondary-foreground"><Icon className="size-5" /></div>
                      {played ? <span className="inline-flex items-center gap-1 rounded-sm bg-secondary px-2 py-1 text-[10px] font-black uppercase text-secondary-foreground"><Check className="size-3" /> Done today</span> : null}
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold">{name}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground"><Clock className="size-3.5" /> {rounds.length} activities · ~{minutes} min</span>
                    <Button variant="secondary" className="border-b-2 border-brand active:translate-y-0.5 active:border-b-0" onClick={() => setSession({ title: name, rounds })}>
                      Start
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-4 inline-flex rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder content — sample lines, not verified teaching material</p>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-26">
          <section className="rounded-md border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2"><Flame className="size-4 text-highlight" fill="currentColor" /><h2 className="text-sm font-extrabold uppercase">This week</h2></div>
            <p className="mt-3 font-display text-3xl font-semibold">{history.length ? history.length : 0} <span className="text-base font-bold text-muted-foreground">sessions practised</span></p>
            <ul className="mt-4 space-y-2 text-sm">
              {history.length ? history.map((item) => <li key={item} className="flex items-center gap-2 font-bold"><Check className="size-4 text-primary" /> {item}</li>) : <li className="text-muted-foreground">Nothing yet — pick a focus and run one.</li>}
            </ul>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-highlight" style={{ width: `${Math.min(100, Math.round((learner.completedMinutes / learner.dailyGoal) * 100))}%` }} /></div>
            <p className="mt-2 text-xs font-bold text-muted-foreground">{learner.completedMinutes} of {learner.dailyGoal} minutes on your goal</p>
          </section>

          <section className="rounded-md border border-border bg-secondary p-5">
            <div className="flex items-start gap-3"><Layers className="mt-0.5 size-5 text-highlight-foreground" /><div><p className="text-xs font-extrabold uppercase text-muted-foreground">How this differs</p><h2 className="mt-1 font-display text-xl font-semibold">Drills, not lessons</h2></div></div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Lessons move you along the path and are marked done. Practise sessions repeat forever, in no particular order, and reshuffle the tiles each time.</p>
          </section>

          <section className="rounded-md border border-border bg-card p-5">
            <h2 className="text-sm font-extrabold uppercase">Sound promise</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Audio samples and tile labels are placeholders until recorded, reviewed material is connected. Nothing here is presented as verified.</p>
          </section>
        </aside>
      </div>

      {session ? (
        <PracticeGame
          rounds={session.rounds}
          mode="free"
          heading={session.title}
          onClose={() => setSession(null)}
          onComplete={() => finish(session.title)}
        />
      ) : null}
    </div>
  );
}
