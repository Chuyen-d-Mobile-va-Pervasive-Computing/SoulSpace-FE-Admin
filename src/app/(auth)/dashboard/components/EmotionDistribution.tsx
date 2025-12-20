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
import { useEffect, useState } from "react";
import { getEmotionDistribution } from "@/lib/api";

export default function EmotionDistribution() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getEmotionDistribution();

      // map API -> chart format
      const chartData = [
        {
          name: "Emotions",
          positive: res.find((i: any) => i.label === "Positive")?.count || 0,
          neutral: res.find((i: any) => i.label === "Neutral")?.count || 0,
          negative: res.find((i: any) => i.label === "Negative")?.count || 0,
        },
      ];

      setData(chartData);
    }

    load();
  }, []);

  return (
    <div className="w-full h-[350px] bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Emotion Distribution
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis dataKey="name" hide />
          <YAxis />

          <Tooltip />
          <Legend />

          <Bar dataKey="positive" fill="#8b5cf6" />
          <Bar dataKey="neutral" fill="#9ca3af" />
          <Bar dataKey="negative" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
