import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  CalendarDays,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Megaphone,
  MessageCircle,
  RefreshCw,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useScript } from "../context/ScriptContext";
import Logo from "../components/Logo";
import { StudentsIllo } from "../components/Illustrations";
import { ROLE_LABEL, SUBJECTS } from "../lib/constants";
import type { Role } from "../types";

const ROLES: { id: Role; icon: typeof GraduationCap; hint: string }[] = [
  { id: "student", icon: GraduationCap, hint: "Darslar va baholar" },
  { id: "teacher", icon: Users, hint: "Jadval boshqaruvi" },
  { id: "parent", icon: UserIcon, hint: "Farzand nazorati" },
];

const DEMO = [
  { role: "student" as Role, label: "O'quvchi", email: "student@maktab.uz" },
  { role: "teacher" as Role, label: "O'qituvchi", email: "teacher@maktab.uz" },
  { role: "parent" as Role, label: "Ota-ona", email: "parent@maktab.uz" },
];

const FEATURES = [
  { icon: CalendarDays, title: "Dars jadvali", text: "Haftalik jadval doim qo'lingizda" },
  { icon: Megaphone, title: "E'lonlar", text: "Maktab yangiliklari bir joyda" },
  { icon: RefreshCw, title: "O'zgarishlar", text: "Dars o'zgarishlaridan xabardor bo'ling" },
  { icon: MessageCircle, title: "AI Yordamchi", text: "Savol bering — javobni darhol oling" },
];

export default function Login() {
  const { user, login, register, toast } = useApp();
  const { t } = useScript();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [className, setClassName] = useState("10-A");
  const [subject, setSubject] = useState("Matematika");
  const [childClass, setChildClass] = useState("10-A");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (mode === "login") {
      const err = login(email, password, role);
      if (err) {
        setError(err);
        return;
      }
      toast(t("Xush kelibsiz! Hisobingizga kirdingiz."));
      navigate("/", { replace: true });
    } else {
      const err = register({
        name,
        email,
        password,
        role,
        className,
        subject,
        childClass,
      });
      if (err) {
        setError(err);
        return;
      }
      toast(t("Ro'yxatdan o'tish muvaffaqiyatli!"));
      navigate("/", { replace: true });
    }
  };

  const useDemo = (demoEmail: string, demoRole: Role) => {
    setMode("login");
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword("12345");
    setError(null);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-purple-400/25 blur-3xl" />
        <div className="float-slow absolute top-32 right-14 h-16 w-16 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm" />
        <div
          className="float-slow absolute bottom-40 left-10 h-12 w-12 rounded-full bg-amber-300/40"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="float-slow absolute top-1/2 right-1/4 h-8 w-8 rounded-lg bg-pink-300/50"
          style={{ animationDelay: "2.4s" }}
        />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
                <path
                  d="M32 20C30 17 26 15 20 15L14 15L14 45L20 45C26 45 30 47 32 50C34 47 38 45 44 45L50 45L50 15L44 15C38 15 34 17 32 20Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M32 20L32 50" stroke="white" strokeWidth="3" />
              </svg>
            </div>
            <span className="text-2xl font-bold">MaktabHub</span>
          </div>

          <h1 className="mt-14 text-4xl leading-tight font-bold">
            {t("Maktabning barchasi")}
            <br />
            {t("bitta joyda.")}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100">
            {t(
              "Dars jadvali, e'lonlar va jadval o'zgarishlarini izlab yurish shart emas. O'quvchilar, o'qituvchilar va ota-onalar uchun yagona platforma.",
            )}
          </p>

          <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-sm ${
                    [
                      "bg-blue-400/40",
                      "bg-purple-400/40",
                      "bg-amber-400/40",
                      "bg-emerald-400/40",
                    ][index]
                  }`}
                >
                  <feature.icon size={18} />
                </span>
                <p className="mt-3 text-sm font-semibold">{t(feature.title)}</p>
                <p className="mt-1 text-xs leading-relaxed text-blue-100/80">
                  {t(feature.text)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative mt-auto text-xs text-blue-200/80">
          © 2026 MaktabHub — {t("O'zbekiston maktablari uchun")}
        </p>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" subtitle={t("Maktab platformasi")} />
          </div>

          <div className="mb-5 flex justify-center lg:hidden">
            <StudentsIllo className="w-44 sm:w-56" />
          </div>

          <div className="surface p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {mode === "login" ? t("Xush kelibsiz") : t("Hisob yarating")}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {mode === "login"
                ? t("Davom etish uchun hisobingizga kiring.")
                : t("Bir necha soniyada ro'yxatdan o'ting.")}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {ROLES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`role-card ${role === item.id ? "role-card-active" : ""}`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      role === item.id
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md shadow-indigo-600/40"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <item.icon size={17} />
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {t(ROLE_LABEL[item.id])}
                  </span>
                  <span className="hidden text-[10px] leading-tight text-slate-400 sm:block dark:text-slate-500">
                    {t(item.hint)}
                  </span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {mode === "register" ? (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {t("Ism familiya")}
                  </label>
                  <div className="relative">
                    <UserIcon
                      size={16}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={inputClass}
                      placeholder="Aziz Karimov"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <AtSign
                    size={16}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="siz@maktab.uz"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {t("Parol")}
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`${inputClass} pr-10`}
                    placeholder="•••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={t("Parolni ko'rsatish")}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === "register" ? (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {role === "student"
                      ? t("Sinf")
                      : role === "teacher"
                        ? t("Fan")
                        : t("Farzandingiz sinfi")}
                  </label>
                  <select
                    className={`${inputClass} pl-4`}
                    value={
                      role === "student"
                        ? className
                        : role === "teacher"
                          ? subject
                          : childClass
                    }
                    onChange={(event) => {
                      const value = event.target.value;
                      if (role === "student") setClassName(value);
                      else if (role === "teacher") setSubject(value);
                      else setChildClass(value);
                    }}
                  >
                    {role === "teacher"
                      ? SUBJECTS.map((item) => (
                          <option key={item}>{item}</option>
                        ))
                      : ["10-A", "10-B", "11-A", "9-A"].map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                  </select>
                </div>
              ) : null}

              {error ? (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <button
                type="submit"
                className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/40 transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
              >
                {mode === "login" ? t("Kirish") : t("Ro'yxatdan o'tish")}
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              {mode === "login" ? t("Hisobingiz yo'qmi?") : t("Hisobingiz bormi?")}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError(null);
                }}
                className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
              >
                {mode === "login" ? t("Ro'yxatdan o'tish") : t("Kirish")}
              </button>
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/40">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t("Demo hisoblar")} · {t("parol")} 12345
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {DEMO.map((item) => (
                <button
                  key={item.email}
                  type="button"
                  onClick={() => useDemo(item.email, item.role)}
                  className="demo-chip"
                  title={`${item.email} · 12345`}
                >
                  <ArrowRight size={12} className="text-indigo-500" />
                  <span className="font-bold">{t(item.label)}</span>
                  <span className="text-slate-400 dark:text-slate-500">
                    {item.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
