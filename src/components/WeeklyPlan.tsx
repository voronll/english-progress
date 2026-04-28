"use client";

import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { TaskCheckbox } from "./TaskCheckbox";

type Variant = "blue" | "teal" | "amber" | "gray";

type Slot = {
  id: string;
  time: string;
  activity: string;
  detail?: string;
};

type Card = {
  id: string;
  dayName: string;
  badge: { label: string; variant: Variant };
  slots: Slot[];
};

type Section = {
  id: string;
  title: string;
  card: Card;
};

const STORAGE_KEY = "english-progress:v1:completedSlots";

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function WeeklyPlan() {
  const sections: Section[] = useMemo(
    () => [
      {
        id: "seg-ter-qua",
        title: "Segunda · Terça · Quarta (dias padrão)",
        card: {
          id: "card-seg-ter-qua",
          dayName: "Seg / Ter / Qua",
          badge: { label: "30 min no total", variant: "blue" },
          slots: [
            {
              id: "seg-ter-qua-trajeto",
              time: "6:55 → 7:40 · trajeto",
              activity: "🎧 Podcast ou áudio técnico",
              detail:
                'Ex: "Syntax.fm", "DevDiscuss", episódios do "Command Line Heroes" — tudo em inglês',
            },
            {
              id: "seg-ter-qua-almoco",
              time: "11:25 → 11:55 · almoço",
              activity: "✍️ Prática ativa (20–25 min)",
              detail:
                "Flashcards Anki (vocabulário técnico de dev) + 1 exercício de escrita curta ou leitura de documentação em inglês",
            },
            {
              id: "seg-ter-qua-noite",
              time: "20:30+ · noite",
              activity: "💻 Projetos pessoais em inglês (passivo)",
              detail:
                "Só mude o hábito: ler docs, Stack Overflow, commit messages e comentários de código em inglês",
            },
          ],
        },
      },
      {
        id: "quinta",
        title: "Quinta",
        card: {
          id: "card-quinta",
          dayName: "Quinta",
          badge: { label: "adaptado — aula de bateria", variant: "gray" },
          slots: [
            {
              id: "quinta-trajeto",
              time: "6:55 → 7:40 · trajeto",
              activity: "🎧 Podcast técnico (igual aos outros dias)",
            },
            {
              id: "quinta-almoco",
              time: "11:25 → 11:45 · almoço",
              activity: "📖 Só leitura ou flashcards",
              detail: "Sessão mais curta — sem pressão, você já tem aula à noite",
            },
          ],
        },
      },
      {
        id: "sexta",
        title: "Sexta",
        card: {
          id: "card-sexta",
          dayName: "Sexta",
          badge: { label: "revisão da semana", variant: "teal" },
          slots: [
            {
              id: "sexta-almoco",
              time: "11:25 → 11:55 · almoço",
              activity: "🔁 Revisão + speaking (falar sozinho)",
              detail:
                "Pegue um tema técnico da semana e explique em voz alta em inglês por 5 min — simula entrevista",
            },
          ],
        },
      },
      {
        id: "sab-dom",
        title: "Sábado e Domingo",
        card: {
          id: "card-sab-dom",
          dayName: "Final de semana",
          badge: { label: "sessão mais longa", variant: "amber" },
          slots: [
            {
              id: "sab-dom-bloco",
              time: "1 bloco · ~60 min",
              activity: "🗣️ Simulação de entrevista técnica",
              detail:
                'Responder perguntas comuns de entrevista em inglês · Sábado: perguntas comportamentais ("Tell me about yourself…") · Domingo: perguntas técnicas de front/back/fullstack',
            },
            {
              id: "sab-dom-bonus",
              time: "bônus (opcional)",
              activity: "🎬 Série ou filme em inglês",
              detail:
                'Legenda em inglês — não em português. Recomendação: "Silicon Valley", "Halt and Catch Fire"',
            },
          ],
        },
      },
    ],
    [],
  );

  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    const saved = safeParseJSON<Record<string, boolean>>(
      window.localStorage.getItem(STORAGE_KEY),
    );
    return saved && typeof saved === "object" ? saved : {};
  });

  useEffect(() => {
    globalThis?.localStorage?.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const badgeClassByVariant: Record<Variant, string> = {
    blue: "bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-200",
    teal: "bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200",
    amber: "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200",
    gray: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100",
  };

  const dotClassByVariant: Record<Variant, string> = {
    blue: "bg-sky-500",
    teal: "bg-emerald-500",
    amber: "bg-amber-500",
    gray: "bg-zinc-400 dark:bg-zinc-500",
  };

  const progressColorByVariant: Record<Variant, string> = {
    blue: "bg-sky-500",
    teal: "bg-emerald-500",
    amber: "bg-amber-500",
    gray: "bg-zinc-500",
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Plano semanal de inglês (dev)
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Marque as tarefas feitas e acompanhe o progresso por dia.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dotClassByVariant.blue}`} />
            Passivo (input)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dotClassByVariant.teal}`} />
            Ativo (prática)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dotClassByVariant.amber}`} />
            Técnico (vocabulário dev)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dotClassByVariant.gray}`} />
            Flexível
          </span>
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const total = section.card.slots.length;
            const done = section.card.slots.reduce(
              (acc, slot) => acc + (completed[slot.id] ? 1 : 0),
              0,
            );

            return (
              <section key={section.id}>
                <h2 className="mb-3 text-base font-medium text-zinc-900 dark:text-zinc-100">
                  {section.title}
                </h2>

                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">{section.card.dayName}</span>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[11px]",
                        badgeClassByVariant[section.card.badge.variant],
                      ].join(" ")}
                    >
                      {section.card.badge.label}
                    </span>
                  </div>

                  <div className="mt-3">
                    <ProgressBar
                      value={done}
                      max={total}
                      colorClassName={progressColorByVariant[section.card.badge.variant]}
                      aria-label={`Progresso de ${section.card.dayName}`}
                    />
                    <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      {done}/{total} concluídas
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    {section.card.slots.map((slot, idx) => (
                      <div key={slot.id}>
                        <div className="grid grid-cols-[160px_1fr] gap-x-3">
                          <div className="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                            {slot.time}
                          </div>
                          <TaskCheckbox
                            checked={Boolean(completed[slot.id])}
                            onChange={(checked) =>
                              setCompleted((prev) => ({ ...prev, [slot.id]: checked }))
                            }
                            label={slot.activity}
                            description={slot.detail}
                            variant={section.card.badge.variant}
                          />
                        </div>

                        {idx < section.card.slots.length - 1 ? (
                          <hr className="my-3 border-zinc-200 dark:border-zinc-800" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          <aside className="border-l-2 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm text-zinc-900 dark:border-emerald-300 dark:bg-emerald-950/40 dark:text-zinc-50">
            <p className="leading-6">
              A maior virada para entrevistas internacionais de dev não é o inglês
              perfeito — é conseguir{" "}
              <strong>pensar e explicar código em inglês ao mesmo tempo</strong>.
              Por isso o foco é em vocabulário técnico real e simulações de
              entrevista.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}

