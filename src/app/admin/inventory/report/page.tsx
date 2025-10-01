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

export default function StatInventoryPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [mostFavorite, setMostFavorite] = useState<string>("");
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [avgRevenuePerOrder, setAvgRevenuePerOrder] = useState<string>("");

  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

  const formatDate = (date?: Date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!fromDate) return;
    const forDate = formatDate(fromDate);
    const url = `${API_PATH}/api/v1/dashboard/inventory-report/${forDate}`;

    setIsLoading(true);
    fetch(url.toString(), { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((resData) => {
        // Overview
        const overview = resData.overview || {};
        setTotalOrders(Number(overview.tong_don_hang || 0));
        setMostFavorite(overview.mon_an_nhieu_nhat || "");
        setTotalRevenue(
          Number((overview.tong_doanh_thu || "0").replace(/,/g, ""))
        );
        setAvgRevenuePerOrder(overview.doanh_thu_trung_binh_don || "0");

        // Pie chart: doanh thu theo danh mục
        setPieData(
          (resData.revenue_by_category || []).map((c: any) => ({
            name: c.ten_danh_muc,
            value: Number((c.doanh_thu || "0").replace(/,/g, "")),
          }))
        );

        // Bar chart: Top 3 món
        setBarData(
          (resData.top_3_items || []).map((item: any) => ({
            ten_ca: item.ten_mon_an,
            tong_doanh_thu: item.so_luong_ban,
          }))
        );

        // Inventory list
        setData(resData.inventory_list || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [fromDate]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-lg font-semibold">Thống kê tồn kho theo ngày</h2>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Grid content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar chart card */}
        <Card>
          <CardHeader>
            <CardTitle>Top 3 món được bán nhiều</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="ten_ca" />
                <YAxis />
                <Tooltip labelFormatter={(label) => `Món: ${label}`} />
                <Bar dataKey="tong_doanh_thu" name="Số lượng bán">
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
                  Tổng đơn hàng
                </p>
                <p className="text-[18px] md:text-[20px] font-bold text-[#2E6AEC]">
                  {totalOrders.toLocaleString("vi-VN")}
                </p>
              </Card>
              <Card className="bg-[#F0FDF4] p-3 gap-2 text-center">
                <p className="text-[14px] md:text-[16px] text-[#16A34A]">
                  Món ăn được ưa thích nhất
                </p>
                <p className="text-[18px] md:text-[20px] font-bold text-[#16A34A]">
                  {mostFavorite}
                </p>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart card */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo danh mục</CardTitle>
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
                <Tooltip
                  formatter={(value: number) =>
                    `${value.toLocaleString("vi-VN")} VNĐ`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card className="bg-[#FAF5FF] p-3 gap-2 text-center">
                <p className="text-[14px] md:text-[16px] text-[#993EEB]">
                  Doanh thu hôm nay
                </p>
                <p className="font-bold text-[18px] md:text-[24px] text-[#993EEB]">
                  {totalRevenue.toLocaleString("vi-VN")} VNĐ
                </p>
              </Card>
              <Card className="bg-[#FEFCE8] p-3 gap-2 text-center">
                <p className="text-[14px] md:text-[16px] text-[#CC8F0D]">
                  Trung bình đơn
                </p>
                <p className="font-bold text-[18px] md:text-[24px] text-[#CC8F0D]">
                  {avgRevenuePerOrder} VNĐ
                </p>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory list table */}
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
