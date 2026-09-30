// Ndebe reference data gathered from ndebe.org and typendebe.com.
// Glyph output stays in prototype notation until the licensed font and verified mapping are connected.

export const ndebeCredit = "Ńdẹ́bẹ́ is a modern writing system for the Ìgbò language, invented in 2009 by Lotanna Igwe-Odunze.";

export const ndebeModules = [
  { number: 0, title: "Check and setup", detail: "Confirm the font and choose an input method.", status: "current" },
  { number: 1, title: "Thinking in syllables", detail: "Move from letters to one character per syllable.", status: "open" },
  { number: 2, title: "Vowels", detail: "Recognise the vowel set and syllabic N/M.", status: "open" },
  { number: 3, title: "Tones", detail: "See how high, mid, and low tone shape a character.", status: "open" },
  { number: 4, title: "Stems", detail: "Explore the stem grid and shared Latin readings.", status: "open" },
  { number: 5, title: "How a character grows", detail: "Build with a stem, fruit radical, vowel, and branch.", status: "open" },
  { number: 6, title: "Build your first syllable", detail: "Choose a stem, vowel, and tone in order.", status: "open" },
  { number: 7, title: "Numerals", detail: "Twenty digits made of a flag and a body.", status: "open" },
  { number: 8, title: "Arithmetic", detail: "Base 20 place value, comparing, promotion and demotion.", status: "open" },
] as const;

// Stem keyboard layout (6 rows × 7) as shown on typendebe.com.
export const ndebeStemRows = [
  ["NW", "GB", "KP", "B", "P", "NY", "M"],
  ["G/V", "G", "N/L/Y", "GW", "K", "KW", "N"],
  ["R/H", "D", "L/R", "Y/H", "R", "Y", "L"],
  ["F/H/SH", "CH", "R/SH", "J/Z", "S/SH", "J", "B/V"],
  ["S", "T", "F/P", "F", "Z", "B/W", "S/T"],
  ["F/V", "Y/GH", "R/F", "W", "W/GH", "NY/Ṇ", "NW/Ṇ"],
] as const;
export const ndebeStems = ndebeStemRows.flat();

export const ndebeVowels = ["A", "Ẹ", "Ị", "Ọ", "Ụ", "E", "I", "O", "U", "N/M"] as const;
export const ndebeTones = ["High", "Mid", "Low"] as const;

export const ndebeParts = [
  { name: "Stem", description: "The tall main consonant form. Teaching shape: a tall rectangle." },
  { name: "Fruit radical", description: "A small component beside the stem. Teaching shape: a small square." },
  { name: "Vowel", description: "The vowel form placed above; its shape carries the tone. Teaching shape: a horizontal rectangle." },
  { name: "Connecting branch", description: "Required whenever a vowel or vowel placeholder sits above the body." },
  { name: "Nzobe", description: "Gives the surviving vowel an elision form, showing it hides an earlier vowel." },
] as const;

// Teaching-form component names from ndebe.org/script/teaching.
export const teachingStems = ["nkuo", "duu", "ukwu", "dogo", "ukwuna", "bo", "iyi"] as const;
export const teachingRadicals = ["nkoakpu", "ome-nkuo", "sisi", "amu", "mamkpulu", "ome-obe"] as const;
export const teachingVowelBases = ["a", "e-dot", "i-dot", "o-dot", "u-dot", "e", "i", "o", "u"] as const;
export const teachingVowelTones = [
  { id: "enu", label: "High (enu)" },
  { id: "ntela", label: "Mid (ntela)" },
  { id: "ani", label: "Low (ani)" },
] as const;

// Catalogue sample: stem combining components with private-use code points.
const combNames = ["nw", "gb", "kp", "b", "p", "ny", "m", "gv", "g", "nly", "gw", "k", "kw", "n", "rh", "d", "lr", "yh", "r", "y", "l", "fhsh", "ch", "rsh", "jz", "ssh", "j", "bv", "s", "t"];
export type CatalogueCategory = "Syllables" | "Nzobe" | "Components" | "Numerals" | "Symbols" | "Teaching" | "Support";
export const catalogueCategories: ("All" | CatalogueCategory)[] = ["All", "Syllables", "Nzobe", "Components", "Numerals", "Symbols", "Teaching", "Support"];
export type CatalogueGlyph = { name: string; code: string | null; category: CatalogueCategory };

export const ndebeNumeralNames = ["ncha", "ofu", "ibuo", "ito", "ino", "ise", "isi", "isa", "isato", "isano", "ili", "mofu", "mibuo", "mito", "mino", "mise", "misi", "misa", "misato", "misano"] as const;

export const catalogueGlyphs: CatalogueGlyph[] = [
  ...combNames.map((name, i) => ({ name: `${name}.comb`, code: `U+${(0xe450 + i).toString(16).toUpperCase()}`, category: "Components" as const })),
  ...ndebeNumeralNames.map((name, i) => ({ name: `digit.${i} · ${name}`, code: null, category: "Numerals" as const })),
  { name: "okoloto.ise (flag 5)", code: null, category: "Numerals" },
  { name: "okoloto.ili (flag 10)", code: null, category: "Numerals" },
  { name: "okoloto.mise (flag 15)", code: null, category: "Numerals" },
  { name: "interpunct · word separator", code: null, category: "Symbols" },
  { name: "vigesimal marker", code: null, category: "Symbols" },
  { name: "decimal marker", code: null, category: "Symbols" },
  { name: "kobo sign ƙ", code: "U+0199", category: "Symbols" },
  { name: "naira sign ₦", code: "U+20A6", category: "Symbols" },
  { name: "dotted circle · stem placeholder", code: "U+25CC", category: "Teaching" },
  { name: "radical placeholder", code: null, category: "Teaching" },
  { name: "vowel placeholder", code: null, category: "Teaching" },
  { name: "nzobe", code: null, category: "Nzobe" },
  { name: "replacement character", code: "U+FFFD", category: "Support" },
  { name: "nonbreaking space", code: "U+00A0", category: "Support" },
  { name: "narrow nonbreaking space", code: "U+202F", category: "Support" },
  { name: "space", code: "U+0020", category: "Support" },
];
export const catalogueTotal = 6709;

export const typingShortcuts = [
  { keys: "Space", action: "Ordinary space" },
  { keys: "Shift + Space", action: "Interpunct / word separator" },
  { keys: "` (backtick)", action: "Nzobe: type after the stem and radical, before the surviving vowel" },
  { keys: "' / Shift + '", action: "Alternating single / double outward-prong quotations" },
  { keys: "0 – 9", action: "Ndebe digits 0–9" },
  { keys: "Option/Alt + 0 – 9", action: "Ndebe digits 10–19" },
  { keys: ". after a numeral", action: "Vigesimal marker: two low stacked dots" },
  { keys: ". elsewhere", action: "Full stop" },
  { keys: "Option/Alt + .", action: "Decimal marker: one low dot" },
  { keys: "Option/Alt + Shift + .", action: "Explicit full stop after a number" },
] as const;

export const typingNotes = [
  { title: "Palettes", body: "Math, Currency, Teaching, and Symbols and spacing have separate labelled buttons. Keyboard users reach them with Tab, then Enter or Space." },
  { title: "Quotation direction", body: "Quotation direction is inferred from the text before the caret. Keyman checks up to 64 preceding characters." },
  { title: "Saved text", body: "Saving exports plain UTF-8 text. Plain text keeps characters only: choose an Ndebe font again if reopened text shows missing-character boxes." },
  { title: "Support characters", body: "The dotted rectangle provides a teaching stem placeholder. Nonbreaking spaces keep adjacent text together without a visible mark." },
] as const;

export const palettes = {
  Currency: ["₦", "ƙ", "$", "£", "€", "¥", "₩"],
  "Symbols and spacing": ["@", "#", "&", "_", "*", "^", "~", ":", "…", "—", "–", "«", "»", "‹", "›", "\u00A0", "\u202F"],
  Math: ["+", "−", "×", "÷", "=", "≠", "<", ">", "≤", "≥", "±", "≈", "∶", "%", "‰", "/", "\\", "|", "°", "℃", "℉", "←", "→", "↔", "π", "√", "∛", "∞", "[", "]", "{", "}"],
  Teaching: ["◌", "[radical ◌]", "[vowel ◌]"],
} as const;

export const ndebeFonts = [
  { name: "Ńdẹ́bẹ́ Rounded", tagline: "A lighter hand.", weight: 400, href: "https://ndebe.org/script/NdebeRounded-Regular.ttf" },
  { name: "Ńdẹ́bẹ́ Soft Bold", tagline: "A fuller presence.", weight: 700, href: "https://ndebe.org/script/NdebeSoftBold-Regular.ttf" },
] as const;
export const keymanPackage = "https://ndebe.org/script/ndebe_2026.kmp";
export const fontsRepo = "https://github.com/ndebeproject/ndebe-fonts";

export const arithmeticRules = [
  { title: "Flag promotion", trigger: "Body reaches 5B or more", effect: "Advance one flag level and subtract 5 from the body", example: "0F + 7B → 5F + 2B" },
  { title: "Flag demotion", trigger: "Body subtraction is impossible", effect: "Drop one flag level and add 5 to the body", example: "10F 2B − 4B → 5F 7B − 4B → 5F 3B" },
  { title: "Place promotion", trigger: "Flags would reach 20F", effect: "Carry 1B to the next place; flags reset to 0F", example: "15 + 7 → 1 in twenties, 0F2B in units = 22" },
  { title: "Place demotion", trigger: "Current place is too small", effect: "1B from the place above becomes 15F0B + 5F0B here", example: "1 twenty → 15F0B + 5F0B units" },
] as const;

export const operationSummary = [
  { op: "Compare", method: "More digits wins; else leftmost digit, flag first, then body", rule: "A flag step (5) always outweighs any body (≤ 4)" },
  { op: "Addition", method: "Flags + flags, bodies + bodies", rule: "Flag promote when body ≥ 5; place promote at 20F" },
  { op: "Subtraction", method: "Flags − flags, bodies − bodies", rule: "Flag demote when body too small; place demote when flags run out" },
  { op: "Multiplication", method: "Core fact table; ×5 is a rotation; ×20 is a shift", rule: "Partial products shifted by place, then added" },
  { op: "Division", method: "Short division by flag card, or a 7-rung ladder", rule: "Largest flag rung first, then largest body rung" },
  { op: "Fractions", method: "Place value continues below the units", rule: "Round up when the next digit shows a 10F/15F flag" },
] as const;

export const placeValues = ["Units", "Twenties", "Four-hundreds", "Eight-thousands", "Hundred-and-sixty-thousands", "Three-million-two-hundred-thousands"] as const;

export function toBase20(n: number): number[] {
  if (!Number.isFinite(n) || n <= 0) return [0];
  const digits: number[] = [];
  let v = Math.floor(n);
  while (v > 0) { digits.unshift(v % 20); v = Math.floor(v / 20); }
  return digits;
}
export const flagOf = (d: number) => Math.floor(d / 5) * 5;
export const bodyOf = (d: number) => d % 5;
export const numeralNotation = (d: number) => `${flagOf(d)}F${bodyOf(d)}B`;
