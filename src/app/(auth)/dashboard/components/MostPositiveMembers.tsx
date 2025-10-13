"use client";

import { useMemo } from "react";

const data = [
  { rank: 1, name: "PLuynhhhh", value: 44 },
  { rank: 2, name: "phanGiang293", value: 28 },
  { rank: 3, name: "yangLuynh", value: 26 },
];

export default function MostPositiveMembers() {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value)), []);

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-5 text-gray-800 dark:text-gray-100">
        Most Positive Members
      </h2>

      <div className="flex flex-col gap-6">
        {data.map((item) => {
          const width = (item.value / maxValue) * 100;
          return (
            <div key={item.rank} className="w-full">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                TOP {item.rank} - {item.name}
              </p>

              <div className="relative w-full h-3 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-3 bg-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${width}%` }}
                />
              </div>

              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1 text-right">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
