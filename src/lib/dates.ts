export const WEEKDAYS = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
  "Yakshanba",
];

export const MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDaysKey(key: string, days: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function formatLongDate(date: Date): string {
  const weekday = WEEKDAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
  return `${weekday}, ${date.getDate()}-${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatShortDate(key: string): string {
  const d = parseDateKey(key);
  return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

export function formatWeekdayDate(key: string): string {
  const d = parseDateKey(key);
  const weekday = WEEKDAYS[d.getDay() === 0 ? 6 : d.getDay() - 1];
  return `${weekday}, ${d.getDate()}-${MONTHS[d.getMonth()]}`;
}

export function weekdayIndex(date: Date): number | null {
  const js = date.getDay();
  if (js === 0) return null;
  return js - 1;
}

export function todayIndex(): number | null {
  return weekdayIndex(new Date());
}

export function nextSchoolDayIndex(from: Date): number | null {
  const js = from.getDay();
  if (js === 0) return 0;
  if (js === 6) return null;
  return js;
}

export function dateKeyForWeekday(day: number, from: Date = new Date()): string {
  const base = toDateKey(from);
  const current = weekdayIndex(from);
  if (current === null) return addDaysKey(base, (day + 1) % 7);
  return addDaysKey(base, (day - current + 7) % 7);
}
