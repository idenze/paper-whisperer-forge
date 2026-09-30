/**
 * Guided lesson content ("Greetings"). Three stages: learn with word cards,
 * use them in a story chat, then lock them in with matching pairs.
 * All learner-visible Igbo is PLACEHOLDER until approved curriculum is connected.
 */
export type WordCard = { id: string; icon: string; igbo: string; meaning: string; note: string };
export type StoryTurn =
  | { speaker: "them"; name: string; avatar: string; line: string; meaning: string }
  | { speaker: "you"; prompt: string; options: readonly { text: string; meaning: string }[]; correct: number; why: string };

export const lessonMeta = { title: "Greetings", unit: "First conversations", scene: "Meeting a neighbour in the morning" };

export const wordCards: readonly WordCard[] = [
  { id: "w1", icon: "🌅", igbo: "PLACEHOLDER morning greeting", meaning: "Good morning (placeholder)", note: "Used when you first see someone in the day." },
  { id: "w2", icon: "🙂", igbo: "PLACEHOLDER how are you", meaning: "How are you? (placeholder)", note: "A friendly follow-up after greeting." },
  { id: "w3", icon: "👍", igbo: "PLACEHOLDER I am well", meaning: "I am well (placeholder)", note: "A common reply." },
  { id: "w4", icon: "🙏", igbo: "PLACEHOLDER thank you", meaning: "Thank you (placeholder)", note: "Closes the exchange politely." },
];

export const storyTurns: readonly StoryTurn[] = [
  { speaker: "them", name: "Neighbour", avatar: "👩🏾", line: "PLACEHOLDER morning greeting", meaning: "Good morning" },
  { speaker: "you", prompt: "Greet her back.", options: [{ text: "PLACEHOLDER morning greeting", meaning: "Good morning" }, { text: "PLACEHOLDER thank you", meaning: "Thank you" }, { text: "PLACEHOLDER I am well", meaning: "I am well" }], correct: 0, why: "A greeting is answered with a greeting." },
  { speaker: "them", name: "Neighbour", avatar: "👩🏾", line: "PLACEHOLDER how are you", meaning: "How are you?" },
  { speaker: "you", prompt: "Tell her how you are.", options: [{ text: "PLACEHOLDER how are you", meaning: "How are you?" }, { text: "PLACEHOLDER I am well", meaning: "I am well" }, { text: "PLACEHOLDER morning greeting", meaning: "Good morning" }], correct: 1, why: "She asked how you are, so you answer." },
  { speaker: "them", name: "Neighbour", avatar: "👩🏾", line: "PLACEHOLDER good to hear", meaning: "Good to hear" },
  { speaker: "you", prompt: "Close politely.", options: [{ text: "PLACEHOLDER thank you", meaning: "Thank you" }, { text: "PLACEHOLDER how are you", meaning: "How are you?" }, { text: "PLACEHOLDER I am well", meaning: "I am well" }], correct: 0, why: "Thanking her ends the chat warmly." },
];
