import type { UiContractRecord } from "../types/contracts";
import { getStatusTone } from "../utils/contracts";
import {
  formatCurrency,
  formatDate,
  formatText,
} from "../utils/format";
import { StatusPill } from "./StatusPill";

type ContractDrawerProps = {
  contract: UiContractRecord | null;
  onClose: () => void;
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[var(--text)]">{value}</p>
    </div>
  );
}

export function ContractDrawer({ contract, onClose }: ContractDrawerProps) {
  if (!contract) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950/35 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Fechar detalhes"
        className="hidden flex-1 md:block"
        onClick={onClose}
      />

      <aside className="mt-auto flex h-[92vh] w-full flex-col rounded-t-[1.8rem] bg-[var(--surface)] shadow-2xl md:ml-auto md:mt-0 md:h-full md:max-w-xl md:rounded-none md:rounded-l-[2rem]">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] px-5 pb-4 pt-5 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Registro {contract.id}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">
              {formatText(contract.empresaContratada)}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">
              {formatText(contract.objeto)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[color:var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-strong)]"
          >
            Fechar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill
              label={formatText(contract.status)}
              tone={getStatusTone(contract.status)}
            />
            <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text)]">
              {contract.dueSituation}
            </span>
            {contract.hasMissingData ? (
              <span className="rounded-full bg-[var(--warning-soft)] px-3 py-1.5 text-sm font-medium text-[var(--warning)]">
                {contract.missingCount} pendência
                {contract.missingCount === 1 ? "" : "s"} de dados
              </span>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Modalidade" value={formatText(contract.modalidade)} />
            <DetailItem
              label="Nº Modalidade"
              value={formatText(contract.numeroModalidade)}
            />
            <DetailItem label="Processo" value={formatText(contract.processo)} />
            <DetailItem label="Contrato" value={formatText(contract.contrato)} />
            <DetailItem
              label="Empresa Contratada"
              value={formatText(contract.empresaContratada)}
            />
            <DetailItem
              label="Valor"
              value={contract.valorDescricao ?? formatCurrency(contract.valor)}
            />
            <DetailItem label="Data Início" value={formatDate(contract.dataInicio)} />
            <DetailItem
              label="Data Vencimento"
              value={formatDate(contract.dataVencimento)}
            />
            <DetailItem
              label="Dias p/ Vencimento"
              value={
                contract.daysToExpiry === null
                  ? "Não informado"
                  : String(contract.daysToExpiry)
              }
            />
            <DetailItem label="Gestor" value={formatText(contract.gestor)} />
            <DetailItem label="Fiscal" value={formatText(contract.fiscal)} />
            <DetailItem
              label="Situação do vencimento"
              value={contract.dueSituation}
            />
          </div>

          <div className="mt-5">
            <p className="field-label">Objeto</p>
            <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-4 text-sm text-[var(--text)]">
              {formatText(contract.objeto)}
            </div>
          </div>

          <div className="mt-5">
            <p className="field-label">Observações</p>
            <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-4 text-sm text-[var(--text)]">
              {formatText(contract.observacoes)}
            </div>
          </div>

          {contract.hasMissingData ? (
            <div className="mt-5">
              <p className="field-label">Dados faltantes</p>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-4">
                <ul className="space-y-2 text-sm text-[var(--text)]">
                  {contract.missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          aria-label="Fechar detalhes"
          className="h-4 w-full md:hidden"
          onClick={onClose}
        />
      </aside>
    </div>
  );
}
