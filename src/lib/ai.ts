import type { Announcement, LessonChange, LessonRow, ScheduleSlot } from "../types";
import { LESSON_TIMES, SUBJECTS } from "./constants";
import {
  WEEKDAYS,
  addDaysKey,
  dateKeyForWeekday,
  formatShortDate,
  formatWeekdayDate,
  nextSchoolDayIndex,
  todayIndex,
  todayKey,
} from "./dates";

export interface AIContext {
  userName: string;
  className: string;
  schedule: ScheduleSlot[];
  announcements: Announcement[];
  changes: LessonChange[];
}

export interface AIAnswer {
  text: string;
  lessons?: LessonRow[];
}

const FALLBACK =
  "Kechirasiz, men faqat jadval va e'lonlar bo'yicha yordam bera olaman.";

const DAY_KEYWORDS = [
  ["dushanba", 0],
  ["seshanba", 1],
  ["chorshanba", 2],
  ["payshanba", 3],
  ["juma", 4],
  ["shanba", 5],
  ["yakshanba", 6],
] as const;

function flat(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ʻ'`’´ʼ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function rowsForDay(
  ctx: AIContext,
  day: number | null,
  dateKey?: string,
): LessonRow[] {
  if (day === null || day === undefined) return [];
  const key = dateKey ?? "";
  const changes = ctx.changes.filter((c) => !key || c.date === key);
  return ctx.schedule
    .filter((slot) => slot.day === day)
    .sort((a, b) => a.lesson - b.lesson)
    .map((slot) => {
      const change = changes.find((c) => c.lessonNumber === slot.lesson);
      const cancelled = change?.newValue.toLowerCase().includes("bekor");
      const row: LessonRow = {
        time: `${slot.lesson}-dars · ${LESSON_TIMES[slot.lesson - 1] ?? ""}`,
        subject: cancelled ? `${slot.subject} (bekor qilindi)` : slot.subject,
        teacher: change && !cancelled ? change.newValue : slot.teacher,
        room: cancelled ? "—" : slot.room,
      };
      return row;
    });
}

function withChangesNote(answer: AIAnswer, dateKey: string, ctx: AIContext): void {
  const todays = ctx.changes.filter((c) => c.date === dateKey);
  if (!todays.length) return;
  const notes = todays.map(
    (c) =>
      `• ${c.lessonNumber}-dars (${c.subject}): ${c.newValue} — ${c.reason}`,
  );
  answer.text += `\n\nDiqqat, o'zgarishlar:\n${notes.join("\n")}`;
}

function formatRows(rows: LessonRow[]): string {
  if (!rows.length) return "Darslar yo'q.";
  return rows
    .map((row, i) => `${i + 1}. ${row.time} — ${row.subject} — ${row.teacher} — ${row.room}`)
    .join("\n");
}

function findSubject(query: string): string | null {
  const q = flat(query).replace(/\s+/g, "");
  for (const subject of SUBJECTS) {
    const key = flat(subject).replace(/\s+/g, "");
    if (q.includes(key)) return subject;
  }
  return null;
}

function findDay(query: string): number | null {
  const q = flat(query);
  for (const [keyword, index] of DAY_KEYWORDS) {
    if (q.includes(keyword)) return index;
  }
  return null;
}

export function answerQuestion(question: string, ctx: AIContext): AIAnswer {
  const q = flat(question);
  const today = todayIndex();
  const dateKey = todayKey();

  if (/^(salom|assalomu|assalomu alaykum|hey|hi|hello|selam)/.test(q)) {
    return {
      text: `Salom, ${ctx.userName}! Men MaktabHub AI yordamchisiman. Dars jadvalingiz, e'lonlar va jadval o'zgarishlari haqida istalgan savol bering.`,
    };
  }

  if (q.includes("rahmat") || q.includes("eslab qoldim")) {
    return { text: "Arzimaydi! Yana savolingiz bo'lsa, bemalol so'rang." };
  }

  if (q.includes("kim") && q.includes("man")) {
    return {
      text: `Siz ${ctx.userName}, ${ctx.className} sinf o'quvchisiz. Qanday yordam bera olaman?`,
    };
  }

  const subject = findSubject(question);
  const dayKeyword = findDay(question);

  // Ertaga qanday darslar bor?
  if (q.includes("ertaga") || q.includes("keyingi dars")) {
    const nextDay = nextSchoolDayIndex(new Date());
    const nextKey = addDaysKey(dateKey, 1);
    if (nextDay === null) {
      return {
        text: `Ertaga yakshanba — sizda darslar yo'q. Dam olish kuni!`,
      };
    }
    const rows = rowsForDay(ctx, nextDay, nextKey);
    const answer: AIAnswer = {
      text: `Ertaga (${formatWeekdayDate(nextKey)}) sizda ${rows.length} ta dars bor:\n\n${formatRows(rows)}`,
      lessons: rows,
    };
    withChangesNote(answer, nextKey, ctx);
    return answer;
  }

  // Bu hafta nechta dars bor?
  if (q.includes("hafta") && (q.includes("nechta") || q.includes("qancha"))) {
    const count = ctx.schedule.length;
    return {
      text: `Bu hafta (${ctx.className} sinfi) jami ${count} ta dars rejalashtirilgan. Dushanbadan shanbagacha davom etadi.`,
    };
  }

  // Nechta darsim bor?
  if (q.includes("nechta") || q.includes("qancha dars")) {
    if (today === null) {
      return { text: "Bugun yakshanba — darslar yo'q." };
    }
    const rows = rowsForDay(ctx, today, dateKey);
    return {
      text: `Bugun (${WEEKDAYS[today]}) sizda ${rows.length} ta darsingiz bor.`,
      lessons: rows,
    };
  }

  // Bugungi darslar
  if (q.includes("bugun") || q.includes("hozirgi dars")) {
    if (today === null) {
      return { text: "Bugun yakshanba — maktabda darslar yo'q. Dam oling!" };
    }
    const rows = rowsForDay(ctx, today, dateKey);
    const answer: AIAnswer = {
      text: `Bugun (${formatWeekdayDate(dateKey)}) sizda ${rows.length} ta dars bor:\n\n${formatRows(rows)}`,
      lessons: rows,
    };
    withChangesNote(answer, dateKey, ctx);
    return answer;
  }

  // Ma'lum kun bo'yicha
  if (dayKeyword !== null && (q.includes("dars") || q.includes("jadval") || dayKeyword >= 0)) {
    const key = dateKeyForWeekday(dayKeyword);
    const rows = rowsForDay(ctx, dayKeyword, key);
    return {
      text: `${WEEKDAYS[dayKeyword]} kuni sizda ${rows.length} ta dars bor:\n\n${formatRows(rows)}`,
      lessons: rows,
    };
  }

  // Fan qaysi kunlarda?
  if (subject && (q.includes("qaysi") || q.includes("qachon") || q.includes("kun"))) {
    const days = ctx.schedule
      .filter((slot) => slot.subject === subject)
      .sort((a, b) => a.day - b.day || a.lesson - b.lesson);
    if (!days.length) {
      return { text: `${subject} fani shu hafta jadvalda yo'q.` };
    }
    const list = days
      .map((slot) => `${WEEKDAYS[slot.day]} — ${slot.lesson}-dars (${slot.room})`)
      .join("\n");
    return { text: `${subject} darslari shu hafta:\n\n${list}` };
  }

  if (subject && q.includes("nechta")) {
    const count = ctx.schedule.filter((slot) => slot.subject === subject).length;
    return { text: `Bu hafta ${subject} fanidan ${count} ta darsingiz bor.` };
  }

  // E'lonlar
  if (q.includes("elon") || q.includes("yangilik") || q.includes("xabar")) {
    const sorted = [...ctx.announcements].sort((a, b) => b.date.localeCompare(a.date));
    if (!sorted.length) return { text: "Hozircha e'lonlar yo'q." };
    if (q.includes("hamma") || q.includes("barcha")) {
      const list = sorted
        .slice(0, 5)
        .map((a) => `• ${formatShortDate(a.date)} — ${a.title}: ${a.text}`)
        .join("\n");
      return { text: `So'nggi e'lonlar:\n\n${list}` };
    }
    const latest = sorted[0];
    return {
      text: `So'nggi e'lon — «${latest.title}» (${formatShortDate(latest.date)}, ${latest.author}):\n\n${latest.text}`,
    };
  }

  // O'zgarishlar
  if (q.includes("ozgarish") || q.includes("bekor") || q.includes("almashtir")) {
    const upcoming = [...ctx.changes]
      .filter((c) => c.date >= dateKey)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4);
    if (!upcoming.length) {
      return { text: "Yaqin kunlarda jadval o'zgarishlari yo'q." };
    }
    const list = upcoming
      .map(
        (c) =>
          `• ${formatShortDate(c.date)}, ${c.lessonNumber}-dars (${c.subject}): ${c.oldValue} → ${c.newValue} — ${c.reason}`,
      )
      .join("\n");
    return { text: `Yaqin kunlardagi o'zgarishlar:\n\n${list}` };
  }

  // Umumiy jadval savoli
  if (q.includes("jadval") || q.includes("darslarim") || q.includes("darsim")) {
    const day = today ?? 0;
    const key = dateKey;
    const rows = rowsForDay(ctx, day, key);
    if (today === null) {
      return {
        text: `Bugun yakshanba — darslar yo'q. Quyida dushanba kuni:\n\n${formatRows(rowsForDay(ctx, 0, key))}`,
        lessons: rowsForDay(ctx, 0, key),
      };
    }
    return {
      text: `Bugungi (${WEEKDAYS[day]}) darslaringiz:\n\n${formatRows(rows)}`,
      lessons: rows,
    };
  }

  if (q.length <= 3) {
    return { text: "Savolingizni to'liqroq yozing, masalan: «Ertaga qanday darslarim bor?»" };
  }

  return { text: FALLBACK };
}
