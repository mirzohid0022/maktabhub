import { useRef, useState, type FormEvent } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useScript } from "../../context/ScriptContext";
import { EmptyState } from "../../components/ui";
import { initials } from "../../lib/store";
import type { User } from "../../types";
import type { Message, MessageStatus, Thread } from "./types";

const STATUS_BADGE: Record<
  MessageStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Tasdiqlanmoqda",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
  approved: {
    label: "Tasdiqlangan",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  },
  rejected: {
    label: "Rad etildi",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
  },
};

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function MessageThread({
  thread,
  messages,
  viewer,
  onSend,
  heading,
}: {
  thread: Thread;
  messages: Message[];
  viewer: User;
  onSend: (text: string) => void;
  heading?: string;
}) {
  const { t } = useScript();
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    send();
  };

  return (
    <div className="surface flex h-full flex-col overflow-hidden p-0">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800/80">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
          {initials(thread.studentName)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
            {heading ?? thread.studentName}
          </p>
          <p className="text-xs text-slate-400">
            {t("Sinf")}: {thread.classId}
          </p>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
        style={{ maxHeight: "24rem" }}
      >
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessageSquare size={22} />}
            title={t("Hozircha xabarlar yo'q")}
            description={t("Birinchi xabarni yozing.")}
          />
        ) : (
          messages.map((message) => {
            const mine = message.authorId === viewer.id;
            const badge =
              message.authorRole === "parent"
                ? STATUS_BADGE[message.status]
                : null;
            return (
              <div
                key={message.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    mine
                      ? "rounded-br-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  <div
                    className={`mt-1.5 flex flex-wrap items-center gap-2 text-[10px] ${
                      mine ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    <span className="font-semibold">{message.authorName}</span>
                    <span>{formatTime(message.createdAt)}</span>
                  </div>
                  {badge ? (
                    <span
                      className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.className}`}
                    >
                      {t(badge.label)}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={submit}
        className="flex items-end gap-2 border-t border-slate-100 px-4 py-3.5 dark:border-slate-800/80 sm:px-5"
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder={t("Xabar yozing...")}
          className="input min-h-[2.75rem] flex-1 resize-none py-2.5"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="btn-primary h-11 w-11 shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t("Yuborish")}
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
