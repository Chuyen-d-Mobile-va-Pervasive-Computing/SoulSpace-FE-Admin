"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { ExpertPost } from "./components/columns";
import { posts } from "./data/expert-data";

export default function Page() {
  const [data, setData] = useState<ExpertPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Sử dụng dữ liệu mock từ expert-data
    setData(posts);
    setIsLoading(false);
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
