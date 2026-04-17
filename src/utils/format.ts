export function formatText(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "Não informado";
}

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Não informado";
  }

  const parts = value.split("-");
  if (parts.length !== 3) {
    return "Não informado";
  }

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function formatCompactNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR").format(value);
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
