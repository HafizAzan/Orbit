import { Select } from "antd";
import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SubscriptionRevenuePoint } from "../../../data/admin-subscriptions";
import { formatCurrency, formatCurrencyCompact } from "../../../lib/helper";
import { Paragraph, Title } from "../../ui/typography";

type RevenueOverviewChartProps = {
  data: SubscriptionRevenuePoint[];
};

function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
  const currentMonthIndex = data.length - 1;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Title level={5} color="default">Revenue Overview</Title>
          <Paragraph size="sm" className="mt-0.5 mb-0!">Monthly subscription revenue across all plans</Paragraph>
        </div>
        <Select
          defaultValue="12m"
          options={[
            { value: "12m", label: "Last 12 Months" },
            { value: "6m", label: "Last 6 Months" },
            { value: "30d", label: "Last 30 Days" },
          ]}
          className="min-w-36"
        />
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(value) => formatCurrencyCompact(Number(value))}
              width={48}
            />
            <Tooltip
              cursor={{ fill: "rgba(79, 70, 229, 0.06)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              }}
              formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.month}
                  fill={index === currentMonthIndex ? "#4f46e5" : "#c7d2fe"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export default React.memo(RevenueOverviewChart);
