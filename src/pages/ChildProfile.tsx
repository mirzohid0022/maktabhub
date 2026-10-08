import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  CalendarDays,
  LogOut,
  School,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageHeader } from "../components/ui";
import { ParentCard, TeacherContactList } from "../components/parent";
import { todayIndex } from "../lib/dates";
import { ROLE_LABEL } from "../lib/constants";
import {
  ATTENDANCE,
  CHILD,
  childGpa,
  gpaPercent,
  toneForPercent,
} from "../lib/childData";

export default function ChildProfile() {
  const { user, logout, schedule, viewClassName, viewClassName: className } = useApp();
  const navigate = useNavigate();

  const gpa = childGpa();
  const percent = gpaPercent();
  const tone = toneForPercent(percent);
  const todayIdx = todayIndex();
  const todayCount = schedule.filter(
    (slot) => slot.day === todayIdx && slot.className === viewClassName,
  ).length;

  const stats = [
    {
      label: "O'rtacha baho",
      value: String(gpa),
      icon: TrendingUp,
      box: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    {
      label: "Sinfdagi o'rin",
      value: `#${CHILD.rank}/${CHILD.classSize}`,
      icon: Trophy,
      box: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    },
    {
      label: "Davomat",
      value: `${ATTENDANCE.percent}%`,
      icon: CalendarCheck,
      box: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
    },
    {
      label: "Bugungi darslar",
      value: String(todayCount),
      icon: CalendarDays,
      box: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    },
  ];

  return (
    <div>
      <PageHeader
        kicker="Farzandim"
        title={CHILD.name}
        subtitle={`${CHILD.className} sinf · ${CHILD.school}`}
      />

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-500 p-6 text-white shadow-float sm:p-7">
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-rose-300/30 blur-3xl" />

        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-orange-600 shadow-float ring-4 ring-white/40 sm:h-28 sm:w-28 sm:text-4xl">
            {CHILD.initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{CHILD.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-xl border border-white/25 bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                {CHILD.className} sinf
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                <School size={13} /> {CHILD.school}
              </span>
              <span className="inline-flex items-center rounded-xl border border-white/25 bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                Sinf rahbari: {CHILD.classTeacher}
              </span>
            </div>
            <p className="mt-3 text-xs font-semibold text-white/85">
              {tone === "green" ? "✅" : tone === "yellow" ? "🟡" : "🔴"} O'rtacha{" "}
              {gpa} · Sinfdagi {CHILD.rank}-o'rin · Davomat {ATTENDANCE.percent}%
            </p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="surface p-4 transition hover:-translate-y-0.5 hover:shadow-float"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.box}`}
            >
              <stat.icon size={17} />
            </span>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ParentCard
          title="O'qituvchilar bilan aloqa"
          icon={<CalendarDays size={16} />}
          iconClass="bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
        >
          <TeacherContactList />
        </ParentCard>

        <ParentCard
          title="Hisob"
          icon={<LogOut size={16} />}
          iconClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          <dl className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
            {[
              { label: "Ota-ona", value: user?.name ?? "—" },
              { label: "Email", value: user?.email ?? "—" },
              { label: "Rol", value: user ? ROLE_LABEL[user.role] : "—" },
              { label: "Farzand", value: CHILD.name },
              { label: "Sinf", value: `${className} · ${CHILD.school}` },
              { label: "Davomat", value: `${ATTENDANCE.percent}% qatnashdi` },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-0"
              >
                <dt className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  {row.label}
                </dt>
                <dd className="text-right text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            Ma'lumotlar {CHILD.name} profilidan olinmoqda. O'zgarishlar maktab
            tomonidan kiritiladi.
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-600 dark:hover:text-white"
          >
            <LogOut size={16} /> Chiqish
          </button>
        </ParentCard>
      </div>
    </div>
  );
}
