import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Baby,
  BarChart3,
  Bell,
  CalendarDays,
  Home,
  LogOut,
  Megaphone,
  MessageCircle,
  MessageSquare,
  NotebookPen,
  RefreshCw,
  User as UserIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useScript } from "../context/ScriptContext";
import Logo from "./Logo";
import ScriptToggle from "./ScriptToggle";
import ThemeToggle from "./ThemeToggle";
import { ROLE_LABEL } from "../lib/constants";
import { initials } from "../lib/store";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Asosiy", icon: Home },
  { to: "/jadval", label: "Dars jadvali", icon: CalendarDays },
  { to: "/uy-vazifalari", label: "Uy vazifalari", icon: NotebookPen },
  { to: "/xabarlar", label: "Xabarlar", icon: MessageSquare },
  { to: "/elonlar", label: "E'lonlar", icon: Megaphone },
  { to: "/ozgarishlar", label: "O'zgarishlar", icon: RefreshCw },
  { to: "/ai", label: "AI Yordamchi", icon: MessageCircle },
  { to: "/profil", label: "Profil", icon: UserIcon },
];

const PARENT_NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Asosiy", icon: Home },
  { to: "/baholar", label: "Baholar", icon: BarChart3 },
  { to: "/jadval", label: "Jadval", icon: CalendarDays },
  { to: "/uy-vazifalari", label: "Uy vazifalari", icon: NotebookPen },
  { to: "/xabarlar", label: "Xabarlar", icon: MessageSquare },
  { to: "/elonlar", label: "E'lonlar", icon: Megaphone },
  { to: "/farzandim", label: "Farzandim", icon: Baby },
];

const TITLES: Record<string, string> = {
  "/": "Asosiy sahifa",
  "/jadval": "Dars jadvali",
  "/uy-vazifalari": "Uy vazifalari",
  "/xabarlar": "Xabarlar",
  "/elonlar": "E'lonlar",
  "/ozgarishlar": "Jadval o'zgarishlari",
  "/ai": "AI Yordamchi",
  "/profil": "Profil",
  "/baholar": "Baholar",
  "/farzandim": "Farzandim",
};

const NAV_TINT: Record<string, string> = {
  "/": "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  "/jadval":
    "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  "/uy-vazifalari":
    "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  "/xabarlar":
    "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  "/elonlar":
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  "/ozgarishlar":
    "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  "/ai": "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300",
  "/profil":
    "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  "/baholar":
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  "/farzandim":
    "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300",
};

const ROLE_RING: Record<string, string> = {
  student: "ring-blue-500/70",
  teacher: "ring-purple-500/70",
  parent: "ring-orange-500/70",
};

function Avatar({
  name,
  src,
  size = "md",
  role,
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  role?: string;
}) {
  const box =
    size === "lg" ? "h-12 w-12 text-base" : size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  const ring = role ? ROLE_RING[role] ?? "" : "";
  return src ? (
    <img
      src={src}
      alt={name}
      className={`${box} ${ring} shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-slate-800`}
    />
  ) : (
    <span
      className={`${box} ${ring} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 font-bold text-white ring-2 ring-white dark:ring-slate-800`}
    >
      {initials(name)}
    </span>
  );
}

export default function Layout() {
  const { user, logout, unreadCount, viewClassName } = useApp();
  const { t } = useScript();
  const location = useLocation();
  const navigate = useNavigate();
  const [bellShake, setBellShake] = useState(false);
  const prevUnread = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount > prevUnread.current) {
      setBellShake(true);
      const timer = setTimeout(() => setBellShake(false), 800);
      prevUnread.current = unreadCount;
      return () => clearTimeout(timer);
    }
    prevUnread.current = unreadCount;
  }, [unreadCount]);

  const isParent = user?.role === "parent";
  const navItems = isParent ? PARENT_NAV_ITEMS : NAV_ITEMS;
  const profileTo = isParent ? "/farzandim" : "/profil";
  const activeNavClass = isParent ? "nav-item-active-warm" : "nav-item-active";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="ambient pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/95 md:flex">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" aria-hidden="true" />
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800/80">
          <Logo subtitle={t("Maktab platformasi")} />
          <span className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-extrabold tracking-[0.12em] text-amber-600 uppercase dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
            v1.0
          </span>
        </div>

        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-extrabold tracking-[0.18em] text-slate-400 uppercase dark:text-slate-500">
            {t("Menyu")}
          </p>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 pb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? `${activeNavClass} -translate-y-px`
                    : "text-slate-500 hover:translate-x-0.5 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? "scale-105 bg-white/20"
                        : `${NAV_TINT[item.to] ?? "bg-slate-100 text-slate-500"} group-hover:scale-105`
                    }`}
                  >
                    <item.icon size={17} />
                  </span>
                  <span>{t(item.label)}</span>
                  {item.to === "/elonlar" && unreadCount > 0 ? (
                    <span className="ml-auto rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      {unreadCount}
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3.5 dark:border-slate-800/80">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-3 dark:border-slate-700/60 dark:from-slate-800/70 dark:to-slate-800/40">
            <Avatar name={user?.name ?? "MaktabHub"} src={user?.avatar} role={user?.role} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                {user?.name}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {user ? t(ROLE_LABEL[user.role]) : ""}
                {isParent && user?.childName
                  ? ` · ${user.childName}`
                  : viewClassName
                    ? ` · ${viewClassName} sinf`
                    : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title={t("Chiqish")}
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
            <span className="hidden text-[10px] font-extrabold tracking-[0.16em] text-slate-400 uppercase md:inline">
              MaktabHub
            </span>
            <span className="hidden text-[10px] text-slate-300 dark:text-slate-600 md:inline">
              /
            </span>
            <h2 className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
              {TITLES[location.pathname]
                ? t(TITLES[location.pathname])
                : "MaktabHub"}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <ScriptToggle />
            <button
              type="button"
              onClick={() => navigate("/elonlar")}
              className={`relative hidden rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:block ${bellShake ? "bell-shake" : ""}`}
              aria-label={t("E'lonlar")}
            >
              <Bell size={19} />
              {unreadCount > 0 ? (
                <span className="pop-badge absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              ) : null}
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => navigate(profileTo)}
              className="ml-1 transition hover:scale-105"
              aria-label={isParent ? t("Farzandim") : t("Profil")}
            >
              <Avatar
                name={user?.name ?? "MaktabHub"}
                src={user?.avatar}
                size="md"
                role={user?.role}
              />
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
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              aria-label={t(item.label)}
              className={({ isActive }) =>
                `relative flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-[10px] font-bold transition-all duration-200 ${
                  isActive
                    ? `${activeNavClass}`
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                }`
              }
            >
              <item.icon size={18} />
              <span className="whitespace-nowrap">{t(item.label)}</span>
              {item.to === "/elonlar" && unreadCount > 0 ? (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-gradient-to-r from-rose-500 to-red-500 ring-2 ring-white dark:ring-slate-900" />
              ) : null}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
