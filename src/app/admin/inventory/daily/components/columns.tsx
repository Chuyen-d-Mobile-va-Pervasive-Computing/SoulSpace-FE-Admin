"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import UpdateInventory from "./UpdateInventory";

export interface Category {
  mon_an_id: string;
  ten_mon_an: string;
  loai_ton_kho: string;
  so_luong_dau_ngay: string;
  so_luong_da_ban: string;
  so_luong_con_lai: string;
  action: string;
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "mon_an_id",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          ID
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("mon_an_id")}</div>,
  },
  {
    accessorKey: "ten_mon_an",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Tên món ăn
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("ten_mon_an")}</div>,
  },
  {
    accessorKey: "loai_ton_kho",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Loại tồn kho
        </Button>
      );
    },
    cell: ({ row }) => {
      const loai_ton_kho = row.getValue("loai_ton_kho") as string;

      return (
        <Badge variant={loai_ton_kho === "Reset" ? "active" : "inactive"}>
          {loai_ton_kho}
        </Badge>
      );
    },
  },
  {
    accessorKey: "so_luong_dau_ngay",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Số lượng đầu ngày
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("so_luong_dau_ngay")}</div>,
  },
  {
    accessorKey: "so_luong_da_ban",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Số lượng đã bán
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("so_luong_da_ban")}</div>,
  },
  {
    accessorKey: "so_luong_con_lai",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Số lượng còn lại
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("so_luong_con_lai")}</div>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row, table }) => {
      const [open, setOpen] = useState(false);
      const [openSuspend, setOpenSuspend] = useState(false);
      const [openUpdate, setOpenUpdate] = useState(false);

      // Lấy refetch và selectedDate từ meta
      const refetch = table.options.meta?.refetch;
      const selectedDate = table.options.meta?.selectedDate;

      // So sánh ngày được chọn với hôm nay
      const today = new Date().toISOString().split("T")[0];
      const isPast = selectedDate && selectedDate < today;

      // Nếu là ngày cũ thì ẩn Action
      if (isPast) {
        return null;
      }

      return (
        <div className="flex items-center gap-2">
          {/* Pencil → mở ShiftDialog */}
          <Pencil
            color="#1E40AF"
            className="cursor-pointer"
            onClick={() => setOpenUpdate(true)}
          />

          <UpdateInventory
            open={openUpdate}
            setOpen={setOpenUpdate}
            monAn={{
              mon_an_id: Number(row.original.mon_an_id),
              ten_mon_an: row.original.ten_mon_an,
              so_luong_dau_ngay: row.original.so_luong_dau_ngay
                ? Number(row.original.so_luong_dau_ngay)
                : undefined,
            }}
            selectedDate={selectedDate ?? ""}
            refetch={refetch}
          />
        </div>
      );
    },
  },
];
