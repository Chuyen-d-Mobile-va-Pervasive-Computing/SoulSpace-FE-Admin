"use client";

import StatCard from "./StatCard";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";

interface TotalUsersProps {
  selectedRange: "Day" | "Week" | "Month" | "Year";
  date: string;
}

export default function TotalUsers({ selectedRange, date }: TotalUsersProps) {
  const [value, setValue] = useState(0);
  const [trendValue, setTrendValue] = useState(0);
  const [trend, setTrend] = useState<"up" | "down">("up");

  const mapRangeToPeriod = {
    Day: "day",
    Week: "week",
    Month: "month",
    Year: "year",
  } as const;

  useEffect(() => {
    if (!date) return;

    async function load() {
      const period = mapRangeToPeriod[selectedRange];
      const data = await getDashboardStats(period, date);

      const users = data.total_users;

      setValue(users.value);
      setTrendValue(users.percent_change);
      setTrend(users.trend === "down" ? "down" : "up");
    }

    load();
  }, [selectedRange, date]);

  const getTrendPeriodText = (range: "Day" | "Week" | "Month" | "Year") => {
    switch (range) {
      case "Day":
        return "Yesterday";
      case "Week":
        return "Previous Week";
      case "Month":
        return "Previous Month";
      case "Year":
        return "Previous Year";
    }
  };

  return (
    <StatCard
      title="Total Users"
      value={value}
      icon={Users}
      trend={trend}
      trendValue={trendValue}
      iconBgColor="#B0E4F8"
      iconColor="#00A7E7"
      trendPeriod={getTrendPeriodText(selectedRange)}
    />
  );
}
