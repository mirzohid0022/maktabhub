import { Check, Inbox, X } from "lucide-react";
import { useScript } from "../../context/ScriptContext";
import { EmptyState } from "../../components/ui";
import type { Message } from "./types";

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month} · ${hours}:${minutes}`;
}

export default function TeacherModerationQueue({
  messages,
  onModerate,
}: {
  messages: Message[];
  onModerate: (id: string, status: "approved" | "rejected") => void;
}) {
  const { t } = useScript();

  return (
    <div className="surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
          <Inbox size={17} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {t("Tasdiqlash navbati")}
          </h3>
          <p className="text-xs text-slate-400">
            {t("Ota-ona xabarlari moderatsiyadan o'tadi")}
          </p>
        </div>
        <span className="ml-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
          {messages.length}
        </span>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={<Inbox size={22} />}
          title={t("Tasdiqlash navbati bo'sh")}
          description={t("Barcha xabarlar ko'rib chiqilgan.")}
        />
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800/70"
            >
              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  {message.authorName}
                </span>
                <span>{formatDateTime(message.createdAt)}</span>
              </div>
              <p className="mt-1.5 text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                {message.text}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onModerate(message.id, "approved")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-500"
                >
                  <Check size={13} />
                  {t("Tasdiqlash")}
                </button>
                <button
                  type="button"
                  onClick={() => onModerate(message.id, "rejected")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-red-300 hover:text-red-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-red-500/50 dark:hover:text-red-400"
                >
                  <X size={13} />
                  {t("Rad etish")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
