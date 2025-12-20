"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getPostsByTopic } from "@/lib/api";

const COLORS = [
  "#14b8a6",
  "#8b5cf6",
  "#3b82f6",
  "#f59e0b",
  "#4338ca",
  "#ef4444",
  "#22c55e",
  "#06b6d4",
  "#a855f7",
  "#f97316",
];

export default function PostsByTopic() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getPostsByTopic();

      const chartData = res.map((item: any, index: number) => ({
        name: item.topic,
        value: item.count,
        color: COLORS[index % COLORS.length],
      }));

      setData(chartData);
    }

    load();
  }, []);

  return (
    <div className="w-full h-[350px] bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Posts by Topic
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
