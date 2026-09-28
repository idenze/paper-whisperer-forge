import { BookOpen, Headphones, MessagesSquare, Shapes } from "lucide-react";

export const learner = {
  name: "Chidi",
  level: 3,
  xp: 1240,
  streak: 7,
  dailyGoal: 15,
  completedMinutes: 9,
};

export const journey = [
  { id: "continue", title: "Continue your lesson", detail: "Greetings · 4 min", action: "Continue", icon: BookOpen, tone: "green" },
  { id: "review", title: "Review 8 words", detail: "Due today · 5 min", action: "Review", icon: Shapes, tone: "coral" },
  { id: "listen", title: "Listening practice", detail: "3 short clips · 3 min", action: "Listen", icon: Headphones, tone: "gold" },
  { id: "practice", title: "Quick practice", detail: "Multiple choice · 3 min", action: "Play", icon: MessagesSquare, tone: "ink" },
] as const;

export const units = [
  {
    number: 1,
    title: "First conversations",
    detail: "4 of 6 lessons",
    progress: 68,
    lessons: [
      { title: "Welcome", status: "done" },
      { title: "Greetings", status: "current" },
      { title: "Introducing yourself", status: "open" },
      { title: "Polite expressions", status: "open" },
    ],
  },
  {
    number: 2,
    title: "People around me",
    detail: "6 lessons",
    progress: 0,
    lessons: [
      { title: "Family", status: "locked" },
      { title: "Friends", status: "locked" },
      { title: "Asking names", status: "locked" },
    ],
  },
] as const;
