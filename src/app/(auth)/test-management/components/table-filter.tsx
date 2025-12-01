"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface TableFilterProps<TData> {
  table: Table<TData>;
}

export function TableFilter<TData>({ table }: TableFilterProps<TData>) {
  return (
    <div>
      <Input
        placeholder="Search tests..."
        className="w-[300px] bg-white"
        onChange={(e) => table.setGlobalFilter(e.target.value)}
      />
    </div>
  );
}
