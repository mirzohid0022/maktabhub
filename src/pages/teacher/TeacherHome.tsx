import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useScript } from "../../context/ScriptContext";
import { Card } from "../../components/ui";
import { WEEKDAYS, formatWeekdayDate } from "../../lib/dates";
import {
  TEACHER_ID,
  getNextLesson,
  getRoom,
  getSchoolInfo,
  getTeacherLessons,
  getUpcomingMeetings,
} from "../../features/teacher/store";

export default function TeacherHome() {
  const { user } = useApp();
  const { t } = useScript();

  const now = new Date();
  const jsDay = now.getDay();
  const todayWeekday = jsDay === 0 ? 7 : jsDay;

  const lessons = getTeacherLessons(TEACHER_ID);
  const nextLesson = getNextLesson(TEACHER_ID, now);
  const todayLessons =
    jsDay === 0 ? [] : lessons.filter((lesson) => lesson.weekday === todayWeekday);
  const meeting = getUpcomingMeetings(now)[0];
  const schoolInfo = getSchoolInfo();
  const directorRoom = getRoom(schoolInfo.directorRoom);
  const staffRoom = getRoom(schoolInfo.staffRoomId);

  const firstName = (user?.name ?? "").trim().split(" ")[0];

  const emptyNote = (text: string) => (
    <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
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
          {t("Salom")}, {firstName}!
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          accent="emerald"
          title={t("Keyingi dars")}
          badge={
            nextLesson ? (
              <span className="rounded-lg bg-[#059669]/10 px-2.5 py-1 text-[11px] font-bold text-[#059669]">
                {t(WEEKDAYS[nextLesson.weekday - 1])}
              </span>
            ) : undefined
          }
        >
          {nextLesson ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {nextLesson.subject}
                </p>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {nextLesson.classId}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Clock size={15} className="shrink-0 text-[#059669]" />
                  {nextLesson.startTime}–{nextLesson.endTime}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={15} className="shrink-0 text-[#059669]" />
                  {getRoom(nextLesson.roomId)?.name}
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays size={15} className="shrink-0 text-[#059669]" />
                  {t(WEEKDAYS[nextLesson.weekday - 1])}
                </li>
              </ul>
            </div>
          ) : (
            emptyNote("Dars yo'q")
          )}
        </Card>

        <Card
          title={t("Bugungi darslar")}
          badge={
            jsDay === 0 ? undefined : (
              <span className="text-xs font-semibold text-slate-400">
                {todayLessons.length} {t("dars")}
              </span>
            )
          }
        >
          {jsDay === 0
            ? emptyNote("Bugun dam olish kuni")
            : todayLessons.length === 0
              ? emptyNote("Bugun darslar yo'q")
              : (
                  <ul className="space-y-2.5">
                    {todayLessons.map((lesson) => {
                      const room = getRoom(lesson.roomId);
                      return (
                        <li
                          key={lesson.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                              {lesson.startTime}–{lesson.endTime}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                                {lesson.classId} · {lesson.subject}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <MapPin size={12} className="shrink-0" />
                                {room?.name}
                              </p>
                            </div>
                          </div>
                          {room ? (
                            <span className="rounded-lg bg-[#059669]/10 px-2.5 py-1 text-[11px] font-bold text-[#059669]">
                              {t(`${room.floor}-qavat`)}
                            </span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
        </Card>

        {meeting ? (
          <Card
            accent="emerald"
            className="sm:col-span-2"
            title={t("Yaqinlashayotgan yig'ilish")}
            badge={
              <span className="rounded-lg bg-[#059669]/10 px-2.5 py-1 text-[11px] font-bold text-[#059669]">
                {t(formatWeekdayDate(meeting.date))}
              </span>
            }
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {meeting.title}
              </p>
              <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                <Clock size={15} className="text-[#059669]" />
                {meeting.time}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                <MapPin size={15} className="text-[#059669]" />
                {getRoom(meeting.roomId)?.name}
              </span>
            </div>
          </Card>
        ) : null}

        <Card className="sm:col-span-2" title={t("Maktab ma'lumotlari")}>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#059669]/10 text-[#059669]">
                <MapPin size={17} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-wide text-slate-400 uppercase dark:text-slate-500">
                  {t("Direktor")}
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                  {directorRoom?.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {schoolInfo.directorHours}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#059669]/10 text-[#059669]">
                <MapPin size={17} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-wide text-slate-400 uppercase dark:text-slate-500">
                  {t("O'qituvchilar")}
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                  {staffRoom?.name}
                </p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
