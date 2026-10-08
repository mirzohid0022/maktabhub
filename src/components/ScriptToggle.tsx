import { Languages } from "lucide-react";
import { useScript } from "../context/ScriptContext";

export default function ScriptToggle() {
  const { script, toggleScript } = useScript();

  return (
    <button
      type="button"
      onClick={toggleScript}
      aria-label="Yozuvni almashtirish"
      title="Yozuvni almashtirish"
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300"
    >
      <Languages size={16} aria-hidden="true" />
      <span aria-hidden="true">
        {script === "latin" ? "Кирилча" : "Lotincha"}
      </span>
    </button>
  );
}
