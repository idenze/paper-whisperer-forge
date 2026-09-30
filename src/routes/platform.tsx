import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Bell, CalendarDays, Check, ChevronLeft, ChevronRight, ClipboardList, GraduationCap, Inbox, LayoutDashboard, LineChart, MessageSquare, Search, Shield, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow, EmptyState, StatusBadge } from "@/components/product-ui";
import { Classroom } from "@/components/platform/classroom";
import type { Lesson, Role, Slot } from "@/lib/contracts";
import { previewAdmin, previewAssignments, previewConversations, previewLessons, previewMessages, previewNotifications, previewProgress, previewSlots, previewStudents, previewWallet } from "@/lib/platform-preview";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Lessons & classroom — Ozituma" },
      { name: "description", content: "Book Igbo teachers, message them, join lessons in the Ozituma classroom and track homework and progress." },
      { property: "og:title", content: "Lessons & classroom — Ozituma" },
      { property: "og:description", content: "Book, learn and teach Igbo in one place: calendar, messages, classroom, homework and progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlatformPage,
});

const navByRole: Record<Role, { id: string; label: string; icon: typeof LayoutDashboard }[]> = {
  student: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }, { id: "book", label: "Book a lesson", icon: CalendarDays },
    { id: "messages", label: "Messages", icon: MessageSquare }, { id: "lessons", label: "Lessons", icon: GraduationCap },
    { id: "assignments", label: "Assignments", icon: ClipboardList }, { id: "progress", label: "Progress", icon: LineChart },
    { id: "notifications", label: "Notifications", icon: Bell },
  ],
  teacher: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }, { id: "calendar", label: "Availability", icon: CalendarDays },
    { id: "students", label: "Students", icon: Users }, { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "lessons", label: "Lessons", icon: GraduationCap }, { id: "assignments", label: "Assignments", icon: ClipboardList },
    { id: "earnings", label: "Earnings", icon: Wallet }, { id: "notifications", label: "Notifications", icon: Bell },
  ],
  admin: [{ id: "admin", label: "Admin console", icon: Shield }],
};

function PlatformPage() {
  const [role, setRole] = useState<Role>("student");
  const [section, setSection] = useState("dashboard");
  const [classroom, setClassroom] = useState<Lesson | null>(null);
  const nav = navByRole[role];
  const pick = (r: Role) => { setRole(r); setSection(navByRole[r][0]!.id); };
  const join = (l: Lesson) => setClassroom(l);

  return (
    <div className="min-h-screen bg-background">
      {classroom && role !== "admin" && <Classroom lesson={classroom} role={role} onLeave={() => setClassroom(null)} />}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Ozituma</Link>
          <p className="font-display text-xl">Lessons</p>
          <StatusBadge tone="warning">Preview data</StatusBadge>
          <div className="ml-auto flex rounded-md border border-border p-0.5 text-sm" role="tablist" aria-label="View as">
            {(["student", "teacher", "admin"] as Role[]).map((r) => (
              <button key={r} role="tab" aria-selected={role === r} onClick={() => pick(r)} className={`rounded px-3 py-1.5 capitalize ${role === r ? "bg-primary text-primary-foreground" : ""}`}>{r}</button>
            ))}
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2" aria-label={`${role} menu`}>
          {nav.map((n) => (
            <button key={n.id} onClick={() => setSection(n.id)} aria-current={section === n.id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm ${section === n.id ? "bg-muted font-semibold text-primary" : "text-muted-foreground"}`}>
              <n.icon className="size-4" />{n.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="mb-5 text-xs text-muted-foreground">Everything here is fictional preview content so you can see how it works. Nothing is saved, charged or sent until the backend is connected.</p>
        {role === "student" && section === "dashboard" && <StudentDashboard onJoin={join} go={setSection} />}
        {role === "teacher" && section === "dashboard" && <TeacherDashboard onJoin={join} go={setSection} />}
        {section === "book" && <BookingFlow />}
        {section === "calendar" && <AvailabilityEditor />}
        {section === "students" && <StudentsList />}
        {section === "messages" && <Messages />}
        {section === "lessons" && <LessonsList role={role} onJoin={join} />}
        {section === "assignments" && <Assignments role={role} />}
        {section === "progress" && <Progress />}
        {section === "earnings" && <Earnings />}
        {section === "notifications" && <Notifications />}
        {section === "admin" && <AdminConsole />}
      </main>
    </div>
  );
}

const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" });
const statusTone = (s: string) => (["confirmed", "verified", "reviewed", "Approved", "Verified", "Paid", "Published", "Active"].includes(s) ? "positive" : ["requested", "pending", "overdue", "Pending", "Open dispute", "unpaid"].includes(s) ? "warning" : "neutral") as "positive" | "warning" | "neutral";

function LessonRow({ l, role, onJoin }: { l: Lesson; role: Role; onJoin: (l: Lesson) => void }) {
  const otherName = role === "teacher" ? l.studentName : l.teacherName;
  const otherPhoto = role === "teacher" ? l.studentPhotoUrl : l.teacherPhotoUrl;
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-border py-4 last:border-0">
      {otherPhoto
        ? <img src={otherPhoto} alt={`Sample photo of ${otherName}`} width={80} height={80} loading="lazy" className="size-10 rounded-full object-cover" />
        : <span className="grid size-10 place-items-center rounded-full bg-muted font-semibold">{otherName[0]}</span>}
      <div className="min-w-[10rem] flex-1">
        <p className="font-semibold">{l.topic}</p>
        <p className="text-sm text-muted-foreground">{fmt(l.startsAt)} · {l.minutes} min · {otherName}</p>
      </div>
      <StatusBadge tone={statusTone(l.status)}>{l.status}</StatusBadge>
      <StatusBadge tone={statusTone(l.payment)}>{l.payment === "verified" ? "Paid" : l.payment}</StatusBadge>
      {l.status === "confirmed" && <Button size="sm" disabled={!l.canJoin} onClick={() => onJoin(l)} title={l.canJoin ? "" : "Opens once payment is verified"}>Join lesson</Button>}
    </li>
  );
}

function Card({ title, eyebrow, children, action }: { title: string; eyebrow?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="border border-border bg-card p-5">
      <div className="mb-3 flex items-end justify-between gap-3"><div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h2 className="font-display text-xl">{title}</h2></div>{action}</div>
      {children}
    </section>
  );
}

function StudentDashboard({ onJoin, go }: { onJoin: (l: Lesson) => void; go: (s: string) => void }) {
  const next = previewLessons.find((l) => l.status === "confirmed" && l.canJoin)!;
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="bg-primary p-6 text-primary-foreground lg:col-span-2">
        <Eyebrow className="text-primary-foreground/80">Ihe na-esote · Next lesson</Eyebrow>
        <h1 className="mt-2 font-display text-3xl">{next.topic}</h1>
        <p className="mt-1 flex items-center gap-2 opacity-80">
          {next.teacherPhotoUrl && <img src={next.teacherPhotoUrl} alt={`Sample photo of ${next.teacherName}`} width={80} height={80} loading="lazy" className="size-8 rounded-full object-cover" />}
          with {next.teacherName} · {fmt(next.startsAt)}
        </p>
        <Button variant="secondary" className="mt-5" onClick={() => onJoin(next)}>Join lesson</Button>
      </section>
      <Card title="Your progress" eyebrow="Level">
        <p className="font-display text-2xl">{previewProgress.level}</p>
        <p className="text-sm text-muted-foreground">{previewProgress.lessonsCompleted} lessons · {previewProgress.vocabulary} words</p>
        <button className="mt-3 text-sm font-semibold text-primary" onClick={() => go("progress")}>See progress →</button>
      </Card>
      <Card title="To do" eyebrow="Homework" action={<button className="text-sm text-primary" onClick={() => go("assignments")}>All</button>}>
        {previewAssignments.filter((a) => a.studentName === "Tobi A." && a.state !== "reviewed").map((a) => <p key={a.id} className="text-sm">{a.title} · <span className="text-muted-foreground">due {a.due}</span></p>)}
      </Card>
      <Card title="Coming up" eyebrow="Lessons" action={<button className="text-sm text-primary" onClick={() => go("book")}>Book another</button>}>
        <ul>{previewLessons.filter((l) => l.status !== "completed").slice(0, 2).map((l) => <LessonRow key={l.id} l={l} role="student" onJoin={onJoin} />)}</ul>
      </Card>
      <Card title="Messages" eyebrow="Inbox"><p className="text-sm">{previewConversations[0]!.name}: “{previewConversations[0]!.lastMessage}”</p><button className="mt-2 text-sm text-primary" onClick={() => go("messages")}>Open messages →</button></Card>
    </div>
  );
}

function TeacherDashboard({ onJoin, go }: { onJoin: (l: Lesson) => void; go: (s: string) => void }) {
  const today = previewLessons.filter((l) => l.teacherName === "Adaeze O." && l.status === "confirmed");
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2"><Card title="Today's lessons" eyebrow="Agenda"><ul>{today.map((l) => <LessonRow key={l.id} l={l} role="teacher" onJoin={onJoin} />)}</ul></Card></div>
      <Card title="This month" eyebrow="Earnings"><p className="font-display text-3xl">{previewWallet.currency}{previewWallet.thisMonth.toLocaleString()}</p><p className="text-sm text-muted-foreground">{previewWallet.lessons} lessons · figures come from the payment system</p><button className="mt-3 text-sm text-primary" onClick={() => go("earnings")}>Open earnings →</button></Card>
      <Card title="Needs attention" eyebrow="Students">
        <ul className="space-y-2 text-sm">{previewStudents.map((s) => (
          <li key={s.id} className="flex items-center gap-2">
            {s.photoUrl
              ? <img src={s.photoUrl} alt={`Sample photo of ${s.name}`} width={80} height={80} loading="lazy" className="size-8 rounded-full object-cover" />
              : <span className="grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold">{s.name[0]}</span>}
            <span className="min-w-0 flex-1"><b>{s.name}</b> — {s.note}</span>
          </li>
        ))}</ul>
      </Card>
      <Card title="Prepare" eyebrow="Before 18:00">
        <ul className="space-y-2 text-sm"><li>☐ Share “Market greetings” material</li><li>☐ Review Tobi's greeting recordings</li><li>☐ Add notes after Numbers lesson</li></ul>
      </Card>
      <Card title="Requests" eyebrow="Bookings"><p className="text-sm">1 new request waiting.</p><button className="mt-2 text-sm text-primary" onClick={() => go("lessons")}>Review →</button></Card>
    </div>
  );
}

function BookingFlow() {
  const steps = ["Lesson", "Duration", "Date & time", "Review", "Payment", "Done"];
  const [step, setStep] = useState(0);
  const [type, setType] = useState("Trial lesson");
  const [minutes, setMinutes] = useState(60);
  const [date, setDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; });
  const [slot, setSlot] = useState<Slot | null>(null);
  const slots = useMemo(() => previewSlots(date), [date]);
  const price = minutes === 30 ? 4500 : minutes === 60 ? 8000 : 11500;
  const shift = (n: number) => { const d = new Date(date); d.setDate(d.getDate() + n); setDate(d); setSlot(null); };

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-6 flex flex-wrap gap-2 text-xs">{steps.map((s, i) => <li key={s} className={`rounded-full px-3 py-1 ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-muted" : "border border-border text-muted-foreground"}`}>{i + 1}. {s}</li>)}</ol>
      <Card title={steps[step]!} eyebrow="Adaeze O. · Enugu dialect">
        {step === 0 && <Choice options={["Trial lesson", "Regular lesson", "Weekly recurring"]} value={type} onChange={setType} />}
        {step === 1 && <Choice options={["30", "60", "90"]} value={String(minutes)} onChange={(v) => setMinutes(Number(v))} suffix=" min" />}
        {step === 2 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <button aria-label="Previous day" onClick={() => shift(-1)}><ChevronLeft /></button>
              <p className="font-semibold">{date.toDateString()}</p>
              <button aria-label="Next day" onClick={() => shift(1)}><ChevronRight /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {slots.map((s) => {
                const sel = slot?.startsAt === s.startsAt;
                const off = s.state !== "available";
                return (
                  <button key={s.startsAt} disabled={off} onClick={() => setSlot(s)} aria-pressed={sel}
                    className={`min-h-11 rounded border text-sm ${sel ? "border-primary bg-primary text-primary-foreground" : off ? "border-dashed border-border text-muted-foreground line-through" : "border-border hover:border-primary"}`}>
                    {new Date(s.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {off && <span className="block text-[10px] no-underline">{s.state}</span>}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Only times the booking system confirms as open can be picked.</p>
          </div>
        )}
        {step === 3 && (
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {[["Teacher", "Adaeze O."], ["Lesson", type], ["When", slot ? fmt(slot.startsAt) : "—"], ["Duration", `${minutes} min`], ["Price", `₦${price.toLocaleString()}`], ["Cancellation", "Free up to 24 hours before"]].map(([k, v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
          </dl>
        )}
        {step === 4 && <div className="text-sm"><p>You'll pay <b>₦{price.toLocaleString()}</b> securely with Paystack.</p><p className="mt-2 text-muted-foreground">Your lesson is only confirmed after the payment is verified by our server — not by this page.</p></div>}
        {step === 5 && <div className="text-center"><Check className="mx-auto size-10 text-primary" /><p className="mt-2 font-display text-xl">Request ready</p><p className="text-sm text-muted-foreground">In the live app you'd get a confirmation once payment is verified. Preview — nothing was booked.</p></div>}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
          {step < 5 && <Button disabled={step === 2 && !slot} onClick={() => setStep(step + 1)}>{step === 4 ? "Pay with Paystack (preview)" : "Continue"}</Button>}
          {step === 5 && <Button onClick={() => { setStep(0); setSlot(null); }}>Book another</Button>}
        </div>
      </Card>
    </div>
  );
}

function Choice({ options, value, onChange, suffix = "" }: { options: string[]; value: string; onChange: (v: string) => void; suffix?: string }) {
  return <div className="grid gap-2 sm:grid-cols-3">{options.map((o) => <button key={o} aria-pressed={value === o} onClick={() => onChange(o)} className={`min-h-14 rounded border px-3 text-sm font-semibold ${value === o ? "border-primary bg-muted text-primary" : "border-border"}`}>{o}{suffix}</button>)}</div>;
}

function AvailabilityEditor() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [9, 11, 14, 17, 18, 19, 20];
  const [on, setOn] = useState<Set<string>>(new Set(["Mon-17", "Mon-18", "Wed-18", "Sat-11"]));
  const toggle = (k: string) => { const n = new Set(on); n.has(k) ? n.delete(k) : n.add(k); setOn(n); };
  return (
    <Card title="Weekly availability" eyebrow="Tap to open or close a time">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead><tr><th />{days.map((d) => <th key={d} className="p-1 font-semibold">{d}</th>)}</tr></thead>
          <tbody>{hours.map((h) => <tr key={h}><td className="pr-2 text-muted-foreground">{h}:00</td>{days.map((d) => { const k = `${d}-${h}`; const open = on.has(k); return <td key={k} className="p-1"><button aria-label={`${d} ${h}:00 ${open ? "open" : "closed"}`} aria-pressed={open} onClick={() => toggle(k)} className={`h-9 w-full rounded ${open ? "bg-primary text-primary-foreground" : "border border-dashed border-border"}`}>{open ? "Open" : ""}</button></td>; })}</tr>)}</tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Days off and exceptions go here too. Saving and double-booking protection are handled by the booking system.</p>
      <Button className="mt-3" disabled>Save availability (connects soon)</Button>
    </Card>
  );
}

function StudentsList() {
  const [open, setOpen] = useState<string | null>(null);
  const s = previewStudents.find((x) => x.id === open);
  if (s) return (
    <Card title={s.name} eyebrow={s.level} action={<button className="text-sm text-primary" onClick={() => setOpen(null)}>← All students</button>}>
      <dl className="grid gap-3 text-sm sm:grid-cols-3">{[["Goal", s.goal], ["Lessons", s.lessonsCompleted], ["Next", s.nextLesson ?? "Not booked"], ["Last", s.lastLesson], ["Open homework", s.openAssignments], ["Progress", `${s.progress}%`]].map(([k, v]) => <div key={String(k)}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
      <p className="mt-4 text-sm"><b>Teacher note:</b> {s.note}</p>
    </Card>
  );
  return (
    <Card title="Your students" eyebrow="Ụmụ akwụkwọ">
      <ul>{previewStudents.map((st) => (
        <li key={st.id}><button onClick={() => setOpen(st.id)} className="flex w-full flex-wrap items-center gap-3 border-b border-border py-3 text-left last:border-0">
          {st.photoUrl
            ? <img src={st.photoUrl} alt={`Sample photo of ${st.name}`} width={80} height={80} loading="lazy" className="size-10 rounded-full object-cover" />
            : <span className="grid size-10 place-items-center rounded-full bg-muted font-semibold">{st.name[0]}</span>}
          <span className="min-w-0 flex-1"><b>{st.name}</b><span className="block text-sm text-muted-foreground">{st.level} · next: {st.nextLesson ?? "not booked"}</span></span>
          <span className="w-24"><span className="block h-2 rounded bg-muted"><span className="block h-2 rounded bg-primary" style={{ width: `${st.progress}%` }} /></span></span>
        </button></li>
      ))}</ul>
    </Card>
  );
}

function Messages() {
  const [active, setActive] = useState<string | null>(null);
  const [threads, setThreads] = useState(previewMessages);
  const [draft, setDraft] = useState("");
  const convo = previewConversations.find((c) => c.id === active);
  const send = () => {
    if (!active || !draft.trim()) return;
    setThreads({ ...threads, [active]: [...(threads[active] ?? []), { id: String(Date.now()), fromMe: true, body: draft, at: "now", state: "sending" }] });
    setDraft("");
  };
  return (
    <div className="grid min-h-[480px] border border-border bg-card md:grid-cols-[280px_1fr]">
      <ul className={`border-r border-border ${active ? "hidden md:block" : ""}`}>
        {previewConversations.map((c) => (
          <li key={c.id}><button onClick={() => setActive(c.id)} className={`w-full border-b border-border p-4 text-left ${active === c.id ? "bg-muted" : ""}`}>
            <span className="flex items-center justify-between gap-2"><span className="flex min-w-0 items-center gap-2">
              {c.photoUrl
                ? <img src={c.photoUrl} alt={`Sample photo of ${c.name}`} width={64} height={64} loading="lazy" className="size-8 rounded-full object-cover" />
                : <span className="grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold">{c.name[0]}</span>}
              <b className="truncate">{c.name}</b></span><span className="text-xs text-muted-foreground">{c.updatedAt}</span></span>
            <span className="flex gap-2 text-sm text-muted-foreground"><span className="truncate">{c.lastMessage}</span>{c.unread > 0 && <span className="rounded-full bg-primary px-2 text-xs text-primary-foreground">{c.unread}</span>}</span>
          </button></li>
        ))}
      </ul>
      {convo ? (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 border-b border-border p-4"><button className="md:hidden" aria-label="Back" onClick={() => setActive(null)}><ArrowLeft className="size-4" /></button>{convo.photoUrl && <img src={convo.photoUrl} alt="" width={64} height={64} className="size-8 rounded-full object-cover" />}<b>{convo.name}</b></div>
          <div className="flex-1 space-y-2 overflow-auto p-4">{(threads[convo.id] ?? []).map((m) => (
            <div key={m.id} className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.fromMe ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>{m.body}<span className="mt-1 block text-[10px] opacity-70">{m.at}{m.fromMe && ` · ${m.state === "sending" ? "Not sent — preview" : "Sent"}`}</span></div>
          ))}</div>
          <form className="flex gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input aria-label="Write a message" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" className="flex-1 rounded border border-border bg-background px-3" />
            <Button type="submit">Send</Button>
          </form>
        </div>
      ) : <div className="hidden place-items-center md:grid"><EmptyState icon={Inbox} title="Pick a conversation" body="Messages with your teachers and students appear here." /></div>}
    </div>
  );
}

function LessonsList({ role, onJoin }: { role: Role; onJoin: (l: Lesson) => void }) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const list = previewLessons.filter((l) => (tab === "past") === (l.status === "completed"));
  return (
    <Card title="Lessons" eyebrow="Ọmụmụ" action={<div className="flex gap-1 text-sm">{(["upcoming", "past"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded px-3 py-1 capitalize ${tab === t ? "bg-muted font-semibold" : ""}`}>{t}</button>)}</div>}>
      <ul>{list.map((l) => <LessonRow key={l.id} l={l} role={role} onJoin={onJoin} />)}</ul>
      {tab === "past" && <p className="mt-3 text-sm text-muted-foreground">{role === "teacher" ? "Add a quick summary: topic, vocabulary, homework." : "Leave a review after a completed lesson."}</p>}
    </Card>
  );
}

function Assignments({ role }: { role: Role }) {
  const list = role === "student" ? previewAssignments.filter((a) => a.studentName === "Tobi A.") : previewAssignments;
  return (
    <Card title="Assignments" eyebrow={role === "teacher" ? "Across your students" : "Your homework"} action={role === "teacher" ? <Button size="sm" disabled>New assignment</Button> : undefined}>
      <ul>{list.map((a) => (
        <li key={a.id} className="flex flex-wrap items-center gap-3 border-b border-border py-3 last:border-0">
          <div className="flex-1"><b>{a.title}</b><p className="text-sm text-muted-foreground">{role === "teacher" && `${a.studentName} · `}due {a.due}</p></div>
          <span className="w-24"><span className="block h-2 rounded bg-muted"><span className="block h-2 rounded bg-primary" style={{ width: `${a.progress}%` }} /></span></span>
          <StatusBadge tone={statusTone(a.state)}>{a.state.replace("_", " ")}</StatusBadge>
          {role === "student" && a.state !== "reviewed" && <Button size="sm" variant="outline">Continue</Button>}
        </li>
      ))}</ul>
    </Card>
  );
}

function Progress() {
  const p = previewProgress;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card title={p.level} eyebrow="Level">
        <div className="grid grid-cols-3 gap-3 text-center">{[["Lessons", p.lessonsCompleted], ["Hours", p.hours], ["Words", p.vocabulary]].map(([k, v]) => <div key={String(k)} className="bg-muted p-3"><p className="font-display text-2xl">{v}</p><p className="text-xs text-muted-foreground">{k}</p></div>)}</div>
      </Card>
      <Card title="Skills" eyebrow="Nkà">{p.skills.map((s) => <div key={s.name} className="mb-2 text-sm"><div className="flex justify-between"><span>{s.name}</span><span>{s.value}%</span></div><div className="h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${s.value}%` }} /></div></div>)}</Card>
      <Card title="Work on next" eyebrow="Focus"><ul className="list-disc pl-5 text-sm">{p.focusAreas.map((f) => <li key={f}>{f}</li>)}</ul></Card>
      <Card title="Goals" eyebrow="Upcoming"><ul className="list-disc pl-5 text-sm">{p.goals.map((g) => <li key={g}>{g}</li>)}</ul></Card>
    </div>
  );
}

function Earnings() {
  const w = previewWallet;
  const money = (n: number) => `${n < 0 ? "−" : ""}${w.currency}${Math.abs(n).toLocaleString()}`;
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-4">{[["This month", w.thisMonth], ["Available", w.available], ["Pending", w.pending], ["Lessons", w.lessons]].map(([k, v]) => <div key={String(k)} className="border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{k}</p><p className="font-display text-2xl">{k === "Lessons" ? v : money(Number(v))}</p></div>)}</div>
      <Card title="Transactions" eyebrow="History" action={<Button size="sm" disabled>Withdraw (connects soon)</Button>}>
        <ul>{w.transactions.map((t) => <li key={t.id} className="flex justify-between border-b border-border py-3 text-sm last:border-0"><span>{t.label}<span className="block text-xs text-muted-foreground">{t.at}</span></span><b>{money(t.amount)}</b></li>)}</ul>
        <p className="mt-3 text-xs text-muted-foreground">Balances, commission and withdrawals are calculated by the payment system, never on this page.</p>
      </Card>
    </div>
  );
}

function Notifications() {
  const [items, setItems] = useState(previewNotifications);
  return (
    <Card title="Notifications" eyebrow="Ọkwa" action={<button className="text-sm text-primary" onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}>Mark all read</button>}>
      <ul>{items.map((n) => <li key={n.id} className="flex gap-3 border-b border-border py-3 last:border-0">{!n.read && <span className="mt-2 size-2 rounded-full bg-primary" aria-label="Unread" />}<div className="flex-1"><b className="text-sm">{n.title}</b><p className="text-sm text-muted-foreground">{n.body}</p></div><span className="text-xs text-muted-foreground">{n.at}</span></li>)}</ul>
    </Card>
  );
}

function AdminConsole() {
  const tabs = Object.keys(previewAdmin);
  const [tab, setTab] = useState<string>(tabs[0] ?? "Users");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<string | null>(null);
  const rows = (previewAdmin[tab] ?? []).filter((r) => (r.primary + r.secondary).toLowerCase().includes(q.toLowerCase()));
  const d = rows.find((r) => r.id === detail);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-1">{tabs.map((t) => <button key={t} onClick={() => { setTab(t); setDetail(null); }} className={`rounded px-3 py-1.5 text-sm ${tab === t ? "bg-primary text-primary-foreground" : "border border-border"}`}>{t}</button>)}</div>
      <div className="flex items-center gap-2 border border-border bg-card px-3"><Search className="size-4 text-muted-foreground" /><input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${tab.toLowerCase()}…`} className="h-11 flex-1 bg-transparent outline-none" /></div>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="border border-border bg-card">
          {rows.length === 0 ? <EmptyState icon={Search} title="No matches" body="Try a different search." /> : rows.map((r) => (
            <button key={r.id} onClick={() => setDetail(r.id)} className={`flex w-full flex-wrap items-center gap-3 border-b border-border p-4 text-left last:border-0 ${detail === r.id ? "bg-muted" : ""}`}>
              <span className="flex-1"><b>{r.primary}</b><span className="block text-sm text-muted-foreground">{r.secondary}</span></span>
              <StatusBadge tone={statusTone(r.status)}>{r.status}</StatusBadge><span className="text-xs text-muted-foreground">{r.at}</span>
            </button>
          ))}
        </div>
        <aside className="border border-border bg-card p-4">
          {d ? <>
            <Eyebrow>{tab}</Eyebrow><h3 className="font-display text-xl">{d.primary}</h3><p className="text-sm text-muted-foreground">{d.secondary}</p>
            <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" disabled>Approve</Button><Button size="sm" variant="outline" disabled>Suspend</Button></div>
            <p className="mt-3 text-xs text-muted-foreground">Actions ask for confirmation and are recorded in the audit log once connected.</p>
          </> : <p className="text-sm text-muted-foreground">Select a row to see details.</p>}
        </aside>
      </div>
    </div>
  );
}
