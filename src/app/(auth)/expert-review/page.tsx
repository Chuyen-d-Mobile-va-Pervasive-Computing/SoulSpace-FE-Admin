"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { columns, ExpertArticle } from "./components/columns";
import { getPendingExpertArticles } from "@/lib/api";

export default function Page() {
  const [data, setData] = useState<ExpertArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getPendingExpertArticles();
      setData(res);
    } catch (err) {
      setError("Failed to load expert articles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-1">
      <h1 className="text-xl font-semibold mb-4">Expert Review</h1>
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
