"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

const COLORS = ["#9194F5", "#C1AEFB", "#E47DF4", "#F27FB7"];
const COLOR_CHART = ["#2563EB", "#9194F5", "#C1AEFB"];

export default function StatPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [mostProductive, setMostProductive] = useState<string>("");
  const [topRevenue, setTopRevenue] = useState<string>("");
  const [totalToday, setTotalToday] = useState<number>(0);
  const [totalOverall, setTotalOverall] = useState<number>(0);
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const start = formatDate(fromDate);
  const end = formatDate(toDate);

  function formatDate(date?: Date) {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const url = new URL(`${API_PATH}/api/v1/dashboard/revenue`);
    if (start) url.searchParams.append("start_date", start);
    if (end) url.searchParams.append("end_date", end);

    setIsLoading(true);
    fetch(url.toString(), {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setData(data.shift_details_log || []);
        setBarData(data.revenue_by_shift_type || []);
        setPieData(
          data.employee_performance?.map((emp: any) => ({
            name: emp.ho_ten,
            value: emp.tong_doanh_thu,
          })) || []
        );
        setMostProductive(data.most_productive_employee);
        setTopRevenue(data.top_revenue_employee);
        setTotalToday(data.total_revenue_today);
        setTotalOverall(data.total_revenue_overall);

        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [start, end]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-lg font-semibold">Thống kê theo ca và nhân viên</h2>
        <div className="flex items-center gap-2">
          {/* From date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-start text-left font-normal",
                  !fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? fromDate.toLocaleDateString("vi-VN") : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
              />
            </PopoverContent>
          </Popover>

          {/* To date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-start text-left font-normal",
                  !toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? toDate.toLocaleDateString("vi-VN") : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={toDate} onSelect={setToDate} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Grid content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar chart card */}
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt doanh thu ca làm việc</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="ten_ca" />
                <YAxis
                  width={100} // tăng chỗ chứa số
                  tickFormatter={(value) => value.toLocaleString("vi-VN")} // format số đẹp hơn
                />

                <Tooltip
                  formatter={(value: number) =>
                    `${value.toLocaleString("vi-VN")} VNĐ`
                  }
                  labelFormatter={(label) => `Ca: ${label}`}
                />
                <Bar dataKey="tong_doanh_thu" name="Tổng doanh thu">
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card className="bg-[#EFF6FF] p-3 gap-2 text-center">
                <p className="text-[14px] md:text-[16px] text-[#2E6AEC]">
                  Doanh thu hôm nay
                </p>
                <p className="text-[18px] md:text-[20px] font-bold text-[#2E6AEC]">
                  {totalToday.toLocaleString("vi-VN")} VNĐ
                </p>
              </Card>
              <Card className="bg-[#F0FDF4] p-3 gap-2 text-center">
                <p className="text-[14px] md:text-[16px] text-[#16A34A]">
                  Doanh thu tổng
                </p>
                <p className="text-[18px] md:text-[20px] font-bold text-[#16A34A]">
                  {totalOverall.toLocaleString("vi-VN")} VNĐ
                </p>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart card */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card className="bg-[#FAF5FF] p-3 gap-2 text-center">
                <p className="text-[14px] md:text-[16px] text-[#993EEB]">
                  Thu ngân năng suất nhất
                </p>
                <p className="font-bold text-[18px] md:text-[24px] text-[#993EEB]">
                  {mostProductive}
                </p>
              </Card>
              <Card className="bg-[#FEFCE8] p-3 gap-2 text-center">
                <p className="text-[14px] md:text-[16px] text-[#CC8F0D]">
                  Nhân viên thu nhiều nhất
                </p>
                <p className="font-bold text-[18px] md:text-[24px] text-[#CC8F0D]">
                  {topRevenue}
                </p>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="bg-white border rounded-[10px] p-3">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
