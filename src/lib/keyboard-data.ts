/**
 * Keyboard layouts for the on-screen keyboard demo. Pure data so the same
 * definitions can later generate desktop (Keyman/.klc/XKB) and mobile
 * (Android IME / iOS extension) keyboards.
 *
 * Igbo behaviour follows the Edémédé keyboard (github.com/chrisemezue/edemede.github.io,
 * Apache-2.0, by Chris C. Emezue and Handel C. Emezue): Shift + vowel cycles the
 * dotted / low-tone / high-tone forms. This is a fresh implementation, not a copy of its code.
 */
export type KeyboardId = "igbo" | "ndebe" | "english";

export type KeyDef = { label: string; insert?: string; action?: "shift" | "backspace" | "space" | "enter"; wide?: boolean; hint?: string };

const row = (s: string): KeyDef[] => s.split(" ").map((c) => ({ label: c }));

const actionsBottom: KeyDef[] = [{ label: "space", action: "space", wide: true }, { label: "⏎", action: "enter" }];

/** Shift + vowel cycles through these forms in order (NFC). */
export const igboVowelCycles: Record<string, readonly string[]> = {
  a: ["ạ", "à", "á"],
  e: ["ẹ", "è", "é"],
  i: ["ị", "ì", "í"],
  o: ["ọ", "ò", "ó"],
  u: ["ụ", "ù", "ú"],
  n: ["ṅ", "ǹ", "ń"],
  m: ["m̀", "ḿ"],
};

/** Extra Igbo characters from the Edémédé layout (tone-marked dotted vowels, macron mid-tone, syllabic nasals). */
export const igboExtraKeys: readonly string[] = [
  "ị", "ọ", "ụ", "ṅ", "ạ", "ẹ",
  "à", "á", "è", "é", "ì", "í", "ò", "ó", "ù", "ú",
  "ọ̀", "ọ́", "ụ̀", "ụ́", "ị̀", "ị́",
  "ā", "ē", "ī", "ō", "ū",
  "ǹ", "ń", "n̄", "m̀", "ḿ",
];

export const keyboardLayouts: Record<KeyboardId, { name: string; note: string; rows: KeyDef[][] }> = {
  igbo: {
    name: "Igbo",
    note: "Standard Igbo letters. Press Shift + a vowel (or n/m) on a computer keyboard to cycle ị → ì → í, etc.",
    rows: [
      row("q w e r t y u i o p"),
      [...row("a s d f g h j k l")],
      [{ label: "⇧", action: "shift" }, ...row("z c v b n m"), { label: "⌫", action: "backspace" }],
      [{ label: "ị" }, { label: "ọ" }, { label: "ụ" }, { label: "ṅ" }, ...actionsBottom],
    ],
  },
  english: {
    name: "English",
    note: "Plain QWERTY layout.",
    rows: [
      row("q w e r t y u i o p"),
      row("a s d f g h j k l"),
      [{ label: "⇧", action: "shift" }, ...row("z x c v b n m"), { label: "⌫", action: "backspace" }],
      [{ label: "," }, { label: "." }, ...actionsBottom],
    ],
  },
  ndebe: {
    name: "Ńdẹ́bẹ́ (prototype)",
    note: "Prototype notation: keys insert labelled parts like [CH] until the licensed Ńdẹ́bẹ́ font and verified key-to-glyph map are supplied.",
    rows: [
      ["NW", "GB", "KP", "B", "P", "NY", "M"].map((s) => ({ label: s, insert: `[${s}]` })),
      ["G", "GW", "K", "KW", "N", "D", "L"].map((s) => ({ label: s, insert: `[${s}]` })),
      ["R", "Y", "CH", "J", "S", "T", "F"].map((s) => ({ label: s, insert: `[${s}]` })),
      ["Z", "W", "A", "Ẹ", "Ị", "Ọ", "Ụ"].map((s) => ({ label: s, insert: `[${s}]` })),
      [{ label: "E", insert: "[E]" }, { label: "I", insert: "[I]" }, { label: "O", insert: "[O]" }, { label: "U", insert: "[U]" }, { label: "⌫", action: "backspace" }, ...actionsBottom],
    ],
  },
};

/** Cycle the character before the caret when Shift + vowel is pressed. Returns null if not applicable. */
export function cycleIgboVowel(before: string, key: string): { replaceLast: boolean; insert: string } {
  const cycle = igboVowelCycles[key.toLowerCase()];
  if (!cycle) return { replaceLast: false, insert: key };
  const last = [...before.normalize("NFC")].pop() ?? "";
  const idx = cycle.indexOf(last);
  if (idx >= 0) return { replaceLast: true, insert: cycle[(idx + 1) % cycle.length]! };
  return { replaceLast: false, insert: cycle[0]! };
}
