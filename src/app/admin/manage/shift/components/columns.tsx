"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShiftDialog } from "@/components/ui/ShiftDialog";
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

export interface Shift {
  ca_id: string;
  ten_ca: string;
  gio_bat_dau: string;
  gio_ket_thuc: string;
  trang_thai: string;
  action: string;
}

// Extend TableMeta to include refetch
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    refetch?: () => void;
  }
}

export const columns: ColumnDef<Shift>[] = [
  {
    accessorKey: "ca_id",
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
    cell: ({ row }) => <div>{row.getValue("ca_id")}</div>,
  },
  {
    accessorKey: "ten_ca",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Tên ca làm việc
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("ten_ca")}</div>,
  },
  {
    accessorKey: "gio_bat_dau",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Giờ bắt đầu
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("gio_bat_dau")}</div>,
  },
  {
    accessorKey: "gio_ket_thuc",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Giờ kết thúc
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("gio_ket_thuc")}</div>,
  },
  {
    accessorKey: "trang_thai",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Hoạt động
        </Button>
      );
    },
    cell: ({ row }) => {
      const trang_thai = row.getValue("trang_thai") as string;

      return (
        <Badge variant={trang_thai === "Hoạt động" ? "active" : "inactive"}>
          {trang_thai}
        </Badge>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row, table }) => {
      const [open, setOpen] = useState(false);
      const [openSuspend, setOpenSuspend] = useState(false);
      const [openUpdate, setOpenUpdate] = useState(false);
      const caId = row.getValue("ca_id") as string;
      // Lấy refetch từ meta của table
      const refetch = table.options.meta?.refetch;
      const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

      const handleSuspend = async () => {
        try {
          const res = await fetch(`${API_PATH}/api/v1/ca/${caId}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ca_id: caId,
              ten_ca: row.getValue("ten_ca"),
              gio_bat_dau: row.getValue("gio_bat_dau"),
              gio_ket_thuc: row.getValue("gio_ket_thuc"),
              trang_thai: "Tạm ngưng",
            }),
          });

          if (res.ok) {
            toast.success("Ca làm đã được tạm ngưng");
            if (typeof refetch === "function") refetch();
          } else {
            toast.error("Không thể tạm ngưng ca làm");
          }
        } catch (err) {
          toast.error("Lỗi kết nối server");
        } finally {
          setOpenSuspend(false);
        }
      };

      return (
        <>
          <div className="flex items-center gap-2">
            {/* Trash → mở AlertDialog */}
            <AlertDialog open={openSuspend} onOpenChange={setOpenSuspend}>
              <AlertDialogTrigger asChild>
                <Trash
                  color="#EF4444"
                  className="cursor-pointer"
                  onClick={() => setOpenSuspend(true)}
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn có chắc muốn tạm ngưng ca làm này?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Thao tác này sẽ đổi trạng thái ca làm sang{" "}
                    <span className="font-bold text-red-600">Tạm ngưng</span>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSuspend}>
                    Đồng ý
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Pencil → mở ShiftDialog */}
            <Pencil
              color="#1E40AF"
              className="cursor-pointer"
              onClick={() => setOpenUpdate(true)}
            />
          </div>

          {openUpdate && (
            <ShiftDialog
              open={openUpdate}
              onClose={() => setOpenUpdate(false)}
              shift={row.original} // truyền dữ liệu ca làm
              onSuccess={refetch}
            />
          )}
        </>
      );
    },
  },
];
