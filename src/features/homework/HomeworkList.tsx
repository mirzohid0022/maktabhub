import { useEffect, useState } from "react";
import { CalendarDays, Check, Trash2 } from "lucide-react";
import { useScript } from "../../context/ScriptContext";
import { EmptyState } from "../../components/ui";
import { subjectHex, subjectSoft } from "../../lib/constants";
import { dayDiff, relativeDue, removeHomework, toggleHomework } from "./store";
import type { Homework } from "./types";

const GROUPS = [
  {
    key: "overdue",
    title: "Muddati o'tgan",
    chip: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300",
    border: "border-l-red-400",
  },
  {
    key: "today",
    title: "Bugun",
    chip: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    border: "border-l-amber-400",
  },
  {
    key: "future",
    title: "Kelgusi",
    chip: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
    border: "border-l-blue-500",
  },
] as const;

function groupOf(item: Homework): (typeof GROUPS)[number]["key"] {
  const diff = dayDiff(item.dueDate);
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  return "future";
}

function relativeTone(item: Homework): string {
  const diff = dayDiff(item.dueDate);
  if (diff < 0) return "text-red-500 dark:text-red-400";
  if (diff === 0) return "text-amber-600 dark:text-amber-400";
  return "text-slate-400";
}

export default function HomeworkList({
  items,
  canEdit,
}: {
  items: Homework[];
  canEdit: boolean;
}) {
  const { t } = useScript();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmId) return;
    const timer = setTimeout(() => setConfirmId(null), 3000);
    return () => clearTimeout(timer);
  }, [confirmId]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays size={22} />}
        title={t("Hozircha uy vazifasi yo'q")}
        description={t("O'qituvchi yangi uy vazifasi qo'shganida ko'rinadi.")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {GROUPS.map((group) => {
        const groupItems = items
          .filter((item) => groupOf(item) === group.key)
          .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        if (groupItems.length === 0) return null;
        return (
          <section key={group.key}>
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${group.chip}`}
              >
                {t(group.title)}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {groupItems.length}
              </span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <ul className="stagger space-y-3">
              {groupItems.map((item) => {
                const done = item.status === "done";
                const hex = subjectHex(item.subject);
                return (
                  <li
                    key={item.id}
                    className={`surface lift p-4 ${group.border} transition ${done ? "opacity-70" : ""}`}
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor: hex,
                    }}
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleHomework(item.id)}
                        aria-label={t("Bajarildi")}
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition ${
                          done
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                            : "border-slate-300 text-transparent hover:border-emerald-400 dark:border-slate-600"
                        }`}
                      >
                        <Check size={15} strokeWidth={3} />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-md px-2 py-0.5 text-[11px] font-bold"
                            style={{
                              backgroundColor: subjectSoft(item.subject, "1F"),
                              color: hex,
                            }}
                          >
                            {item.subject}
                          </span>
                          <span
                            className={`text-[11px] font-bold ${relativeTone(item)}`}
                          >
                            {t(relativeDue(item.dueDate))}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {item.dueDate}
                          </span>
                        </div>
                        <p
                          className={`mt-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100 ${done ? "line-through" : ""}`}
                        >
                          {item.title}
                        </p>
                      </div>

                      {canEdit ? (
                        <div className="shrink-0">
                          {confirmId === item.id ? (
                            <button
                              type="button"
                              onClick={() => {
                                removeHomework(item.id);
                                setConfirmId(null);
                              }}
                              className="animate-pulse rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500"
                            >
                              {t("Ha, o'chirilsin")}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmId(item.id)}
                              aria-label={t("O'chirish")}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
