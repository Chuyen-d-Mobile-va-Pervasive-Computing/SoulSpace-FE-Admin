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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";

const API_PATH = process.env.NEXT_PUBLIC_API_PATH || "";

interface AssignShiftProps {
  open: boolean;
  onClose: () => void;
  onAssigned?: () => void;
}

export default function AssignShift({
  open,
  onClose,
  onAssigned,
}: AssignShiftProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [shifts, setShifts] = useState<any[]>([]);
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [thuTrongTuan, setThuTrongTuan] = useState<number | undefined>(
    undefined
  );

  // Lấy danh sách ca
  useEffect(() => {
    fetch(`${API_PATH}/api/v1/ca/`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setShifts(data || []))
      .catch((err) => console.error(err));
  }, []);

  // Lấy danh sách nhân viên
  useEffect(() => {
    fetch(`${API_PATH}/api/v1/nhan-vien/cashiers/names`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data || []);
        setFilteredEmployees(data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // Lọc nhân viên
  useEffect(() => {
    if (!search.trim()) {
      setFilteredEmployees(employees);
    } else {
      setFilteredEmployees(
        employees.filter((e) =>
          e.ho_ten.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, employees]);

  const removeEmployee = (id: number) => {
    setSelectedEmployees(
      selectedEmployees.filter((e) => e.nhan_vien_id !== id)
    );
  };

  // Format date to yyyy-MM-dd for payload, ensuring local date is preserved
  function formatToIsoDate(d?: Date) {
    if (!d) return "";
    const fixed = new Date(d);
    fixed.setDate(fixed.getDate());
    return format(fixed, "yyyy-MM-dd");
  }

  function getThuTrongTuan(d: Date) {
    const jsDay = d.getDay(); // 0=CN, 1=Mon, ...
    return jsDay === 0 ? 8 : jsDay + 1;
  }

  const handleAssign = async () => {
    if (!thuTrongTuan || !selectedShift || selectedEmployees.length === 0)
      return;

    const payload = {
      thu_trong_tuan: thuTrongTuan,
      ca_id: Number(selectedShift),
      nhan_vien_ids: selectedEmployees.map((e) => e.nhan_vien_id),
    };

    try {
      const res = await fetch(`${API_PATH}/api/v1/phan-cong/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const { message, success_count, failed_count } = data;

      if (success_count > 0 && failed_count === 0) {
        toast.success(message || "Phân công thành công!");
        setSelectedEmployees([]);
        onClose();
        if (onAssigned) onAssigned();
      } else if (success_count > 0 && failed_count > 0) {
        toast.warning(
          message || "Một số nhân viên được phân công, một số thất bại!"
        );
      } else if (success_count === 0 && failed_count > 0) {
        toast.error(message || "Phân công thất bại!");
      } else {
        toast(message || "Không có thay đổi nào.");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Assign error:", err);
    }
  };

  // Reset selectedEmployees khi đóng popup
  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedEmployees([]);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chia ca làm việc</DialogTitle>
        </DialogHeader>

        {/* Thứ làm việc */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium">Thứ làm việc</label>
          <Select onValueChange={(v) => setThuTrongTuan(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn thứ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">Thứ 2</SelectItem>
              <SelectItem value="3">Thứ 3</SelectItem>
              <SelectItem value="4">Thứ 4</SelectItem>
              <SelectItem value="5">Thứ 5</SelectItem>
              <SelectItem value="6">Thứ 6</SelectItem>
              <SelectItem value="7">Thứ 7</SelectItem>
              <SelectItem value="8">Chủ nhật</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ca làm */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium">Ca làm</label>
          <Select onValueChange={(v) => setSelectedShift(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn ca" />
            </SelectTrigger>
            <SelectContent>
              {shifts.map((s) => (
                <SelectItem key={s.ca_id} value={String(s.ca_id)}>
                  {s.ten_ca} ({s.gio_bat_dau} - {s.gio_ket_thuc})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nhân viên */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nhân viên</label>
          <div className="relative">
            <Input
              placeholder="Nhập tên nhân viên..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenPopover(true); // mở dropdown khi nhập
              }}
              onFocus={() => setOpenPopover(true)} // mở khi focus
              onBlur={() => {
                // Delay 1 chút để click chọn item không bị đóng ngay
                setTimeout(() => setOpenPopover(false), 150);
              }}
            />

            {openPopover && (
              <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-md border bg-white shadow">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((e) => (
                    <div
                      key={e.nhan_vien_id}
                      className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => {
                        // dùng onMouseDown thay vì onClick để bắt ngay lúc click
                        if (
                          !selectedEmployees.find(
                            (s) => s.nhan_vien_id === e.nhan_vien_id
                          )
                        ) {
                          setSelectedEmployees([...selectedEmployees, e]);
                        }
                        setSearch(""); // clear input
                        setOpenPopover(false); // đóng popover
                      }}
                    >
                      {e.ho_ten}
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-1 text-sm text-gray-500">
                    {search.trim()
                      ? "Không tìm thấy nhân viên"
                      : "Hãy nhập để tìm nhân viên"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nhân viên đã chọn */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nhân viên được phân công
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedEmployees.map((e) => (
              <div
                key={e.nhan_vien_id}
                className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {e.ho_ten}
                <button
                  type="button"
                  onClick={() => removeEmployee(e.nhan_vien_id)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAssign}
            className="bg-green-600 hover:bg-green-700"
          >
            Chia ca
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
