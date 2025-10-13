"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 59 },
  { name: "March", value: 80 },
  { name: "April", value: 81 },
  { name: "May", value: 56 },
  { name: "June", value: 55 },
  { name: "July", value: 70 },
  { name: "August", value: 75 },
  { name: "September", value: 60 },
  { name: "October", value: 90 },
  { name: "November", value: 85 },
  { name: "December", value: 95 },
];

export default function LineGraph() {
  return (
    <div className="w-full h-[350px] bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Engagement Rate
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="name"
            tick={{ fill: "#6b7280", fontSize: 11 }} // 👈 nhỏ lại ở đây
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />

          <Tooltip formatter={(value: number) => `${value}%`} />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5, fill: "#3b82f6" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
