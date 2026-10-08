import {
  BarChart3,
  BookOpen,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { PageHeader } from "../components/ui";
import { GradeBar, ParentCard, RingProgress } from "../components/parent";
import {
  ATTENDANCE,
  CHILD,
  GRADE_BAR,
  GRADE_CHIP,
  RECENT_GRADES,
  SUBJECT_GRADES,
  TONE_LABEL,
  childGpa,
  gpaPercent,
  gradeCounts,
  medalForRank,
  shortDateLabel,
  toneForPercent,
} from "../lib/childData";

export default function Grades() {
  const gpa = childGpa();
  const percent = gpaPercent();
  const tone = toneForPercent(percent);
  const counts = gradeCounts();

  return (
    <div>
      <PageHeader
        kicker="Baholar jurnali"
        title="Baholar"
        subtitle={`${CHILD.name} · ${CHILD.className} sinf · 1-chorak · ${SUBJECT_GRADES.length} ta fan`}
      />

      <div className="stagger grid gap-5 lg:grid-cols-3">
        <ParentCard
          title="O'rtacha baho"
          icon={<TrendingUp size={16} />}
          iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
        >
          <div className="flex items-center gap-4">
            <RingProgress percent={percent} tone={tone} caption="umumiy" />
            <div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {gpa}
              </p>
              <p
                className={`mt-1 text-sm font-bold ${tone === "green" ? "text-emerald-600 dark:text-emerald-400" : tone === "yellow" ? "text-amber-500" : "text-red-500"}`}
              >
                {TONE_LABEL[tone]}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                5 balldan {percent}%
              </p>
            </div>
          </div>
        </ParentCard>

        <ParentCard
          title="Sinfda o'rni"
          icon={<Trophy size={16} />}
          iconClass="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
        >
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
              #{CHILD.rank}
            </p>
            <p className="text-lg font-bold text-slate-400">/ {CHILD.classSize}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              o'quvchi
            </p>
            <span className="ml-auto text-3xl">{medalForRank(CHILD.rank)}</span>
          </div>
          <p className="mt-2 inline-flex rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            Sinfda eng yaxshi {CHILD.topPercent}% ichida
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-600 dark:text-slate-300">
                  {CHILD.name}
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {gpa}
                </span>
              </div>
              <div className="mt-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-2.5 rounded-full bg-emerald-500"
                  style={{ width: `${(gpa / 5) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-500 dark:text-slate-400">
                  Sinf o'rtachasi
                </span>
                <span className="font-extrabold text-slate-500 dark:text-slate-400">
                  {CHILD.classAverage}
                </span>
              </div>
              <div className="mt-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-2.5 rounded-full bg-slate-400 dark:bg-slate-600"
                  style={{ width: `${(CHILD.classAverage / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </ParentCard>

        <ParentCard
          title="Baho taqsimoti"
          icon={<BarChart3 size={16} />}
          iconClass="bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
        >
          <ul className="space-y-3">
            {counts.map((item) => (
              <li key={item.grade}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {item.grade} baho
                  </span>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {item.count} ta fan
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-2.5 rounded-full ${GRADE_BAR[item.grade] ?? GRADE_BAR[3]}`}
                    style={{
                      width: `${(item.count / SUBJECT_GRADES.length) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50 px-3.5 py-2.5 text-xs dark:border-teal-500/20 dark:bg-teal-500/10">
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              Davomat
            </span>
            <span className="font-extrabold text-teal-700 dark:text-teal-300">
              {ATTENDANCE.percent}% · {ATTENDANCE.absentDays} kun kelmadi
            </span>
          </div>
        </ParentCard>

        <ParentCard
          className="lg:col-span-2"
          title="Fanlar bo'yicha baholar"
          icon={<BookOpen size={16} />}
          iconClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
          action={
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              O'rtacha: {gpa}
            </span>
          }
        >
          <div className="grid gap-3.5 sm:grid-cols-2">
            {SUBJECT_GRADES.map((item) => (
              <GradeBar
                key={item.subject}
                subject={item.subject}
                grade={item.grade}
              />
            ))}
          </div>
        </ParentCard>

        <ParentCard
          title="So'nggi baholar"
          icon={<Star size={16} />}
          iconClass="bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
        >
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {RECENT_GRADES.map((item, index) => (
              <li
                key={`${item.date}-${item.subject}-${index}`}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="w-16 shrink-0 text-[11px] font-bold text-slate-400">
                  {shortDateLabel(item.date)}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                    GRADE_CHIP[item.grade] ?? GRADE_CHIP[3]
                  }`}
                >
                  {item.grade}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                    {item.subject}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">
                    {item.teacher}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ParentCard>
      </div>
    </div>
  );
}
