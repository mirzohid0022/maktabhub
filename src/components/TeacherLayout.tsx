import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  DoorOpen,
  Home,
  LogOut,
  Users,
  UsersRound,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useScript } from "../context/ScriptContext";
import ScriptToggle from "./ScriptToggle";
import ThemeToggle from "./ThemeToggle";
import { ROLE_LABEL } from "../lib/constants";
import { initials } from "../lib/store";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/teacher", label: "Bosh sahifa", icon: Home, end: true },
  { to: "/teacher/jadval", label: "Jadval", icon: CalendarDays },
  { to: "/teacher/sinflar", label: "Sinflar", icon: Users },
  { to: "/teacher/xonalar", label: "Xonalar", icon: DoorOpen },
  { to: "/teacher/yigilishlar", label: "Yig'ilishlar", icon: UsersRound },
];

const TITLES: Record<string, string> = {
  "/teacher": "Bosh sahifa",
  "/teacher/jadval": "Jadval",
  "/teacher/sinflar": "Sinflar",
  "/teacher/xonalar": "Xonalar",
  "/teacher/yigilishlar": "Yig'ilishlar",
};

const ACTIVE =
  "bg-[#059669] text-white shadow-lg shadow-[#059669]/30 -translate-y-px";
const ACTIVE_BOTTOM =
  "bg-[#059669] text-white shadow-md shadow-[#059669]/30";
const IDLE =
  "text-slate-500 hover:translate-x-0.5 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white";
const IDLE_BOTTOM =
  "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200";

export default function TeacherLayout() {
  const { user, logout } = useApp();
  const { t } = useScript();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const pageTitle = TITLES[location.pathname] ?? "Bosh sahifa";

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="ambient pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/95 md:flex">
        <div className="h-1.5 w-full bg-[#059669]" aria-hidden="true" />
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5 dark:border-slate-800/80">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#059669] text-white shadow-md shadow-[#059669]/25">
            <BookOpen size={21} strokeWidth={2.2} />
          </span>
          <div className="leading-tight">
            <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              MaktabHub
            </p>
            <p className="text-xs font-semibold text-[#059669]">
              {t("O'qituvchi paneli")}
            </p>
          </div>
        </div>

        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-extrabold tracking-[0.18em] text-slate-400 uppercase dark:text-slate-500">
            {t("Menyu")}
          </p>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 pb-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive ? ACTIVE : IDLE
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? "scale-105 bg-white/20"
                        : "bg-slate-100 text-slate-500 group-hover:scale-105 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <item.icon size={17} />
                  </span>
                  <span>{t(item.label)}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3.5 dark:border-slate-800/80">
          <div className="flex items-center gap-3 rounded-xl border border-[#059669]/25 bg-[#059669]/5 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#059669] text-sm font-bold text-white">
              {initials(user?.name ?? "MaktabHub")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                {user?.name}
              </p>
              <p className="truncate text-[11px] font-semibold text-[#059669]">
                {user ? t(ROLE_LABEL[user.role]) : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title={t("Chiqish")}
              aria-label={t("Chiqish")}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-600 hover:shadow-sm dark:hover:bg-slate-700"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="relative z-10 md:pl-64">
        <header className="header-glass sticky top-0 z-30 flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#059669]" aria-hidden="true" />
            <span className="hidden text-[10px] font-extrabold tracking-[0.16em] text-[#059669] uppercase md:inline">
              MaktabHub
            </span>
            <span className="hidden text-[10px] text-slate-300 dark:text-slate-600 md:inline">
              /
            </span>
            <h2 className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
              {t(pageTitle)}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <ScriptToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#059669] text-white transition hover:brightness-110"
              title={t("Chiqish")}
              aria-label={t("Chiqish")}
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pt-7 pb-36 md:px-6 md:pb-12">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/70 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-900/95"
        aria-label={t("Asosiy menyu")}
      >
        <div className="no-scrollbar flex items-stretch gap-1 overflow-x-auto px-2 py-1.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              aria-label={t(item.label)}
              className={({ isActive }) =>
                `relative flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-[10px] font-bold transition-all duration-200 ${
                  isActive ? ACTIVE_BOTTOM : IDLE_BOTTOM
                }`
              }
            >
              <item.icon size={18} />
              <span className="whitespace-nowrap">{t(item.label)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
