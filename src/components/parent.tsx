import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { MessageCircle, Send, User as UserIcon } from "lucide-react";
import { useApp } from "../context/AppContext";
import Modal from "./Modal";
import {
  LESSON_TIMES,
  SUBJECT_STYLE,
  SUBJECT_STYLE_FALLBACK,
  lessonRange,
} from "../lib/constants";
import { initials } from "../lib/store";
import { TONE_STROKE, type Tone } from "../lib/childData";
import type { LessonChange, ScheduleSlot } from "../types";

export interface LessonStatus {
  kind: "lesson" | "break" | "before" | "after" | "weekend" | "empty";
  slot?: ScheduleSlot;
  cancelled?: boolean;
  nextSlot?: ScheduleSlot;
}

export function lessonStatus(
  todayLessons: ScheduleSlot[],
  changes: LessonChange[],
  dateKey: string,
  now: Date = new Date(),
): LessonStatus {
  const jsDay = now.getDay();
  if (jsDay === 0 || jsDay === 6) return { kind: "weekend" };
  if (todayLessons.length === 0) return { kind: "empty" };

  const sorted = [...todayLessons].sort((a, b) => a.lesson - b.lesson);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isCancelled = (slot: ScheduleSlot) =>
    changes.some(
      (change) =>
        change.date === dateKey &&
        change.lessonNumber === slot.lesson &&
        change.newValue.toLowerCase().includes("bekor"),
    );

  const firstStart = lessonRange(LESSON_TIMES[sorted[0].lesson - 1])[0];
  if (nowMinutes < firstStart) return { kind: "before", nextSlot: sorted[0] };

  for (let index = 0; index < sorted.length; index += 1) {
    const slot = sorted[index];
    const [start, end] = lessonRange(LESSON_TIMES[slot.lesson - 1]);
    if (nowMinutes >= start && nowMinutes <= end) {
      return { kind: "lesson", slot, cancelled: isCancelled(slot) };
    }
    const next = sorted[index + 1];
    if (next) {
      const [nextStart] = lessonRange(LESSON_TIMES[next.lesson - 1]);
      if (nowMinutes > end && nowMinutes < nextStart) {
        return { kind: "break", nextSlot: next };
      }
    }
  }

  return { kind: "after" };
}

export function ParentCard({
  title,
  icon,
  iconClass,
  action,
  className = "",
  bodyClassName = "p-4 sm:p-5",
  children,
}: {
  title: string;
  icon: ReactNode;
  iconClass: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`surface lift glow-orange flex flex-col overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h3 className="flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-slate-100">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
          >
            {icon}
          </span>
          {title}
        </h3>
        {action}
      </div>
      <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export function RingProgress({
  percent,
  tone,
  size = 132,
  stroke = 13,
  caption,
}: {
  percent: number;
  tone: Tone;
  size?: number;
  stroke?: number;
  caption?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = (clamped / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-100 dark:stroke-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={TONE_STROKE[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {clamped}%
        </span>
        {caption ? (
          <span className="mt-0.5 text-[10px] font-bold tracking-wide text-slate-400 uppercase">
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function GradeBar({ subject, grade }: { subject: string; grade: number }) {
  const bars: Record<number, string> = {
    5: "bg-emerald-500",
    4: "bg-blue-500",
    3: "bg-amber-400",
    2: "bg-red-500",
  };
  const chips: Record<number, string> = {
    5: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    4: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    3: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    2: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {subject}
        </span>
        <span
          className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${chips[grade] ?? chips[3]}`}
        >
          {grade}
        </span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-2 rounded-full ${bars[grade] ?? bars[3]}`}
          style={{ width: `${(grade / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function useChildTeachers() {
  const { schedule, viewClassName } = useApp();
  return useMemo(() => {
    const map = new Map<string, { subject: string; teacher: string }>();
    for (const slot of schedule) {
      if (slot.className !== viewClassName) continue;
      if (!map.has(slot.subject)) {
        map.set(slot.subject, { subject: slot.subject, teacher: slot.teacher });
      }
    }
    return [...map.values()].sort((a, b) => a.subject.localeCompare(b.subject, "uz"));
  }, [schedule, viewClassName]);
}

export function TeacherContactList() {
  const teachers = useChildTeachers();
  const { toast } = useApp();
  const [active, setActive] = useState<{ subject: string; teacher: string } | null>(null);
  const [message, setMessage] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim() || !active) {
      toast("Xabar matnini kiriting.", "error");
      return;
    }
    toast(`Xabar yuborildi: ${active.teacher}`);
    setMessage("");
    setActive(null);
  };

  return (
    <>
      <ul className="space-y-2.5">
        {teachers.map((item) => (
          <li
            key={item.subject}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-orange-200 hover:bg-orange-50/50 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-orange-500/30"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 text-xs font-extrabold text-white">
                {initials(item.teacher)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                  {item.teacher}
                </p>
                <span
                  className={`inline-flex mt-0.5 items-center rounded-md border px-1.5 py-px text-[10px] font-bold ${
                    SUBJECT_STYLE[item.subject] ?? SUBJECT_STYLE_FALLBACK
                  }`}
                >
                  {item.subject}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActive(item);
                setMessage("");
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[11px] font-bold text-slate-600 shadow-sm transition hover:bg-orange-500 hover:text-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-orange-500"
            >
              <MessageCircle size={13} />
              <span className="hidden sm:inline">Xabar yozish</span>
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={Boolean(active)}
        title={active ? `${active.teacher} — xabar` : ""}
        onClose={() => setActive(null)}
        footer={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setActive(null)}
            >
              Bekor qilish
            </button>
            <button type="button" className="btn-primary" onClick={submit}>
              <Send size={15} /> Yuborish
            </button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-3 dark:border-orange-500/30 dark:bg-orange-500/10">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 text-xs font-extrabold text-white">
              {active ? initials(active.teacher) : ""}
            </span>
            <div className="text-sm">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {active?.teacher}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {active?.subject} fani o'qituvchisi
              </p>
            </div>
            <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm dark:bg-slate-900">
              <UserIcon size={15} />
            </span>
          </div>
          <div>
            <label className="field-label">Xabar matni</label>
            <textarea
              className="input min-h-28 resize-y"
              placeholder="Assalomu alaykum, farzandimning darsi haqida savol bor edi..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </>
  );
}
