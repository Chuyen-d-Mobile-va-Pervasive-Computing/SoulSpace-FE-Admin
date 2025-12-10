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
import { CirclePlus, PlusCircle, Search } from "lucide-react";

interface TableFilterProps<TData> {
  table: Table<TData>;
}

export function TableFilter<TData>({ table }: TableFilterProps<TData>) {
  const statusColumn = table.getColumn("status");
  const statusValue = (statusColumn?.getFilterValue() as string) ?? "all";

  return (
    <div className="flex gap-3">
      <div className="relative inline-flex flex-row">
        <Input
          placeholder="Search posts..."
          className="w-[240px] bg-white pr-8"
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
        <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
      </div>

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
        </SelectContent>
      </Select>
    </div>
  );
}
