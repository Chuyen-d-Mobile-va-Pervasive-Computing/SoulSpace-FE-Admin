"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UpdateInventoryProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  monAn: {
    mon_an_id: number;
    ten_mon_an: string;
    so_luong_dau_ngay?: number;
  };
  selectedDate: string; // yyyy-mm-dd được chọn
  refetch?: () => void;
}

export default function UpdateInventory({
  open,
  setOpen,
  monAn,
  selectedDate,
  refetch,
}: UpdateInventoryProps) {
  const [quantity, setQuantity] = useState<number>(
    monAn.so_luong_dau_ngay || 0
  );
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

  // Nếu thay đổi món ăn thì reset lại số lượng
  useEffect(() => {
    setQuantity(monAn.so_luong_dau_ngay || 0);
  }, [monAn]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${API_PATH}/api/v1/ton-kho/cap-nhat-dau-ngay/${selectedDate}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mon_an_id: monAn.mon_an_id,
            so_luong_dau_ngay: quantity,
          }),
        }
      );

      if (!res.ok) {
        // Lấy error body từ backend
        const errorData = await res.json();
        throw new Error(errorData.detail || "Cập nhật thất bại");
      }

      const data = await res.json();
      toast.success("Cập nhật thành công!");
      setOpen(false);
      refetch?.();
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật số lượng đầu ngày ({selectedDate})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Tên món ăn */}
          <Input value={monAn.ten_mon_an} disabled />

          {/* Số lượng */}
          <Input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Nhập số lượng"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
