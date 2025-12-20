"use client";

import { useEffect, useMemo, useState } from "react";
import { getMostPositiveUsers } from "@/lib/api";

const RANK_COLORS = [
  "linear-gradient(90deg, #f59e0b, #fbbf24)", // 🥇
  "linear-gradient(90deg, #3b82f6, #60a5fa)", // 🥈
  "linear-gradient(90deg, #8b5cf6, #a78bfa)", // 🥉
];

const DEFAULT_COLOR = "linear-gradient(90deg, #94a3b8, #cbd5f5)";

export default function MostPositiveMembers() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getMostPositiveUsers();

      const mapped = res.map((item: any, index: number) => ({
        rank: index + 1,
        name: item.username,
        value: item.count,
      }));

      setData(mapped);
    }

    load();
  }, []);

  const maxValue = useMemo(() => {
    return data.length ? Math.max(...data.map((d) => d.value)) : 1;
  }, [data]);

  return (
    <div className="w-full bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-5 text-gray-800">
        Most Positive Members
      </h2>

      <div className="flex flex-col gap-6">
        {data.map((item) => {
          const width = (item.value / maxValue) * 100;
          const barColor = RANK_COLORS[item.rank - 1] || DEFAULT_COLOR;

          return (
            <div key={item.rank} className="w-full">
              <p className="text-sm font-medium text-gray-700 mb-2">
                TOP {item.rank} - {item.name}
              </p>

              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-3 rounded-full transition-all duration-700"
                  style={{
                    width: `${width}%`,
                    background: barColor,
                  }}
                />
              </div>

              <div className="text-sm font-semibold text-gray-800 mt-1 text-right">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
