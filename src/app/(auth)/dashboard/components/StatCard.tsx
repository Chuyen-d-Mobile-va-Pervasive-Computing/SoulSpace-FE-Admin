"use client";

import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconBgColor?: string; // màu nền icon
  iconColor?: string; // màu icon
  trend: "up" | "down";
  trendValue: number | string;
  trendPeriod: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconBgColor = "#E5E5E5",
  iconColor = "#555",
  trend,
  trendValue,
  trendPeriod,
}: StatCardProps) {
  const trendColor = trend === "up" ? "#00B69B" : "#FF0A0A";

  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col justify-between shadow-sm">
      {/* Top row */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-[#202224] font-bold">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>

        {/* Icon  */}
        <div
          className="w-12 h-12 flex items-center justify-center rounded-[16px]"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
      </div>

      {/* Bottom row: trend */}
      <div
        className="flex items-center mt-4 gap-1 text-sm font-medium"
        style={{ color: trendColor }}
      >
        {trend === "up" ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>
          {trendValue}% from {trendPeriod}
        </span>
      </div>
    </div>
  );
}
