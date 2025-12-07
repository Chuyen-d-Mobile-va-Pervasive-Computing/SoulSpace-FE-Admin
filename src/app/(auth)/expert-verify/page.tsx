"use client";

import { useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import type { Expert } from "./components/columns";

import { getAllExperts } from "@/lib/api";
import { toast } from "sonner";

export default function Page() {
  const [data, setData] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await getAllExperts();

        console.log("EXPERT API RESPONSE:", res);

        setData(res.experts || []);
      } catch (err: any) {
        console.error("❌ Failed to load experts:", err);
        setError(err.message || "Failed to load experts");
        toast.error(err.message || "Failed to load experts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperts();
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
