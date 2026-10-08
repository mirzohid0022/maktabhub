import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp,
  Bot,
  CalendarDays,
  Clock,
  Info,
  Megaphone,
  MapPin,
  RotateCcw,
  Send,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { answerQuestion, type AIContext } from "../lib/ai";
import { uid } from "../lib/store";
import { formatShortDate, todayKey } from "../lib/dates";
import type { ChatMessage } from "../types";

const SUGGESTIONS = [
  "Ertaga qanday darslarim bor?",
  "Bugun nechta darsim bor?",
  "Keyingi e'lon nima?",
  "Matematika qaysi kunlari?",
  "Yaqin o'zgarishlar",
];

export default function AIAssistant() {
  const { user, schedule, announcements, changes, viewClassName, toast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid("m"),
      role: "assistant",
      text: `Salom! Men MaktabHub AI yordamchisiman 🤖\n\n${viewClassName} sinfi jadvalingiz, maktab e'lonlari va dars o'zgarishlari bo'yicha savol bering — sizga aniq javob beraman.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const context: AIContext = useMemo(
    () => ({
      userName: user?.name ?? "",
      className: viewClassName,
      schedule,
      announcements,
      changes,
    }),
    [user, viewClassName, schedule, announcements, changes],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || typing) return;

    const userMessage: ChatMessage = {
      id: uid("m"),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    const answer = answerQuestion(trimmed, context);
    const delay = Math.min(900, 380 + trimmed.length * 8);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: uid("m"),
          role: "assistant",
          text: answer.text,
          lessons: answer.lessons,
        },
      ]);
    }, delay);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <div className="flex min-h-[calc(100vh-9rem)] flex-col lg:min-h-[calc(100vh-8rem)]">
      <div className="surface relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -top-20 -right-10 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-glow">
                <Bot size={24} />
              </div>
              <span className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
            </div>
            <div>
              <p className="kicker">MaktabHub sun'iy intellekti</p>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                AI Yordamchi
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Onlayn · {viewClassName} sinfi ma'lumotlari bilan ishlaydi
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setMessages([
                {
                  id: uid("m"),
                  role: "assistant",
                  text: "Suhbat tozalandi. Qanday yordam bera olaman?",
                },
              ]);
              toast("Suhbat tozalandi", "info");
            }}
          >
            <RotateCcw size={15} /> Suhbatni tozalash
          </button>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => ask(item)}
              disabled={typing}
              className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-md disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
            >
              <Sparkles
                size={12}
                className="text-amber-500 transition group-hover:rotate-12"
              />
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="surface mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
          <p className="text-xs font-bold tracking-[0.12em] text-slate-400 uppercase">
            Suhbat tarixi
          </p>
          <p className="text-[11px] text-slate-400">
            {messages.filter((m) => m.role === "user").length} ta savol
          </p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white ${
                  message.role === "user"
                    ? "bg-slate-800 dark:bg-slate-700"
                    : "bg-gradient-to-br from-blue-500 to-indigo-600"
                }`}
              >
                {message.role === "user" ? (
                  <UserIcon size={15} />
                ) : (
                  <Bot size={15} />
                )}
              </span>

              <div
                className={`max-w-[85%] sm:max-w-[75%] ${
                  message.role === "user" ? "text-right" : ""
                }`}
              >
                <div
                  className={`inline-block rounded-2xl px-4 py-3 text-left text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    message.role === "user"
                      ? "rounded-tr-sm bg-gradient-to-b from-blue-500 to-blue-700 text-white"
                      : "rounded-tl-sm border border-slate-200 bg-white text-slate-700 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {message.text}
                </div>

                {message.lessons && message.lessons.length > 0 ? (
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                    {message.lessons.map((lesson, index) => (
                      <div
                        key={`${lesson.subject}-${index}`}
                        className="rise-in flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700/70 dark:bg-slate-800"
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[11px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                            {lesson.subject}
                          </p>
                          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <Clock size={10} /> {lesson.time}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={10} /> {lesson.room}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <p className="mt-1.5 text-[10px] text-slate-400">
                  {message.role === "assistant" ? "AI Yordamchi" : user?.name}
                </p>
              </div>
            </div>
          ))}

          {typing ? (
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Bot size={15} />
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3.5 dark:border-slate-700/70 dark:bg-slate-800">
                <span className="typing-dot h-2 w-2 rounded-full bg-blue-500" />
                <span
                  className="typing-dot h-2 w-2 rounded-full bg-blue-500"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="typing-dot h-2 w-2 rounded-full bg-blue-500"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/70 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:px-5"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Masalan: Ertaga qanday darslarim bor?"
              className="input py-3 pl-4 pr-12"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300">
              <Info size={15} />
            </span>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-glow transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:w-auto sm:px-5"
            aria-label="Yuborish"
          >
            <Send size={17} className="sm:hidden" />
            <span className="hidden items-center gap-2 text-sm font-semibold sm:flex">
              Yuborish <ArrowUp size={15} />
            </span>
          </button>
        </form>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 px-4 py-3.5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:text-slate-400">
        <p className="flex items-start gap-2">
          <Info size={14} className="mt-0.5 shrink-0 text-blue-500" />
          AI yordamchi faqat dars jadvali, e'lonlar va o'zgarishlar bo'yicha
          javob beradi.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/jadval"
            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
          >
            <CalendarDays size={13} /> Jadval
          </Link>
          <Link
            to="/elonlar"
            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
          >
            <Megaphone size={13} /> E'lonlar
          </Link>
        </div>
      </div>

      <p className="mt-3 hidden text-center text-[11px] text-slate-400 sm:block">
        Oxirgi ma'lumotlar: {formatShortDate(todayKey())} · Jami{" "}
        {schedule.length} ta dars, {announcements.length} ta e'lon
      </p>
    </div>
  );
}
