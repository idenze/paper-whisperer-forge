import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Home,
  LockKeyhole,
  MessageCircle,
  Search,
  Sparkles,
  SquarePen,
  Trophy,
  UserRound,
  Volume2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { NdebeStudio } from "@/components/ndebe-studio";
import { OzitumaMark } from "@/components/ozituma-mark";
import { TutorView } from "@/components/tutor-view";
import { journey, learner, units } from "@/lib/learning-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ozituma Learn Igbo — Your daily learning journey" },
      { name: "description", content: "Build confidence in Igbo through short lessons, listening, review, and culturally grounded practice." },
      { property: "og:title", content: "Ozituma Learn Igbo" },
      { property: "og:description", content: "A thoughtful daily path into Igbo language and culture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tab = "Home" | "Learn" | "Tutor" | "Ndebe" | "Profile";

const navItems = [
  { label: "Home", icon: Home },
  { label: "Learn", icon: BookOpen },
  { label: "Practise", icon: Sparkles, href: "https://ozituma.com/practice" },
  { label: "Tutor", icon: MessageCircle },
  { label: "Ndebe", icon: SquarePen },
  { label: "Dictionary", icon: Search, href: "https://ozituma.com/" },
  { label: "Profile", icon: UserRound },
] as const;

function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [lessonOpen, setLessonOpen] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const markDone = (id: string) => {
    setCompleted((items) => (items.includes(id) ? items : [...items, id]));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <OzitumaMark />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navItems.map(({ label, icon: Icon, ...item }) =>
              "href" in item ? (
                <Button key={label} asChild variant="ghost">
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <Icon className="size-4" /> {label}
                  </a>
                </Button>
              ) : (
                <Button key={label} variant="ghost" onClick={() => setActiveTab(label as Tab)} aria-current={activeTab === label ? "page" : undefined} className={activeTab === label ? "bg-secondary text-secondary-foreground" : ""}>
                  <Icon className="size-4" /> {label}
                </Button>
              ),
            )}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-2 sm:flex">
              <Flame className="size-4 text-highlight" fill="currentColor" />
              <span className="text-sm font-extrabold">{learner.streak}</span>
              <span className="text-xs text-muted-foreground">day streak</span>
            </div>
            <button className="grid size-10 place-items-center rounded-full bg-ink text-sm font-black text-primary-foreground" aria-label="Open profile">CE</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 pb-28 pt-7 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
        <section className="rise-in mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase text-primary">Monday · Today’s journey</p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">Nnọọ, {learner.name}.</h1>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">A little every day goes a long way. You have four short activities waiting.</p>
          </div>
          <div className="flex min-w-64 items-center gap-4 rounded-md border border-border bg-card px-4 py-3 shadow-sm">
            <div className="grid size-12 place-items-center rounded-full bg-secondary text-sm font-black text-secondary-foreground">L{learner.level}</div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold"><span>Level {learner.level}</span><span>{learner.xp.toLocaleString()} XP</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-[62%] rounded-full bg-highlight" /></div>
            </div>
          </div>
        </section>

        {activeTab === "Tutor" ? (
          <TutorView />
        ) : activeTab === "Ndebe" ? (
          <NdebeStudio />
        ) : activeTab !== "Home" && activeTab !== "Learn" ? (
          <ComingSoon tab={activeTab} onBack={() => setActiveTab("Home")} />
        ) : (
          <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-8">
              {activeTab === "Home" && (
                <>
                  <section className="rise-in-delay overflow-hidden rounded-lg bg-brand text-brand-foreground shadow-lg">
                    <div className="grid md:grid-cols-[1fr_240px]">
                      <div className="p-6 sm:p-8">
                        <div className="mb-8 flex items-center gap-2 text-xs font-extrabold uppercase text-brand-foreground/75"><span className="h-px w-8 bg-highlight" /> Unit 1 · Lesson 2</div>
                        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Continue: Greetings</h2>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-brand-foreground/80">Pick up where you left off with a short listening and recognition exercise.</p>
                        <Button className="mt-7 bg-highlight text-highlight-foreground hover:bg-highlight/90" onClick={() => { setLessonOpen(true); setAnswer(null); }}>
                          Continue lesson <ArrowRight className="size-4" />
                        </Button>
                      </div>
                      <div className="relative hidden overflow-hidden border-l border-brand-foreground/15 md:block" aria-hidden="true">
                        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(30deg,transparent_35%,currentColor_36%,currentColor_38%,transparent_39%),linear-gradient(-30deg,transparent_35%,currentColor_36%,currentColor_38%,transparent_39%)] [background-size:42px_72px]" />
                        <div className="absolute bottom-6 left-6 right-6 border-l-4 border-highlight pl-4 font-display text-2xl leading-tight">Learn it.<br />Live it.<br />Pass it on.</div>
                      </div>
                    </div>
                  </section>

                  <section aria-labelledby="journey-heading">
                    <div className="mb-4 flex items-end justify-between">
                      <div><p className="text-xs font-bold uppercase text-muted-foreground">Your plan</p><h2 id="journey-heading" className="mt-1 font-display text-2xl font-semibold">Today’s journey</h2></div>
                      <span className="text-sm font-bold text-primary">{learner.completedMinutes + completed.length * 2} / {learner.dailyGoal} min</span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {journey.map(({ id, title, detail, action, icon: Icon, tone }) => {
                        const isDone = completed.includes(id);
                        return (
                          <article key={id} className="group flex min-h-32 items-center gap-4 rounded-md border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className={`grid size-12 shrink-0 place-items-center rounded-md ${tone === "green" ? "bg-primary text-primary-foreground" : tone === "coral" ? "bg-accent text-accent-foreground" : tone === "gold" ? "bg-secondary text-secondary-foreground" : "bg-ink text-primary-foreground"}`}><Icon className="size-5" /></div>
                            <div className="min-w-0 flex-1"><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{detail}</p></div>
                            <Button variant={isDone ? "ghost" : "icon"} aria-label={`${action}: ${title}`} onClick={() => id === "continue" ? setLessonOpen(true) : markDone(id)}>
                              {isDone ? <Check className="size-5 text-primary" /> : <ChevronRight className="size-5" />}
                            </Button>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}

              <CoursePath onStart={() => setLessonOpen(true)} expanded={activeTab === "Learn"} />
            </div>

            <aside className="space-y-5 xl:sticky xl:top-26">
              <section className="rounded-md border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Daily goal</h2><span className="text-xs font-extrabold text-primary">60%</span></div>
                <div className="mt-5 flex items-center gap-5">
                  <div className="relative grid size-24 place-items-center rounded-full" style={{ background: "conic-gradient(var(--color-primary) 60%, var(--color-muted) 0)" }}>
                    <div className="grid size-[74px] place-items-center rounded-full bg-card text-center"><span><b className="block text-xl">9</b><small className="text-muted-foreground">minutes</small></span></div>
                  </div>
                  <div><p className="font-bold">6 minutes to go</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Finish one more activity to reach today’s goal.</p></div>
                </div>
              </section>

              <section className="rounded-md border border-border bg-secondary p-5">
                <div className="flex items-start gap-3"><Trophy className="mt-0.5 size-5 text-highlight-foreground" /><div><p className="text-xs font-extrabold uppercase text-muted-foreground">Weekly rhythm</p><h2 className="mt-1 font-display text-xl font-semibold">Five active days</h2></div></div>
                <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-muted-foreground">
                  {"MTWTFSS".split("").map((day, index) => <div key={`${day}-${index}`}><span className={`mx-auto mb-2 grid size-7 place-items-center rounded-full ${index < 5 ? "bg-primary text-primary-foreground" : "bg-card"}`}>{index < 5 ? <Check className="size-3" /> : day}</span>{day}</div>)}
                </div>
              </section>

              <section className="rounded-md border border-border bg-card p-5">
                <div className="flex items-center gap-2"><Volume2 className="size-4 text-primary" /><h2 className="text-sm font-extrabold uppercase">Content promise</h2></div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Language content will carry a clear review label. Demonstration text is never presented as verified teaching material.</p>
                <span className="mt-4 inline-flex rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder content</span>
              </section>
            </aside>
          </div>
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-border bg-card px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-lg lg:hidden" aria-label="Mobile navigation">
        {navItems.slice(0, 6).map(({ label, icon: Icon, ...item }) =>
          "href" in item ? (
            <a key={label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[10px] font-bold text-muted-foreground"><Icon className="size-5" />{label}</a>
          ) : (
            <button key={label} onClick={() => setActiveTab(label as Tab)} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[10px] font-bold ${activeTab === label ? "text-primary" : "text-muted-foreground"}`}><Icon className="size-5" />{label}</button>
          ),
        )}
      </nav>

      {lessonOpen && <LessonDialog answer={answer} setAnswer={setAnswer} onClose={() => setLessonOpen(false)} onComplete={() => { markDone("continue"); setLessonOpen(false); }} />}
    </div>
  );
}

function CoursePath({ onStart, expanded }: { onStart: () => void; expanded: boolean }) {
  return (
    <section aria-labelledby="path-heading" className={expanded ? "pt-1" : ""}>
      <div className="mb-4"><p className="text-xs font-bold uppercase text-muted-foreground">Level 0 · Foundations</p><h2 id="path-heading" className="mt-1 font-display text-2xl font-semibold">Your learning path</h2></div>
      <div className="space-y-3">
        {units.map((unit) => <article key={unit.number} className="rounded-md border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className={`grid size-11 shrink-0 place-items-center rounded-md font-black ${unit.progress ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{unit.number}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-display text-xl font-semibold">{unit.title}</h3><p className="text-sm text-muted-foreground">{unit.detail}</p></div><span className="text-xs font-bold text-muted-foreground">{unit.progress}%</span></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${unit.progress}%` }} /></div>
              {(expanded || unit.number === 1) && <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {unit.lessons.map((lesson) => <button key={lesson.title} disabled={lesson.status === "locked"} onClick={lesson.status === "current" ? onStart : undefined} className={`flex min-h-12 items-center gap-3 rounded-md border px-3 text-left text-sm font-bold transition ${lesson.status === "current" ? "border-primary bg-secondary text-secondary-foreground" : "border-border bg-background disabled:opacity-55"}`}>
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full ${lesson.status === "done" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{lesson.status === "done" ? <Check className="size-3.5" /> : lesson.status === "locked" ? <LockKeyhole className="size-3.5" /> : <BookOpen className="size-3.5" />}</span>{lesson.title}
                </button>)}
              </div>}
            </div>
          </div>
        </article>)}
      </div>
    </section>
  );
}

function ComingSoon({ tab, onBack }: { tab: Exclude<Tab, "Home" | "Learn">; onBack: () => void }) {
  return <section className="mx-auto max-w-2xl py-24 text-center"><span className="mx-auto grid size-14 place-items-center rounded-md bg-secondary text-secondary-foreground"><Sparkles className="size-6" /></span><p className="mt-6 text-xs font-bold uppercase text-primary">First milestone</p><h1 className="mt-2 font-display text-4xl font-semibold">{tab} is taking shape.</h1><p className="mx-auto mt-4 max-w-lg text-muted-foreground">This area is reserved in the learning experience and will be connected when approved content and services are ready.</p><Button className="mt-7" onClick={onBack}>Return home</Button></section>;
}

function LessonDialog({ answer, setAnswer, onClose, onComplete }: { answer: number | null; setAnswer: (value: number) => void; onClose: () => void; onComplete: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-end bg-foreground/35 p-0 sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
    <div className="w-full max-w-xl rounded-t-lg bg-card p-5 shadow-2xl sm:rounded-lg sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><span className="inline-flex rounded-sm bg-muted px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">Placeholder content</span><h2 id="lesson-title" className="mt-3 font-display text-3xl font-semibold">Listening check</h2><p className="mt-2 text-sm text-muted-foreground">A structure preview. Approved recordings and language will replace this demonstration.</p></div><Button variant="icon" onClick={onClose} aria-label="Close lesson"><X className="size-5" /></Button></div>
      <button className="mt-6 flex w-full items-center justify-center gap-3 rounded-md bg-brand px-4 py-6 font-bold text-brand-foreground" aria-label="Play placeholder audio"><Volume2 className="size-5" /> Play sample audio</button>
      <fieldset className="mt-6"><legend className="mb-3 text-sm font-extrabold">Choose the matching meaning</legend><div className="grid gap-2">{["PLACEHOLDER option A", "PLACEHOLDER option B", "PLACEHOLDER option C"].map((option, index) => <button key={option} onClick={() => setAnswer(index)} className={`min-h-12 rounded-md border px-4 text-left text-sm font-semibold ${answer === index ? "border-primary bg-secondary" : "border-border bg-background"}`}>{String.fromCharCode(65 + index)}. {option}</button>)}</div></fieldset>
      <Button className="mt-6 w-full" disabled={answer === null} onClick={onComplete}>Check and continue <ArrowRight className="size-4" /></Button>
    </div>
  </div>;
}
