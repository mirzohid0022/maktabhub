export type Script = "latin" | "cyrillic";

/**
 * Unit-test-style examples:
 *
 *   toCyrillic("o'qituvchi")   === "ўқитувчи"
 *   toCyrillic("Dars jadvali") === "Дарс жадвали"
 *   toCyrillic("Yangilanish")  === "Янгиланиш"
 *
 * Multi-character sequences are matched before single characters
 * (longest-match-first), so "sh" wins over "s" + "h", "o'" wins over
 * "o" + "'", and so on. Digits, punctuation, spaces and apostrophes
 * that are not part of a mapped pair pass through unchanged.
 */

const PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["O'", "Ў"],
  ["G'", "Ғ"],
  ["o'", "ў"],
  ["g'", "ғ"],
  ["O’", "Ў"],
  ["G’", "Ғ"],
  ["o’", "ў"],
  ["g’", "ғ"],
  ["Sh", "Ш"],
  ["SH", "Ш"],
  ["sh", "ш"],
  ["Ch", "Ч"],
  ["CH", "Ч"],
  ["ch", "ч"],
  ["ng", "нг"],
  ["Yo", "Ё"],
  ["YO", "Ё"],
  ["yo", "ё"],
  ["Yu", "Ю"],
  ["YU", "Ю"],
  ["yu", "ю"],
  ["Ya", "Я"],
  ["YA", "Я"],
  ["ya", "я"],
  ["Ye", "Е"],
  ["YE", "Е"],
  ["ye", "е"],
  ["Ts", "Ц"],
  ["TS", "Ц"],
  ["ts", "ц"],
];

const SINGLES: Record<string, string> = {
  a: "а",
  b: "б",
  d: "д",
  e: "е",
  f: "ф",
  g: "г",
  h: "ҳ",
  i: "и",
  j: "ж",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  q: "қ",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  v: "в",
  x: "х",
  y: "й",
  z: "з",
  A: "А",
  B: "Б",
  D: "Д",
  E: "Е",
  F: "Ф",
  G: "Г",
  H: "Ҳ",
  I: "И",
  J: "Ж",
  K: "К",
  L: "Л",
  M: "М",
  N: "Н",
  O: "О",
  P: "П",
  Q: "Қ",
  R: "Р",
  S: "С",
  T: "Т",
  U: "У",
  V: "В",
  X: "Х",
  Y: "Й",
  Z: "З",
};

export function toCyrillic(text: string): string {
  let out = "";
  let index = 0;
  while (index < text.length) {
    const pair = PAIRS.find(([from]) => text.startsWith(from, index));
    if (pair) {
      out += pair[1];
      index += pair[0].length;
      continue;
    }
    const char = text[index];
    out += SINGLES[char] ?? char;
    index += 1;
  }
  return out;
}
