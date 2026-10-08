import { useState } from "react";
import { Clock, MapPin, X } from "lucide-react";
import { useScript } from "../../context/ScriptContext";
import { Card } from "../../components/ui";
import { WEEKDAYS } from "../../lib/dates";
import {
  TEACHER_ID,
  getRoom,
  getTeacherClasses,
  getTeacherLessons,
} from "../../features/teacher/store";

export default function TeacherClasses() {
  const { t } = useScript();
  const [selected, setSelected] = useState<string | null>(null);

  const lessons = getTeacherLessons(TEACHER_ID);
  const classes = getTeacherClasses(TEACHER_ID);
  const selectedLessons = selected
    ? lessons.filter((lesson) => lesson.classId === selected)
    : [];

  const roomNamesFor = (classId: string) => {
    const names = new Set<string>();
    for (const lesson of lessons) {
      if (lesson.classId !== classId) continue;
      const room = getRoom(lesson.roomId);
      if (room) names.add(room.name);
    }
    return [...names];
  };

  const toggleClass = (classId: string) => {
    setSelected((previous) => (previous === classId ? null : classId));
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#059669] uppercase">
          {t("O'qituvchi paneli")}
        </p>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[1.7rem] dark:text-white">
          {t("Sinflarim")}
        </h1>
        {selected ? null : (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {t("Sinfni tanlang")}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((classId) => {
          const classLessons = lessons.filter(
            (lesson) => lesson.classId === classId,
          );
          const isSelected = selected === classId;
          return (
            <div
              key={classId}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => toggleClass(classId)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleClass(classId);
                }
              }}
              className="cursor-pointer rounded-2xl transition hover:-translate-y-0.5"
            >
              <Card
                accent={isSelected ? "emerald" : undefined}
                title={<span className="text-base">{classId}</span>}
                badge={
                  <span className="rounded-full bg-[#059669]/10 px-2.5 py-1 text-[11px] font-bold text-[#059669]">
                    {classLessons.length} {t("dars")}
                  </span>
                }
                action={
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                      isSelected
                        ? "bg-[#059669] text-white"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                    }`}
                    aria-hidden="true"
                  >
                    <Clock size={14} />
                  </span>
                }
                bodyClassName="space-y-2.5"
              >
                <div className="flex flex-wrap gap-1.5">
                  {roomNamesFor(classId).map((roomName) => (
                    <span
                      key={roomName}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400"
                    >
                      <MapPin size={11} className="shrink-0" />
                      {roomName}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {t("Batafsil uchun bosing")}
                </p>
              </Card>
            </div>
          );
        })}
      </div>

      {selected ? (
        <Card
          className="mt-5"
          accent="emerald"
          title={selected}
          badge={
            <span className="rounded-full bg-[#059669]/10 px-2.5 py-1 text-[11px] font-bold text-[#059669]">
              {selectedLessons.length} {t("dars")}
            </span>
          }
          action={
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800"
              title={t("Yopish")}
              aria-label={t("Yopish")}
            >
              <X size={15} />
            </button>
          }
        >
          <ul className="space-y-2.5">
            {selectedLessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-slate-800/60"
              >
                <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                  {lesson.startTime}–{lesson.endTime}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {t(WEEKDAYS[lesson.weekday - 1])}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  · {lesson.subject}
                </span>
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-[#059669]">
                  <MapPin size={12} className="shrink-0" />
                  {getRoom(lesson.roomId)?.name}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
