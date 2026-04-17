import type { ChangeEvent } from "react";
import type { ExpiryBand, FiltersState, ValueRange } from "../types/contracts";
import { VALUE_RANGE_LABELS } from "../utils/contracts";

type FilterOptions = {
  statuses: string[];
  modalidades: string[];
  empresas: string[];
  gestores: string[];
  fiscais: string[];
};

type FiltersPanelProps = {
  filters: FiltersState;
  options: FilterOptions;
  activeFilterCount: number;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onReset: () => void;
  onChange: <Key extends keyof FiltersState>(
    key: Key,
    value: FiltersState[Key],
  ) => void;
};

const EXPIRY_OPTIONS: Array<{ value: Exclude<ExpiryBand, "no_date">; label: string }> =
  [
    { value: "expired", label: "Vencidos" },
    { value: "today", label: "Vencem hoje" },
    { value: "up_to_7", label: "Até 7 dias" },
    { value: "up_to_30", label: "Até 30 dias" },
    { value: "up_to_60", label: "Até 60 dias" },
    { value: "up_to_90", label: "Até 90 dias" },
    { value: "over_90", label: "Acima de 90 dias" },
  ];

const VALUE_OPTIONS: Array<{ value: Exclude<ValueRange, "all">; label: string }> =
  Object.entries(VALUE_RANGE_LABELS).map(([value, label]) => ({
    value: value as Exclude<ValueRange, "all">,
    label,
  }));

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="min-w-0">
      <span className="field-label">{label}</span>
      <select className="field-shell" value={value} onChange={onChange}>
        <option value="all">Todos</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DatalistField({
  label,
  value,
  listId,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  listId: string;
  options: string[];
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="min-w-0">
      <span className="field-label">{label}</span>
      <input
        type="text"
        className="field-shell"
        value={value}
        list={listId}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </label>
  );
}

export function FiltersPanel({
  filters,
  options,
  activeFilterCount,
  mobileOpen,
  onToggleMobile,
  onReset,
  onChange,
}: FiltersPanelProps) {
  const statusOptions = options.statuses.map((status) => ({
    value: status,
    label: status,
  }));

  const modalidadeOptions = options.modalidades.map((modalidade) => ({
    value: modalidade,
    label: modalidade,
  }));

  return (
    <section className="panel p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="section-title">Filtros</h2>
          <p className="section-subtitle">
            Busca rápida, recortes operacionais e pendências de dados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
            {activeFilterCount} ativo{activeFilterCount === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-[color:var(--border)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--surface-strong)]"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={onToggleMobile}
            className="inline-flex rounded-full border border-[color:var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-strong)] md:hidden"
          >
            {mobileOpen ? "Ocultar" : "Exibir"} filtros
          </button>
        </div>
      </div>

      <div className={`${mobileOpen ? "mt-5 block" : "mt-5 hidden"} md:block`}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="min-w-0 xl:col-span-2">
            <span className="field-label">Busca geral</span>
            <input
              type="search"
              value={filters.search}
              onChange={(event) => onChange("search", event.target.value)}
              placeholder="Objeto, empresa, contrato, processo, gestor ou fiscal"
              className="field-shell"
              autoComplete="off"
            />
          </label>

          <SelectField
            label="Status"
            value={filters.status}
            options={statusOptions}
            onChange={(event) => onChange("status", event.target.value)}
          />

          <SelectField
            label="Modalidade"
            value={filters.modalidade}
            options={modalidadeOptions}
            onChange={(event) => onChange("modalidade", event.target.value)}
          />

          <DatalistField
            label="Empresa Contratada"
            value={filters.empresaContratada}
            listId="empresas-contratadas"
            options={options.empresas}
            placeholder="Digite para filtrar"
            onChange={(event) =>
              onChange("empresaContratada", event.target.value)
            }
          />

          <DatalistField
            label="Gestor"
            value={filters.gestor}
            listId="gestores-contratos"
            options={options.gestores}
            placeholder="Digite para filtrar"
            onChange={(event) => onChange("gestor", event.target.value)}
          />

          <DatalistField
            label="Fiscal"
            value={filters.fiscal}
            listId="fiscais-contratos"
            options={options.fiscais}
            placeholder="Digite para filtrar"
            onChange={(event) => onChange("fiscal", event.target.value)}
          />

          <SelectField
            label="Faixa de vencimento"
            value={filters.expiryBand}
            options={EXPIRY_OPTIONS}
            onChange={(event) =>
              onChange("expiryBand", event.target.value as FiltersState["expiryBand"])
            }
          />

          <SelectField
            label="Faixa de valor"
            value={filters.valueRange}
            options={VALUE_OPTIONS}
            onChange={(event) =>
              onChange("valueRange", event.target.value as FiltersState["valueRange"])
            }
          />

          <SelectField
            label="Pendência de dados"
            value={filters.pendingData}
            options={[
              { value: "missing", label: "Com pendência" },
              { value: "complete", label: "Sem pendência" },
            ]}
            onChange={(event) =>
              onChange("pendingData", event.target.value as FiltersState["pendingData"])
            }
          />
        </div>
      </div>
    </section>
  );
}
