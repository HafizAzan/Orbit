import { Select } from "antd";
import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { VelocityPoint } from "../../../data/workspace-dashboard";

type TeamVelocityChartProps = {
  data: VelocityPoint[];
};

function TeamVelocityChart({ data }: TeamVelocityChartProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Team Velocity</h3>
          <p className="mt-0.5 text-sm text-muted">Tasks completed over the last 30 days</p>
        </div>
        <Select
          defaultValue="30d"
          options={[
            { value: "30d", label: "Last 30 Days" },
            { value: "14d", label: "Last 14 Days" },
            { value: "7d", label: "Last 7 Days" },
          ]}
          className="min-w-36"
        />
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} width={32} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              }}
              formatter={(value) => [`${value} tasks`, "Completed"]}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="url(#velocityGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export default React.memo(TeamVelocityChart);
