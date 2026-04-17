import { cx } from "../utils/format";

type StatusPillProps = {
  label: string;
  tone: "danger" | "warning" | "success" | "neutral" | "brand";
};

const TONE_CLASSES = {
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  success: "bg-[var(--success-soft)] text-[var(--success)]",
  neutral: "bg-[var(--neutral-soft)] text-[var(--muted)]",
  brand: "bg-[var(--brand-soft)] text-[var(--brand)]",
};

export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-[0.02em]",
        TONE_CLASSES[tone],
      )}
    >
      {label}
    </span>
  );
}
