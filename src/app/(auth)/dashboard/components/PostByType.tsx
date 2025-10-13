"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Science", value: 200, color: "#14b8a6" },
  { name: "Technology", value: 600, color: "#8b5cf6" },
  { name: "Finance", value: 450, color: "#3b82f6" },
  { name: "Politics", value: 350, color: "#f59e0b" },
  { name: "Review", value: 900, color: "#4338ca" },
  { name: "Analysis", value: 250, color: "#ef4444" },
];

export default function PostsByType() {
  return (
    <div className="w-full h-[350px] bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Posts by Type
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
