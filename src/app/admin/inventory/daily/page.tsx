"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { toast } from "sonner";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Tuần hiện tại dựa vào selectedDate
  const getWeekDates = (baseDate: string) => {
    const base = new Date(baseDate);
    const dayOfWeek = base.getDay();
    const monday = new Date(base);
    monday.setDate(base.getDate() - ((dayOfWeek + 6) % 7));

    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const [weekDates, setWeekDates] = useState<string[]>(
    getWeekDates(selectedDate)
  );

  const fetchData = (forDate: string) => {
    setIsLoading(true);
    fetch(`${API_PATH}/api/v1/ton-kho/${forDate}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData(selectedDate);
    // Cập nhật weekDates mỗi khi selectedDate thay đổi để nút "Hôm nay" hoặc chọn ngày tuần khác cũng cập nhật dải tuần
    setWeekDates(getWeekDates(selectedDate));
  }, [selectedDate]);

  // === Các hàm điều khiển tuần ===
  const handlePrevWeek = () => {
    const monday = new Date(weekDates[0]);
    monday.setDate(monday.getDate() - 7);
    const newWeek = getWeekDates(monday.toISOString().split("T")[0]);
    setWeekDates(newWeek);
    setSelectedDate(newWeek[0]); // chuyển selectedDate sang thứ 2 tuần trước
  };

  const handleNextWeek = () => {
    const monday = new Date(weekDates[0]);
    monday.setDate(monday.getDate() + 7);
    const newWeek = getWeekDates(monday.toISOString().split("T")[0]);
    setWeekDates(newWeek);
    setSelectedDate(newWeek[0]); // chuyển selectedDate sang thứ 2 tuần sau
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setWeekDates(getWeekDates(today));
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        weekDates={weekDates}
        refetch={() => fetchData(selectedDate)}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        onToday={handleToday}
      />
    </div>
  );
}
