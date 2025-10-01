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
import { Search, FileText } from "lucide-react";
import { DataTablePagination } from "./data-pagination";
import { TableFilter } from "./table-filter";

interface DataTableProps<TData extends object, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  error: string | undefined;
  refetch: () => void;
}

export function DataTable<TData extends object, TValue>({
  columns,
  data,
  isLoading,
  error,
  refetch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
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
    onGlobalFilterChange: setGlobalFilter, // Cập nhật giá trị tìm kiếm
    state: {
      sorting,
      columnFilters,
      globalFilter, // Thêm state này vào bảng
    },
    meta: { refetch },
  });

  return (
    <div>
      <div className="w-full px-7 py-5 bg-white rounded-[10px] inline-flex flex-col justify-start items-start gap-2 overflow-hidden">
        <div className="inline-flex justify-start items-center gap-5">
          <FileText color="#1E40AF" strokeWidth={2.75} />
          <p className="text-blue-800 text-xl font-bold font-['Inter']">
            Đơn hàng chờ thanh toán
          </p>
        </div>
        <div className="w-full bg-white flex items-center justify-between border border-white rounded-[10px] h-[60px]">
          <div className="flex justify-end items-center h-full">
            <div className="relative h-full flex items-center">
              <TableFilter table={table} />
              <Search className="absolute right-2 top-2/5 transform -translate-y-1 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white p-3 mt-[20px] rounded-[10px]">
        <div className="rounded-md">
          {isLoading ? (
            <div className="flex items-center justify-center">Loading...</div>
          ) : error ? (
            <div className="flex items-center justify-center">
              Error: {error}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#F3F4F6]">
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
      </div>
      {table.getRowModel().rows?.length > 0 && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}