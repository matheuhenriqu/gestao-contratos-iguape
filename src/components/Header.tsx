type HeaderProps = {
  totalContracts: number;
};

export function Header({ totalContracts }: HeaderProps) {
  return (
    <header className="panel overflow-hidden">
      <div className="flex flex-col gap-6 px-5 py-5 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] p-2.5 sm:p-3">
            <img
              src="/logo-prefeitura-iguape.png"
              alt="Prefeitura de Iguape/SP"
              className="h-14 w-auto shrink-0 sm:h-16"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
              Prefeitura de Iguape/SP
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
              Gestão de Contratos
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Consulta institucional com leitura rápida, filtros operacionais e
              acompanhamento de vencimentos.
            </p>
          </div>
        </div>

        <div className="grid max-w-full grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-end">
          <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Base
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--text)]">
              CONTRATOS.xlsx
            </p>
          </div>
          <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Registros
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--text)]">
              {totalContracts} contratos
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
