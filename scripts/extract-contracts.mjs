import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import XLSX from "xlsx";

const REQUIRED_SHEET = "CONTRATOS";
const OUTPUT_FILE = path.resolve(process.cwd(), "src/data/contracts.json");

const CANDIDATE_SOURCES = [
  process.env.CONTRACTS_SOURCE,
  path.resolve(process.cwd(), "CONTRATOS.xlsx"),
  path.resolve(process.cwd(), "../CONTRATOS.xlsx"),
  path.resolve(process.cwd(), "../Downloads/CONTRATOS.xlsx"),
  "C:/Users/user/Downloads/CONTRATOS.xlsx",
].filter(Boolean);

const PRIORITY_FIELD_LABELS = {
  modalidade: "Modalidade",
  numeroModalidade: "Nº Modalidade",
  objeto: "Objeto",
  processo: "Processo",
  contrato: "Contrato",
  empresaContratada: "Empresa Contratada",
  valor: "Valor",
  dataInicio: "Data Início",
  dataVencimento: "Data Vencimento",
  status: "Status",
  gestor: "Gestor",
  fiscal: "Fiscal",
};

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveSourceFile() {
  for (const candidate of CANDIDATE_SOURCES) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `Planilha CONTRATOS.xlsx não encontrada. Verifique um destes caminhos: ${CANDIDATE_SOURCES.join(
      ", ",
    )}`,
  );
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const cleaned = String(value)
    .replace(/\s+/g, " ")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
}

function normalizeCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return Number(value);
  }

  const text = String(value)
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeDate(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      const year = parsed.y;
      const month = `${parsed.m}`.padStart(2, "0");
      const day = `${parsed.d}`.padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }

  const text = normalizeText(value);
  if (!text) {
    return null;
  }

  const brazilianMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brazilianMatch) {
    const [, day, month, year] = brazilianMatch;
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.valueOf())) {
    const year = parsed.getFullYear();
    const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
    const day = `${parsed.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return null;
}

function normalizeInteger(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

function buildMissingFields(contract) {
  const missingFields = [];

  for (const [field, label] of Object.entries(PRIORITY_FIELD_LABELS)) {
    const isValueField =
      field === "valor" &&
      contract.valor === null &&
      contract.valorDescricao === null;

    if (field === "valor") {
      if (isValueField) {
        missingFields.push(label);
      }
      continue;
    }

    if (contract[field] === null) {
      missingFields.push(label);
    }
  }

  return missingFields;
}

function buildSearchText(contract) {
  return [
    contract.id,
    contract.modalidade,
    contract.numeroModalidade,
    contract.objeto,
    contract.processo,
    contract.contrato,
    contract.empresaContratada,
    contract.valorDescricao,
    contract.status,
    contract.gestor,
    contract.fiscal,
    contract.observacoes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("pt-BR");
}

function normalizeContractRow(row, index) {
  const contract = {
    id: normalizeText(row.ID) ?? `registro-${index + 1}`,
    sourceIndex: index + 2,
    modalidade: normalizeText(row.Modalidade),
    numeroModalidade: normalizeText(row["Nº Modalidade"]),
    objeto: normalizeText(row.Objeto),
    processo: normalizeText(row.Processo),
    contrato: normalizeText(row.Contrato),
    empresaContratada: normalizeText(row["Empresa Contratada"]),
    valor: normalizeCurrency(row["Valor (R$)"]),
    valorDescricao: normalizeText(row["Valor (Descrição)"]),
    dataInicio: normalizeDate(row["Data Início"]),
    dataVencimento: normalizeDate(row["Data Vencimento"]),
    diasParaVencimentoPlanilha: normalizeInteger(row["Dias p/ Vencimento"]),
    status: normalizeText(row.Status),
    gestor: normalizeText(row.Gestor),
    fiscal: normalizeText(row.Fiscal),
    observacoes: normalizeText(row["Observações"]),
  };

  const missingFields = buildMissingFields(contract);

  return {
    ...contract,
    missingFields,
    missingCount: missingFields.length,
    hasMissingData: missingFields.length > 0,
    searchText: buildSearchText(contract),
  };
}

async function main() {
  const sourceFile = await resolveSourceFile();
  const workbook = XLSX.readFile(sourceFile, {
    cellDates: true,
    raw: true,
  });

  const sheet = workbook.Sheets[REQUIRED_SHEET];
  if (!sheet) {
    throw new Error(`A aba obrigatória "${REQUIRED_SHEET}" não foi encontrada.`);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    raw: true,
    blankrows: false,
  });

  const normalizedRows = rows.map(normalizeContractRow);

  await fs.writeFile(
    OUTPUT_FILE,
    `${JSON.stringify(normalizedRows, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `Arquivo gerado com ${normalizedRows.length} contratos em ${OUTPUT_FILE}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
