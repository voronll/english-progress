"use client";

type ProgressBarProps = {
  value: number;
  max: number;
  colorClassName?: string;
  "aria-label"?: string;
};

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function ProgressBar({
  value,
  max,
  colorClassName,
  "aria-label": ariaLabel = "Progresso",
}: ProgressBarProps) {
  const ratio = max <= 0 ? 0 : clamp01(value / max);
  const pct = Math.round(ratio * 100);

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={[
            "h-full rounded-full transition-[width] duration-300",
            colorClassName ?? "bg-emerald-500",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-12 text-right text-[11px] text-zinc-600 tabular-nums dark:text-zinc-400">
        {pct}%
      </div>
    </div>
  );
}

