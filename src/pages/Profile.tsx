import {
  BadgeCheck,
  BookOpen,
  Check,
  Globe,
  GraduationCap,
  Languages,
  LogOut,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  Users,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageHeader } from "../components/ui";
import { ROLE_LABEL, SUBJECTS } from "../lib/constants";
import { initials } from "../lib/store";
import { formatLongDate } from "../lib/dates";
import { useState } from "react";

export default function Profile() {
  const {
    user,
    theme,
    toggleTheme,
    logout,
    resetDemoData,
    announcements,
    changes,
    schedule,
    viewClassName,
    readIds,
  } = useApp();
  const [notifications, setNotifications] = useState(true);

  if (!user) return null;

  const roleMeta =
    user.role === "student"
      ? {
          icon: GraduationCap,
          label: ROLE_LABEL.student,
          detail: `${user.className ?? viewClassName} sinf o'quvchisi`,
          box: "from-blue-500 to-indigo-600",
        }
      : user.role === "teacher"
        ? {
            icon: BookOpen,
            label: ROLE_LABEL.teacher,
            detail: `${user.subject ?? SUBJECTS[0]} fani o'qituvchisi`,
            box: "from-emerald-500 to-teal-600",
          }
        : {
            icon: Users,
            label: ROLE_LABEL.parent,
            detail: `${user.childName ?? "Farzand"} · ${user.childClass ?? viewClassName} sinf ota-onasi`,
            box: "from-amber-500 to-orange-600",
          };

  const stats = [
    { label: "Darslar (hafta)", value: schedule.length },
    { label: "E'lonlar", value: announcements.length },
    { label: "O'zgarishlar", value: changes.length },
    { label: "O'qilgan", value: readIds.length },
  ];

  return (
    <div>
      <PageHeader title="Profil" kicker="Hisob" subtitle="Hisobingiz va sozlamalaringiz" />

      <div className="surface relative overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 sm:h-32">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-10 right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute right-40 -bottom-16 h-44 w-44 rounded-full bg-amber-300/30 blur-2xl" />
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-7 sm:pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-24 w-24 rounded-3xl object-cover shadow-float ring-4 ring-white dark:ring-slate-900"
                  />
                ) : (
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${roleMeta.box} text-2xl font-extrabold text-white shadow-float ring-4 ring-white dark:ring-slate-900`}
                  >
                    {initials(user.name)}
                  </div>
                )}
                <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-white dark:ring-slate-900">
                  <Check size={14} />
                </span>
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                    {user.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                    <BadgeCheck size={12} /> Tasdiqlangan
                  </span>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{user.email}</span>
                  <span className="hidden sm:inline">·</span>
                  <span>{roleMeta.detail}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span
                className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-br ${roleMeta.box} px-3.5 py-2 text-xs font-bold text-white shadow-md`}
              >
                <roleMeta.icon size={14} />
                {roleMeta.label}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/50"
              >
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="surface overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <p className="kicker">Sozlamalar</p>
            <h3 className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">
              Interfeys va bildirishnomalar
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Qorong'i rejim
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {theme === "dark" ? "Yoqilgan" : "O'chirilgan"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={theme === "dark"}
                onClick={toggleTheme}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                  theme === "dark" ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    theme === "dark" ? "translate-x-[22px]" : "translate-x-[2px]"
                  }`}
                  style={{ left: 0 }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Languages size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Til
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    O'zbekcha (Lotin)
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Globe size={12} /> Asosiy
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Palette size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Bildirishnomalar
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Yangi e'lonlar haqida xabar olish
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications}
                onClick={() => setNotifications((prev) => !prev)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                  notifications
                    ? "bg-blue-600"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    notifications ? "translate-x-[22px]" : "translate-x-[2px]"
                  }`}
                  style={{ left: 0 }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <RotateCcw size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Namuna ma'lumotlar
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Jadval va e'lonlarni boshlang'ich holatga qaytarish
                  </p>
                </div>
              </div>
              <button type="button" className="btn-secondary !py-2 !text-xs" onClick={resetDemoData}>
                Tiklash
              </button>
            </div>
          </div>
        </section>

        <section className="surface overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <p className="kicker">Hisob ma'lumotlari</p>
            <h3 className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">
              Shaxsiy ma'lumotlar
            </h3>
          </div>

          <dl className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
            {[
              { label: "Ism familiya", value: user.name },
              { label: "Email", value: user.email },
              { label: "Rol", value: ROLE_LABEL[user.role] },
              {
                label:
                  user.role === "teacher"
                    ? "Fan"
                    : user.role === "parent"
                      ? "Farzand sinfi"
                      : "Sinf",
                value:
                  user.role === "teacher"
                    ? (user.subject ?? "—")
                    : (user.childClass ?? user.className ?? viewClassName),
              },
              {
                label: "Bugungi sana",
                value: formatLongDate(new Date()),
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <dt className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  {row.label}
                </dt>
                <dd className="text-right font-semibold text-slate-800 dark:text-slate-100">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-slate-100 p-5 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-600 dark:hover:text-white"
            >
              <LogOut size={16} /> Chiqish
            </button>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              MaktabHub v1.0 · O'zbekiston maktablari uchun
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
