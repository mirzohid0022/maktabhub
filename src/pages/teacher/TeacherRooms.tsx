import { DoorOpen } from "lucide-react";
import { useScript } from "../../context/ScriptContext";
import { Card } from "../../components/ui";
import { WEEKDAYS } from "../../lib/dates";
import {
  TEACHER_ID,
  getTeacherLessons,
  loadTeacherData,
} from "../../features/teacher/store";

export default function TeacherRooms() {
  const { t } = useScript();

  const data = loadTeacherData();
  const lessons = getTeacherLessons(TEACHER_ID);
  const floors = [
    ...new Set(data.rooms.map((room) => room.floor)),
  ].sort((a, b) => a - b);

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#059669] uppercase">
          {t("O'qituvchi paneli")}
        </p>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[1.7rem] dark:text-white">
          {t("Xonalar")}
        </h1>
      </div>

      {floors.map((floor) => {
        const rooms = data.rooms.filter((room) => room.floor === floor);
        return (
          <section key={floor} className="mb-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase dark:bg-white dark:text-slate-900">
                {t(`${floor}-qavat`)}
              </span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {rooms.map((room) => {
                const roomLessons = lessons.filter(
                  (lesson) => lesson.roomId === room.id,
                );
                return (
                  <Card
                    key={room.id}
                    title={room.name}
                    badge={
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#059669]/10 px-2.5 py-1 text-[11px] font-bold text-[#059669]">
                        <DoorOpen size={12} />
                        {roomLessons.length} {t("dars")}
                      </span>
                    }
                  >
                    {roomLessons.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        {t("Dars yo'q")}
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {roomLessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-800/60"
                          >
                            <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                              {lesson.startTime}–{lesson.endTime}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-100">
                              {t(WEEKDAYS[lesson.weekday - 1])}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              · {lesson.classId}
                            </span>
                            <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
                              {lesson.subject}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
