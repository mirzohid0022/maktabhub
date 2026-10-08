import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Clock,
  MapPin,
  Megaphone,
  RefreshCw,
  TrendingUp,
  User as UserIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card, CardSkeleton, EmptyState, Skeleton } from "../components/ui";
import {
  BellIllo,
  CalendarIllo,
  EmptyBoxIllo,
} from "../components/Illustrations";
import { useCountUp, useDelay } from "../lib/store";
import {
  MONTHS,
  WEEKDAYS,
  formatLongDate,
  formatShortDate,
  todayIndex,
  todayKey,
} from "../lib/dates";
import {
  LESSON_TIMES,
  SUBJECT_STYLE,
  SUBJECT_STYLE_FALLBACK,
  subjectHex,
} from "../lib/constants";

function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return "Xayrli tong";
  if (hour >= 12 && hour < 18) return "Xayrli kun";
  return "Xayrli kech";
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  trend,
}: {
  label: string;
  value: number;
  icon: typeof CalendarDays;
  gradient: string;
  trend: string;
}) {
  const animated = useCountUp(value);
  return (
    <div
      className={`lift glow-blue relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-4 text-white shadow-lg shadow-slate-900/10 sm:p-5`}
    >
      <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/20 blur-xl" />
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm">
        <Icon size={19} />
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight">
        {animated}
      </p>
      <p className="text-xs font-semibold text-white/85">{label}</p>
      <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide">
        <TrendingUp size={11} />
        {trend}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { user, schedule, announcements, changes, viewClassName, readIds } = useApp();
  const loading = useDelay(500);

  const now = new Date();
  const todayIdx = todayIndex();
  const dateKey = todayKey();

  const todayLessons = schedule
    .filter((slot) => slot.day === todayIdx)
    .sort((a, b) => a.lesson - b.lesson);

  const latestAnnouncements = [...announcements]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const upcomingChanges = [...changes]
    .filter((change) => change.date >= dateKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const stats = [
    {
      label: "Bu hafta darslar",
      value: schedule.length,
      icon: CalendarDays,
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      trend: "joriy hafta",
    },
    {
      label: "Bugungi darslar",
      value: todayLessons.length,
      icon: Clock,
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      trend: "bugungi kun",
    },
    {
      label: "E'lonlar",
      value: announcements.length,
      icon: Megaphone,
      gradient: "from-purple-500 via-violet-600 to-fuchsia-600",
      trend: "umumiy",
    },
    {
      label: "O'zgarishlar",
      value: changes.length,
      icon: RefreshCw,
      gradient: "from-amber-500 via-orange-500 to-orange-600",
      trend: "shu mavsumda",
    },
  ];

  const firstName = (user?.name ?? "").split(" ")[0];
  const weekday = WEEKDAYS[now.getDay() === 0 ? 6 : now.getDay() - 1];
  const dayNumber = String(now.getDate()).padStart(2, "0");

  const isTeacher = user?.role === "teacher";

  const quickActions = [
    {
      to: "/jadval",
      label: "Dars jadvalini tahrirlash",
      icon: CalendarDays,
      desc: "Darslarni, o'qituvchilar va xonalarni o'zgartiring",
    },
    {
      to: "/elonlar",
      label: "E'lon joylash",
      icon: Megaphone,
      desc: "Maktab jamoasi uchun yangi e'lon qo'shing",
    },
    {
      to: "/ozgarishlar",
      label: "O'zgarish qo'shish",
      icon: RefreshCw,
      desc: "Dars bekor qilinishi yoki o'zgarishini belgilang",
    },
  ];

  const heroChips =
    user?.role === "parent"
      ? [
          "Ota-ona",
          `Farzandingiz: ${user.childName ?? "—"} · ${viewClassName} sinf`,
        ]
      : user?.role === "teacher"
        ? [
            "O'qituvchi",
            `${user.subject ?? "Fan"} · ${viewClassName} sinfi jadvali`,
          ]
        : ["O'quvchi", `${viewClassName} sinf o'quvchisi`];

  const changesSection = (
    <section className="surface lift glow-orange lg:col-span-3">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <RefreshCw size={17} className="text-amber-500" />
          Jadval o'zgarishlari
        </h3>
        <Link
          to="/ozgarishlar"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
        >
          Barchasi <ArrowRight size={13} />
        </Link>
      </div>

      <div className="p-4 sm:p-5">
        {loading ? (
          <CardSkeleton lines={2} />
        ) : upcomingChanges.length === 0 ? (
          <EmptyState
            icon={<RefreshCw size={26} />}
            title="O'zgarishlar yo'q"
            description="Jadval bo'yicha hozircha o'zgarishlar kiritilmagan."
            illo={<EmptyBoxIllo className="w-full" />}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingChanges.map((change) => {
              const cancelled = change.newValue
                .toLowerCase()
                .includes("bekor");
              return (
                <div
                  key={change.id}
                  className={`rounded-xl border-l-4 p-4 ${
                    cancelled
                      ? "border-l-red-500 bg-red-50 dark:bg-red-500/10"
                      : "border-l-amber-500 bg-amber-50 dark:bg-amber-500/10"
                  }`}
                >
                  <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                    {formatShortDate(change.date)} · {change.lessonNumber}-dars
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
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
      </div>
    </section>
  );

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-float sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-12 h-60 w-60 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="pointer-events-none absolute top-6 right-1/3 h-24 w-24 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute right-10 bottom-6 h-16 w-16 rounded-full bg-white/10" />

        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.2em] text-indigo-200 uppercase">
              {greetingFor(now.getHours())}
            </p>
            <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Salom, {firstName}! <span className="inline-block float-slow">👋</span>
            </h1>
            <p className="mt-2 text-sm text-indigo-100 sm:text-base">
              {formatLongDate(now)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {heroChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-xl border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="w-fit rounded-3xl border border-white/25 bg-white/15 p-5 text-center backdrop-blur-md sm:p-6">
            <p className="text-5xl leading-none font-extrabold tracking-tight sm:text-6xl">
              {dayNumber}
            </p>
            <p className="mt-2 text-sm font-semibold text-blue-100">
              {MONTHS[now.getMonth()]} {now.getFullYear()}
            </p>
            <p className="mt-3 rounded-lg bg-white/20 px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase">
              {weekday}
            </p>
          </div>
        </div>
      </section>

      {isTeacher ? (
        <div className="mt-5">
          <p className="kicker mb-3">Tezkor amallar</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group block transition duration-200 hover:-translate-y-0.5"
              >
                <Card
                  className="h-full transition duration-200 group-hover:shadow-float"
                  title={action.label}
                  action={
                    <ArrowRight
                      size={16}
                      className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
                    />
                  }
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <action.icon size={18} />
                    </span>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {action.desc}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-5">{changesSection}</div>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <Skeleton className="h-10 w-10 rounded-2xl" />
                    <Skeleton className="mt-4 h-8 w-16" />
                    <Skeleton className="mt-2 h-3.5 w-24" />
                  </div>
                ))
              : stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="surface lift glow-blue lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <CalendarDays size={17} className="text-blue-500" />
              Bugungi darslar
            </h3>
            <Link
              to="/jadval"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
            >
              To'liq jadval <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : todayLessons.length === 0 ? (
              <EmptyState
                icon={<CalendarDays size={26} />}
                title="Bugun darslar yo'q"
                description="Bugun maktabda darslar rejalashtirilmagan. Dam olish kuni muborak!"
                illo={<CalendarIllo className="w-full" />}
              />
            ) : (
              <ul className="space-y-2.5">
                {todayLessons.map((slot) => {
                  const change = changes.find(
                    (item) =>
                      item.date === dateKey && item.lessonNumber === slot.lesson,
                  );
                  const cancelled =
                    change?.newValue.toLowerCase().includes("bekor") ?? false;
                  return (
                    <li
                      key={`${slot.day}-${slot.lesson}`}
                      style={
                        cancelled ? undefined : { borderLeftColor: subjectHex(slot.subject) }
                      }
                      className={`flex flex-col gap-2 rounded-xl border border-l-4 p-3.5 transition sm:flex-row sm:items-center sm:justify-between ${
                        cancelled
                          ? "border-red-200 border-l-red-500 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
                          : "border-slate-100 bg-slate-50 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-blue-500/30"
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
                        className={`self-start rounded-lg px-2 py-1 text-[11px] font-semibold sm:self-center ${
                          cancelled
                            ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {slot.lesson}-dars
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="surface lift glow-purple">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <Megaphone size={17} className="text-purple-500" />
              So'nggi e'lonlar
            </h3>
            <Link
              to="/elonlar"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
            >
              Barchasi <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : latestAnnouncements.length === 0 ? (
              <EmptyState
                icon={<Bell size={26} />}
                title="Hozircha e'lonlar yo'q"
                description="Maktabdan yangi e'lonlar shu yerda paydo bo'ladi."
                illo={<BellIllo className="w-full" />}
              />
            ) : (
              <ul className="space-y-3">
                {latestAnnouncements.map((item) => (
                  <li
                    key={item.id}
                    className={`rounded-xl border p-3.5 transition hover:border-blue-200 dark:hover:border-blue-500/30 ${
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
                      {!readIds.includes(item.id) ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      ) : null}
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
          </div>
        </section>

            {changesSection}
          </div>
        </>
      )}
    </div>
  );
}
