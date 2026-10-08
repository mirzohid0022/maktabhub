import { MONTHS, parseDateKey } from "./dates";

export const CHILD = {
  name: "Aziz Karimov",
  initials: "AK",
  className: "10-A",
  school: "Toshkent shahar 45-maktab",
  classTeacher: "Malika Yusupova",
  rank: 3,
  classSize: 28,
  classAverage: 3.9,
  topPercent: 10,
};

export interface SubjectGrade {
  subject: string;
  grade: number;
}

export const SUBJECT_GRADES: SubjectGrade[] = [
  { subject: "Matematika", grade: 5 },
  { subject: "Ona tili", grade: 5 },
  { subject: "Ingliz tili", grade: 4 },
  { subject: "Fizika", grade: 5 },
  { subject: "Kimyo", grade: 4 },
  { subject: "Tarix", grade: 5 },
  { subject: "Biologiya", grade: 5 },
  { subject: "Geografiya", grade: 4 },
  { subject: "Informatika", grade: 5 },
  { subject: "Jismoniy tarbiya", grade: 5 },
];

export interface RecentGrade {
  date: string;
  subject: string;
  grade: number;
  teacher: string;
}

export const RECENT_GRADES: RecentGrade[] = [
  { date: "2026-10-06", subject: "Matematika", grade: 5, teacher: "Karimova N." },
  { date: "2026-10-05", subject: "Fizika", grade: 5, teacher: "Rahimov B." },
  { date: "2026-10-03", subject: "Ingliz tili", grade: 4, teacher: "Smith J." },
  { date: "2026-10-02", subject: "Kimyo", grade: 4, teacher: "Yusupova D." },
  { date: "2026-10-01", subject: "Ona tili", grade: 5, teacher: "Aliyeva M." },
];

export const ATTENDANCE = {
  percent: 98,
  absentDays: 1,
};

export const PARENT_ANNOUNCEMENT_CATEGORIES = ["Tadbir", "O'zgarish"];

export type Tone = "green" | "yellow" | "red";

export function childGpa(): number {
  const total = SUBJECT_GRADES.reduce((sum, item) => sum + item.grade, 0);
  return Math.round((total / SUBJECT_GRADES.length) * 10) / 10;
}

export function gpaPercent(): number {
  return Math.round((childGpa() / 5) * 100);
}

export function toneForPercent(percent: number): Tone {
  if (percent > 85) return "green";
  if (percent >= 70) return "yellow";
  return "red";
}

export const TONE_STROKE: Record<Tone, string> = {
  green: "#10b981",
  yellow: "#f59e0b",
  red: "#ef4444",
};

export const TONE_TEXT: Record<Tone, string> = {
  green: "text-emerald-600 dark:text-emerald-400",
  yellow: "text-amber-500 dark:text-amber-400",
  red: "text-red-500 dark:text-red-400",
};

export const TONE_LABEL: Record<Tone, string> = {
  green: "Juda yaxshi",
  yellow: "Yaxshi",
  red: "Qoniqarli",
};

export const GRADE_BAR: Record<number, string> = {
  5: "bg-emerald-500",
  4: "bg-blue-500",
  3: "bg-amber-400",
  2: "bg-red-500",
};

export const GRADE_CHIP: Record<number, string> = {
  5: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  4: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  3: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  2: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export function medalForRank(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "🎖️";
}

export function shortDateLabel(key: string): string {
  const date = parseDateKey(key);
  return `${date.getDate()}-${MONTHS[date.getMonth()]}`;
}

export function gradeCounts(): { grade: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const item of SUBJECT_GRADES) {
    counts.set(item.grade, (counts.get(item.grade) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => b.grade - a.grade);
}

export type AttendanceState = "present" | "absent" | "future" | "off";

export interface CalendarCell {
  day: number;
  state: AttendanceState;
}

function toDateNumber(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function absentDayNumbers(now: Date): Set<number> {
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const schoolDays: number[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const jsDay = date.getDay();
    if (jsDay === 0 || jsDay === 6) continue;
    if (toDateNumber(date) > toDateNumber(now)) continue;
    schoolDays.push(day);
  }
  const absentIndex = schoolDays.length >= 2 ? 1 : 0;
  return new Set(schoolDays.length ? [schoolDays[absentIndex]] : []);
}

export function monthCalendar(now: Date = new Date()): {
  year: number;
  month: number;
  leadingBlanks: number;
  cells: CalendarCell[];
} {
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstJsDay = new Date(year, month, 1).getDay();
  const leadingBlanks = (firstJsDay + 6) % 7;
  const absent = absentDayNumbers(now);

  const cells: CalendarCell[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const jsDay = date.getDay();
    if (jsDay === 0 || jsDay === 6) {
      cells.push({ day, state: "off" });
    } else if (toDateNumber(date) > toDateNumber(now)) {
      cells.push({ day, state: "future" });
    } else if (absent.has(day)) {
      cells.push({ day, state: "absent" });
    } else {
      cells.push({ day, state: "present" });
    }
  }

  return { year, month, leadingBlanks, cells };
}
