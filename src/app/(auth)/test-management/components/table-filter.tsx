"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";

interface TableFilterProps<TData> {
  table: Table<TData>;
}

export function TableFilter<TData>({ table }: TableFilterProps<TData>) {
  return (
    <div className="relative inline-flex flex-row">
      <Input
        placeholder="Search tests..."
        className="w-[300px] bg-white pr-8"
        onChange={(e) => table.setGlobalFilter(e.target.value)}
      />
      <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
    </div>
  );
}
