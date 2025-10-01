"use client";

import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Order } from "./columns";
import { Badge } from "@/components/ui/badge";

interface PopupOrderDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSaveDraft?: (order: Order | null) => void;
  onConfirm?: (order: Order | null) => void;
}

export default function PopupOrderDetail({
  open,
  onOpenChange,
  order,
}: PopupOrderDetailProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] md:max-w-[900px] lg:max-w-[900px] p-3 rounded-[12px]">
        <div className="w-full relative rounded-[12px] bg-white max-h-[80vh] overflow-y-auto overflow-x-hidden flex flex-col p-3 gap-3 text-left text-sm text-black font-inter">
          {/* Header */}
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-[12px]">
              <DialogTitle className="text-sm">Chi tiết đơn hàng</DialogTitle>
              <Badge
                variant={
                  order.trang_thai_don_hang.toLowerCase().includes("chờ")
                    ? "pending"
                    : order.trang_thai_don_hang
                          .toLowerCase()
                          .includes("đã thanh toán")
                      ? "paid"
                      : order.trang_thai_don_hang.toLowerCase().includes("hủy")
                        ? "inactive"
                        : "default"
                }
              >
                {order.trang_thai_don_hang}
              </Badge>
            </div>

            <div
              className="w-[20px] h-[20px] cursor-pointer"
              onClick={() => onOpenChange(false)}
            ></div>
          </div>

          {/* Main content */}
          <div className="w-full flex flex-col md:flex-row items-start justify-start gap-3">
            {/* LEFT COLUMN: Thông tin khách hàng */}
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              {/* STT & mã đơn + ảnh */}
              <div className="w-full flex flex-row items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <strong className="text-xs">
                    STT: <span className="font-normal">{order.so_thu_tu}</span>
                  </strong>
                  <strong className="text-xs">
                    Mã đơn hàng:{" "}
                    <span className="font-normal">{order.don_hang_id}</span>
                  </strong>
                </div>
                <Image
                  src={`data:image/png;base64,${order.ma_qr}`}
                  alt="QR code"
                  width={70}
                  height={65}
                  unoptimized
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div className="text-gray-300 w-full">
                ────────────────────────────────
              </div>

              {/* Thông tin KH */}
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-row w-full justify-between gap-3 grid grid-cols-3">
                  <div className="flex flex-col">
                    <div className="text-[11px]">Tên phạm nhân</div>
                    <strong>{order.ten_pham_nhan}</strong>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[11px]">Buồng giam</div>
                    <strong>{order.so_phong_pham_nhan}</strong>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[11px]">Ngày đặt</div>
                    <strong>
                      {new Date(order.thoi_gian_dat).toLocaleString("vi-VN")}
                    </strong>
                  </div>
                </div>

                <div className="flex flex-row w-full justify-between grid grid-cols-3 gap-3">
                  <div className="flex flex-col w-[120px]">
                    <div className="text-[11px]">Mã đơn hàng</div>
                    <strong>{order.don_hang_id}</strong>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[11px]">Tên người mua</div>
                    <strong>{order.ho_ten_khach_hang}</strong>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[11px]">Số điện thoại</div>
                    <strong>{order.so_dien_thoai}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sản phẩm + tổng tiền */}
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <div>
                <div className="mb-2">
                  <strong className="text-sm">Thông tin đơn hàng</strong>
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  <div className="space-y-3 mt-3">
                    {order.chi_tiet_theo_ngay?.map((day: any, idx: number) => (
                      <div key={idx} className="border p-2 rounded">
                        <div className="font-bold">
                          {day.ngay_giao_formatted}
                        </div>
                        {day.items.map((it: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span>
                              {it.ten_mon_an} x{it.so_luong}
                            </span>
                            <span>
                              {parseInt(it.thanh_tien).toLocaleString("vi-VN")}{" "}
                              đ
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                    {order.chi_tiet_theo_ngay?.length === 0 && (
                      <div className="flex justify-center items-center text-gray-500">
                        <span>Không có thông tin đơn hàng</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white p-2">
                <div className="flex justify-between items-center text-sm">
                  <strong>Tổng tiền</strong>
                  <strong>
                    {parseInt(order.tong_tien).toLocaleString("vi-VN")} đ
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
