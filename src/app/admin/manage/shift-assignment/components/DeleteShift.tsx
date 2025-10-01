"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const API_PATH = process.env.NEXT_PUBLIC_API_PATH || "";

export default function DeleteShift({
  open,
  onOpenChange,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const [shifts, setShifts] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  // Lấy danh sách phân công khi mở popup
  useEffect(() => {
    if (open) {
      fetch(`${API_PATH}/api/v1/phan-cong/`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          const arr = Array.isArray(data) ? data : data?.data || [];
          setShifts(arr);
        })
        .catch((err) => console.error(err));
    }
  }, [open]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      toast.error("Bạn chưa chọn phân công nào!");
      return;
    }

    try {
      const res = await fetch(`${API_PATH}/api/v1/phan-cong/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phan_cong_ids: selected }),
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Xóa phân công thành công!");
        setSelected([]);
        onOpenChange(false);
        if (onDeleted) onDeleted();
      } else {
        toast.error("Xóa phân công thất bại!");
      }
    } catch {
      toast.error("Đã có lỗi xảy ra khi xóa!");
    }
  };

  // === Nhóm dữ liệu theo thứ và ca ===
  const groupedData = useMemo(() => {
    const daysMap: Record<string, Record<string, any[]>> = {};
    shifts.forEach((item) => {
      const day =
        item.thu_trong_tuan === 8 ? "Chủ nhật" : `Thứ ${item.thu_trong_tuan}`;
      const shift = item.ca.ten_ca;

      if (!daysMap[day]) daysMap[day] = {};
      if (!daysMap[day][shift]) daysMap[day][shift] = [];
      daysMap[day][shift].push(item);
    });
    return daysMap;
  }, [shifts]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Xóa phân công</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-64">
          <div className="space-y-4">
            {Object.entries(groupedData).map(([day, shiftsByCa]) => (
              <div key={day}>
                <h1 className="text-lg font-bold border-b pb-1 mb-2">{day}</h1>
                {Object.entries(shiftsByCa).map(([ca, items]) => (
                  <div key={ca} className="mb-3 pl-2">
                    <h2 className="text-md font-semibold mb-1">{ca}</h2>
                    <div className="space-y-2 pl-3">
                      {items.map((item) => (
                        <div
                          key={item.phan_cong_id}
                          className="flex items-center gap-2 border-b pb-1"
                        >
                          <Checkbox
                            checked={selected.includes(item.phan_cong_id)}
                            onCheckedChange={() =>
                              toggleSelect(item.phan_cong_id)
                            }
                          />
                          <span className="text-sm">
                            {item.nhan_vien.ho_ten}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
          >
            Xóa đã chọn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
