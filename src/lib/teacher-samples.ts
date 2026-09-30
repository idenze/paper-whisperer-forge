import type { Tables } from "@/integrations/supabase/types";

/**
 * SAMPLE teacher marketplace data — fictional people, shown only so the owner can
 * preview the screens. Never saved to the database, always labelled "Sample".
 * Replace by approving real teacher profiles in the app.
 */
type Teacher = Tables<"teacher_profiles">;
const base = { user_id: "sample", currency: "NGN", status: "approved" as const, created_at: "2026-09-01T00:00:00Z", updated_at: "2026-09-01T00:00:00Z", video_url: null, photo_url: null };

export const sampleTeachers: Teacher[] = [
  { ...base, id: "sample-1", display_name: "Adaeze O. (Sample)", headline: "Patient teacher for complete beginners and diaspora families", bio: "Sample profile. I help adults who grew up hearing Igbo at home finally speak it with confidence. Lessons are relaxed, conversation-first, and built around your daily life.", dialects: ["Central", "Anambra"], specialties: ["Beginners", "Conversation", "Diaspora"], qualifications: "B.A. Linguistics (sample)", years_experience: 6, hourly_rate_kobo: 1500000, country: "Nigeria", open_to_schools: true },
  { ...base, id: "sample-2", display_name: "Mr. Emeka N. (Sample)", headline: "Secondary school Igbo teacher · WAEC & NECO preparation", bio: "Sample profile. Ten years teaching Igbo in secondary schools. I prepare students for exams and support schools that need a qualified Igbo teacher.", dialects: ["Central", "Enugu"], specialties: ["WAEC", "NECO", "Grammar", "Schools"], qualifications: "NCE, B.Ed Igbo (sample)", years_experience: 10, hourly_rate_kobo: 1200000, country: "Nigeria", open_to_schools: true },
  { ...base, id: "sample-3", display_name: "Chiamaka U. (Sample)", headline: "Fun, song-based lessons for children aged 4–12", bio: "Sample profile. Songs, stories and games — children learn without noticing. Parents get a short note after every lesson.", dialects: ["Imo"], specialties: ["Children", "Songs", "Stories"], qualifications: "Early years teaching certificate (sample)", years_experience: 4, hourly_rate_kobo: 1000000, country: "United Kingdom", open_to_schools: false },
  { ...base, id: "sample-4", display_name: "Dr. Obinna A. (Sample)", headline: "Advanced Igbo, literature and translation", bio: "Sample profile. For advanced learners, researchers and translators who want depth: proverbs, literature and formal writing.", dialects: ["Central", "Abia"], specialties: ["Advanced", "Literature", "Translation"], qualifications: "Ph.D. Igbo Studies (sample)", years_experience: 15, hourly_rate_kobo: 2500000, country: "United States", open_to_schools: true },
];

export const sampleRatings: Record<string, { teacher_id: string; avg_rating: number; review_count: number }> = {
  "sample-1": { teacher_id: "sample-1", avg_rating: 4.9, review_count: 38 },
  "sample-2": { teacher_id: "sample-2", avg_rating: 4.8, review_count: 52 },
  "sample-3": { teacher_id: "sample-3", avg_rating: 5, review_count: 21 },
  "sample-4": { teacher_id: "sample-4", avg_rating: 4.7, review_count: 14 },
};

export const sampleReviews = [
  { id: "r1", rating: 5, comment: "Sample review — very patient, I finally hold short conversations with my grandmother.", who: "Learner, London", date: "Sep 2026" },
  { id: "r2", rating: 5, comment: "Sample review — lessons are well planned and she sends notes afterwards.", who: "Parent, Lagos", date: "Aug 2026" },
  { id: "r3", rating: 4, comment: "Sample review — great teacher, sometimes hard to find an evening slot.", who: "Learner, Houston", date: "Aug 2026" },
];

export type SampleBooking = { id: string; who: string; when: string; minutes: number; status: "requested" | "confirmed" | "completed" | "cancelled"; paid: boolean; note: string; priceKobo: number };

export const sampleTeacherBookings: SampleBooking[] = [
  { id: "b1", who: "Tobi A. (sample learner)", when: "Thu 2 Oct · 18:00", minutes: 60, status: "requested", paid: false, note: "Beginner, wants to greet in-laws", priceKobo: 1500000 },
  { id: "b2", who: "Grace E. (sample learner)", when: "Fri 3 Oct · 10:00", minutes: 30, status: "confirmed", paid: true, note: "Continue market vocabulary", priceKobo: 750000 },
  { id: "b3", who: "Ifeanyi K. (sample learner)", when: "Sat 4 Oct · 14:00", minutes: 90, status: "confirmed", paid: false, note: "Exam revision", priceKobo: 2250000 },
  { id: "b4", who: "Nkem O. (sample learner)", when: "Mon 29 Sep · 17:00", minutes: 60, status: "completed", paid: true, note: "Family words", priceKobo: 1500000 },
];

export const sampleHires = [
  { id: "h1", school: "Greenfield Academy (sample)", email: "hr@greenfield.example", details: "Part-time Igbo teacher, JSS1–3, 3 mornings a week, Enugu.", status: "sent" },
  { id: "h2", school: "Saturday Heritage School (sample)", email: "admin@heritage.example", details: "Online Saturday classes for 12 diaspora children.", status: "accepted" },
];

export const sampleLearnerBookings: SampleBooking[] = [
  { id: "l1", who: "Adaeze O. (Sample)", when: "Fri 3 Oct · 10:00", minutes: 30, status: "confirmed", paid: false, note: "Market vocabulary", priceKobo: 750000 },
  { id: "l2", who: "Chiamaka U. (Sample)", when: "Sun 5 Oct · 16:00", minutes: 60, status: "requested", paid: false, note: "Lesson for my 7-year-old", priceKobo: 1000000 },
  { id: "l3", who: "Adaeze O. (Sample)", when: "Mon 22 Sep · 10:00", minutes: 60, status: "completed", paid: true, note: "Greetings", priceKobo: 1500000 },
];

export const sampleApplications = [
  { id: "a1", name: "Uchenna P. (sample applicant)", qualifications: "NCE Igbo · 3 years", headline: "Conversation practice for adults" },
  { id: "a2", name: "Ngozi M. (sample applicant)", qualifications: "B.A. Igbo · 8 years", headline: "School curriculum support" },
];
