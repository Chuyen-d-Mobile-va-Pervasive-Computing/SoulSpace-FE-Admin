"use client";

import { useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import type { Test } from "./components/columns";
import { getAllTests } from "@/lib/api";

export default function Page() {
  const [data, setData] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);

        const res = await getAllTests();

        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load tests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="p-1">
      <h1 className="text-xl font-semibold mb-4">Test Management</h1>
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
