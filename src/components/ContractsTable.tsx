import type { SortKey, SortState, UiContractRecord } from "../types/contracts";
import {
  getStatusTone,
  getUrgencyClasses,
} from "../utils/contracts";
import {
  formatCurrency,
  formatDate,
  formatText,
} from "../utils/format";
import { StatusPill } from "./StatusPill";

type ContractsTableProps = {
  records: UiContractRecord[];
  selectedContractId: string | null;
  sortState: SortState;
  onSortChange: (key: SortKey) => void;
  onSelect: (contract: UiContractRecord) => void;
};

const COLUMNS: Array<{ key: SortKey; label: string; className?: string }> = [
  { key: "modalidade", label: "Modalidade", className: "min-w-[10rem]" },
  { key: "numeroModalidade", label: "Nº Modalidade", className: "min-w-[8rem]" },
  { key: "objeto", label: "Objeto", className: "min-w-[20rem]" },
  { key: "processo", label: "Processo", className: "min-w-[8rem]" },
  { key: "contrato", label: "Contrato", className: "min-w-[8rem]" },
  {
    key: "empresaContratada",
    label: "Empresa Contratada",
    className: "min-w-[12rem]",
  },
  { key: "valor", label: "Valor", className: "min-w-[10rem]" },
  { key: "dataInicio", label: "Data Início", className: "min-w-[7.5rem]" },
  { key: "dataVencimento", label: "Data Vencimento", className: "min-w-[7.5rem]" },
  { key: "daysToExpiry", label: "Dias p/ Vencimento", className: "min-w-[8rem]" },
  { key: "status", label: "Status", className: "min-w-[9rem]" },
  { key: "gestor", label: "Gestor", className: "min-w-[11rem]" },
  { key: "fiscal", label: "Fiscal", className: "min-w-[11rem]" },
];

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: SortState["direction"];
}) {
  return (
    <span
      className={`text-[0.65rem] tracking-[0.16em] ${
        active ? "text-[var(--brand)]" : "text-[var(--muted)]"
      }`}
    >
      {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );
}

export function ContractsTable({
  records,
  selectedContractId,
  sortState,
  onSortChange,
  onSelect,
}: ContractsTableProps) {
  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <table className="min-w-[1320px] table-fixed border-separate border-spacing-0">
          <thead>
            <tr>
              {COLUMNS.map((column) => {
                const active = sortState.key === column.key;
                return (
                  <th
                    key={column.key}
                    className={`border-b border-[color:var(--border)] bg-[var(--surface)] px-3 py-3 text-left align-middle text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] ${column.className ?? ""}`}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-left"
                      onClick={() => onSortChange(column.key)}
                    >
                      <span>{column.label}</span>
                      <SortIndicator
                        active={active}
                        direction={sortState.direction}
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {records.map((record) => {
              const isSelected = selectedContractId === record.id;
              return (
                <tr
                  key={`${record.id}-${record.sourceIndex}`}
                  className={`cursor-pointer transition ${
                    isSelected ? "bg-[var(--brand-soft)]/70" : "hover:bg-[var(--surface-strong)]"
                  }`}
                  onClick={() => onSelect(record)}
                >
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm font-medium text-[var(--text)]">
                    {formatText(record.modalidade)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm text-[var(--text)]">
                    {formatText(record.numeroModalidade)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm text-[var(--text)]">
                    <div className="line-clamp-2 max-w-[22rem]">
                      {formatText(record.objeto)}
                    </div>
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm text-[var(--text)]">
                    {formatText(record.processo)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm text-[var(--text)]">
                    {formatText(record.contrato)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm text-[var(--text)]">
                    {formatText(record.empresaContratada)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm font-medium text-[var(--text)]">
                    {record.valorDescricao ?? formatCurrency(record.valor)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm text-[var(--text)]">
                    {formatDate(record.dataInicio)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm text-[var(--text)]">
                    {formatDate(record.dataVencimento)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm">
                    <div className={getUrgencyClasses(record.urgency)}>
                      <p className="font-semibold">
                        {record.daysToExpiry === null
                          ? "Não informado"
                          : record.daysToExpiry}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {record.dueSituation}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm">
                    <StatusPill
                      label={formatText(record.status)}
                      tone={getStatusTone(record.status)}
                    />
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm text-[var(--text)]">
                    {formatText(record.gestor)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-3 py-4 align-top text-sm text-[var(--text)]">
                    {formatText(record.fiscal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
