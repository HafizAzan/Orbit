import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TaskStatusSlice } from "../../../data/workspace-dashboard";

type TaskStatusChartProps = {
  data: TaskStatusSlice[];
};

function TaskStatusChart({ data }: TaskStatusChartProps) {
  const totalTasks = useMemo(() => data.reduce((sum, item) => sum + item.count, 0), [data]);

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <h3 className="text-lg font-semibold text-foreground">Task Status</h3>

      <div className="relative mx-auto mt-4 h-52 w-full max-w-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="label" innerRadius={58} outerRadius={82} paddingAngle={2} stroke="none">
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-foreground">{totalTasks}</p>
          <p className="text-xs font-medium text-muted">Tasks</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {data.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <span className="font-semibold text-foreground">{item.count}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default React.memo(TaskStatusChart);
