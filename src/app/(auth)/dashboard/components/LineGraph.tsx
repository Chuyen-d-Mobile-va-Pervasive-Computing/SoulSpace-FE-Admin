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
import { useEffect, useState } from "react";
import { getDashboardChart } from "@/lib/api";

interface LineGraphProps {
  period?: "day" | "week" | "month" | "year";
}

export default function LineGraph({ period = "month" }: LineGraphProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getDashboardChart(period);

      // 🔥 FIX Ở ĐÂY
      setData(res.data || []);
    }

    load();
  }, [period]);

  return (
    <div className="w-full h-[350px] bg-white rounded-2xl p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="label"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

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
