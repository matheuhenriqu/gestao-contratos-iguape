import type {
  ContractRecord,
  ExpiryBand,
  FiltersState,
  SortKey,
  SortState,
  UiContractRecord,
  ValueRange,
} from "../types/contracts";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const DEFAULT_FILTERS: FiltersState = {
  search: "",
  status: "all",
  modalidade: "all",
  empresaContratada: "",
  gestor: "",
  fiscal: "",
  expiryBand: "all",
  valueRange: "all",
  pendingData: "all",
};

export const DEFAULT_SORT: SortState = {
  key: "daysToExpiry",
  direction: "asc",
};

export const EXPIRY_BAND_LABELS: Record<Exclude<ExpiryBand, "all">, string> = {
  expired: "Vencidos",
  today: "Vencem hoje",
  up_to_7: "Até 7 dias",
  up_to_30: "Até 30 dias",
  up_to_60: "Até 60 dias",
  up_to_90: "Até 90 dias",
  over_90: "Acima de 90 dias",
  no_date: "Sem data",
};

export const VALUE_RANGE_LABELS: Record<Exclude<ValueRange, "all">, string> = {
  up_to_50k: "Até R$ 50 mil",
  from_50k_to_250k: "R$ 50 mil a R$ 250 mil",
  from_250k_to_1m: "R$ 250 mil a R$ 1 mi",
  above_1m: "Acima de R$ 1 mi",
  no_value: "Sem valor numérico",
};

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function normalizeSearchValue(value: string | null | undefined) {
  return stripAccents(String(value ?? "").toLocaleLowerCase("pt-BR"));
}

function parseDateOnly(value: string | null) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDaysToExpiry(
  contract: Pick<ContractRecord, "dataVencimento" | "diasParaVencimentoPlanilha">,
  referenceDate = new Date(),
) {
  const expirationDate = parseDateOnly(contract.dataVencimento);
  if (!expirationDate) {
    return contract.diasParaVencimentoPlanilha;
  }

  const difference = expirationDate.getTime() - getStartOfDay(referenceDate).getTime();
  return Math.round(difference / DAY_IN_MS);
}

export function getExpiryBand(daysToExpiry: number | null): Exclude<ExpiryBand, "all"> {
  if (daysToExpiry === null) {
    return "no_date";
  }

  if (daysToExpiry < 0) {
    return "expired";
  }

  if (daysToExpiry === 0) {
    return "today";
  }

  if (daysToExpiry <= 7) {
    return "up_to_7";
  }

  if (daysToExpiry <= 30) {
    return "up_to_30";
  }

  if (daysToExpiry <= 60) {
    return "up_to_60";
  }

  if (daysToExpiry <= 90) {
    return "up_to_90";
  }

  return "over_90";
}

export function getDueSituation(daysToExpiry: number | null) {
  if (daysToExpiry === null) {
    return "Sem data de vencimento";
  }

  if (daysToExpiry < 0) {
    const absoluteDays = Math.abs(daysToExpiry);
    return absoluteDays === 1 ? "Vencido há 1 dia" : `Vencido há ${absoluteDays} dias`;
  }

  if (daysToExpiry === 0) {
    return "Vence hoje";
  }

  if (daysToExpiry === 1) {
    return "Vence amanhã";
  }

  return `Vence em ${daysToExpiry} dias`;
}

export function getUrgency(daysToExpiry: number | null) {
  if (daysToExpiry === null) {
    return "neutral" as const;
  }

  if (daysToExpiry <= 7) {
    return "critical" as const;
  }

  if (daysToExpiry <= 30) {
    return "warning" as const;
  }

  return "ok" as const;
}

export function toUiContractRecord(
  contract: ContractRecord,
  referenceDate = new Date(),
): UiContractRecord {
  const daysToExpiry = getDaysToExpiry(contract, referenceDate);

  return {
    ...contract,
    daysToExpiry,
    expiryBand: getExpiryBand(daysToExpiry),
    dueSituation: getDueSituation(daysToExpiry),
    urgency: getUrgency(daysToExpiry),
  };
}

function matchesTextContains(fieldValue: string | null, filterValue: string) {
  const normalizedFilter = normalizeSearchValue(filterValue.trim());
  if (!normalizedFilter) {
    return true;
  }

  return normalizeSearchValue(fieldValue).includes(normalizedFilter);
}

function matchesValueRange(value: number | null, range: ValueRange) {
  if (range === "all") {
    return true;
  }

  if (value === null) {
    return range === "no_value";
  }

  switch (range) {
    case "up_to_50k":
      return value <= 50_000;
    case "from_50k_to_250k":
      return value > 50_000 && value <= 250_000;
    case "from_250k_to_1m":
      return value > 250_000 && value <= 1_000_000;
    case "above_1m":
      return value > 1_000_000;
    case "no_value":
      return false;
    default:
      return true;
  }
}

function sortNullAware(
  a: string | number | null,
  b: string | number | null,
  direction: "asc" | "desc",
) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  const base =
    typeof a === "number" && typeof b === "number"
      ? a - b
      : String(a).localeCompare(String(b), "pt-BR", {
          numeric: true,
          sensitivity: "base",
        });

  return direction === "asc" ? base : -base;
}

function getSortableValue(record: UiContractRecord, key: SortKey) {
  switch (key) {
    case "valor":
      return record.valor;
    case "dataInicio":
      return parseDateOnly(record.dataInicio)?.getTime() ?? null;
    case "dataVencimento":
      return parseDateOnly(record.dataVencimento)?.getTime() ?? null;
    case "daysToExpiry":
      return record.daysToExpiry;
    default:
      return record[key] ?? null;
  }
}

export function filterAndSortContracts(
  contracts: ContractRecord[],
  filters: FiltersState,
  sortState: SortState,
  referenceDate = new Date(),
) {
  const normalizedSearch = normalizeSearchValue(filters.search.trim());

  const filtered = contracts
    .map((contract) => toUiContractRecord(contract, referenceDate))
    .filter((contract) => {
      if (
        normalizedSearch &&
        !normalizeSearchValue(contract.searchText).includes(normalizedSearch)
      ) {
        return false;
      }

      if (filters.status !== "all" && contract.status !== filters.status) {
        return false;
      }

      if (
        filters.modalidade !== "all" &&
        contract.modalidade !== filters.modalidade
      ) {
        return false;
      }

      if (
        !matchesTextContains(
          contract.empresaContratada,
          filters.empresaContratada,
        )
      ) {
        return false;
      }

      if (!matchesTextContains(contract.gestor, filters.gestor)) {
        return false;
      }

      if (!matchesTextContains(contract.fiscal, filters.fiscal)) {
        return false;
      }

      if (
        filters.expiryBand !== "all" &&
        contract.expiryBand !== filters.expiryBand
      ) {
        return false;
      }

      if (!matchesValueRange(contract.valor, filters.valueRange)) {
        return false;
      }

      if (filters.pendingData === "missing" && !contract.hasMissingData) {
        return false;
      }

      if (filters.pendingData === "complete" && contract.hasMissingData) {
        return false;
      }

      return true;
    });

  return filtered.sort((left, right) =>
    sortNullAware(
      getSortableValue(left, sortState.key),
      getSortableValue(right, sortState.key),
      sortState.direction,
    ),
  );
}

export function paginateContracts<T>(records: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    page: safePage,
    totalPages,
    items: records.slice(startIndex, startIndex + pageSize),
  };
}

function uniqueSorted(values: Array<string | null>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
    .sort((left, right) =>
      left.localeCompare(right, "pt-BR", { sensitivity: "base" }),
    );
}

export function collectFilterOptions(contracts: ContractRecord[]) {
  return {
    statuses: uniqueSorted(contracts.map((contract) => contract.status)),
    modalidades: uniqueSorted(contracts.map((contract) => contract.modalidade)),
    empresas: uniqueSorted(
      contracts.map((contract) => contract.empresaContratada),
    ),
    gestores: uniqueSorted(contracts.map((contract) => contract.gestor)),
    fiscais: uniqueSorted(contracts.map((contract) => contract.fiscal)),
  };
}

export function buildMetrics(records: UiContractRecord[]) {
  return {
    totalContracts: records.length,
    totalValue: records.reduce((sum, record) => sum + (record.valor ?? 0), 0),
    activeContracts: records.filter((record) => record.status === "Ativo").length,
    expiredContracts: records.filter((record) => record.expiryBand === "expired")
      .length,
    upcomingContracts: records.filter((record) =>
      ["today", "up_to_7", "up_to_30"].includes(record.expiryBand),
    ).length,
    incompleteContracts: records.filter((record) => record.hasMissingData).length,
  };
}

export function getStatusTone(status: string | null) {
  switch (status) {
    case "Vencido":
      return "danger" as const;
    case "Vence em breve":
    case "Atenção":
      return "warning" as const;
    case "Ativo":
      return "success" as const;
    case "Fracassado":
    case "Não Assinou":
      return "danger" as const;
    case "Licitando":
    case "Aguardando":
    case "Em Andamento":
    case "Publicado":
    case "Suspenso":
    case "Indefinido":
      return "brand" as const;
    default:
      return "neutral" as const;
  }
}

export function getUrgencyClasses(urgency: UiContractRecord["urgency"]) {
  switch (urgency) {
    case "critical":
      return "text-[var(--danger)]";
    case "warning":
      return "text-[var(--warning)]";
    case "ok":
      return "text-[var(--success)]";
    default:
      return "text-[var(--muted)]";
  }
}

export function buildChartData(records: UiContractRecord[]) {
  const statusCounts = new Map<string, number>();
  const modalityCounts = new Map<string, number>();
  const expiryCounts = new Map<string, number>();
  const companyCounts = new Map<string, number>();
  const companyValues = new Map<string, number>();

  for (const record of records) {
    const statusKey = record.status ?? "Não informado";
    statusCounts.set(statusKey, (statusCounts.get(statusKey) ?? 0) + 1);

    const modalityKey = record.modalidade ?? "Não informado";
    modalityCounts.set(modalityKey, (modalityCounts.get(modalityKey) ?? 0) + 1);

    if (record.expiryBand !== "no_date") {
      const expiryLabel = EXPIRY_BAND_LABELS[record.expiryBand];
      expiryCounts.set(expiryLabel, (expiryCounts.get(expiryLabel) ?? 0) + 1);
    }

    const companyKey = record.empresaContratada ?? "Não informado";
    companyCounts.set(companyKey, (companyCounts.get(companyKey) ?? 0) + 1);

    if (record.valor !== null) {
      companyValues.set(
        companyKey,
        (companyValues.get(companyKey) ?? 0) + record.valor,
      );
    }
  }

  const byCountSorter = (left: [string, number], right: [string, number]) =>
    right[1] - left[1] || left[0].localeCompare(right[0], "pt-BR");

  const expiryOrder = [
    "Vencidos",
    "Vencem hoje",
    "Até 7 dias",
    "Até 30 dias",
    "Até 60 dias",
    "Até 90 dias",
    "Acima de 90 dias",
  ];

  return {
    statusChart: [...statusCounts.entries()]
      .sort(byCountSorter)
      .map(([name, value]) => ({ name, value })),
    modalityChart: [...modalityCounts.entries()]
      .sort(byCountSorter)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value })),
    expiryChart: expiryOrder.map((label) => ({
      name: label,
      value: expiryCounts.get(label) ?? 0,
    })),
    companyCountChart: [...companyCounts.entries()]
      .sort(byCountSorter)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value })),
    companyValueChart: [...companyValues.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value })),
  };
}

export function getActiveFilterCount(filters: FiltersState) {
  let count = 0;

  for (const [key, value] of Object.entries(filters)) {
    const defaultValue = DEFAULT_FILTERS[key as keyof FiltersState];
    if (value !== defaultValue && value !== "") {
      count += 1;
    }
  }

  return count;
}
