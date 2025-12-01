"use client";

import { useEffect, useState } from "react";
import { columns } from "./components/columns";
import { experts } from "./data/expert-data";
import { DataTable } from "./components/data-table";
import type { Expert } from "./components/columns";

export default function Page() {
  const [data, setData] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      setTimeout(() => {
        setData(experts);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to load experts");
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="p-1">
      <h1 className="text-xl font-semibold mb-4">Expert Verify</h1>
      <div className="bg-white p-4 rounded-2xl">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
