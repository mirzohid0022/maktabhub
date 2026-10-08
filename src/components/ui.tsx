import type { ReactNode } from "react";
import { useScript } from "../context/ScriptContext";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <Skeleton className="mb-4 h-5 w-40" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  illo,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  illo?: ReactNode;
}) {
  const { t } = useScript();
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-indigo-200/80 bg-gradient-to-b from-indigo-50/60 to-white px-6 py-12 text-center dark:border-slate-700/70 dark:from-slate-800/50 dark:to-slate-900/40">
      {illo ? (
        <div className="mb-4 w-40 sm:w-44">{illo}</div>
      ) : (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 dark:bg-blue-500/10">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
        {t(title)}
      </p>
      {description ? (
        <p className="mt-1.5 max-w-xs text-sm text-slate-500 dark:text-slate-400">
          {t(description)}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Card({
  title,
  badge,
  action,
  children,
  className = "",
  bodyClassName = "",
  accent,
}: {
  title?: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  accent?: "emerald";
}) {
  const hasHeader = title !== undefined || badge !== undefined || action !== undefined;
  const accentStyle =
    accent === "emerald" ? { borderColor: "#059669" } : undefined;
  const accentCls =
    accent === "emerald" ? "ring-1 ring-[#059669]/30" : "";
  return (
    <section
      style={accentStyle}
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 ${accentCls} ${className}`}
    >
      {hasHeader ? (
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {title !== undefined ? (
              <div className="min-w-0 text-sm font-bold text-slate-900 dark:text-slate-100">
                {title}
              </div>
            ) : null}
            {badge}
          </div>
          {action !== undefined ? (
            <div className="flex items-center gap-2">{action}</div>
          ) : null}
        </header>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  kicker,
  actions,
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
  actions?: ReactNode;
}) {
  const { t } = useScript();
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? <p className="kicker mb-1.5">{t(kicker)}</p> : null}
        <h1 className="text-gradient text-2xl font-extrabold tracking-tight sm:text-[1.7rem]">
          {t(title)}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {t(subtitle)}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
