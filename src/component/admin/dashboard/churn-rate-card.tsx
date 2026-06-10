import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { CHURN_RATE } from "../../../data/admin-dashboard";

function ChurnRateCard() {
  const data = [
    { name: "churn", value: CHURN_RATE.value },
    { name: "retained", value: 100 - CHURN_RATE.value },
  ];

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center justify-center lg:w-44">
          <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#4f46e5" />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-foreground">{CHURN_RATE.value}%</p>
              <p className="text-xs font-medium text-muted">{CHURN_RATE.label}</p>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 border-t border-border pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <h3 className="text-lg font-semibold text-foreground">Churn Rate</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{CHURN_RATE.helperText}</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="rounded-xl bg-indigo-50 px-4 py-3">
              <p className="text-xs font-medium text-muted">Retained</p>
              <p className="mt-0.5 text-lg font-bold text-foreground">{100 - CHURN_RATE.value}%</p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-4 py-3">
              <p className="text-xs font-medium text-muted">vs last month</p>
              <p className="mt-0.5 text-lg font-bold text-emerald-600">-0.3%</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default React.memo(ChurnRateCard);
