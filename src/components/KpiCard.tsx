import type { ReactNode } from "react";

type KpiCardProps = {
  title: string;
  value: string;
  note: string;
  accent: "brand" | "danger" | "warning" | "success" | "neutral";
  icon: ReactNode;
};

const ACCENT_CLASSES = {
  brand:
    "border-[color:color-mix(in_srgb,var(--brand)_18%,var(--border))] bg-[color:var(--brand-soft)] text-[var(--brand)]",
  danger:
    "border-[color:color-mix(in_srgb,var(--danger)_18%,var(--border))] bg-[color:var(--danger-soft)] text-[var(--danger)]",
  warning:
    "border-[color:color-mix(in_srgb,var(--warning)_18%,var(--border))] bg-[color:var(--warning-soft)] text-[var(--warning)]",
  success:
    "border-[color:color-mix(in_srgb,var(--success)_18%,var(--border))] bg-[color:var(--success-soft)] text-[var(--success)]",
  neutral:
    "border-[color:var(--border)] bg-[color:var(--neutral-soft)] text-[var(--text)]",
};

export function KpiCard({ title, value, note, accent, icon }: KpiCardProps) {
  return (
    <article className="panel p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-[1.9rem]">
            {value}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">{note}</p>
        </div>

        <div
          className={`rounded-2xl border p-3 shadow-sm ${ACCENT_CLASSES[accent]}`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}
