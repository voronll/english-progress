"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type TaskCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  variant?: "blue" | "teal" | "amber" | "gray";
  disabled?: boolean;
};

export function TaskCheckbox({
  checked,
  onChange,
  label,
  description,
  variant = "teal",
  disabled = false,
}: TaskCheckboxProps) {
  const id = useId();

  const checkedClassByVariant: Record<
    NonNullable<TaskCheckboxProps["variant"]>,
    string
  > = {
    blue: "data-checked:bg-sky-600 data-checked:border-sky-600",
    teal: "data-checked:bg-emerald-600 data-checked:border-emerald-600",
    amber: "data-checked:bg-amber-600 data-checked:border-amber-600",
    gray: "data-checked:bg-zinc-600 data-checked:border-zinc-600",
  };

  const ringClassByVariant: Record<
    NonNullable<TaskCheckboxProps["variant"]>,
    string
  > = {
    blue: "focus-within:ring-sky-500/30",
    teal: "focus-within:ring-emerald-500/30",
    amber: "focus-within:ring-amber-500/30",
    gray: "focus-within:ring-zinc-500/30",
  };

  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => onChange(next === true)}
        className={cn(
          "mt-0",
          checked ? checkedClassByVariant[variant] : "",
        )}
        aria-label={label}
      />
      <label
        htmlFor={id}
        className={cn(
          "flex-1 select-none",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          "rounded-md outline-none focus-within:ring-2",
          ringClassByVariant[variant],
        )}
      >
        <span
          className={cn(
            "block text-sm leading-5",
            checked ? "text-zinc-500 line-through dark:text-zinc-400" : "",
          )}
        >
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-5 text-zinc-600 dark:text-zinc-400">
            {description}
          </span>
        ) : null}
      </label>
    </div>
  );
}

