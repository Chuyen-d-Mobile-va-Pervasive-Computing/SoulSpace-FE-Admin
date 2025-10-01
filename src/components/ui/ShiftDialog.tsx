"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Shift {
  ca_id?: string;
  ten_ca: string;
  gio_bat_dau: string;
  gio_ket_thuc: string;
  trang_thai?: string;
}

interface ShiftDialogProps {
  open: boolean;
  onClose: () => void;
  shift?: Shift; // nếu có => update, nếu không => create
  onSuccess?: () => void;
}

export function ShiftDialog({
  open,
  onClose,
  shift,
  onSuccess,
}: ShiftDialogProps) {
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const [form, setForm] = useState<Shift>({
    ten_ca: "",
    gio_bat_dau: "",
    gio_ket_thuc: "",
    trang_thai: "Hoạt động",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shift) {
      setForm({
        ca_id: shift.ca_id ?? "",
        ten_ca: shift.ten_ca ?? "",
        gio_bat_dau: shift.gio_bat_dau,
        gio_ket_thuc: shift.gio_ket_thuc,
        trang_thai: shift.trang_thai ?? "Hoạt động",
      });
    } else {
      setForm({
        ca_id: "",
        ten_ca: "",
        gio_bat_dau: "",
        gio_ket_thuc: "",
        trang_thai: "Hoạt động",
      });
    }
  }, [shift]);

  const handleSave = async () => {
    if (!API_PATH) return;

    try {
      let res;
      if (form.ca_id) {
        // update
        res = await fetch(`${API_PATH}/api/v1/ca/${form.ca_id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ca_id: form.ca_id,
            ten_ca: form.ten_ca,
            gio_bat_dau: form.gio_bat_dau,
            gio_ket_thuc: form.gio_ket_thuc,
            trang_thai: form.trang_thai,
          }),
        });
      } else {
        // create
        res = await fetch(`${API_PATH}/api/v1/ca/`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ten_ca: form.ten_ca,
            gio_bat_dau: form.gio_bat_dau,
            gio_ket_thuc: form.gio_ket_thuc,
          }),
        });
      }

      if (res.ok) {
        toast.success(
          `${form.ca_id ? "Cập nhật" : "Thêm"} ca làm "${form.ten_ca}" thành công`
        );
        if (typeof onSuccess === "function") onSuccess();
        onClose();
      } else {
        let errorMsg = "Có lỗi xảy ra";
        try {
          const data = await res.json();
          if (data?.detail) {
            errorMsg = data.detail;
          }
        } catch {
          errorMsg = await res.text();
        }
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error("Có lỗi kết nối server");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-800">
            {shift?.ca_id ? "Cập nhật ca làm việc" : "Thêm ca làm việc"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Tên ca làm */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tên ca làm</label>
            <Input
              placeholder="Ca lễ"
              value={form.ten_ca ?? ""}
              onChange={(e) => setForm({ ...form, ten_ca: e.target.value })}
            />
          </div>

          {/* Giờ bắt đầu */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Giờ bắt đầu</label>
            <Input
              type="time"
              value={form.gio_bat_dau ?? ""}
              onChange={(e) =>
                setForm({ ...form, gio_bat_dau: e.target.value })
              }
            />
          </div>

          {/* Chỉ hiện Mã ca làm khi update */}
          {shift && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Mã ca làm</label>
              <Input value={form.ca_id ?? ""} disabled />
            </div>
          )}

          {/* Giờ kết thúc */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Giờ kết thúc</label>
            <Input
              type="time"
              value={form.gio_ket_thuc ?? ""}
              onChange={(e) =>
                setForm({ ...form, gio_ket_thuc: e.target.value })
              }
            />
          </div>

          {/* Trạng thái chỉ có ở update */}
          {shift && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={form.trang_thai ?? "Hoạt động"}
                onValueChange={(value) =>
                  setForm({ ...form, trang_thai: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                  <SelectItem value="Tạm ngưng">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            {shift?.trang_thai ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
