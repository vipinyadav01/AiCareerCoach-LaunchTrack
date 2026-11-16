"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { Panel } from "@/components/app/screen";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  // Formatted after mount so locale dates match between server and client.
  useEffect(() => {
    if (assessments) {
      setChartData(
        assessments.map((assessment) => ({
          date: new Date(assessment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          score: assessment.quizScore,
        }))
      );
    }
  }, [assessments]);

  return (
    <Panel title="Score over time" description="Each point is one quiz, oldest on the left.">
      <div className="h-[280px] text-muted-foreground">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "currentColor", fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-sm">
                    <p className="tabular text-sm font-medium">{Number(payload[0].value).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                  </div>
                ) : null
              }
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
