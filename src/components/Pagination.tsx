type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--border)] px-4 py-4 sm:px-5">
      <p className="text-sm text-[var(--muted)]">
        Página {page} de {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="rounded-full border border-[color:var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-strong)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-full border border-[color:var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-strong)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
