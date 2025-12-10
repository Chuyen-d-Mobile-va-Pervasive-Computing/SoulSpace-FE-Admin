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
    Day: "today",
    Week: "week",
    Month: "month",
    Year: "all",
  };
  const period = mapRangeToPeriod[selectedRange];

  useEffect(() => {
    async function load() {
      const period = mapRangeToPeriod[selectedRange];
      const data = await getDashboardStats(period, date);

      setValue(data.users.total);
      setTrendValue(data.users.in_period);
      setTrend(data.users.in_period >= 0 ? "up" : "down");
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
