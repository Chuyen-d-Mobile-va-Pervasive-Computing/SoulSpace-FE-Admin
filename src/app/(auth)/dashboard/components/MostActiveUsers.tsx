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
  { name: "PLuynhhhh", posts: 632, reactions: 814 },
  { name: "yanggg", posts: 752, reactions: 914 },
  { name: "hehe", posts: 752, reactions: 914 },
];

export default function MostActiveUsers() {
  return (
    <div className="w-full h-[350px] bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Most Active Users
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 13, fill: "#6b7280" }}
            width={100}
          />
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={10}
          />
          <Bar
            dataKey="posts"
            fill="#3b82f6"
            name="post"
            barSize={14}
            radius={[4, 4, 4, 4]}
          />
          <Bar
            dataKey="reactions"
            fill="#06b6d4"
            name="reactions"
            barSize={14}
            radius={[4, 4, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
