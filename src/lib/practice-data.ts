import { AudioWaveform, Ear, MessagesSquare, Mountain, type LucideIcon } from "lucide-react";

export type PracticeOption = {
  icon: string;
  label: string;
};

export type PracticeRound = {
  prompt: string;
  hint: string;
  options: readonly PracticeOption[];
  correct: number;
};

export type PracticeFocus = {
  id: string;
  name: string;
  detail: string;
  minutes: number;
  icon: LucideIcon;
  rounds: readonly PracticeRound[];
};

/**
 * Guided lesson set: opened from the current lesson on the learner's path.
 * All learner-visible Igbo is placeholder until approved curriculum is connected.
 */
export const lessonRounds: readonly PracticeRound[] = [
  {
    prompt: "Which scene matches what you hear?",
    hint: "Listen first, then choose a scene tile.",
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
    hint: "One tile keeps the exchange going.",
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
    hint: "Match the sound, not the picture.",
    options: [
      { icon: "🥁", label: "PLACEHOLDER sound A" },
      { icon: "🗣️", label: "PLACEHOLDER sound B" },
      { icon: "🎶", label: "PLACEHOLDER sound C" },
      { icon: "👂", label: "PLACEHOLDER sound D" },
    ],
    correct: 3,
  },
];

/**
 * Free practise sets: opened from the Practise menu. Deliberately separate from
 * the lesson path — these are repeatable drills, not curriculum progress.
 */
export const practiceFocuses: readonly PracticeFocus[] = [
  {
    id: "ear",
    name: "Ear training",
    detail: "Hold a short line in memory and pick it out again.",
    minutes: 3,
    icon: Ear,
    rounds: [
      {
        prompt: "How many sounds did you hear?",
        hint: "Play the sample as many times as you need.",
        options: [
          { icon: "1️⃣", label: "PLACEHOLDER one" },
          { icon: "2️⃣", label: "PLACEHOLDER two" },
          { icon: "3️⃣", label: "PLACEHOLDER three" },
          { icon: "4️⃣", label: "PLACEHOLDER four" },
        ],
        correct: 1,
      },
      {
        prompt: "Which sample is the same one again?",
        hint: "Same line, different order.",
        options: [
          { icon: "🔁", label: "PLACEHOLDER repeat A" },
          { icon: "🔀", label: "PLACEHOLDER other A" },
          { icon: "🔈", label: "PLACEHOLDER other B" },
          { icon: "🎧", label: "PLACEHOLDER other C" },
        ],
        correct: 0,
      },
      {
        prompt: "Where did the line rise?",
        hint: "Rising, falling, or flat.",
        options: [
          { icon: "📈", label: "PLACEHOLDER rise" },
          { icon: "📉", label: "PLACEHOLDER fall" },
          { icon: "➖", label: "PLACEHOLDER flat" },
          { icon: "❓", label: "PLACEHOLDER unsure" },
        ],
        correct: 0,
      },
    ],
  },
  {
    id: "scenes",
    name: "Scene matching",
    detail: "Link a line to the moment it actually belongs to.",
    minutes: 4,
    icon: Mountain,
    rounds: [
      {
        prompt: "Which place fits what you hear?",
        hint: "Picture the surroundings.",
        options: [
          { icon: "🏠", label: "PLACEHOLDER home" },
          { icon: "🛒", label: "PLACEHOLDER market" },
          { icon: "🚌", label: "PLACEHOLDER travel" },
          { icon: "⛪", label: "PLACEHOLDER gathering" },
        ],
        correct: 1,
      },
      {
        prompt: "Who is speaking here?",
        hint: "Think about who answers whom.",
        options: [
          { icon: "🧑‍🤝‍🧑", label: "PLACEHOLDER friends" },
          { icon: "👩‍👧", label: "PLACEHOLDER family" },
          { icon: "🧑‍💼", label: "PLACEHOLDER stranger" },
          { icon: "🧒", label: "PLACEHOLDER child" },
        ],
        correct: 0,
      },
      {
        prompt: "What is happening right now?",
        hint: "Arriving, leaving, or asking.",
        options: [
          { icon: "🚪", label: "PLACEHOLDER arriving" },
          { icon: "👋", label: "PLACEHOLDER leaving" },
          { icon: "❔", label: "PLACEHOLDER asking" },
          { icon: "🙏", label: "PLACEHOLDER thanking" },
        ],
        correct: 2,
      },
    ],
  },
  {
    id: "responses",
    name: "Reply fast",
    detail: "Hear a line, then reach for the answer that fits.",
    minutes: 3,
    icon: MessagesSquare,
    rounds: [
      {
        prompt: "Which reply keeps the talk going?",
        hint: "Answer the line you heard.",
        options: [
          { icon: "✅", label: "PLACEHOLDER yes" },
          { icon: "🚫", label: "PLACEHOLDER no" },
          { icon: "🤔", label: "PLACEHOLDER maybe" },
          { icon: "🔇", label: "PLACEHOLDER silence" },
        ],
        correct: 0,
      },
      {
        prompt: "Someone greeted you. What comes back?",
        hint: "Greeting for greeting.",
        options: [
          { icon: "👋", label: "PLACEHOLDER greeting back" },
          { icon: "🍽️", label: "PLACEHOLDER offer" },
          { icon: "🕒", label: "PLACEHOLDER time" },
          { icon: "🛏️", label: "PLACEHOLDER rest" },
        ],
        correct: 0,
      },
      {
        prompt: "Which reply is too blunt here?",
        hint: "Notice the politeness.",
        options: [
          { icon: "🫖", label: "PLACEHOLDER polite A" },
          { icon: "🫗", label: "PLACEHOLDER polite B" },
          { icon: "⚡", label: "PLACEHOLDER blunt" },
          { icon: "🌼", label: "PLACEHOLDER polite C" },
        ],
        correct: 2,
      },
    ],
  },
  {
    id: "sounds",
    name: "Sound sorting",
    detail: "Sort the tricky Igbo sounds you keep meeting.",
    minutes: 4,
    icon: AudioWaveform,
    rounds: [
      {
        prompt: "Which tile carries this sound?",
        hint: "Listen for the shape in the mouth.",
        options: [
          { icon: "🌀", label: "PLACEHOLDER sound set A" },
          { icon: "🧊", label: "PLACEHOLDER sound set B" },
          { icon: "🔔", label: "PLACEHOLDER sound set C" },
          { icon: "🪘", label: "PLACEHOLDER sound set D" },
        ],
        correct: 3,
      },
      {
        prompt: "Which pair shares one sound?",
        hint: "Two lines, one shared sound.",
        options: [
          { icon: "🅰️", label: "PLACEHOLDER pair A" },
          { icon: "🅱️", label: "PLACEHOLDER pair B" },
          { icon: "🅾️", label: "PLACEHOLDER pair C" },
          { icon: "🆎", label: "PLACEHOLDER pair D" },
        ],
        correct: 1,
      },
      {
        prompt: "Which one does not belong?",
        hint: "Three share a sound, one does not.",
        options: [
          { icon: "🟢", label: "PLACEHOLDER member A" },
          { icon: "🟢", label: "PLACEHOLDER member B" },
          { icon: "🔴", label: "PLACEHOLDER outsider" },
          { icon: "🟢", label: "PLACEHOLDER member C" },
        ],
        correct: 2,
      },
    ],
  },
];

/** One activity pulled from every focus, for a mixed run. */
export const mixedRounds: readonly PracticeRound[] = practiceFocuses.map(
  (focus) => focus.rounds[0],
);
