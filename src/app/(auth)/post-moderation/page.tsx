"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Report } from "./components/columns";
import { getAllReports } from "@/lib/api";

export default function Page() {
  const [data, setData] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await getAllReports();
        setData(reports);
      } catch (err: any) {
        setError("Failed to load reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-1">
      <h1 className="text-xl font-semibold mb-4">Post Moderation</h1>
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
