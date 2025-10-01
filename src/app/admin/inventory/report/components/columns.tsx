"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export interface Inventory {
  mon_an_id: string;
  ten_mon_an: string;
  ten_danh_muc: string;
  so_luong_ban: string;
  so_luong_con_lai: string;
  tong_tien_thu: string;
}

export const columns: ColumnDef<Inventory>[] = [
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
    accessorKey: "ten_danh_muc",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Tên danh mục
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("ten_danh_muc")}</div>,
  },
  {
    accessorKey: "so_luong_ban",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Số lượng bán
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("so_luong_ban")}</div>,
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
    accessorKey: "tong_tien_thu",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Tổng tiền thu
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("tong_tien_thu")}</div>,
  },
];
