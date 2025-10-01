"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type MonAn = {
  mon_an_id: number;
  ten_mon_an: string;
};

type WeeklyMenuProps = {
  open: boolean;
  onClose: () => void;
  day: string;
  onAdded?: () => void;
};

type Row = { monId: number | null; giaBan: string };

export default function WeeklyMenu({
  open,
  onClose,
  day,
  onAdded,
}: WeeklyMenuProps) {
  const [monAnList, setMonAnList] = useState<MonAn[]>([]);
  const [rows, setRows] = useState<Row[]>([{ monId: null, giaBan: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

  useEffect(() => {
    if (!open) return;
    // Reset dữ liệu khi mở popup
    setRows([{ monId: null, giaBan: "" }]);
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_PATH}/api/v1/mon-an/`, {
          signal: controller.signal,
          credentials: "include",
        });
        const data = await res.json();
        console.log("API /mon-an/ response:", data);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];
        setMonAnList(list);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Fetch mon-an lỗi:", err);
        setError("Lấy danh sách món thất bại");
        setMonAnList([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [open, API_PATH]);

  const handleAddRow = () => {
    setRows([...rows, { monId: null, giaBan: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChangeRow = (
    index: number,
    field: keyof Row,
    value: string | number | null
  ) => {
    const newRows = [...rows];
    (newRows[index] as any)[field] = value;
    setRows(newRows);
  };

  const handleSave = async () => {
    // Chuẩn bị data theo format API
    const foods = rows
      .filter((row) => row.monId !== null && row.giaBan.trim() !== "")
      .map((row) => ({
        mon_an_id: row.monId!,
        gia_ap_dung: Number(row.giaBan),
      }));

    if (foods.length === 0) {
      alert("Vui lòng chọn ít nhất 1 món và nhập giá bán");
      return;
    }

    // Map day (string) sang số thứ (2 -> 8)
    const dayMap: Record<string, number> = {
      "Thứ Hai": 2,
      "Thứ Ba": 3,
      "Thứ Tư": 4,
      "Thứ Năm": 5,
      "Thứ Sáu": 6,
      "Thứ Bảy": 7,
      "Chủ Nhật": 8,
    };

    const thu = dayMap[day] ?? null;
    if (!thu) {
      alert("Ngày không hợp lệ");
      return;
    }

    try {
      setLoading(true);

      const foods = rows.map((row) => ({
        mon_an_id: row.monId,
        gia_ap_dung: Number(row.giaBan),
      }));

      console.log("URL:", `${API_PATH}/api/v1/thuc-don/add-food?thu=${thu}`);
      console.log("Body:", foods);

      const res = await fetch(
        `${API_PATH}/api/v1/thuc-don/add-food?thu=${thu}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(foods), // 👈 gửi trực tiếp array
        }
      );

      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status}`);
      }

      const result = await res.json();
      console.log("Lưu thành công:", result);
      toast.success(result?.message || "Lưu thực đơn thành công!");
      if (onAdded) onAdded();
      onClose();
    } catch (err) {
      console.error("Lỗi khi lưu thực đơn:", err);
      toast.error("Lưu thực đơn thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm món cho thực đơn: {day}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {rows.map((row, idx) => (
            <div key={idx} className="w-full flex items-center gap-3">
              {/* Chọn món */}
              <div className="w-1/2">
                <Select
                  value={row.monId !== null ? String(row.monId) : undefined}
                  onValueChange={(val) =>
                    handleChangeRow(idx, "monId", Number(val))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn món" />
                  </SelectTrigger>
                  <SelectContent>
                    {monAnList.map((mon) => (
                      <SelectItem
                        key={mon.mon_an_id}
                        value={String(mon.mon_an_id)}
                      >
                        {mon.ten_mon_an}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Giá bán */}
              <Input
                className="w-1/2"
                type="text"
                value={row.giaBan}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, ""); // chỉ giữ số
                  handleChangeRow(idx, "giaBan", numericValue);
                }}
                placeholder="Giá"
              />

              {/* Nút xoá dòng */}
              {rows.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveRow(idx)}
                >
                  ✕
                </Button>
              )}
            </div>
          ))}

          {/* Nút thêm dòng */}
          <Button variant="outline" onClick={handleAddRow}>
            + Thêm món
          </Button>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu thực đơn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
