import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Clock,
  MapPin,
  Megaphone,
  MessageCircle,
  RefreshCw,
  Star,
  TrendingUp,
  Trophy,
  User as UserIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Skeleton } from "../components/ui";
import {
  ParentCard,
  GradeBar,
  RingProgress,
  TeacherContactList,
  lessonStatus,
} from "../components/parent";
import { useDelay } from "../lib/store";
import {
  MONTHS,
  WEEKDAYS,
  formatLongDate,
  formatShortDate,
  todayIndex,
  todayKey,
} from "../lib/dates";
import { LESSON_TIMES, SUBJECT_STYLE, SUBJECT_STYLE_FALLBACK } from "../lib/constants";
import {
  ATTENDANCE,
  CHILD,
  GRADE_CHIP,
  PARENT_ANNOUNCEMENT_CATEGORIES,
  RECENT_GRADES,
  SUBJECT_GRADES,
  TONE_LABEL,
  childGpa,
  gpaPercent,
  medalForRank,
  monthCalendar,
  shortDateLabel,
  toneForPercent,
} from "../lib/childData";

export default function ParentDashboard() {
  const { schedule, announcements, changes, viewClassName, user, readIds } = useApp();
  const loading = useDelay(450);

  const now = new Date();
  const todayIdx = todayIndex();
  const dateKey = todayKey();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const todayLessons = schedule
    .filter((slot) => slot.day === todayIdx && slot.className === viewClassName)
    .sort((a, b) => a.lesson - b.lesson);

  const upcomingChanges = [...changes]
    .filter((change) => change.date >= dateKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const status = lessonStatus(todayLessons, changes, dateKey, now);

  const lessonState = (lesson: number): "done" | "now" | "next" => {
    const [start, end] = LESSON_TIMES[lesson - 1].split("–");
    const toMin = (value: string) => {
      const [h, m] = value.split(":").map(Number);
      return h * 60 + m;
    };
    if (nowMinutes > toMin(end)) return "done";
    if (nowMinutes >= toMin(start)) return "now";
    return "next";
  };

  const gpa = childGpa();
  const percent = gpaPercent();
  const tone = toneForPercent(percent);
  const calendar = monthCalendar(now);

  const importantAnnouncements = [...announcements]
    .filter((item) => PARENT_ANNOUNCEMENT_CATEGORIES.includes(item.category))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const stateChip: Record<string, { label: string; className: string }> = {
    done: {
      label: "Tugadi",
      className: "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
    },
    now: {
      label: "Hozir",
      className: "bg-emerald-500 text-white shadow-sm shadow-emerald-500/40",
    },
    next: {
      label: "Kutilmoqda",
      className: "bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400",
    },
  };

  const statusBlock = () => {
    switch (status.kind) {
      case "lesson": {
        const slot = status.slot!;
        if (status.cancelled) {
          return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
              <p className="text-xs font-extrabold tracking-wide text-red-500 uppercase dark:text-red-300">
                Hozirgi dars bekor qilindi
              </p>
              <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                {slot.subject}
              </p>
              <p className="mt-1 text-xs text-red-600 dark:text-red-300">
                {slot.lesson}-dars · {LESSON_TIMES[slot.lesson - 1]} · {slot.room}
              </p>
            </div>
          );
        }
        return (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide text-emerald-600 uppercase dark:text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Hozir dars davom etmoqda
            </p>
            <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
              {slot.subject}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
              <span>{slot.lesson}-dars</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {LESSON_TIMES[slot.lesson - 1]}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} /> {slot.room}
              </span>
              <span className="inline-flex items-center gap-1">
                <UserIcon size={12} /> {slot.teacher}
              </span>
            </p>
          </div>
        );
      }
      case "break":
        return (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <p className="text-xs font-extrabold tracking-wide text-amber-600 uppercase dark:text-amber-300">
              Hozir tanaffus
            </p>
            <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              Keyingi dars: {status.nextSlot?.subject}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {status.nextSlot ? LESSON_TIMES[status.nextSlot.lesson - 1] : ""} ·{" "}
              {status.nextSlot?.room} · {status.nextSlot?.teacher}
            </p>
          </div>
        );
      case "before":
        return (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-500/30 dark:bg-sky-500/10">
            <p className="text-xs font-extrabold tracking-wide text-sky-600 uppercase dark:text-sky-300">
              Darslar hali boshlanmadi
            </p>
            <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              Birinchi dars: {status.nextSlot?.subject}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {status.nextSlot ? LESSON_TIMES[status.nextSlot.lesson - 1] : ""}
            </p>
          </div>
        );
      case "weekend":
        return (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/30 dark:bg-violet-500/10">
            <p className="text-xs font-extrabold tracking-wide text-violet-600 uppercase dark:text-violet-300">
              Bugun dam olish kuni
            </p>
            <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              Farzandingiz hozir maktabda emas
            </p>
          </div>
        );
      case "empty":
        return (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-xs font-extrabold tracking-wide text-slate-400 uppercase">
              Bugun darslar yo'q
            </p>
            <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              Jadvalda bugun uchun dars rejalashtirilmagan
            </p>
          </div>
        );
      default:
        return (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              Darslar tugagan
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Bugungi barcha darslar yakunlandi
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white shadow-float sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-12 h-60 w-60 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-rose-300/30 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-orange-600 shadow-float ring-4 ring-white/40 sm:h-28 sm:w-28 sm:text-4xl">
              {CHILD.initials}
            </div>
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-white/85 uppercase">
                Ota-ona paneli
              </p>
              <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Farzandim: {CHILD.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-xl border border-white/25 bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                  {CHILD.className} sinf
                </span>
                <span className="inline-flex items-center rounded-xl border border-white/25 bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                  {CHILD.school}
                </span>
                <span className="inline-flex items-center rounded-xl border border-white/25 bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                  {formatLongDate(now)}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden shrink-0 rounded-3xl border border-white/25 bg-white/15 p-5 text-center backdrop-blur-md md:block">
            <p className="text-4xl leading-none font-extrabold">{gpa}</p>
            <p className="mt-1.5 text-[11px] font-bold tracking-[0.14em] text-blue-100 uppercase">
              O'rtacha baho
            </p>
            <p className="mt-2 rounded-lg bg-white/20 px-3 py-1 text-[11px] font-bold">
              {CHILD.className} · {CHILD.school.split(",")[0]}
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className={`surface p-5 ${index === 3 || index === 5 || index === 7 ? "lg:col-span-2" : ""}`}
            >
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-4 h-8 w-28" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="stagger mt-5 grid gap-5 lg:grid-cols-3">
          <ParentCard
            title="Hozirgi holat"
            icon={<Clock size={16} />}
            iconClass="bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
            action={
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                {WEEKDAYS[now.getDay() === 0 ? 6 : now.getDay() - 1]}
              </span>
            }
          >
            {statusBlock()}
          </ParentCard>

          <ParentCard
            title="O'zlashtirish darajasi"
            icon={<TrendingUp size={16} />}
            iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
          >
            <div className="flex items-center gap-4">
              <RingProgress percent={percent} tone={tone} caption="umumiy" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  O'rtacha baho
                </p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {gpa}
                </p>
                <p
                  className={`mt-1 inline-flex rounded-lg px-2 py-1 text-[11px] font-bold ${
                    tone === "green"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : tone === "yellow"
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                        : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                  }`}
                >
                  {TONE_LABEL[tone]}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                  {SUBJECT_GRADES.length} ta fan bo'yicha hisoblangan
                </p>
              </div>
            </div>
          </ParentCard>

          <ParentCard
            title="Sinfda o'rni"
            icon={<Trophy size={16} />}
            iconClass="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
          >
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                #{CHILD.rank}
              </p>
              <p className="text-lg font-bold text-slate-400">/ {CHILD.classSize}</p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                o'quvchi
              </p>
              <span className="ml-auto text-3xl" title="3-o'rin">
                {medalForRank(CHILD.rank)}
              </span>
            </div>
            <p className="mt-2 inline-flex rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
              Sinfda eng yaxshi {CHILD.topPercent}% ichida
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">
                    {CHILD.name}
                  </span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {gpa}
                  </span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2.5 rounded-full bg-emerald-500"
                    style={{ width: `${(gpa / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">
                    Sinf o'rtachasi
                  </span>
                  <span className="font-extrabold text-slate-500 dark:text-slate-400">
                    {CHILD.classAverage}
                  </span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2.5 rounded-full bg-slate-400 dark:bg-slate-600"
                    style={{ width: `${(CHILD.classAverage / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </ParentCard>

          <ParentCard
            className="lg:col-span-2"
            title="Bugungi darslar"
            icon={<CalendarDays size={16} />}
            iconClass="bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
            action={
              <Link
                to="/jadval"
                className="flex items-center gap-1 text-xs font-semibold text-orange-600 transition hover:text-orange-700 dark:text-orange-400"
              >
                To'liq jadval <ArrowRight size={13} />
              </Link>
            }
          >
            {todayLessons.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700">
                Bugun uchun darslar yo'q
              </p>
            ) : (
              <ul className="space-y-2.5">
                {todayLessons.map((slot) => {
                  const change = changes.find(
                    (item) =>
                      item.date === dateKey && item.lessonNumber === slot.lesson,
                  );
                  const cancelled =
                    change?.newValue.toLowerCase().includes("bekor") ?? false;
                  const state = lessonState(slot.lesson);
                  const chip = cancelled
                    ? {
                        label: "Bekor",
                        className:
                          "bg-red-500 text-white shadow-sm shadow-red-500/40",
                      }
                    : stateChip[state];

                  return (
                    <li
                      key={`${slot.day}-${slot.lesson}`}
                      className={`flex flex-col gap-2 rounded-xl border p-3.5 transition sm:flex-row sm:items-center sm:justify-between ${
                        cancelled
                          ? "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
                          : state === "now"
                            ? "border-emerald-300 bg-emerald-50 shadow-md shadow-emerald-500/10 dark:border-emerald-500/40 dark:bg-emerald-500/10"
                            : state === "done"
                              ? "border-slate-100 bg-slate-50/70 opacity-65 dark:border-slate-800 dark:bg-slate-800/40"
                              : "border-slate-100 bg-white hover:border-orange-200 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-orange-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 min-w-16 items-center justify-center rounded-lg bg-white px-2 text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                          {LESSON_TIMES[slot.lesson - 1]}
                        </span>
                        <div>
                          <span
                            className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-sm font-semibold ${
                              SUBJECT_STYLE[slot.subject] ?? SUBJECT_STYLE_FALLBACK
                            }`}
                          >
                            {slot.subject}
                          </span>
                          <p className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <UserIcon size={12} /> {slot.teacher}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} /> {slot.room}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`self-start rounded-lg px-2 py-1 text-[11px] font-bold sm:self-center ${chip.className}`}
                      >
                        {cancelled ? chip.label : `${slot.lesson}-dars · ${chip.label}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </ParentCard>

          <ParentCard
            title="Davomat"
            icon={<CalendarCheck size={16} />}
            iconClass="bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400"
          >
            <div className="space-y-1.5">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {ATTENDANCE.percent}%
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Bu oy qatnashdi
              </p>
              <p className="inline-flex rounded-lg bg-red-50 px-2 py-1 text-[11px] font-bold text-red-500 dark:bg-red-500/15 dark:text-red-300">
                Kelmagan kunlar: {ATTENDANCE.absentDays}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <p className="mb-2 text-center text-[11px] font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {MONTHS[calendar.month]} {calendar.year}
              </p>
              <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-slate-400 uppercase">
                {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Yu"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {Array.from({ length: calendar.leadingBlanks }).map((_, index) => (
                  <span key={`blank-${index}`} />
                ))}
                {calendar.cells.map((cell) => {
                  const styles: Record<string, string> = {
                    present:
                      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
                    absent:
                      "bg-red-100 text-red-600 font-extrabold ring-1 ring-red-300 dark:bg-red-500/25 dark:text-red-300 dark:ring-red-500/40",
                    future:
                      "bg-white text-slate-300 dark:bg-slate-900 dark:text-slate-600",
                    off: "bg-slate-100/70 text-slate-300 dark:bg-slate-800/60 dark:text-slate-600",
                  };
                  return (
                    <span
                      key={cell.day}
                      className={`flex h-6 items-center justify-center rounded-md text-[10px] font-semibold ${styles[cell.state]}`}
                    >
                      {cell.day}
                    </span>
                  );
                })}
              </div>
              <div className="mt-2.5 flex items-center justify-center gap-3 text-[9px] font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-400" /> Qatnadi
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-red-400" /> Kelmadi
                </span>
              </div>
            </div>
          </ParentCard>

          <ParentCard
            className="lg:col-span-3"
            title="Jadval o'zgarishlari"
            icon={<RefreshCw size={16} />}
            iconClass="bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
            action={
              <Link
                to="/ozgarishlar"
                className="flex items-center gap-1 text-xs font-semibold text-orange-600 transition hover:text-orange-700 dark:text-orange-400"
              >
                Barchasi <ArrowRight size={13} />
              </Link>
            }
          >
            {upcomingChanges.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700">
                O'zgarishlar yo'q
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {upcomingChanges.map((change) => {
                  const cancelled = change.newValue
                    .toLowerCase()
                    .includes("bekor");
                  return (
                    <div
                      key={change.id}
                      className={`rounded-xl border-l-4 p-3.5 ${
                        cancelled
                          ? "border-l-red-500 bg-red-50 dark:bg-red-500/10"
                          : "border-l-amber-500 bg-amber-50 dark:bg-amber-500/10"
                      }`}
                    >
                      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                        {formatShortDate(change.date)} · {change.lessonNumber}-dars
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {change.subject}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {change.oldValue} → <strong>{change.newValue}</strong>
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {change.reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </ParentCard>

          <ParentCard
            className="lg:col-span-2"
            title="Fanlar bo'yicha baholar"
            icon={<BookOpen size={16} />}
            iconClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
            action={
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                O'rtacha: {gpa}
              </span>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {SUBJECT_GRADES.map((item) => (
                <GradeBar
                  key={item.subject}
                  subject={item.subject}
                  grade={item.grade}
                />
              ))}
            </div>
          </ParentCard>

          <ParentCard
            title="So'nggi baholar"
            icon={<Star size={16} />}
            iconClass="bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
          >
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {RECENT_GRADES.map((item, index) => (
                <li
                  key={`${item.date}-${item.subject}-${index}`}
                  className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                      GRADE_CHIP[item.grade] ?? GRADE_CHIP[3]
                    }`}
                  >
                    {item.grade}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                      {item.subject}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {shortDateLabel(item.date)} · {item.teacher}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ParentCard>

          <ParentCard
            className="lg:col-span-2"
            title="Muhim e'lonlar"
            icon={<Megaphone size={16} />}
            iconClass="bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400"
            action={
              <Link
                to="/elonlar"
                className="flex items-center gap-1 text-xs font-semibold text-orange-600 transition hover:text-orange-700 dark:text-orange-400"
              >
                Barchasi <ArrowRight size={13} />
              </Link>
            }
          >
            {importantAnnouncements.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700">
                Muhim e'lonlar hozircha yo'q
              </p>
            ) : (
              <ul className="space-y-2.5">
                {importantAnnouncements.map((item) => (
                  <li
                    key={item.id}
                    className={`rounded-xl border p-3.5 transition hover:border-orange-200 dark:hover:border-orange-500/30 ${
                      readIds.includes(item.id)
                        ? "border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40"
                        : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          readIds.includes(item.id)
                            ? "text-slate-500 dark:text-slate-400"
                            : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="shrink-0 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.text}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {item.author} · {formatShortDate(item.date)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </ParentCard>

          <ParentCard
            title="O'qituvchi bilan aloqa"
            icon={<MessageCircle size={16} />}
            iconClass="bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
            bodyClassName="p-4 sm:p-5"
          >
            <TeacherContactList />
          </ParentCard>
        </div>
      )}

      <p className="mt-6 text-center text-[11px] text-slate-400">
        {CHILD.name} · {CHILD.className} sinf · {CHILD.school} · Ota-ona:{" "}
        {user?.name}
      </p>
    </div>
  );
}
