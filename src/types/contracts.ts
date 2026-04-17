export type ContractRecord = {
  id: string;
  sourceIndex: number;
  modalidade: string | null;
  numeroModalidade: string | null;
  objeto: string | null;
  processo: string | null;
  contrato: string | null;
  empresaContratada: string | null;
  valor: number | null;
  valorDescricao: string | null;
  dataInicio: string | null;
  dataVencimento: string | null;
  diasParaVencimentoPlanilha: number | null;
  status: string | null;
  gestor: string | null;
  fiscal: string | null;
  observacoes: string | null;
  missingFields: string[];
  missingCount: number;
  hasMissingData: boolean;
  searchText: string;
};

export type ExpiryBand =
  | "all"
  | "expired"
  | "today"
  | "up_to_7"
  | "up_to_30"
  | "up_to_60"
  | "up_to_90"
  | "over_90"
  | "no_date";

export type ValueRange =
  | "all"
  | "up_to_50k"
  | "from_50k_to_250k"
  | "from_250k_to_1m"
  | "above_1m"
  | "no_value";

export type PendingDataFilter = "all" | "missing" | "complete";

export type FiltersState = {
  search: string;
  status: string;
  modalidade: string;
  empresaContratada: string;
  gestor: string;
  fiscal: string;
  expiryBand: ExpiryBand;
  valueRange: ValueRange;
  pendingData: PendingDataFilter;
};

export type SortDirection = "asc" | "desc";

export type SortKey =
  | "modalidade"
  | "numeroModalidade"
  | "objeto"
  | "processo"
  | "contrato"
  | "empresaContratada"
  | "valor"
  | "dataInicio"
  | "dataVencimento"
  | "daysToExpiry"
  | "status"
  | "gestor"
  | "fiscal";

export type SortState = {
  key: SortKey;
  direction: SortDirection;
};

export type UiContractRecord = ContractRecord & {
  daysToExpiry: number | null;
  expiryBand: Exclude<ExpiryBand, "all">;
  dueSituation: string;
  urgency: "critical" | "warning" | "ok" | "neutral";
};
