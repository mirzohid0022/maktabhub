export const SUBJECTS = [
  "Matematika",
  "Ona tili",
  "Ingliz tili",
  "Fizika",
  "Kimyo",
  "Tarix",
  "Biologiya",
  "Geografiya",
  "Informatika",
  "Jismoniy tarbiya",
];

export const SUBJECT_HEX: Record<string, string> = {
  Matematika: "#3B82F6",
  "Ona tili": "#10B981",
  "Ingliz tili": "#8B5CF6",
  Fizika: "#F59E0B",
  Kimyo: "#EF4444",
  Tarix: "#92400E",
  Biologiya: "#14B8A6",
  Geografiya: "#06B6D4",
  Informatika: "#6366F1",
  "Jismoniy tarbiya": "#EC4899",
};

export function subjectHex(subject: string): string {
  return SUBJECT_HEX[subject] ?? "#64748B";
}

export function subjectSoft(subject: string, alpha = "1A"): string {
  return `${subjectHex(subject)}${alpha}`;
}

export const SUBJECT_STYLE: Record<string, string> = {
  Matematika:
    "bg-[#3B82F6]/10 text-[#2563EB] border-[#3B82F6]/30 dark:bg-[#3B82F6]/15 dark:text-[#93C5FD] dark:border-[#3B82F6]/35",
  "Ona tili":
    "bg-[#10B981]/10 text-[#059669] border-[#10B981]/30 dark:bg-[#10B981]/15 dark:text-[#6EE7B7] dark:border-[#10B981]/35",
  "Ingliz tili":
    "bg-[#8B5CF6]/10 text-[#7C3AED] border-[#8B5CF6]/30 dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD] dark:border-[#8B5CF6]/35",
  Fizika:
    "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/30 dark:bg-[#F59E0B]/15 dark:text-[#FCD34D] dark:border-[#F59E0B]/35",
  Kimyo:
    "bg-[#EF4444]/10 text-[#DC2626] border-[#EF4444]/30 dark:bg-[#EF4444]/15 dark:text-[#FCA5A5] dark:border-[#EF4444]/35",
  Tarix:
    "bg-[#92400E]/10 text-[#92400E] border-[#92400E]/30 dark:bg-[#92400E]/20 dark:text-[#D6A06A] dark:border-[#92400E]/40",
  Biologiya:
    "bg-[#14B8A6]/10 text-[#0D9488] border-[#14B8A6]/30 dark:bg-[#14B8A6]/15 dark:text-[#5EEAD4] dark:border-[#14B8A6]/35",
  Geografiya:
    "bg-[#06B6D4]/10 text-[#0891B2] border-[#06B6D4]/30 dark:bg-[#06B6D4]/15 dark:text-[#67E8F9] dark:border-[#06B6D4]/35",
  Informatika:
    "bg-[#6366F1]/10 text-[#4F46E5] border-[#6366F1]/30 dark:bg-[#6366F1]/15 dark:text-[#A5B4FC] dark:border-[#6366F1]/35",
  "Jismoniy tarbiya":
    "bg-[#EC4899]/10 text-[#DB2777] border-[#EC4899]/30 dark:bg-[#EC4899]/15 dark:text-[#F9A8D4] dark:border-[#EC4899]/35",
};

export const SUBJECT_DOT: Record<string, string> = {
  Matematika: "bg-[#3B82F6]",
  "Ona tili": "bg-[#10B981]",
  "Ingliz tili": "bg-[#8B5CF6]",
  Fizika: "bg-[#F59E0B]",
  Kimyo: "bg-[#EF4444]",
  Tarix: "bg-[#92400E]",
  Biologiya: "bg-[#14B8A6]",
  Geografiya: "bg-[#06B6D4]",
  Informatika: "bg-[#6366F1]",
  "Jismoniy tarbiya": "bg-[#EC4899]",
};

export const SUBJECT_STYLE_FALLBACK =
  "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30";

export const CATEGORIES = ["Umumiy", "Tadbir", "Imtihon", "O'zgarish"] as const;

export const CATEGORY_STYLE: Record<string, string> = {
  Umumiy:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30",
  Tadbir:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30",
  Imtihon:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30",
  "O'zgarish":
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
};

export const LESSON_TIMES = [
  "08:00–08:45",
  "08:55–09:40",
  "09:50–10:35",
  "10:50–11:35",
  "11:45–12:30",
  "12:40–13:25",
  "13:35–14:20",
];

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function lessonRange(time: string): [number, number] {
  const [start, end] = time.split("–");
  return [toMinutes(start), toMinutes(end)];
}

export function currentLessonNumber(now: Date = new Date()): number | null {
  const jsDay = now.getDay();
  if (jsDay === 0 || jsDay === 6) return null;
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (let index = 0; index < LESSON_TIMES.length; index += 1) {
    const [start, end] = lessonRange(LESSON_TIMES[index]);
    if (minutes >= start && minutes <= end) return index + 1;
  }
  return null;
}

export const ROLE_LABEL: Record<string, string> = {
  student: "O'quvchi",
  teacher: "O'qituvchi",
  parent: "Ota-ona",
};

export function classIdFromName(className: string): string {
  return className.replace(/[^0-9A-Za-z]/g, "");
}
