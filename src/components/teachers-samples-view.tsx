import { ArrowLeft, Banknote, Building2, CalendarDays, Check, Clock, GraduationCap, ShieldCheck, Star, UserRound, Video, Wallet } from "lucide-react";
import { Fragment, useState } from "react";
import { Button } from "@/components/button";
import { sampleApplications, sampleHires, sampleLearnerBookings, sampleReviews, sampleTeacherBookings, type SampleBooking } from "@/lib/teacher-samples";
import adaezePhoto from "@/assets/sample-teacher-adaeze.jpg";

export type SampleRole = "teacher" | "learner" | "school" | "admin";
const money = (kobo: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);

export function SampleBanner() {
  return <p className="rounded-md border-2 border-dashed border-highlight bg-secondary px-3 py-2 text-xs font-black uppercase text-secondary-foreground">Sample preview · fictional people and numbers · nothing here is saved or charged</p>;
}

export function SampleDashboards({ role, setRole, onBack }: { role: SampleRole; setRole: (r: SampleRole) => void; onBack: () => void }) {
  const tabs: { id: SampleRole; label: string; icon: typeof UserRound }[] = [
    { id: "teacher", label: "Teacher dashboard", icon: GraduationCap },
    { id: "learner", label: "Learner page", icon: UserRound },
    { id: "school", label: "School page", icon: Building2 },
    { id: "admin", label: "Admin approvals", icon: ShieldCheck },
  ];
  return (
    <div className="rise-in space-y-5">
      <Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> All teachers</Button>
      <SampleBanner />
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map(({ id, label, icon: Icon }) => <Button key={id} variant={role === id ? "primary" : "secondary"} onClick={() => setRole(id)} aria-selected={role === id} role="tab"><Icon className="size-4" />{label}</Button>)}
      </div>
      {role === "teacher" ? <TeacherDash /> : role === "learner" ? <LearnerPage /> : role === "school" ? <SchoolPage /> : <AdminPage />}
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Wallet; label: string; value: string; sub?: string }) {
  return <div className="rounded-lg border border-border bg-card p-4"><Icon className="size-5 text-primary" /><p className="mt-2 text-xs font-extrabold uppercase text-muted-foreground">{label}</p><p className="text-2xl font-black">{value}</p>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</div>;
}

function statusPill(b: SampleBooking) {
  const tone = b.status === "requested" ? "bg-secondary" : b.status === "confirmed" ? "bg-primary text-primary-foreground" : b.status === "completed" ? "bg-muted" : "bg-muted line-through";
  return <span className={`rounded-sm px-2 py-0.5 text-[11px] font-black uppercase ${tone}`}>{b.status}{b.paid ? " · paid" : ""}</span>;
}

function TeacherDash() {
  const [bookings, setBookings] = useState(sampleTeacherBookings);
  const [hires, setHires] = useState(sampleHires);
  const [slots, setSlots] = useState<string[]>(["Mon-18", "Wed-18", "Fri-10", "Sat-14"]);
  const set = (id: string, status: SampleBooking["status"]) => setBookings((bs) => bs.map((b) => b.id === id ? { ...b, status } : b));
  const earned = bookings.filter((b) => b.paid).reduce((s, b) => s + b.priceKobo, 0);
  const fee = Math.round(earned * 0.15);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], hours = [8, 10, 14, 16, 18, 20];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-brand p-6 text-brand-foreground">
        <img src={adaezePhoto} alt="Fictional sample portrait of Adaeze O." width={768} height={960} loading="lazy" className="size-16 rounded-full border-2 border-brand-foreground/30 object-cover" />
        <div className="flex-1"><p className="text-xs font-extrabold uppercase opacity-75">Teacher dashboard</p><h2 className="font-display text-3xl font-semibold">Adaeze O. (Sample)</h2><p className="text-sm opacity-80">Profile live · 4.9 ★ from 38 reviews</p></div>
        <Button variant="secondary">Edit profile</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Wallet} label="Earned (paid)" value={money(earned - fee)} sub={`after sample 15% fee (${money(fee)})`} />
        <Stat icon={CalendarDays} label="Upcoming" value={String(bookings.filter((b) => b.status === "confirmed").length)} sub="confirmed lessons" />
        <Stat icon={Clock} label="Requests" value={String(bookings.filter((b) => b.status === "requested").length)} sub="waiting for you" />
        <Stat icon={Star} label="Rating" value="4.9" sub="38 reviews" />
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display text-xl font-semibold">Lessons</h3>
          <div className="mt-3 space-y-2">{bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-3">
              <div><p className="font-bold">{b.who}</p><p className="text-xs text-muted-foreground">{b.when} · {b.minutes} min · {money(b.priceKobo)}</p><p className="mt-1 text-sm">{b.note}</p><div className="mt-1">{statusPill(b)}</div></div>
              <div className="flex flex-wrap gap-2">
                {b.status === "requested" && <><Button onClick={() => set(b.id, "confirmed")}><Check className="size-4" />Accept</Button><Button variant="ghost" onClick={() => set(b.id, "cancelled")}>Decline</Button></>}
                {b.status === "confirmed" && <><Button variant="secondary" disabled={!b.paid} title={b.paid ? "" : "Opens once the learner pays"}><Video className="size-4" />Join call</Button><Button onClick={() => set(b.id, "completed")}>Mark taught</Button></>}
              </div>
            </div>))}</div>
        </section>
        <div className="space-y-5">
          <section className="rounded-lg border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold"><Banknote className="size-5 text-primary" />Payouts</h3>
            <p className="mt-2 text-sm text-muted-foreground">Available to withdraw</p><p className="text-3xl font-black">{money(earned - fee)}</p>
            <p className="mt-2 text-xs text-muted-foreground">Bank: GTBank ••••4821 (sample)</p>
            <Button className="mt-3 w-full" disabled title="Paystack payouts are connected by your developer">Withdraw via Paystack</Button>
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display text-xl font-semibold">Weekly availability</h3>
            <p className="text-xs text-muted-foreground">Tap to open or close a slot.</p>
            <div className="mt-3 grid grid-cols-[auto_repeat(7,1fr)] gap-1 text-center text-[10px] font-bold">
              <span />{days.map((d) => <span key={d}>{d.slice(0, 2)}</span>)}
              {hours.map((h) => <Fragment key={h}><span className="pr-1 text-right">{h}:00</span>{days.map((d) => { const k = `${d}-${h}`, on = slots.includes(k); return <button key={k} aria-label={`${d} ${h}:00`} onClick={() => setSlots((s) => on ? s.filter((x) => x !== k) : [...s, k])} className={`h-6 rounded-sm ${on ? "bg-primary" : "bg-muted"}`} />; })}</Fragment>)}
            </div>
          </section>
        </div>
      </div>
      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-display text-xl font-semibold">School hiring requests</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">{hires.map((h) => (
          <div key={h.id} className="rounded-md border border-border p-4">
            <p className="font-bold">{h.school} <span className="text-xs font-normal text-muted-foreground">· {h.status}</span></p>
            <p className="text-xs text-muted-foreground">{h.email}</p><p className="mt-1 text-sm">{h.details}</p>
            {h.status === "sent" && <div className="mt-2 flex gap-2"><Button onClick={() => setHires((x) => x.map((y) => y.id === h.id ? { ...y, status: "accepted" } : y))}>Accept</Button><Button variant="ghost" onClick={() => setHires((x) => x.map((y) => y.id === h.id ? { ...y, status: "declined" } : y))}>Decline</Button></div>}
          </div>))}</div>
      </section>
      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-display text-xl font-semibold">Latest reviews</h3>
        <div className="mt-2 divide-y divide-border">{sampleReviews.map((r) => <div key={r.id} className="py-3"><p className="flex gap-0.5 text-highlight">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-4" fill="currentColor" />)}</p><p className="mt-1 text-sm">{r.comment}</p><p className="text-xs text-muted-foreground">{r.who} · {r.date}</p></div>)}</div>
      </section>
    </div>
  );
}

function LearnerPage() {
  const [bookings, setBookings] = useState(sampleLearnerBookings);
  const [reviewed, setReviewed] = useState<string[]>([]);
  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-brand p-6 text-brand-foreground"><p className="text-xs font-extrabold uppercase opacity-75">Learner page</p><h2 className="font-display text-3xl font-semibold">Chidi’s lessons (Sample)</h2><p className="text-sm opacity-80">3 lessons · 1 teacher saved</p></div>
      <section className="space-y-2">{bookings.map((b) => (
        <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
          <div><p className="font-bold">{b.who}</p><p className="text-xs text-muted-foreground">{b.when} · {b.minutes} min · {money(b.priceKobo)}</p><p className="mt-1 text-sm">{b.note}</p><div className="mt-1">{statusPill(b)}</div></div>
          <div className="flex gap-2">
            {b.status === "requested" && <span className="text-xs font-bold text-muted-foreground">Waiting for teacher</span>}
            {b.status === "confirmed" && !b.paid && <Button onClick={() => setBookings((x) => x.map((y) => y.id === b.id ? { ...y, paid: true } : y))}>Pay {money(b.priceKobo)} (sample)</Button>}
            {b.status === "confirmed" && b.paid && <Button variant="secondary"><Video className="size-4" />Join call</Button>}
            {b.status === "completed" && (reviewed.includes(b.id) ? <span className="text-sm font-bold text-primary">Reviewed ✓</span> : <Button variant="secondary" onClick={() => setReviewed((r) => [...r, b.id])}><Star className="size-4" />Leave 5★ review</Button>)}
          </div>
        </div>))}</section>
      <p className="text-xs text-muted-foreground">In the real app, “Pay” opens Paystack checkout; your developer connects it.</p>
    </div>
  );
}

function SchoolPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-brand p-6 text-brand-foreground"><p className="text-xs font-extrabold uppercase opacity-75">School page</p><h2 className="font-display text-3xl font-semibold">Greenfield Academy (Sample)</h2><p className="text-sm opacity-80">Find and hire qualified Igbo teachers by reviews and credentials.</p></div>
      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-display text-xl font-semibold">Hiring requests sent</h3>
        <div className="mt-3 space-y-2">
          {[{ t: "Mr. Emeka N. (Sample)", s: "sent", d: "Part-time JSS1–3, 3 mornings a week" }, { t: "Dr. Obinna A. (Sample)", s: "accepted", d: "Staff workshop on Igbo literature" }].map((h) => (
            <div key={h.t} className="flex items-center justify-between rounded-md border border-border p-3"><div><p className="font-bold">{h.t}</p><p className="text-sm text-muted-foreground">{h.d}</p></div><span className={`rounded-sm px-2 py-0.5 text-[11px] font-black uppercase ${h.s === "accepted" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{h.s}</span></div>))}
        </div>
      </section>
      <p className="text-sm text-muted-foreground">Schools use the “Open to schools” filter on the Teachers page, then “Hire for school” on a profile.</p>
    </div>
  );
}

function AdminPage() {
  const [apps, setApps] = useState(sampleApplications.map((a) => ({ ...a, status: "pending" })));
  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl font-semibold">Teacher applications</h2>
      {apps.map((a) => (
        <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-4">
          <div><p className="font-bold">{a.name}</p><p className="text-sm text-muted-foreground">{a.headline} · {a.qualifications}</p></div>
          {a.status === "pending" ? <div className="flex gap-2"><Button onClick={() => setApps((x) => x.map((y) => y.id === a.id ? { ...y, status: "approved" } : y))}>Approve</Button><Button variant="ghost" onClick={() => setApps((x) => x.map((y) => y.id === a.id ? { ...y, status: "rejected" } : y))}>Reject</Button></div>
            : <span className="text-sm font-bold capitalize text-primary">{a.status}</span>}
        </div>))}
    </div>
  );
}
