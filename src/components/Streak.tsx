"use client";

type StreakProps = {
  studiedDates: Record<string, boolean>;
  todayKey: string;
};

function parseKey(key: string) {
  const [y, m, d] = key.split("-").map((x) => Number(x));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function toKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function computeStreak(studiedDates: Record<string, boolean>, todayKey: string) {
  let count = 0;
  const date = parseKey(todayKey);

  // Conta somente streak "até hoje" (inclui hoje se estiver marcado).
  // Se quiser streak "máximo histórico", a gente muda depois.
  while (studiedDates[toKey(date)]) {
    count += 1;
    date.setDate(date.getDate() - 1);
  }

  return count;
}

export function Streak({ studiedDates, todayKey }: StreakProps) {
  const streak = computeStreak(studiedDates, todayKey);
  const todayDone = Boolean(studiedDates[todayKey]);

  return (
    <div className="mb-6 rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium">Streak</div>
          <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
            Dias seguidos estudando - LOCK IN!
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums">{streak}</div>
          <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
            {todayDone ? "Hoje: concluído" : "Hoje: pendente"}
          </div>
        </div>
      </div>
    </div>
  );
}

