"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

interface TableFilterProps<TData> {
  table: Table<TData>;
}

export function TableFilter<TData>({ table }: TableFilterProps<TData>) {
  const statusColumn = table.getColumn("status");
  const statusValue = (statusColumn?.getFilterValue() as string) ?? "all";

  return (
    <div className="flex gap-3">
      <Input
        placeholder="Search posts..."
        className="w-[240px] bg-white"
        onChange={(e) => table.setGlobalFilter(e.target.value)}
      />

      <Select
        value={statusValue}
        onValueChange={(value) =>
          statusColumn?.setFilterValue(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="dismissed">Dismissed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
