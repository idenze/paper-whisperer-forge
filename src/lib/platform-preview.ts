// PREVIEW DATA ONLY — fictional, never saved, always shown with a "Preview" label.
// Delete this file once the backend agent supplies the contracts in contracts.ts.
import type { AdminRow, Assignment, AppNotification, Conversation, Lesson, Message, ProgressSummary, Slot, StudentRecord, WalletSummary } from "./contracts";

const day = (offset: number, h: number) => { const d = new Date(); d.setDate(d.getDate() + offset); d.setHours(h, 0, 0, 0); return d.toISOString(); };

export const previewLessons: Lesson[] = [
  { id: "l1", teacherName: "Adaeze O.", studentName: "Tobi A.", topic: "Greetings at the market", startsAt: day(0, 18), minutes: 60, status: "confirmed", payment: "verified", priceLabel: "₦8,000", canJoin: true },
  { id: "l2", teacherName: "Adaeze O.", studentName: "Nneka B.", topic: "Family words", startsAt: day(0, 20), minutes: 30, status: "confirmed", payment: "pending", priceLabel: "₦4,500", canJoin: false },
  { id: "l3", teacherName: "Mr. Emeka N.", studentName: "Tobi A.", topic: "Tone practice", startsAt: day(2, 17), minutes: 60, status: "requested", payment: "unpaid", priceLabel: "₦7,000", canJoin: false },
  { id: "l4", teacherName: "Adaeze O.", studentName: "Tobi A.", topic: "Numbers", startsAt: day(-3, 18), minutes: 60, status: "completed", payment: "verified", priceLabel: "₦8,000", canJoin: false },
];

export function previewSlots(date: Date): Slot[] {
  const now = Date.now();
  return [9, 10, 11, 14, 15, 17, 18, 19, 20].map((h, i) => {
    const d = new Date(date); d.setHours(h, 0, 0, 0);
    const state = d.getTime() < now ? "past" : i % 4 === 1 ? "booked" : i % 5 === 3 ? "unavailable" : "available";
    return { startsAt: d.toISOString(), minutes: 60, state };
  });
}

export const previewConversations: Conversation[] = [
  { id: "c1", name: "Adaeze O.", lastMessage: "See you at 6 — bring the market words.", unread: 2, updatedAt: "18:02" },
  { id: "c2", name: "Mr. Emeka N.", lastMessage: "I've accepted your request.", unread: 0, updatedAt: "Yesterday" },
];
export const previewMessages: Record<string, Message[]> = {
  c1: [
    { id: "m1", fromMe: false, body: "Hello! Ready for today's lesson?", at: "17:40", state: "sent" },
    { id: "m2", fromMe: true, body: "Yes, I practised the greetings.", at: "17:45", state: "sent" },
    { id: "m3", fromMe: false, body: "See you at 6 — bring the market words.", at: "18:02", state: "sent" },
  ],
  c2: [{ id: "m4", fromMe: false, body: "I've accepted your request.", at: "Mon", state: "sent" }],
};

export const previewAssignments: Assignment[] = [
  { id: "a1", title: "Record five greetings", studentName: "Tobi A.", due: "Tomorrow", state: "in_progress", progress: 60 },
  { id: "a2", title: "Family words worksheet", studentName: "Nneka B.", due: "Friday", state: "not_started", progress: 0 },
  { id: "a3", title: "Numbers 1–20 quiz", studentName: "Tobi A.", due: "Last week", state: "reviewed", progress: 100 },
  { id: "a4", title: "Market dialogue", studentName: "Ike C.", due: "2 days ago", state: "overdue", progress: 20 },
];

export const previewProgress: ProgressSummary = {
  lessonsCompleted: 12, hours: 11.5, vocabulary: 148, level: "Beginner 2",
  skills: [{ name: "Speaking", value: 45 }, { name: "Listening", value: 60 }, { name: "Reading", value: 35 }, { name: "Vocabulary", value: 55 }, { name: "Pronunciation", value: 40 }],
  focusAreas: ["Tone on two-syllable words", "Question forms"], goals: ["Hold a 2-minute market conversation", "Learn 50 more words"],
};

export const previewStudents: StudentRecord[] = [
  { id: "s1", name: "Tobi A.", level: "Beginner 2", goal: "Talk with grandparents", lessonsCompleted: 12, lastLesson: "3 days ago", nextLesson: "Today 18:00", progress: 55, openAssignments: 1, note: "Strong listening; tones need work." },
  { id: "s2", name: "Nneka B.", level: "Beginner 1", goal: "Travel to Enugu", lessonsCompleted: 3, lastLesson: "Last week", nextLesson: "Today 20:00", progress: 20, openAssignments: 1, note: "Payment pending for today." },
  { id: "s3", name: "Ike C.", level: "Intermediate", goal: "Read Igbo news", lessonsCompleted: 30, lastLesson: "2 weeks ago", nextLesson: null, progress: 70, openAssignments: 1, note: "Homework overdue — check in." },
];

export const previewWallet: WalletSummary = {
  currency: "₦", thisMonth: 96000, available: 54400, pending: 12000, lessons: 14,
  transactions: [
    { id: "t1", label: "Lesson · Tobi A.", amount: 6800, at: "Today", kind: "earning" },
    { id: "t2", label: "Withdrawal to bank", amount: -40000, at: "Mon", kind: "withdrawal" },
    { id: "t3", label: "Lesson · Ike C.", amount: 6800, at: "Last week", kind: "earning" },
  ],
};

export const previewNotifications: AppNotification[] = [
  { id: "n1", title: "Lesson starting soon", body: "Greetings at the market begins in 30 minutes.", at: "17:30", read: false },
  { id: "n2", title: "New homework", body: "Record five greetings — due tomorrow.", at: "Yesterday", read: false },
  { id: "n3", title: "Booking confirmed", body: "Tone practice with Mr. Emeka N.", at: "Mon", read: true },
];

export const previewAdmin: Record<string, AdminRow[]> = {
  Users: [{ id: "u1", primary: "Tobi A.", secondary: "Student", status: "Active", at: "Joined Aug" }, { id: "u2", primary: "Adaeze O.", secondary: "Teacher", status: "Active", at: "Joined Jul" }],
  Teachers: [{ id: "t1", primary: "Chiamaka U.", secondary: "Application · Owerri dialect", status: "Pending", at: "2 days ago" }, { id: "t2", primary: "Adaeze O.", secondary: "Verified", status: "Approved", at: "Jul" }],
  Bookings: [{ id: "b1", primary: "Tobi A. → Adaeze O.", secondary: "Today 18:00 · 60 min", status: "Confirmed", at: "Today" }],
  Payments: [{ id: "p1", primary: "₦8,000 · Tobi A.", secondary: "Verified by server", status: "Verified", at: "Today" }, { id: "p2", primary: "₦4,500 · Nneka B.", secondary: "Awaiting verification", status: "Pending", at: "Today" }],
  Withdrawals: [{ id: "w1", primary: "₦40,000 · Adaeze O.", secondary: "Bank transfer", status: "Paid", at: "Mon" }],
  Reviews: [{ id: "r1", primary: "5★ · Adaeze O.", secondary: "“Patient and clear.”", status: "Published", at: "Sun" }],
  Reports: [{ id: "rp1", primary: "Lesson no-show", secondary: "Ike C. vs Mr. Emeka N.", status: "Open dispute", at: "Yesterday" }],
};
