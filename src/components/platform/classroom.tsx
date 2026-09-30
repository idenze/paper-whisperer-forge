import { useEffect, useRef, useState } from "react";
import { BookOpen, Bot, Clock, FileText, Mic, MicOff, MessageSquare, MonitorUp, PenLine, PhoneOff, Video, VideoOff, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/product-ui";
import { LocalPreviewVideoService, type VideoService } from "@/lib/video-service";
import type { Lesson } from "@/lib/contracts";

type Panel = "chat" | "materials" | "whiteboard" | "notes" | "assistant" | "info";
const panels: { id: Panel; label: string; icon: typeof MessageSquare }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "materials", label: "Materials", icon: FileText },
  { id: "whiteboard", label: "Board", icon: PenLine },
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "assistant", label: "Assistant", icon: Bot },
  { id: "info", label: "Lesson", icon: Clock },
];

export function Classroom({ lesson, role, onLeave }: { lesson: Lesson; role: "student" | "teacher"; onLeave: () => void }) {
  const service = useRef<VideoService>(new LocalPreviewVideoService());
  const videoEl = useRef<HTMLVideoElement>(null);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [panel, setPanel] = useState<Panel | null>("chat");
  const [seconds, setSeconds] = useState(0);
  const [chat, setChat] = useState<string[]>(["Teacher: Nnọọ! Welcome."]);
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const s = service.current;
    s.createRoom(lesson.id).then((room) => s.joinRoom(room)).then(() => {
      if (videoEl.current) videoEl.current.srcObject = s.localStream();
    });
    const t = setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => { clearInterval(t); s.leaveRoom(); };
  }, [lesson.id]);

  const toggleMic = () => { mic ? service.current.muteMicrophone() : service.current.unmuteMicrophone(); setMic(!mic); };
  const toggleCam = () => { cam ? service.current.disableCamera() : service.current.enableCamera(); setCam(!cam); };
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const other = role === "student" ? lesson.teacherName : lesson.studentName;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground text-background">
      <header className="flex items-center justify-between gap-3 border-b border-background/10 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-display text-lg">{lesson.topic}</p>
          <p className="text-xs opacity-70">with {other} · {lesson.minutes} min</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <StatusBadge tone="warning">Preview room</StatusBadge>
          <span className="flex items-center gap-1"><Wifi className="size-4" aria-hidden /> Good</span>
          <span className="font-mono" aria-label="Lesson timer">{time}</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="relative flex min-h-0 flex-1 items-center justify-center p-3" aria-label="Video">
          <div className="grid size-full place-items-center rounded-md bg-background/5">
            <div className="text-center">
              <div className="mx-auto grid size-24 place-items-center rounded-full bg-primary text-3xl font-display text-primary-foreground">{other[0]}</div>
              <p className="mt-3 text-sm">{other}</p>
              <p className="text-xs opacity-60">Waiting for the video provider to connect</p>
            </div>
          </div>
          <div className="absolute bottom-5 right-5 aspect-video w-36 overflow-hidden rounded-md border border-background/20 bg-background/10 sm:w-52">
            <video ref={videoEl} autoPlay muted playsInline className={cam ? "size-full object-cover" : "hidden"} />
            {!cam && <p className="grid size-full place-items-center text-xs">Camera off</p>}
            <span className="absolute left-2 top-1 text-[10px]">You</span>
          </div>
          {sharing && <p className="absolute left-5 top-5 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Sharing screen</p>}
        </section>

        {panel && (
          <aside className="flex h-[45%] flex-col border-t border-background/10 bg-background text-foreground lg:h-auto lg:w-96 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <p className="font-semibold">{panels.find((p) => p.id === panel)?.label}</p>
              <button className="text-sm text-muted-foreground" onClick={() => setPanel(null)}>Close</button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4 text-sm">
              {panel === "chat" && (
                <div className="flex h-full flex-col">
                  <div className="flex-1 space-y-2">{chat.map((m, i) => <p key={i} className="rounded bg-muted px-3 py-2">{m}</p>)}</div>
                  <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { setChat([...chat, `You: ${draft}`]); setDraft(""); } }}>
                    <input aria-label="Message" value={draft} onChange={(e) => setDraft(e.target.value)} className="flex-1 rounded border border-border bg-card px-3" />
                    <Button size="sm" type="submit">Send</Button>
                  </form>
                </div>
              )}
              {panel === "materials" && <ul className="space-y-2">{["Market greetings.pdf", "Tone chart.png"].map((f) => <li key={f} className="flex items-center gap-2 rounded border border-border p-3"><FileText className="size-4" />{f}<span className="ml-auto text-xs text-muted-foreground">Preview</span></li>)}</ul>}
              {panel === "whiteboard" && <Whiteboard />}
              {panel === "notes" && (
                <div className="space-y-2">
                  <p className="text-muted-foreground">{role === "teacher" ? "Quick summary: topic, vocabulary, homework." : "Your private notes."}</p>
                  <textarea aria-label="Lesson notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="h-48 w-full rounded border border-border bg-card p-3" />
                  <p className="text-xs text-muted-foreground">Saving connects when the backend is ready.</p>
                </div>
              )}
              {panel === "assistant" && <p className="text-muted-foreground">The teaching assistant will suggest vocabulary, quick quizzes and a lesson summary here. It supports the teacher and is not yet connected.</p>}
              {panel === "info" && <dl className="space-y-2"><div><dt className="text-muted-foreground">Topic</dt><dd>{lesson.topic}</dd></div><div><dt className="text-muted-foreground">Attendance</dt><dd>You · {other} (waiting)</dd></div><div><dt className="text-muted-foreground">Payment</dt><dd>{lesson.payment}</dd></div></dl>}
            </div>
          </aside>
        )}
      </div>

      <nav className="flex flex-wrap items-center justify-center gap-2 border-t border-background/10 px-3 py-3" aria-label="Classroom controls">
        <Ctrl label={mic ? "Mute" : "Unmute"} active={!mic} onClick={toggleMic}>{mic ? <Mic /> : <MicOff />}</Ctrl>
        <Ctrl label={cam ? "Camera off" : "Camera on"} active={!cam} onClick={toggleCam}>{cam ? <Video /> : <VideoOff />}</Ctrl>
        <Ctrl label="Share screen" active={sharing} onClick={() => { service.current.shareScreen(!sharing); setSharing(!sharing); }}><MonitorUp /></Ctrl>
        <span className="mx-1 h-8 w-px bg-background/20" />
        {panels.map((p) => <Ctrl key={p.id} label={p.label} active={panel === p.id} onClick={() => setPanel(panel === p.id ? null : p.id)}><p.icon /></Ctrl>)}
        <button onClick={onLeave} className="ml-2 flex min-h-11 items-center gap-2 rounded-full bg-destructive px-4 text-sm font-semibold text-destructive-foreground"><PhoneOff className="size-4" /> {role === "teacher" ? "End lesson" : "Leave"}</button>
      </nav>
    </div>
  );
}

function Ctrl({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button aria-label={label} aria-pressed={active} title={label} onClick={onClick}
      className={`grid size-11 place-items-center rounded-full [&_svg]:size-5 ${active ? "bg-background text-foreground" : "bg-background/10 hover:bg-background/20"}`}>
      {children}
    </button>
  );
}

function Whiteboard() {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => { const r = e.currentTarget.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  return (
    <div>
      <canvas ref={ref} width={330} height={260} className="w-full touch-none rounded border border-border bg-card"
        onPointerDown={(e) => { drawing.current = true; const c = ref.current!.getContext("2d")!; const [x, y] = pos(e); c.beginPath(); c.moveTo(x, y); }}
        onPointerMove={(e) => { if (!drawing.current) return; const c = ref.current!.getContext("2d")!; const [x, y] = pos(e); c.lineWidth = 2; c.lineTo(x, y); c.stroke(); }}
        onPointerUp={() => (drawing.current = false)} />
      <button className="mt-2 text-xs text-muted-foreground" onClick={() => ref.current!.getContext("2d")!.clearRect(0, 0, 330, 260)}>Clear board</button>
      <p className="text-xs text-muted-foreground">Local only — sharing with the other person needs the live connection.</p>
    </div>
  );
}
