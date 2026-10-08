import { useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card, EmptyState, PageHeader, Skeleton } from "../components/ui";
import { EmptyBoxIllo } from "../components/Illustrations";
import Modal from "../components/Modal";
import { useDelay } from "../lib/store";
import { formatWeekdayDate, todayKey } from "../lib/dates";
import { SUBJECTS } from "../lib/constants";
import type { LessonChange } from "../types";

export default function Changes() {
  const { changes, addChange, deleteChange, canEdit, toast } = useApp();
  const loading = useDelay(400);
  const [modalOpen, setModalOpen] = useState(false);

  const [date, setDate] = useState(todayKey());
  const [lessonNumber, setLessonNumber] = useState(1);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");

  const dateKey = todayKey();

  const grouped = useMemo(() => {
    const sorted = [...changes].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.lessonNumber - b.lessonNumber;
    });
    const map = new Map<string, LessonChange[]>();
    for (const change of sorted) {
      const list = map.get(change.date) ?? [];
      list.push(change);
      map.set(change.date, list);
    }
    return [...map.entries()];
  }, [changes]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!oldValue.trim() || !newValue.trim() || !reason.trim()) {
      toast("Barcha maydonlarni to'ldiring.", "error");
      return;
    }
    addChange({
      date,
      lessonNumber,
      subject,
      oldValue: oldValue.trim(),
      newValue: newValue.trim(),
      reason: reason.trim(),
    });
    setOldValue("");
    setNewValue("");
    setReason("");
    setModalOpen(false);
  };

  const upcomingCount = changes.filter((change) => change.date >= dateKey).length;

  return (
    <div>
      <PageHeader
        kicker="Jonli kuzatuv"
        title="Jadval o'zgarishlari"
        subtitle={`Kiritilgan ${changes.length} ta o'zgarish · ularni daqiqada kuzating`}
        actions={
          canEdit ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setModalOpen(true)}
            >
              <Plus size={16} /> O'zgarish qo'shish
            </button>
          ) : null
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Jami o'zgarishlar",
            value: changes.length,
            icon: RefreshCw,
            box: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
          },
          {
            label: "Yaqin kunlardagi",
            value: upcomingCount,
            icon: CalendarClock,
            box: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
          },
          {
            label: "Bekor qilingan darslar",
            value: changes.filter((c) =>
              c.newValue.toLowerCase().includes("bekor"),
            ).length,
            icon: AlertTriangle,
            box: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="transition hover:-translate-y-0.5 hover:shadow-float"
            bodyClassName="flex items-center gap-3.5"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.box}`}
            >
              <stat.icon size={18} />
            </span>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <EmptyState
          icon={<RefreshCw size={26} />}
          title="Hozircha jadval o'zgarishlari yo'q"
          description="Darslar o'zgarganda ular shu yerda paydo bo'ladi."
          illo={<EmptyBoxIllo className="w-full" />}
        />
      ) : (
        <div className="stagger space-y-6">
          {grouped.map(([day, items]) => {
            const isToday = day === dateKey;
            const isPast = day < dateKey;
            return (
              <section key={day}>
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold tracking-wide uppercase ${
                      isToday
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : isPast
                          ? "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    }`}
                  >
                    {formatWeekdayDate(day)}
                  </span>
                  {isToday ? (
                    <span className="kicker">Bugungi o'zgarishlar</span>
                  ) : null}
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="space-y-3">
                  {items.map((change) => {
                    const cancelled = change.newValue
                      .toLowerCase()
                      .includes("bekor");
                    return (
                      <Card
                        key={change.id}
                        className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float ${
                          cancelled
                            ? "border-red-200/80 dark:border-red-500/30"
                            : "border-amber-200/80 dark:border-amber-500/30"
                        }`}
                        title={`${change.lessonNumber}-dars`}
                        badge={
                          <>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${
                                cancelled
                                  ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                              }`}
                            >
                              {cancelled ? "Bekor qilindi" : "O'zgartirildi"}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {change.subject}
                            </span>
                          </>
                        }
                        action={
                          canEdit ? (
                            <button
                              type="button"
                              onClick={() => deleteChange(change.id)}
                              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800"
                              title="O'chirish"
                            >
                              <Trash2 size={15} />
                            </button>
                          ) : undefined
                        }
                        bodyClassName="pl-3"
                      >
                        <span
                          className={`absolute inset-y-0 left-0 w-1.5 ${
                            cancelled ? "bg-red-500" : "bg-amber-500"
                          }`}
                        />

                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 line-through decoration-slate-400 dark:bg-slate-800 dark:text-slate-400">
                            {change.oldValue}
                          </span>
                          <ArrowRight size={15} className="text-slate-400" />
                          <span
                            className={`rounded-lg px-2.5 py-1 font-bold ${
                              cancelled
                                ? "bg-red-600 text-white"
                                : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            }`}
                          >
                            {change.newValue}
                          </span>
                        </div>

                        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Pencil size={12} className="shrink-0" />
                          Sabab: <em>{change.reason}</em>
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        title="Yangi jadval o'zgarishi"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Bekor qilish
            </button>
            <button type="button" className="btn-primary" onClick={submit}>
              <Plus size={15} /> Qo'shish
            </button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Sana</label>
              <input
                type="date"
                className="input"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Dars raqami</label>
              <select
                className="input"
                value={lessonNumber}
                onChange={(event) => setLessonNumber(Number(event.target.value))}
              >
                {Array.from({ length: 7 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}-dars
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Fan</label>
            <select
              className="input"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            >
              {SUBJECTS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Eski qiymat</label>
              <input
                className="input"
                placeholder="Rahimov B. / 208-xona"
                value={oldValue}
                onChange={(event) => setOldValue(event.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Yangi qiymat</label>
              <input
                className="input"
                placeholder="Bekor qilindi"
                value={newValue}
                onChange={(event) => setNewValue(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="field-label">Sabab</label>
            <input
              className="input"
              placeholder="O'qituvchi kasal"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  );
}
