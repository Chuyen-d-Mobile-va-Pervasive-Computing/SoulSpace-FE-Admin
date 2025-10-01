"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addDays, startOfWeek, endOfWeek, format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Plus,
} from "lucide-react";
import WeeklyMenu from "@/components/ui/WeeklyMenu";
import FoodListByDay from "./components/FoodListByDay";

type MonAn = {
  mon_an_id: number;
  hinh_anh: string;
  ten_mon_an: string;
  mo_ta: string;
  so_luong_con_lai: number;
  gia_ap_dung: string;
  ten_danh_muc: string;
};

type ThucDonTuan = {
  ten_thu: string;
  danh_sach_mon_an: MonAn[];
};

const categoryColors: Record<string, string> = {
  "Món chính": "bg-[#EFF6FF]",
  "Món tráng miệng": "bg-[#F0FDF4]",
  "Nước uống": "bg-[#FFFBE9]",
  "Ăn vặt": "bg-[#F2D9EF]",
  Salad: "bg-[#FEDCBD]",
};

const dayTextColors: Record<string, string> = {
  "Thứ Hai": "#3B82F6",
  "Thứ Ba": "#36C495",
  "Thứ Tư": "#F5A51E",
  "Thứ Năm": "#9A41EB",
  "Thứ Sáu": "#EE62A7",
  "Thứ Bảy": "#F04E4E",
  "Chủ Nhật": "#6E66E9",
};

const thuMap: Record<string, number> = {
  "Thứ Hai": 2,
  "Thứ Ba": 3,
  "Thứ Tư": 4,
  "Thứ Năm": 5,
  "Thứ Sáu": 6,
  "Thứ Bảy": 7,
  "Chủ Nhật": 8,
};

export default function MenuTuan() {
  const [data, setData] = useState<ThucDonTuan[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [openDay, setOpenDay] = useState<number | null>(null);

  const fetchData = () => {
    fetch(`${API_PATH}/api/v1/thuc-don/tuan`)
      .then((res) => res.json())
      .then((d: ThucDonTuan[]) => setData(d));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekRange = `${format(start, "dd/MM/yyyy", { locale: vi })} - ${format(
    end,
    "dd/MM/yyyy",
    { locale: vi }
  )}`;

  const handlePrevWeek = () => setCurrentWeek(addDays(currentWeek, -7));
  const handleNextWeek = () => setCurrentWeek(addDays(currentWeek, 7));

  return (
    <div className="bg-white rounded-[10px] p-4">
      {/* Grid các ngày */}
      <div className="grid grid-cols-7 gap-4">
        {data.map((day) => {
          // group theo category
          const grouped: Record<string, MonAn[]> = {};
          day.danh_sach_mon_an.forEach((mon) => {
            if (!grouped[mon.ten_danh_muc]) {
              grouped[mon.ten_danh_muc] = [];
            }
            grouped[mon.ten_danh_muc].push(mon);
          });

          return (
            <div key={day.ten_thu} className="space-y-2">
              {/* Header ngày */}
              <div className="flex items-center justify-between">
                <span
                  className="font-bold text-center px-3 py-1 rounded-md w-full"
                  style={{ color: dayTextColors[day.ten_thu] }}
                >
                  {day.ten_thu}
                </span>
                <EllipsisVertical
                  className="cursor-pointer"
                  onClick={() => setOpenDay(thuMap[day.ten_thu])}
                />
              </div>
              <button
                className="w-full px-3 py-2 bg-white rounded-[10px] border border-dashed border-black/50 inline-flex justify-center items-center gap-1 overflow-hidden hover:bg-gray-50"
                onClick={() => {
                  setSelectedDay(day.ten_thu);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="inline-block mr-2" size={16} />
                <span className="text-black/50 text-base font-bold font-['Inter']">
                  Thêm món
                </span>
              </button>

              {/* Các card theo category */}
              {Object.entries(grouped).map(([category, mons]) => (
                <Card
                  key={category}
                  className={`${
                    categoryColors[category] || "bg-white"
                  } border-none shadow-sm gap-1 p-2`}
                >
                  <CardHeader className="p-2 pb-0">
                    <CardTitle className="text-sm font-medium">
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {mons.map((mon) => (
                        <li key={mon.mon_an_id}>{mon.ten_mon_an}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })}
        {openDay && (
          <FoodListByDay
            openDay={openDay}
            setOpenDay={setOpenDay}
            onUpdated={fetchData}
          />
        )}
        {/* Popup thêm món */}
        <WeeklyMenu
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          day={selectedDay}
          onAdded={fetchData}
        />
      </div>
    </div>
  );
}
