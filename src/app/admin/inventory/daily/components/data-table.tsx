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
import { useRouter, usePathname } from "next/navigation";
import { DataTablePagination } from "./data-pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlusCircle, Receipt } from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
// Extend TableMeta to include selectedDate and setSelectedDate
declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    selectedDate?: string;
    setSelectedDate?: (date: string) => void;
    refetch?: () => void;
  }
}

interface DataTableProps<TData extends object, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  error: string | undefined;
  selectedDate?: string;
  setSelectedDate?: (date: string) => void;
  weekDates?: string[];
  refetch?: () => void;
}

export function DataTable<TData extends object, TValue>(
  props: DataTableProps<TData, TValue> & {
    onPrev?: () => void;
    onNext?: () => void;
    onToday?: () => void;
  }
) {
  const {
    columns,
    data,
    isLoading,
    error,
    weekDates,
    selectedDate,
    setSelectedDate,
    refetch,
    onPrev,
    onNext,
    onToday,
  } = props;
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
    filterFns: { global: globalFilterFn },
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    meta: {
      selectedDate,
      setSelectedDate,
      refetch,
    },
  });

  return (
    <div>
      {/* Khối tiêu đề + nút chuyển tuần */}
      <div className="w-full px-7 py-5 bg-white rounded-[10px] flex flex-col gap-5 mb-[20px]">
        <div className="flex justify-between items-center ml-[30px] mr-[30px]">
          {/* Bên trái: tiêu đề */}
          <div className="inline-flex justify-start items-center gap-5">
            <Receipt color="#1E40AF" strokeWidth={2.75} />
            <p className="text-blue-800 text-xl font-bold font-['Inter']">
              Tồn kho ngày
            </p>
          </div>

          {/* Bên phải: nút tuần */}
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={onPrev}
              className="bg-blue-700 hover:bg-blue-800"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="default"
              onClick={onNext}
              className="bg-blue-700 hover:bg-blue-800"
            >
              <ChevronRight />
            </Button>
            <Button
              variant="default"
              onClick={onToday}
              className="bg-blue-700 hover:bg-blue-800"
            >
              Hôm nay
            </Button>
          </div>
        </div>

        {/* Danh sách ngày trong tuần */}
        {/* Danh sách ngày trong tuần */}
        <div className="flex gap-2 mt-2 ml-[30px]">
          {weekDates?.map((date) => {
            const d = parseISO(date);
            const weekday = format(d, "EEE", { locale: vi }); // T2, T3...
            const dayNum = format(d, "dd/MM"); // 16/09
            const isSelected = selectedDate === date;

            // Kiểm tra ngày trước hôm nay
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = d < today;

            return (
              <Button
                key={date}
                variant={isSelected ? "default" : "outline"}
                onClick={() => setSelectedDate && setSelectedDate(date)}
                className={`flex flex-row items-center gap-1 px-4 py-3 whitespace-nowrap
          ${isSelected ? "bg-blue-700 text-white" : ""}
          ${!isSelected && isPast ? "bg-gray-200 text-gray-500 hover:bg-gray-300" : ""}
        `}
              >
                <span className="text-sm font-medium">{weekday}</span>
                <span className="text-base font-semibold">{dayNum}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="w-full bg-white flex items-center justify-between border border-white rounded-[10px] p-4">
        {isLoading ? (
          <div className="flex items-center justify-center">Loading...</div>
        ) : error ? (
          <div className="flex items-center justify-center">Error: {error}</div>
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
      {table.getRowModel().rows?.length > 0 && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
