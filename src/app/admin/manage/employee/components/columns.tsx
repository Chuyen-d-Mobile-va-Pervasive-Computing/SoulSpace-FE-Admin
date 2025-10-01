"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

export interface Cashier {
  nhan_vien_id: number;
  ho_ten: string;
  so_dien_thoai: string;
  email: string;
  trang_thai: string;
  tong_tien_thu: string;
  chuc_vu?: string;
  username?: string;
}
const roleLabels: Record<string, string> = {
  admin: "Quản lý",
  cashier: "Thu ngân",
};

export const getColumns = (
  onEdit: (cashier: Cashier) => void,
  onDeactivate: (cashier: Cashier) => void
): ColumnDef<Cashier>[] => [
  {
    accessorKey: "nhan_vien_id",
    header: () => <div className="text-left font-semibold">MSNV</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("nhan_vien_id")}</div>,
  },
  {
    accessorKey: "ho_ten",
    header: () => <div className="text-left font-semibold">Họ và tên</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("ho_ten")}</div>,
  },
  {
    accessorKey: "chuc_vu",
    header: "Chức vụ",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const cell = String(row.getValue(columnId) ?? "").trim().toLowerCase();
      const fv = String(filterValue ?? "").trim().toLowerCase();
      return cell.includes(fv);
    },
    cell: ({ row }) => {
      const value = row.getValue("chuc_vu") as string;
      return (
        <div className="text-left">
          {roleLabels[value] || value || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "so_dien_thoai",
    header: () => <div className="text-left font-semibold">Số điện thoại</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("so_dien_thoai")}</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="text-left font-semibold">Email</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "tong_tien_thu",
    header: () => <div className="text-left font-semibold">Tổng tiền thu</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("tong_tien_thu")}</div>,
  },
  {
    accessorKey: "trang_thai",
    header: () => <div className="text-left font-semibold">Tình trạng</div>,
    cell: ({ row }) => {
      const rawStatus = row.getValue("trang_thai") as string;
      let badgeVariant: "active" | "inactive" | "default" = "default";

      if (rawStatus === "Hoạt động") badgeVariant = "active";
      else if (rawStatus === "Thôi việc") badgeVariant = "inactive";

      return <Badge variant={badgeVariant}>{rawStatus}</Badge>;
    },
  },
  {
    id: "action",
    header: () => <div className="text-left font-semibold">Hành động</div>,
    cell: ({ row }) => {
      const cashier = row.original as Cashier;
      return (
        <div className="flex gap-2">
          <button className="cursor-pointer" onClick={() => onEdit(cashier)}>
            <Pencil color="#1E40AF" />
          </button>
          <button className="cursor-pointer" onClick={() => onDeactivate(cashier)}>
            <Trash2 color="#EF4444" />
          </button>
        </div>
      );
    },
  },
];