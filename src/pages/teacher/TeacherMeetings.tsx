import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useScript } from "../../context/ScriptContext";
import { Card } from "../../components/ui";
import { formatShortDate, formatWeekdayDate } from "../../lib/dates";
import { getRoom, getUpcomingMeetings } from "../../features/teacher/store";

export default function TeacherMeetings() {
  const { t } = useScript();

  const meetings = getUpcomingMeetings(new Date());

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#059669] uppercase">
          {t("O'qituvchi paneli")}
        </p>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[1.7rem] dark:text-white">
          {t("Yig'ilishlar")}
        </h1>
      </div>

      {meetings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {t("Yaqin yig'ilishlar yo'q")}
        </p>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const room = getRoom(meeting.roomId);
            return (
              <Card
                key={meeting.id}
                accent="emerald"
                title={<span className="text-base">{meeting.title}</span>}
                badge={
                  <span className="rounded-lg bg-[#059669]/10 px-2.5 py-1 text-[11px] font-bold text-[#059669]">
                    {formatShortDate(meeting.date)}
                  </span>
                }
              >
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={15} className="shrink-0 text-[#059669]" />
                    {t(formatWeekdayDate(meeting.date))}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} className="shrink-0 text-[#059669]" />
                    {meeting.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} className="shrink-0 text-[#059669]" />
                    {room?.name}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
