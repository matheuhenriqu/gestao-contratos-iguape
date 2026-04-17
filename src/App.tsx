import {
  Suspense,
  lazy,
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import contractsData from "./data/contracts.json";
import { ContractDrawer } from "./components/ContractDrawer";
import { ContractsTable } from "./components/ContractsTable";
import { FiltersPanel } from "./components/FiltersPanel";
import { Header } from "./components/Header";
import { KpiCard } from "./components/KpiCard";
import { MobileContractList } from "./components/MobileContractList";
import { Pagination } from "./components/Pagination";
import type { ContractRecord, FiltersState, SortState } from "./types/contracts";
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  buildChartData,
  buildMetrics,
  collectFilterOptions,
  filterAndSortContracts,
  getActiveFilterCount,
  paginateContracts,
} from "./utils/contracts";
import { formatCompactNumber, formatCurrency } from "./utils/format";

const PAGE_SIZE = 12;
const CONTRACTS = contractsData as ContractRecord[];
const ChartsSection = lazy(() => import("./components/ChartsSection"));

const SORT_PRESETS: Array<{ label: string; value: string; state: SortState }> = [
  {
    label: "Vencimento mais próximo",
    value: "daysToExpiry:asc",
    state: { key: "daysToExpiry", direction: "asc" },
  },
  {
    label: "Vencimento mais distante",
    value: "daysToExpiry:desc",
    state: { key: "daysToExpiry", direction: "desc" },
  },
  {
    label: "Maior valor",
    value: "valor:desc",
    state: { key: "valor", direction: "desc" },
  },
  {
    label: "Menor valor",
    value: "valor:asc",
    state: { key: "valor", direction: "asc" },
  },
  {
    label: "Empresa A-Z",
    value: "empresaContratada:asc",
    state: { key: "empresaContratada", direction: "asc" },
  },
  {
    label: "Empresa Z-A",
    value: "empresaContratada:desc",
    state: { key: "empresaContratada", direction: "desc" },
  },
];

function IconSquare({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-6 w-6">{children}</div>;
}

function ContractsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v12A1.5 1.5 0 0 1 17 19.5H7A1.5 1.5 0 0 1 5.5 18V6A1.5 1.5 0 0 1 7 4.5Z" />
      <path d="M8.5 9h7M8.5 12h7M8.5 15h4.5" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3.5v17" />
      <path d="M16.8 7.8c0-1.9-2.1-3.3-4.8-3.3S7.2 5.9 7.2 7.8 9 10.5 12 10.5s4.8 1.2 4.8 3.1-2.1 3.9-4.8 3.9-4.8-1.4-4.8-3.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 8v5" />
      <path d="M12 17h.01" />
      <path d="M10.2 3.9 2.8 17a2 2 0 0 0 1.7 3h14.9a2 2 0 0 0 1.7-3L13.8 3.9a2 2 0 0 0-3.5 0Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 7.5C4 5.6 7.6 4 12 4s8 1.6 8 3.5S16.4 11 12 11 4 9.4 4 7.5Z" />
      <path d="M4 7.5V12c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5V7.5" />
      <path d="M4 12v4.5C4 18.4 7.6 20 12 20s8-1.6 8-3.5V12" />
    </svg>
  );
}

export default function App() {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [sortState, setSortState] = useState<SortState>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(filters.search);
  const referenceDate = new Date();
  const filterOptions = collectFilterOptions(CONTRACTS);
  const appliedFilters = { ...filters, search: deferredSearch };
  const filteredContracts = filterAndSortContracts(
    CONTRACTS,
    appliedFilters,
    sortState,
    referenceDate,
  );
  const metrics = buildMetrics(filteredContracts);
  const charts = buildChartData(filteredContracts);
  const pagination = paginateContracts(filteredContracts, page, PAGE_SIZE);
  const activeFilterCount = getActiveFilterCount(filters);
  const selectedContract =
    filteredContracts.find((contract) => contract.id === selectedContractId) ?? null;
  useEffect(() => {
    if (pagination.page !== page) {
      setPage(pagination.page);
    }
  }, [page, pagination.page]);

  useEffect(() => {
    if (
      selectedContractId &&
      !filteredContracts.some((contract) => contract.id === selectedContractId)
    ) {
      setSelectedContractId(null);
    }
  }, [filteredContracts, selectedContractId]);

  function updateFilter<Key extends keyof FiltersState>(
    key: Key,
    value: FiltersState[Key],
  ) {
    startTransition(() => {
      setFilters((current) => ({ ...current, [key]: value }));
      setPage(1);
    });
  }

  function resetFilters() {
    startTransition(() => {
      setFilters(DEFAULT_FILTERS);
      setPage(1);
    });
  }

  function handleSortToggle(key: SortState["key"]) {
    startTransition(() => {
      setSortState((current) => ({
        key,
        direction:
          current.key === key && current.direction === "asc" ? "desc" : "asc",
      }));
      setPage(1);
    });
  }

  function handleSortPresetChange(value: string) {
    const selectedPreset = SORT_PRESETS.find((preset) => preset.value === value);
    if (!selectedPreset) {
      return;
    }

    startTransition(() => {
      setSortState(selectedPreset.state);
      setPage(1);
    });
  }

  const sortPresetValue = `${sortState.key}:${sortState.direction}`;

  return (
    <div className="min-h-screen pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <main className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Header totalContracts={CONTRACTS.length} />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <KpiCard
            title="Total de contratos"
            value={formatCompactNumber(metrics.totalContracts)}
            note="Resultado conforme a seleção atual."
            accent="brand"
            icon={
              <IconSquare>
                <ContractsIcon />
              </IconSquare>
            }
          />
          <KpiCard
            title="Valor total"
            value={formatCurrency(metrics.totalValue)}
            note="Soma dos valores numéricos disponíveis."
            accent="neutral"
            icon={
              <IconSquare>
                <CurrencyIcon />
              </IconSquare>
            }
          />
          <KpiCard
            title="Contratos ativos"
            value={formatCompactNumber(metrics.activeContracts)}
            note="Status cadastrado como Ativo."
            accent="success"
            icon={
              <IconSquare>
                <CheckIcon />
              </IconSquare>
            }
          />
          <KpiCard
            title="Contratos vencidos"
            value={formatCompactNumber(metrics.expiredContracts)}
            note="Vencimento anterior à data atual."
            accent="danger"
            icon={
              <IconSquare>
                <AlertIcon />
              </IconSquare>
            }
          />
          <KpiCard
            title="Próximos do vencimento"
            value={formatCompactNumber(metrics.upcomingContracts)}
            note="Hoje, até 7 dias e até 30 dias."
            accent="warning"
            icon={
              <IconSquare>
                <ClockIcon />
              </IconSquare>
            }
          />
          <KpiCard
            title="Dados incompletos"
            value={formatCompactNumber(metrics.incompleteContracts)}
            note="Pendências nos campos operacionais."
            accent="neutral"
            icon={
              <IconSquare>
                <DatabaseIcon />
              </IconSquare>
            }
          />
        </section>

        <FiltersPanel
          filters={filters}
          options={filterOptions}
          activeFilterCount={activeFilterCount}
          mobileOpen={mobileFiltersOpen}
          onToggleMobile={() => setMobileFiltersOpen((current) => !current)}
          onReset={resetFilters}
          onChange={updateFilter}
        />

        <section className="panel overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-[color:var(--border)] px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="section-title">Tabela principal</h2>
                <p className="section-subtitle">
                  Ordenação por coluna no desktop, cards nativos no mobile e
                  detalhe completo ao selecionar um registro.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 sm:w-[16rem]">
                  <label className="field-label">Ordenação</label>
                  <select
                    className="field-shell"
                    value={sortPresetValue}
                    onChange={(event) => handleSortPresetChange(event.target.value)}
                  >
                    {SORT_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
                  {formatCompactNumber(filteredContracts.length)} registro
                  {filteredContracts.length === 1 ? "" : "s"} na seleção
                </div>
              </div>
            </div>
          </div>

          {filteredContracts.length === 0 ? (
            <div className="px-4 py-14 text-center sm:px-5">
              <div className="mx-auto max-w-md">
                <p className="text-lg font-semibold text-[var(--text)]">
                  Nenhum contrato encontrado.
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Ajuste os filtros para ampliar a seleção ou limpe os recortes
                  aplicados.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          ) : (
            <>
              <ContractsTable
                records={pagination.items}
                selectedContractId={selectedContractId}
                sortState={sortState}
                onSortChange={handleSortToggle}
                onSelect={(contract) => setSelectedContractId(contract.id)}
              />

              <div className="px-4 py-4 sm:px-5 lg:hidden">
                <MobileContractList
                  records={pagination.items}
                  selectedContractId={selectedContractId}
                  onSelect={(contract) => setSelectedContractId(contract.id)}
                />
              </div>

              {pagination.totalPages > 1 ? (
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onChange={setPage}
                />
              ) : null}
            </>
          )}
        </section>

        {filteredContracts.length > 0 ? (
          <Suspense
            fallback={
              <section className="panel p-5">
                <h2 className="section-title">Gráficos</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Carregando visualizações analíticas...
                </p>
              </section>
            }
          >
            <ChartsSection {...charts} />
          </Suspense>
        ) : null}
      </main>

      <ContractDrawer
        contract={selectedContract}
        onClose={() => setSelectedContractId(null)}
      />
    </div>
  );
}
