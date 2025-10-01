"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Cashier } from "./columns";
import { toast } from "sonner";

const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

const schema = z.object({
  ho_ten: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự"),
  chuc_vu: z.string().optional().nullable(),
  so_dien_thoai: z.string().optional().nullable(),
  trang_thai: z.enum(["Hoạt động", "Thôi việc"]),
});

type FormData = z.infer<typeof schema>;

interface PopupUpdateCashierProps {
  open: boolean;
  onClose: () => void;
  cashier: Cashier | null;
  onUpdated: () => void;
}

export default function PopupUpdateCashier({
  open,
  onClose,
  cashier,
  onUpdated,
}: PopupUpdateCashierProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (cashier) {
      reset({
        ho_ten: cashier.ho_ten,
        chuc_vu: cashier.chuc_vu || "",
        so_dien_thoai: cashier.so_dien_thoai || "",
        trang_thai: cashier.trang_thai as "Hoạt động" | "Thôi việc",
      });
    }
  }, [cashier, reset]);

  const onSubmit = async (data: FormData) => {
    if (!cashier) return;
    try {
      const res = await fetch(
        `${API_PATH}/api/v1/nhan-vien/${cashier.nhan_vien_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            ho_ten: data.ho_ten,
            chuc_vu: data.chuc_vu,
            so_dien_thoai: data.so_dien_thoai,
            trang_thai: data.trang_thai,
          }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.error("Update error:", error);
        toast(
          "Cập nhật thất bại",
          {
            description: error.message || "Đã có lỗi xảy ra",
          }
        );
        return;
      }

     toast.success("Cập nhật thành công");

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1E40AF]">Cập nhật thu ngân</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium">Họ tên</label>
            <Input className="mt-2" {...register("ho_ten")} />
            {errors.ho_ten && (
              <p className="text-red-500 text-sm">{errors.ho_ten.message}</p>
            )}
          </div>

          {/* Chức vụ */}
          <div>
            <label className="block text-sm font-medium">Chức vụ</label>
            <Input className="mt-2" {...register("chuc_vu")} />
            {errors.chuc_vu && (
              <p className="text-red-500 text-sm">{errors.chuc_vu.message}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium">Số điện thoại</label>
            <Input 
            className="mt-2" 
            {...register("so_dien_thoai", {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              },
            })}
            inputMode="numeric"
            pattern="[0-9]*" 
            />
            {errors.so_dien_thoai && (
              <p className="text-red-500 text-sm">{errors.so_dien_thoai.message}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium mb-2">Trạng thái</label>
            <Select
              value={watch("trang_thai")}
              onValueChange={(val) =>
                setValue("trang_thai", val as "Hoạt động" | "Thôi việc")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
              >
                <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                <SelectItem value="Thôi việc">Thôi việc</SelectItem>
              </SelectContent>
            </Select>
            {errors.trang_thai && (
              <p className="text-red-500 text-sm">{errors.trang_thai.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button className="cursor-pointer" type="button" variant="outline" onClick={onClose}>
              Huỷ
            </Button>
            <Button className="bg-[#16a34a] hover:bg-[#16a34a]/80 cursor-pointer" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}