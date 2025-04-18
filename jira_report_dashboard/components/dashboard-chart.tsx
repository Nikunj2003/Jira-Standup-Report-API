"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface DashboardChartProps {
  data: Record<string, number>
}

export function DashboardChart({ data }: DashboardChartProps) {
  // Convert the data object to an array format for recharts
  const chartData = Object.entries(data)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // If no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="rounded-full bg-primary/10 p-4 mx-auto mb-4">
            <BarChart className="h-10 w-10 text-primary" />
          </div>
          <p className="text-muted-foreground">No report data available</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <XAxis
          dataKey="date"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          tickMargin={10}
        />
        <Tooltip
          cursor={{ fill: "var(--primary-10)" }}
          contentStyle={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          itemStyle={{ color: "var(--foreground)" }}
          labelStyle={{ color: "var(--foreground)", fontWeight: "bold", marginBottom: "4px" }}
        />
        <Bar
          dataKey="count"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
          animationDuration={1000}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
