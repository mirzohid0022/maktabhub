import { BookOpen } from "lucide-react";

export default function Logo({
  size = "md",
  subtitle,
}: {
  size?: "sm" | "md" | "lg";
  subtitle?: string;
}) {
  const box =
    size === "lg"
      ? "h-12 w-12 rounded-2xl"
      : size === "sm"
        ? "h-8 w-8 rounded-lg"
        : "h-10 w-10 rounded-xl";
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const icon = size === "lg" ? 26 : size === "sm" ? 17 : 21;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${box} flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/25`}
      >
        <BookOpen size={icon} strokeWidth={2.2} />
      </div>
      <div className="leading-tight">
        <p className={`${text} font-bold tracking-tight text-slate-900 dark:text-white`}>
          MaktabHub
        </p>
        {subtitle ? (
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
