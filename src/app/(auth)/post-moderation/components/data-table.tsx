"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  filterFns,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CirclePlus, PlusCircle, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { DataTablePagination } from "./data-pagination";
import { TableFilter } from "./table-filter";
import Link from "next/link";

interface DataTableProps<TData extends object, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  error: string | undefined;
}

export function DataTable<TData extends object, TValue>({
  columns,
  data,
  isLoading,
  error,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const router = useRouter();
  const path = usePathname();

  const [globalFilter, setGlobalFilter] = React.useState("");
  const globalFilterFn = <TData extends object>(
    row: Row<TData>,
    columnId: string,
    filterValue: string
  ) => {
    return Object.values(row.original).some((value) =>
      String(value).toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: { global: globalFilterFn }, // Dùng bộ lọc toàn cục
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter, // Cập nhật giá trị tìm kiếm
    state: {
      sorting,
      columnFilters,
      globalFilter, // Thêm state này vào bảng
    },
  });

  return (
    <div>
      <div className="w-full flex items-center justify-between mb-[20px] mt-[10px] h-[60px]">
        <div className="flex justify-end items-center h-full">
          <div className="relative h-full flex items-center">
            <TableFilter table={table} />
          </div>
        </div>

        <div className="flex justify-start">
          <div className="relative"></div>
        </div>
      </div>
      <div className="rounded-md">
        {isLoading ? (
          <div className="flex items-center justify-center">Loading...</div>
        ) : error ? (
          <div className="flex items-center justify-center">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader className="bg-[#F1F4F9]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      {table.getRowModel().rows?.length > 0 && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
