import type { UiContractRecord } from "../types/contracts";
import { getStatusTone, getUrgencyClasses } from "../utils/contracts";
import {
  formatCurrency,
  formatDate,
  formatText,
} from "../utils/format";
import { StatusPill } from "./StatusPill";

type MobileContractListProps = {
  records: UiContractRecord[];
  selectedContractId: string | null;
  onSelect: (contract: UiContractRecord) => void;
};

export function MobileContractList({
  records,
  selectedContractId,
  onSelect,
}: MobileContractListProps) {
  return (
    <div className="space-y-3 lg:hidden">
      {records.map((record) => {
        const isSelected = selectedContractId === record.id;

        return (
          <button
            key={`${record.id}-${record.sourceIndex}`}
            type="button"
            onClick={() => onSelect(record)}
            className={`panel block w-full p-4 text-left transition ${
              isSelected ? "ring-2 ring-[var(--brand)]/20" : ""
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {formatText(record.modalidade)}
                </p>
                <h3 className="mt-2 text-base font-semibold tracking-tight text-[var(--text)]">
                  {formatText(record.empresaContratada)}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                  {formatText(record.objeto)}
                </p>
              </div>

              <StatusPill
                label={formatText(record.status)}
                tone={getStatusTone(record.status)}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Contrato
                </p>
                <p className="mt-1 text-[var(--text)]">
                  {formatText(record.contrato)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Valor
                </p>
                <p className="mt-1 text-[var(--text)]">
                  {record.valorDescricao ?? formatCurrency(record.valor)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Vencimento
                </p>
                <p className="mt-1 text-[var(--text)]">
                  {formatDate(record.dataVencimento)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Situação
                </p>
                <p className={`mt-1 font-medium ${getUrgencyClasses(record.urgency)}`}>
                  {record.dueSituation}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
