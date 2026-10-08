import { useMemo, useState } from "react";
import { CalendarDays, Check, MapPin, Pencil, User as UserIcon, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card, EmptyState, PageHeader, Skeleton } from "../components/ui";
import { CalendarIllo } from "../components/Illustrations";
import Modal from "../components/Modal";
import { useDelay } from "../lib/store";
import { WEEKDAYS, dateKeyForWeekday, nextSchoolDayIndex, todayIndex } from "../lib/dates";
import {
  LESSON_TIMES,
  SUBJECTS,
  currentLessonNumber,
  subjectHex,
  subjectSoft,
} from "../lib/constants";
import type { ScheduleSlot } from "../types";

type Filter = "today" | "tomorrow" | "week";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "today", label: "Bugun" },
  { id: "tomorrow", label: "Ertaga" },
  { id: "week", label: "Butun hafta" },
];

export default function Schedule() {
  const { schedule, changes, saveSlot, canEdit, viewClassName, toast, user } = useApp();
  const isParent = user?.role === "parent";
  const loading = useDelay(450);
  const [filter, setFilter] = useState<Filter>("week");
  const [editing, setEditing] = useState<{ day: number; lesson: number } | null>(
    null,
  );
  const [draft, setDraft] = useState<ScheduleSlot | null>(null);

  const todayIdx = todayIndex();
  const tomorrowIdx = nextSchoolDayIndex(new Date());
  const liveLesson = currentLessonNumber();

  const visibleDays = useMemo(() => {
    if (filter === "today") return todayIdx === null ? [] : [todayIdx];
    if (filter === "tomorrow") return tomorrowIdx === null ? [] : [tomorrowIdx];
    return [0, 1, 2, 3, 4, 5];
  }, [filter, todayIdx, tomorrowIdx]);

  const openEditor = (day: number, lesson: number) => {
    if (!canEdit) return;
    const existing = schedule.find(
      (slot) => slot.className === viewClassName && slot.day === day && slot.lesson === lesson,
    );
    setDraft(
      existing ?? {
        className: viewClassName,
        day,
        lesson,
        subject: "Matematika",
        teacher: "",
        room: "",
      },
    );
    setEditing({ day, lesson });
  };

  const saveDraft = () => {
    if (!draft) return;
    if (!draft.teacher.trim() || !draft.room.trim()) {
      toast("O'qituvchi va xona maydonlarini to'ldiring.", "error");
      return;
    }
    saveSlot(draft);
    setEditing(null);
    setDraft(null);
  };

  const dayChange = (day: number) =>
    changes.filter((change) => change.date === dateKeyForWeekday(day));

  const totalLessons = schedule.length;

  return (
    <div>
      <PageHeader
        kicker="Haftalik jadval"
        title={isParent ? "Farzandingiz jadvali" : "Dars jadvali"}
        subtitle={`${viewClassName} sinfi · Dushanba–Shanba · jami ${totalLessons} ta dars`}
        actions={
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                  filter === item.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      />

      {canEdit ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-xs font-medium text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
          <Pencil size={15} className="shrink-0" />
          Tahrirlash rejimi: darsni o'zgartirish uchun katakchani bosing.
        </div>
      ) : null}

      {loading ? (
        <Card>
          <Skeleton className="mb-4 h-10 w-full" />
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="mb-3 h-24 w-full rounded-xl" />
          ))}
        </Card>
      ) : visibleDays.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={26} />}
          title="Bu kun uchun darslar yo'q"
          description="Tanlangan kunda maktabda dars rejalashtirilmagan."
          illo={<CalendarIllo className="w-full" />}
        />
      ) : (
        <Card className="overflow-hidden p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-800/70 dark:via-slate-900 dark:to-slate-800/70">
                  <th className="sticky left-0 z-10 w-36 border-b border-slate-200 bg-inherit px-4 py-3.5 text-[11px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:border-slate-700 dark:text-slate-500">
                    Kun
                  </th>
                  {LESSON_TIMES.map((time, index) => (
                    <th
                      key={time}
                      className="border-b border-slate-200 px-3 py-3.5 text-center dark:border-slate-700"
                    >
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {index + 1}-dars
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                        {time}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleDays.map((day) => {
                  const isToday = day === todayIdx;
                  const isTomorrow = day === tomorrowIdx;
                  return (
                    <tr
                      key={day}
                      className={`group/row transition-colors ${
                        isToday
                          ? "bg-blue-50/60 dark:bg-blue-500/[0.07]"
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <th
                        scope="row"
                        className={`sticky left-0 z-10 border-b border-slate-100 bg-inherit px-4 py-3.5 text-left align-top dark:border-slate-800 ${
                          isToday
                            ? "bg-blue-50/90 dark:bg-[#0b1424]"
                            : "bg-white dark:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-7 w-1 rounded-full ${
                              isToday
                                ? "bg-blue-600"
                                : isTomorrow
                                  ? "bg-amber-400"
                                  : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              {WEEKDAYS[day]}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">
                              {isToday
                                ? "Bugun"
                                : isTomorrow
                                  ? "Ertaga"
                                  : `${day + 1}-kun`}
                            </p>
                          </div>
                        </div>
                      </th>

                      {LESSON_TIMES.map((_, lessonIndex) => {
                        const lessonNumber = lessonIndex + 1;
                        const slot = schedule.find(
                          (item) =>
                            item.className === viewClassName &&
                            item.day === day &&
                            item.lesson === lessonNumber,
                        );
                        const change = dayChange(day).find(
                          (item) => item.lessonNumber === lessonNumber,
                        );
                        const cancelled =
                          change?.newValue.toLowerCase().includes("bekor") ?? false;
                        const isLive =
                          slot !== undefined &&
                          !cancelled &&
                          day === todayIdx &&
                          lessonNumber === liveLesson;

                        return (
                          <td
                            key={lessonNumber}
                            className="border-b border-l border-slate-100 p-1.5 align-top dark:border-slate-800/80"
                          >
                            <button
                              type="button"
                              disabled={!canEdit}
                              onClick={() => openEditor(day, lessonNumber)}
                              title={
                                slot
                                  ? `${slot.subject} · ${slot.teacher} · ${slot.room} · ${LESSON_TIMES[lessonIndex]}${cancelled ? " · BEKOR QILINDI" : ""}`
                                  : undefined
                              }
                              style={
                                slot && !cancelled
                                  ? {
                                      borderLeft: `4px solid ${subjectHex(slot.subject)}`,
                                      backgroundColor: subjectSoft(slot.subject, "14"),
                                    }
                                  : undefined
                              }
                              className={`group/cell relative flex h-full min-h-[86px] w-full flex-col items-start justify-start rounded-xl border p-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                slot
                                  ? cancelled
                                    ? "border-red-200 border-l-4 border-l-red-500 bg-red-50/70 dark:border-red-500/30 dark:bg-red-500/10"
                                    : "border-slate-200/70 dark:border-slate-700/70"
                                  : "border-dashed border-slate-200 bg-transparent hover:border-purple-300 hover:bg-purple-50/50 dark:border-slate-700 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/5"
                              } ${canEdit ? "cursor-pointer" : "cursor-default"}`}
                            >
                              {slot ? (
                                <>
                                  <span
                                    className={`text-[13px] leading-tight font-bold ${cancelled ? "line-through opacity-60" : ""}`}
                                    style={
                                      cancelled
                                        ? undefined
                                        : { color: subjectHex(slot.subject) }
                                    }
                                  >
                                    {slot.subject}
                                  </span>
                                  <span className="mt-1.5 flex items-center gap-1 text-[11px] leading-tight opacity-80">
                                    <UserIcon size={11} className="shrink-0" />
                                    {cancelled ? "—" : slot.teacher}
                                  </span>
                                  <span className="mt-1 flex items-center gap-1 text-[11px] leading-tight opacity-80">
                                    <MapPin size={11} className="shrink-0" />
                                    {cancelled ? "Bekor qilindi" : slot.room}
                                  </span>
                                </>
                              ) : (
                                <span className="flex h-full w-full items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 transition-colors group-hover/cell:text-purple-500 dark:text-slate-600 dark:group-hover/cell:text-purple-300">
                                  {canEdit ? (
                                    <>
                                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[13px] leading-none">
                                        +
                                      </span>
                                      Qo'shish
                                    </>
                                  ) : (
                                    "Bo'sh"
                                  )}
                                </span>
                              )}

                              {isLive ? (
                                <span
                                  className="absolute top-2 right-2 flex h-2.5 w-2.5"
                                  title="Hozir o'tilmoqda"
                                >
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                                </span>
                              ) : null}

                              {canEdit && slot ? (
                                <span className="absolute right-1.5 bottom-1.5 rounded-md bg-white/70 p-1 opacity-0 shadow-sm transition group-hover/row:opacity-100 dark:bg-slate-900/70">
                                  <Pencil size={11} className="text-slate-600 dark:text-slate-300" />
                                </span>
                              ) : null}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="mt-5" title={<p className="kicker">Fanlar bo'yicha ranglar</p>}>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((subject) => (
            <span
              key={subject}
              style={{
                backgroundColor: subjectSoft(subject, "14"),
                borderColor: `${subjectHex(subject)}59`,
                color: subjectHex(subject),
              }}
              className="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: subjectHex(subject) }}
              />
              {subject}
            </span>
          ))}
        </div>
      </Card>

      <Modal
        open={Boolean(editing)}
        title={
          editing
            ? `${WEEKDAYS[editing.day]} · ${editing.lesson}-darsni tahrirlash`
            : ""
        }
        onClose={() => {
          setEditing(null);
          setDraft(null);
        }}
        footer={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditing(null);
                setDraft(null);
              }}
            >
              <X size={15} /> Bekor qilish
            </button>
            <button type="button" className="btn-primary" onClick={saveDraft}>
              <Check size={15} /> Saqlash
            </button>
          </>
        }
      >
        {draft ? (
          <div className="space-y-4">
            <div>
              <label className="field-label">Fan</label>
              <select
                className="input"
                value={draft.subject}
                onChange={(event) =>
                  setDraft({ ...draft, subject: event.target.value })
                }
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">O'qituvchi</label>
                <input
                  className="input"
                  placeholder="Karimova N."
                  value={draft.teacher}
                  onChange={(event) =>
                    setDraft({ ...draft, teacher: event.target.value })
                  }
                />
              </div>
              <div>
                <label className="field-label">Xona</label>
                <input
                  className="input"
                  placeholder="201-xona"
                  value={draft.room}
                  onChange={(event) =>
                    setDraft({ ...draft, room: event.target.value })
                  }
                />
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
              Dars vaqti: <strong>{LESSON_TIMES[draft.lesson - 1]}</strong> ·
              Sinf: <strong>{draft.className}</strong>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
