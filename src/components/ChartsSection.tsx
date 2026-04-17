import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../utils/format";

type ChartRow = {
  name: string;
  value: number;
};

type ChartsSectionProps = {
  statusChart: ChartRow[];
  modalityChart: ChartRow[];
  expiryChart: ChartRow[];
  companyCountChart: ChartRow[];
  companyValueChart: ChartRow[];
};

const PIE_COLORS = [
  "#164978",
  "#0f3352",
  "#3a6f9f",
  "#7c95ad",
  "#c99345",
  "#17603a",
  "#b42318",
  "#607284",
];

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <article className="panel p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
      </div>
      <div className="h-72 w-full min-w-0">{children}</div>
    </article>
  );
}

const commonAxisProps = {
  stroke: "#7f8c99",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

function toChartNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function ChartsSection({
  statusChart,
  modalityChart,
  expiryChart,
  companyCountChart,
  companyValueChart,
}: ChartsSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="section-title">Gráficos</h2>
        <p className="section-subtitle">
          Distribuição por status, modalidade, vencimento e concentração por
          empresa.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Contratos por status"
          subtitle="Leitura do status cadastrado na planilha."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusChart}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={108}
                paddingAngle={3}
              >
                {statusChart.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  const numericValue = toChartNumber(value);
                  return [
                    `${numericValue} contrato${numericValue === 1 ? "" : "s"}`,
                    "Quantidade",
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Contratos por modalidade"
          subtitle="Top modalidades com maior incidência."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={modalityChart}
              layout="vertical"
              margin={{ top: 8, right: 20, bottom: 0, left: 20 }}
            >
              <CartesianGrid stroke="rgba(96,114,132,0.16)" horizontal={false} />
              <XAxis type="number" {...commonAxisProps} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                {...commonAxisProps}
              />
              <Tooltip
                formatter={(value) => {
                  const numericValue = toChartNumber(value);
                  return [
                    `${numericValue} contrato${numericValue === 1 ? "" : "s"}`,
                    "Quantidade",
                  ];
                }}
              />
              <Bar
                dataKey="value"
                radius={[0, 8, 8, 0]}
                fill="#164978"
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Vencimentos por período"
          subtitle="Criticidade organizada por faixa de vencimento."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={expiryChart}
              margin={{ top: 8, right: 20, left: 0, bottom: 12 }}
            >
              <CartesianGrid stroke="rgba(96,114,132,0.16)" vertical={false} />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-18}
                textAnchor="end"
                height={56}
                {...commonAxisProps}
              />
              <YAxis {...commonAxisProps} />
              <Tooltip
                formatter={(value) => {
                  const numericValue = toChartNumber(value);
                  return [
                    `${numericValue} contrato${numericValue === 1 ? "" : "s"}`,
                    "Quantidade",
                  ];
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#c99345" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Empresas com mais contratos"
          subtitle="Concentração por quantidade de registros."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={companyCountChart}
              layout="vertical"
              margin={{ top: 8, right: 20, bottom: 0, left: 20 }}
            >
              <CartesianGrid stroke="rgba(96,114,132,0.16)" horizontal={false} />
              <XAxis type="number" {...commonAxisProps} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                {...commonAxisProps}
              />
              <Tooltip
                formatter={(value) => {
                  const numericValue = toChartNumber(value);
                  return [
                    `${numericValue} contrato${numericValue === 1 ? "" : "s"}`,
                    "Quantidade",
                  ];
                }}
              />
              <Bar
                dataKey="value"
                radius={[0, 8, 8, 0]}
                fill="#607284"
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="xl:col-span-2">
          <ChartCard
            title="Empresas com maior valor contratado"
            subtitle="Soma dos valores numéricos informados por empresa."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={companyValueChart}
                layout="vertical"
                margin={{ top: 8, right: 20, bottom: 0, left: 20 }}
              >
                <CartesianGrid stroke="rgba(96,114,132,0.16)" horizontal={false} />
                <XAxis
                  type="number"
                  {...commonAxisProps}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(value)
                  }
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={160}
                  {...commonAxisProps}
                />
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(toChartNumber(value)),
                    "Valor",
                  ]}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 8, 8, 0]}
                  fill="#17603a"
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
}

export { ChartsSection };
export default ChartsSection;
