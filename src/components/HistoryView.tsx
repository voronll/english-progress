"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const STORAGE_KEY_STUDIED_DATES = "english-progress:v1:studiedDates";

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function monthKeyFromDateKey(dateKey: string) {
  // YYYY-MM-DD -> YYYY-MM
  return dateKey.slice(0, 7);
}

function formatMonthTitle(monthKey: string) {
  const [y, m] = monthKey.split("-").map((x) => Number(x));
  const d = new Date(y, (m ?? 1) - 1, 1);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(
    d,
  );
}

function dayNumberFromDateKey(dateKey: string) {
  const dd = dateKey.slice(8, 10);
  return Number(dd);
}

function compareMonthKeyDesc(a: string, b: string) {
  // YYYY-MM lexicographic matches chronological
  return b.localeCompare(a);
}

export function HistoryView() {
  const [studiedDates] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    const saved = safeParseJSON<Record<string, boolean>>(
      window.localStorage.getItem(STORAGE_KEY_STUDIED_DATES),
    );
    return saved && typeof saved === "object" ? saved : {};
  });

  const months = useMemo(() => {
    const keys = Object.keys(studiedDates).filter((k) => studiedDates[k]);
    const grouped = new Map<string, number[]>();

    for (const k of keys) {
      const mk = monthKeyFromDateKey(k);
      const day = dayNumberFromDateKey(k);
      if (!Number.isFinite(day)) continue;
      const list = grouped.get(mk) ?? [];
      list.push(day);
      grouped.set(mk, list);
    }

    const monthKeys = Array.from(grouped.keys()).sort(compareMonthKeyDesc);
    return monthKeys.map((mk) => {
      const days = (grouped.get(mk) ?? []).sort((a, b) => a - b);
      return { monthKey: mk, title: formatMonthTitle(mk), days };
    });
  }, [studiedDates]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
        <header className="mb-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              English Progress
            </div>
            <Link
              href="/"
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-sm transition hover:bg-zinc-50 active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900/40"
            >
              Voltar
            </Link>
          </div>

          <h1 className="text-xl font-semibold tracking-tight">Histórico</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Dias estudados (100% concluído no dia).
          </p>
        </header>

        {months.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Nenhum dia estudado ainda. Complete 100% do card de hoje para começar.
          </div>
        ) : (
          <div className="space-y-6">
            {months.map((m) => (
              <section key={m.monthKey}>
                <h2 className="mb-3 text-base font-medium text-zinc-900 dark:text-zinc-100">
                  {m.title}
                </h2>

                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex flex-wrap gap-2">
                    {m.days.map((d) => (
                      <span
                        key={`${m.monthKey}-${d}`}
                        className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200"
                      >
                        {String(d).padStart(2, "0")}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

