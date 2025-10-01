"use client";
import React from "react";
import { useState, useEffect } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { toast } from "sonner";
export default function page() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

  const fetchData = () => {
    setIsLoading(true);
    fetch(`${API_PATH}/api/v1/ca/`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error}
        refetch={fetchData}
      />
    </div>
  );
}
