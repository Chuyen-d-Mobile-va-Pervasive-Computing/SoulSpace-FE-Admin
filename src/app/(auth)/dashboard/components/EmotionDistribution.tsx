"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Feb", positive: 150, neutral: 100, negative: 200 },
  { month: "Mar", positive: 250, neutral: 150, negative: 300 },
  { month: "Apr", positive: 300, neutral: 200, negative: 500 },
  { month: "May", positive: 350, neutral: 250, negative: 600 },
  { month: "Jun", positive: 270, neutral: 230, negative: 280 },
  { month: "Jul", positive: 220, neutral: 190, negative: 320 },
  { month: "Aug", positive: 250, neutral: 220, negative: 270 },
  { month: "Sep", positive: 300, neutral: 210, negative: 350 },
  { month: "Oct", positive: 270, neutral: 190, negative: 580 },
  { month: "Nov", positive: 310, neutral: 250, negative: 480 },
  { month: "Dec", positive: 260, neutral: 180, negative: 280 },
];

export default function EmotionDistribution() {
  return (
    <div className="w-full h-[350px] bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Emotion Distribution
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Legend
            verticalAlign="top"
            align="center"
            iconType="circle"
            iconSize={10}
          />
          <Bar
            dataKey="positive"
            stackId="a"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
          <Bar dataKey="neutral" stackId="a" fill="#9ca3af" />
          <Bar dataKey="negative" stackId="a" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
