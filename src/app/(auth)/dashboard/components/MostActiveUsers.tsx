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
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { getMostActiveUsers } from "@/lib/api";

const RANK_COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6"];
const DEFAULT_COLOR = "#94a3b8";

export default function MostActiveUsers() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getMostActiveUsers();

      const chartData = res.map((item: any) => ({
        name: item.username,
        posts: item.count,
      }));

      setData(chartData);
    }

    load();
  }, []);

  return (
    <div className="w-full h-[350px] bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Most Active Users
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <YAxis
            dataKey="name"
            type="category"
            width={120}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 13 }}
          />

          <Tooltip />
          <Legend />

          <Bar
            dataKey="posts"
            name="Interactions"
            barSize={14}
            radius={[0, 4, 4, 0]}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={RANK_COLORS[index] || DEFAULT_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
