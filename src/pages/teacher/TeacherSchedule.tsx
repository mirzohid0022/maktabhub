import { Clock, MapPin } from "lucide-react";
import { useScript } from "../../context/ScriptContext";
import { Card } from "../../components/ui";
import { WEEKDAYS } from "../../lib/dates";
import {
  TEACHER_ID,
  getNextLesson,
  getRoom,
  getTeacherLessons,
} from "../../features/teacher/store";

const SCHOOL_WEEK = [1, 2, 3, 4, 5];

export default function TeacherSchedule() {
  const { t } = useScript();

  const now = new Date();
  const jsDay = now.getDay();
  const todayWeekday = jsDay === 0 ? 7 : jsDay;

  const lessons = getTeacherLessons(TEACHER_ID);
  const nextLesson = getNextLesson(TEACHER_ID, now);

  const emptyNote = (text: string) => (
    <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      {t(text)}
    </p>
  );

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#059669] uppercase">
          {t("O'qituvchi paneli")}
        </p>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[1.7rem] dark:text-white">
          {t("Haftalik jadval")}
        </h1>
      </div>

      {SCHOOL_WEEK.map((weekday) => {
        const dayLessons = lessons.filter(
          (lesson) => lesson.weekday === weekday,
        );
        const isToday = weekday === todayWeekday;

        return (
          <section key={weekday} className="mb-6">
            <div className="mb-3 flex items-center gap-3">
              <span
                className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-bold tracking-wide uppercase ${
                  isToday
                    ? "bg-[#059669] text-white shadow-md shadow-[#059669]/30"
                    : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                }`}
              >
                {t(WEEKDAYS[weekday - 1])}
              </span>
              {isToday ? (
                <span className="text-[11px] font-extrabold tracking-[0.16em] text-[#059669] uppercase">
                  {t("Bugun")}
                </span>
              ) : null}
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {dayLessons.length === 0 ? (
              emptyNote("Dars yo'q")
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {dayLessons.map((lesson) => {
                  const isNext = nextLesson?.id === lesson.id;
                  const room = getRoom(lesson.roomId);
                  return (
                    <Card
                      key={lesson.id}
                      accent={isNext ? "emerald" : undefined}
                      title={
                        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                          <Clock size={14} className="text-[#059669]" />
                          {lesson.startTime}–{lesson.endTime}
                        </span>
                      }
                      badge={
                        isNext ? (
                          <span className="rounded-full bg-[#059669] px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase">
                            {t("Keyingi")}
                          </span>
                        ) : undefined
                      }
                      bodyClassName="space-y-1.5"
                    >
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {lesson.classId}{" "}
                        <span className="font-medium text-slate-400">·</span>{" "}
                        {lesson.subject}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin size={13} className="shrink-0 text-[#059669]" />
                        {room?.name}
                      </p>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
