import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TaskStatusSlice } from "../../../data/workspace-dashboard";
import { useChartTheme } from "../../../lib/chart-theme";
import EmptyStatePanel from "../../ui/empty-state-panel";
import { Text, Title } from "../../ui/typography";

type TaskStatusChartProps = {
  data: TaskStatusSlice[];
};

function TaskStatusChart({ data }: TaskStatusChartProps) {
  const totalTasks = useMemo(() => data.reduce((sum, item) => sum + item.count, 0), [data]);
  const chart = useChartTheme();
  const hasData = totalTasks > 0 && data.length > 0;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <Title level={5} color="default">Task Status</Title>

      {!hasData ? (
        <EmptyStatePanel
          className="mt-4"
          compact
          description="No tasks yet. Status breakdown will appear once work is created."
        />
      ) : (
        <>
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
                    border: `1px solid ${chart.tooltipBorder}`,
                    backgroundColor: chart.tooltipBg,
                    color: chart.axis,
                    boxShadow: chart.tooltipShadow,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <Text as="p" weight="bold" className="text-3xl">{totalTasks}</Text>
              <Text as="p" size="xs" weight="medium" color="muted">Tasks</Text>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {data.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <Text as="span" size="sm" color="muted" className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </Text>
                <Text as="span" size="sm" weight="semibold">{item.count}</Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

export default React.memo(TaskStatusChart);
