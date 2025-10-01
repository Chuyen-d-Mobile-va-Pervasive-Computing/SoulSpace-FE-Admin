"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export interface Category {
  nhat_ky_ca_id: string;
  ten_thu_ngan: string;
  ngay_lam_viec: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  tong_tien_thu: string;
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "nhat_ky_ca_id",
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
    cell: ({ row }) => <div>{row.getValue("nhat_ky_ca_id")}</div>,
  },
  {
    accessorKey: "ten_thu_ngan",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Tên thu ngân
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("ten_thu_ngan")}</div>,
  },
  {
    accessorKey: "ngay_lam_viec",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Ngày làm việc
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("ngay_lam_viec")}</div>,
  },
  {
    accessorKey: "thoi_gian_bat_dau",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Thời gian bắt đầu
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("thoi_gian_bat_dau")}</div>,
  },
  {
    accessorKey: "thoi_gian_ket_thuc",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Thời gian kết thúc
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("thoi_gian_ket_thuc")}</div>,
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
