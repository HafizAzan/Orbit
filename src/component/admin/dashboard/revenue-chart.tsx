import { Select } from "antd";
import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { RevenueDataPoint } from "../../../data/admin-dashboard";
import { formatCurrency, formatCurrencyCompact } from "../../../lib/helper";

type RevenueChartProps = {
  data: RevenueDataPoint[];
};

function RevenueChart({ data }: RevenueChartProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Growth</h3>
          <p className="mt-0.5 text-sm text-muted">Monthly recurring revenue across all organizations</p>
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
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
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
            <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export default React.memo(RevenueChart);
