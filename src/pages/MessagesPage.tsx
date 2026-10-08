import { useEffect, useState } from "react";
import { MessageSquare, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useScript } from "../context/ScriptContext";
import { PageHeader, EmptyState } from "../components/ui";
import MessageThread from "../features/messages/MessageThread";
import TeacherModerationQueue from "../features/messages/TeacherModerationQueue";
import {
  DENIED_TEXT,
  ensureThread,
  getMessages,
  moderateMessage,
  sendMessage,
  useMessagesState,
} from "../features/messages/store";
import { initials } from "../lib/store";

export default function MessagesPage() {
  const { user, toast } = useApp();
  const { t } = useScript();
  const state = useMessagesState();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setActiveId((prev) => prev ?? ensureThread(user));
  }, [user]);

  if (!user) return null;

  const isTeacher = user.role === "teacher";
  const isStudent = user.role === "student";
  const threadId = activeId;
  const activeThread = state.threads.find((item) => item.id === threadId);
  const pending = state.messages.filter((item) => item.status === "pending");

  const handleSend = (text: string) => {
    if (!threadId) return;
    const status = sendMessage(threadId, user, text);
    if (status === "pending") {
      toast(t("Xabar moderatorga yuborildi"), "info");
    } else {
      toast(t("Xabar yuborildi"));
    }
  };

  const handleModerate = (id: string, status: "approved" | "rejected") => {
    moderateMessage(id, status);
    toast(
      status === "approved"
        ? t("Xabar tasdiqlandi")
        : t("Xabar rad etildi"),
      status === "approved" ? "success" : "info",
    );
  };

  return (
    <div className="page-enter">
      <PageHeader
        kicker="MaktabHub"
        title="Xabarlar"
        subtitle="Ota-onalar va o'qituvchilar o'rtasidagi xabar almashinuvi"
      />

      {isStudent ? (
        <div className="max-w-2xl">
          <div className="surface p-6">
            <EmptyState
              icon={<MessageSquare size={22} />}
              title={t(DENIED_TEXT)}
              description={t("Xabar yozish uchun ota-ona hisobidan kiring.")}
            />
          </div>
        </div>
      ) : isTeacher ? (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="surface p-4">
            <div className="mb-3 flex items-center gap-2 px-1">
              <Users size={16} className="text-slate-400" />
              <p className="text-xs font-extrabold tracking-[0.14em] text-slate-400 uppercase">
                {t("Suhbatlar")}
              </p>
            </div>
            <ul className="space-y-2">
              {state.threads.map((thread) => {
                const last = state.messages
                  .filter((item) => item.threadId === thread.id)
                  .sort((a, b) => b.createdAt - a.createdAt)[0];
                const active = thread.id === threadId;
                return (
                  <li key={thread.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(thread.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        active
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                        }`}
                      >
                        {initials(thread.studentName)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">
                          {thread.studentName}
                        </span>
                        <span
                          className={`block truncate text-[11px] ${active ? "text-blue-100" : "text-slate-400"}`}
                        >
                          {last ? last.text : t("Xabarlar yo'q")}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {thread.classId}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-2">
            {activeThread ? (
              <MessageThread
                thread={activeThread}
                messages={getMessages(activeThread.id, user.role)}
                viewer={user}
                onSend={handleSend}
                heading={`${activeThread.studentName} · ${activeThread.classId}`}
              />
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <TeacherModerationQueue
              messages={pending}
              onModerate={handleModerate}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          {activeThread ? (
            <MessageThread
              thread={activeThread}
              messages={getMessages(activeThread.id, user.role)}
              viewer={user}
              onSend={handleSend}
              heading={`${t("Suhbat")} · ${activeThread.studentName}`}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
