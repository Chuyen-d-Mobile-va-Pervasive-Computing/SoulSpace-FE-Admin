"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export interface Order {
    don_hang_id: number;
    ho_ten_khach_hang: string;
    thoi_gian_dat: string;
    tong_tien: string;
    trang_thai_don_hang: string;
    so_thu_tu?: number;
    ma_qr?: string;
    so_dien_thoai?: string;
    ten_pham_nhan?: string;
    so_phong_pham_nhan?: string;
    chi_tiet_theo_ngay?: {
        ngay_giao_formatted: string;
        items: {
        ten_mon_an: string;
        so_luong: number;
        thanh_tien: string;
        }[];
    }[];
    trang_thai_thanh_toan?: string;
    thoi_gian_thanh_toan: string;
    thu_ngan?: {
        nhan_vien_id: number;
        ho_ten: string;
    }
}

export const getColumns = (
    onOpen: (order: Order) => void,
): ColumnDef<Order>[] => [
    {
        accessorKey: "so_thu_tu",
        header: () => <div className="text-left font-semibold">STT</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue("so_thu_tu")}</div>,
    },
    {
        accessorKey: "don_hang_id",
        header: () => <div className="text-left font-semibold">MSĐH</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue("don_hang_id")}</div>,
    },
    {
        accessorKey: "ho_ten_khach_hang",
        header: () => <div className="text-left font-semibold">Họ tên khách</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue("ho_ten_khach_hang")}</div>,
    },
    {
        accessorKey: "so_dien_thoai",
        header: () => <div className="text-left font-semibold">Số điện thoại</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue("so_dien_thoai")}</div>,
    },
    {
        accessorKey: "ten_pham_nhan",
        header: () => <div className="text-left font-semibold">Tên phạm nhân</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue("ten_pham_nhan")}</div>,
    },
    {
        accessorKey: "tong_tien",
        header: () => <div className="text-left font-semibold">Tổng tiền</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue("tong_tien")}</div>,
    },
    {
        accessorKey: "thoi_gian_dat",
        header: () => (
        <Button className="pl-0" variant="ghost" style={{ backgroundColor: "transparent" }}>
            Ngày đặt
        </Button>
        ),
        cell: ({ row }) => {
        const isoString = row.getValue("thoi_gian_dat") as string;
        const date = new Date(isoString);
        return (
            <div>
            {date.toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })}
            </div>
        );
        },
    },
    {
        accessorKey: "trang_thai_don_hang",
        header: () => <div className="text-left font-semibold">Tình trạng</div>,
        cell: ({ row }) => {
        const rawStatus = row.getValue("trang_thai_don_hang") as string;
        let badgeVariant: "pending" | "paid" | "default" = "default";

        if (rawStatus === "Chờ thanh toán") badgeVariant = "pending";
        else if (rawStatus === "Đã thanh toán") badgeVariant = "paid";

        return <Badge variant={badgeVariant}>{rawStatus}</Badge>;
        },
    },
    {
        id: "action",
        header: () => <div className="text-left font-semibold">Hành động</div>,
        cell: ({ row }) => {
        const order = row.original as Order;
        return (
            <div className="flex gap-2">
                <button className="cursor-pointer" onClick={() => onOpen(order)}>
                    <Eye color="#1E40AF" />
                </button>
            </div>
        );
        },
    },
];