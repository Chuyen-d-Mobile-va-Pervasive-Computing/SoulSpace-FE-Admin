"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "./components/data-table";
import { columns, Report } from "./components/columns";
import { getAllReports } from "@/lib/api";

export default function Page() {
  const [data, setData] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  // 🔥 Đưa fetchReports ra ngoài, dùng useCallback để ổn định reference
  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const reports = await getAllReports();
      setData(reports);
      setError(undefined);
    } catch (err: any) {
      setError("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Gọi 1 lần khi vào trang
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="p-1">
      <h1 className="text-xl font-semibold mb-4">Post Moderation</h1>
      <div className="bg-white p-4 rounded-2xl">
        <DataTable
          columns={columns(fetchReports)}
          data={data}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
