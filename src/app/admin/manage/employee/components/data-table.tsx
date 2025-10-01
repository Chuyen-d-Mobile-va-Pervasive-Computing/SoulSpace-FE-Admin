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
import { Input } from "@/components/ui/input";
import { PlusCircle, Users, Search} from "lucide-react";
import { DataTablePagination } from "./data-pagination";
import { TableFilter } from "./table-filter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PopupUpdateCashier from "./PopupUpdateCashier";
import { Cashier } from "./columns";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData extends object, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  error: string | undefined;
}

const cashierSchema = z.object({
  ho_ten: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự"),
  chuc_vu: z.string().min(1, "Chức vụ không được bỏ trống"),
  so_dien_thoai: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(11, "Số điện thoại không hợp lệ")
    .nullable()
    .optional(),
  email: z.string().min(1,"Email không hợp lệ"),
});

type CashierFormValues = z.infer<typeof cashierSchema>;

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
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CashierFormValues>({
    resolver: zodResolver(cashierSchema),
  });

  const onSubmit = async (data: CashierFormValues) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_PATH}/api/v1/nhan-vien/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Không thể thêm thu ngân");
      }

      const result = await res.json();
      console.log("Thêm thành công:", result);
      toast.success("Thêm thu ngân thành công")

      reset();
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Thêm thu ngân thất bại");
      alert("Có lỗi xảy ra khi thêm thu ngân");
    } finally {
      setLoading(false);
    }
  };

  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [selectedCashier, setSelectedCashier] = React.useState<Cashier | null>(null);
  const handleOpenUpdate = (cashier: Cashier) => {
    setSelectedCashier(cashier);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedCashier(null);
  };

  const handleUpdated = () => {
    window.location.reload();
  };

  const [selectedRole, setSelectedRole] = React.useState<string>("__all__");
  const roleLabels: Record<string, string> = {
    admin: "Quản lý",
    cashier: "Thu ngân",
  };

  const roles = React.useMemo(() => {
    return Array.from(
      new Set(
        data
          .map((d: any) => d.chuc_vu?.toString().trim())
          .filter(Boolean)
      )
    ) as string[];
  }, [data]);

  React.useEffect(() => {
    const col = table.getColumn("chuc_vu");
    const filter = col?.getFilterValue() as string | undefined;
    setSelectedRole(filter === undefined ? "__all__" : String(filter));
  }, [table.getState().columnFilters]);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    if (value === "__all__") {
      table.getColumn("chuc_vu")?.setFilterValue(undefined);
    } else {
      table.getColumn("chuc_vu")?.setFilterValue(value);
    }
  };

  return (
    <div>
      <div className="w-full px-7 py-5 bg-white rounded-[10px] inline-flex flex-col justify-start items-start gap-2 overflow-hidden">
        <div className="inline-flex justify-start items-center gap-5">
          <Users color="#1E40AF" strokeWidth={2.75} />
            <p className="text-blue-800 text-xl font-bold font-['Inter']">
              Quản lý nhân viên
            </p>
          </div>
          <div className="w-full bg-white flex items-center justify-between border border-white rounded-[10px] h-[60px]">
            <div className="flex justify-end items-center h-full gap-4">
              <div className="relative h-full flex items-center">
                <TableFilter table={table} />
                <Search className="absolute right-2 top-2/5 transform -translate-y-1 text-gray-500" />
              </div>
              <div className="relative h-full flex items-center">
                <Select value={selectedRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Tất cả chức vụ</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabels[role] || role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="relative">
                <Button
                  className="h-[40px] bg-[#16A34A] hover:bg-[#16A34A]/80 cursor-pointer flex items-center gap-2"
                  onClick={() => setOpen(true)}
                >
                  <PlusCircle className="w-4 h-4" />
                  Thêm thu ngân
                </Button>
              </div>
            </div>
          </div>
      </div>
      <div className="rounded-md bg-white p-3 mt-[20px] rounded-[10px]">
        {isLoading ? (
          <div className="flex items-center justify-center">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="flex items-center justify-center">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="font-bold bg-[#F3F4F6]"
                      >
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

      {/* Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1E40AF]">Thêm thu ngân</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-rows-2 gap-6">
              <div>
                <label className="font-semibold text-sm">Họ và tên</label>
                <Input className="mt-2" placeholder="Nguyễn Văn A" {...register("ho_ten")} />
                {errors.ho_ten && (
                  <p className="text-red-500 text-sm">
                    {errors.ho_ten.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-sm">Chức vụ</label>
                <Input className="mt-2" placeholder="admin" {...register("chuc_vu")} />
                {errors.chuc_vu && (
                  <p className="text-red-500 text-sm">
                    {errors.chuc_vu.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-rows-2 gap-6">
              <div>
                <label className="font-semibold text-sm">Số điện thoại</label>
                <Input
                  className="mt-2"
                  placeholder="0123456789"
                  {...register("so_dien_thoai", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    },
                  })}
                  inputMode="numeric" 
                  pattern="[0-9]*"
                />
                {errors.so_dien_thoai && (
                  <p className="text-red-500 text-sm">
                    {errors.so_dien_thoai.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-sm">Email</label>
                <Input className="mt-2" placeholder="email@gmail.com" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#16a34a] hover:bg-[#16a34a]/80 text-white cursor-pointer"
              >
                {loading ? "Đang lưu..." : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <PopupUpdateCashier
        open={openUpdate}
        onClose={handleCloseUpdate}
        cashier={selectedCashier}
        onUpdated={handleUpdated}
      />
    </div>
  );
}