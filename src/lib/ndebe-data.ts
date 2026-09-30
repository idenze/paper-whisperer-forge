export const ndebeModules = [
  { number: 0, title: "Check and setup", detail: "Confirm the font and choose an input method.", status: "current" },
  { number: 1, title: "Thinking in syllables", detail: "Move from letters to one character per syllable.", status: "open" },
  { number: 2, title: "Vowels", detail: "Recognise the vowel set and syllabic N/M.", status: "open" },
  { number: 3, title: "Tones", detail: "See how high, mid, and low tone shape a character.", status: "locked" },
  { number: 4, title: "Stems", detail: "Explore the stem grid and shared Latin readings.", status: "locked" },
  { number: 5, title: "How a character grows", detail: "Build with a stem, fruit radical, vowel, and branch.", status: "locked" },
  { number: 6, title: "Build your first syllable", detail: "Choose a stem, vowel, and tone in order.", status: "locked" },
] as const;

export const ndebeStems = ["B", "CH", "D", "F", "G", "GB", "GW", "H", "K", "KP", "L", "M", "N", "NY", "P", "R", "S", "SH", "T", "V", "W", "Y", "Z"] as const;
export const ndebeVowels = ["A", "Ẹ", "Ị", "Ọ", "Ụ", "E", "I", "O", "U", "N/M"] as const;
export const ndebeTones = ["High", "Mid", "Low"] as const;

export const ndebeParts = [
  { name: "Stem", description: "The main consonant form." },
  { name: "Fruit radical", description: "A component whose precise teaching role awaits verified course content." },
  { name: "Vowel", description: "The vowel form attached to the character." },
  { name: "Connecting branch", description: "The bar joining character parts." },
  { name: "Nzobe", description: "The form used for elision." },
] as const;