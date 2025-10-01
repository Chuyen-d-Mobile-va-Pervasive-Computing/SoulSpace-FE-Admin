"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
const dayNames: Record<number, string> = {
  2: "thứ hai",
  3: "thứ ba",
  4: "thứ tư",
  5: "thứ năm",
  6: "thứ sáu",
  7: "thứ bảy",
  8: "chủ nhật",
};

type Food = {
  mon_an_id: number;
  ten_mon_an: string;
  gia_ap_dung: string | number | null;
  ten_danh_muc?: string;
};

type FoodListByDayProps = {
  openDay: number | null;
  setOpenDay: (day: number | null) => void;
  onUpdated?: () => void;
};

export default function FoodListByDay(props: FoodListByDayProps) {
  const { openDay, setOpenDay, onUpdated } = props;
  const [foods, setFoods] = useState<Food[]>([]);
  // lưu giá hiển thị dưới dạng chuỗi chỉ chứa chữ số (ví dụ "20000")
  const [editedPrices, setEditedPrices] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // helper: chuyển bất kỳ giá trả về nào (string có comma, etc.) -> chuỗi chỉ số
  type FoodListByDayProps = {
    openDay: number | null;
    setOpenDay: (day: number | null) => void;
  };

  const normalizePriceToDigits = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    // loại bỏ mọi ký tự không phải chữ số (giữ số nguyên)
    const digits = s.replace(/[^\d]/g, "");
    return digits;
  };

  const fetchFoods = async () => {
    if (!openDay) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_PATH}/api/v1/thuc-don/thu/${openDay}`, {
        credentials: "include",
      });
      const data = await res.json();
      const list: Food[] = Array.isArray(data) ? data : [];
      setFoods(list);

      // khởi tạo editedPrices từ data để input hiển thị giá ngay
      const init: Record<number, string> = {};
      list.forEach((f) => {
        init[f.mon_an_id] = normalizePriceToDigits(f.gia_ap_dung);
      });
      setEditedPrices(init);
    } catch (err) {
      console.error("Fetch foods lỗi:", err);
      setFoods([]);
      setEditedPrices({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openDay) {
      fetchFoods();
    } else {
      // khi đóng popup thì reset state để tránh hiển thị cũ
      setFoods([]);
      setEditedPrices({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDay]);

  const handleDelete = async (mon_an_id: number) => {
    if (!openDay) return;
    try {
      setDeletingIds((s) => [...s, mon_an_id]);
      const res = await fetch(
        `${API_PATH}/api/v1/thuc-don/remove-food?thu=${openDay}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ mon_an_ids: [mon_an_id] }),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Xóa thất bại: ${res.status} ${txt}`);
      }

      // refresh danh sách (đảm bảo đúng dữ liệu server)
      await fetchFoods();
    } catch (err) {
      console.error("Xóa món lỗi:", err);
      // Có thể toast lỗi ở đây nếu muốn
    } finally {
      setDeletingIds((s) => s.filter((id) => id !== mon_an_id));
      setConfirmDeleteId(null);
    }
  };

  const handleUpdatePrices = async () => {
    if (!openDay) return;

    // build payload: [{ mon_an_id, gia_ap_dung }]
    const payload = Object.entries(editedPrices)
      .map(([id, val]) => {
        const num = Number(val || 0);
        return {
          mon_an_id: Number(id),
          gia_ap_dung: num,
        };
      })
      .filter((p) => !Number.isNaN(p.gia_ap_dung));

    if (payload.length === 0) {
      alert("Không có giá nào để cập nhật");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(
        `${API_PATH}/api/v1/thuc-don/update-prices?thu=${openDay}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Update thất bại: ${res.status} ${txt}`);
      }

      // reload dữ liệu từ server để đồng bộ
      await fetchFoods();
      toast.success("Cập nhật thành công");
      // Đóng popup và gọi cập nhật dữ liệu tuần
      setOpenDay(null);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Cập nhật giá lỗi:", err);
      alert("Cập nhật giá thất bại");
    } finally {
      setSaving(false);
    }
  };

  // thay đổi giá phía client (chỉ cho nhập số)
  const onChangePrice = (id: number, raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    setEditedPrices((prev) => ({ ...prev, [id]: digits }));
  };

  return (
    <>
      <Dialog open={!!openDay} onOpenChange={() => setOpenDay(null)}>
        <DialogContent
          className="max-w-lg"
          style={{ maxHeight: "80vh", overflow: "auto" }}
        >
          <DialogHeader>
            <DialogTitle>Món ăn {openDay ? dayNames[openDay] : ""}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {loading && <p className="text-gray-500">Đang tải...</p>}

            {!loading && foods.length === 0 && (
              <p className="text-gray-500">Chưa có món ăn nào</p>
            )}

            {!loading &&
              foods.map((food) => (
                <div
                  key={food.mon_an_id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">{food.ten_mon_an}</p>
                    {food.ten_danh_muc && (
                      <p className="text-sm text-gray-500">
                        {food.ten_danh_muc}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      // dùng text để tránh browser tự ý hiển thị dấu '-'
                      type="text"
                      value={editedPrices[food.mon_an_id] ?? ""}
                      onChange={(e) =>
                        onChangePrice(food.mon_an_id, e.target.value)
                      }
                      className="w-28"
                      placeholder="Giá (VNĐ)"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setConfirmDeleteId(food.mon_an_id)}
                      disabled={deletingIds.includes(food.mon_an_id)}
                      title="Xóa món"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setOpenDay(null)}>
                Hủy
              </Button>
              <Button
                onClick={handleUpdatePrices}
                disabled={saving || Object.keys(editedPrices).length === 0}
              >
                {saving ? "Đang lưu..." : "Xác nhận"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Popup xác nhận xóa */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa món</DialogTitle>
          </DialogHeader>
          <div>Bạn có chắc muốn xóa món này khỏi thực đơn?</div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
                disabled={deletingIds.includes(confirmDeleteId ?? -1)}
              >
                Xóa
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
