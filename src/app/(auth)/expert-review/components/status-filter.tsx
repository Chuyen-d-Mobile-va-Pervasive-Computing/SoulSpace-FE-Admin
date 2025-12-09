"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

interface StatusFilterProps<TData> {
  table: Table<TData>;
}

export function StatusFilter<TData>({ table }: StatusFilterProps<TData>) {
  const handleStatusChange = (value: string) => {
    if (value === "all") {
      table.getColumn("status")?.setFilterValue("");
    } else {
      table.getColumn("status")?.setFilterValue(value);
    }
  };

  return (
    <Select onValueChange={handleStatusChange} defaultValue="all">
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-600"></span>
              Pending
            </span>
          </SelectItem>
          <SelectItem value="approved">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              Approved
            </span>
          </SelectItem>
          <SelectItem value="rejected">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Rejected
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
