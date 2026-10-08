import { Moon, Sun } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useScript } from "../context/ScriptContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  const { t } = useScript();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      aria-label={t("Qorong'i rejim")}
      title={t("Qorong'i rejim")}
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
