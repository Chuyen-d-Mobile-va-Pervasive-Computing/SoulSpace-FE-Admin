"use client";

import StatCard from "./StatCard";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";

interface TotalCommentsProps {
  selectedRange: "Day" | "Week" | "Month" | "Year";
  date: string;
}

export default function TotalComments({
  selectedRange,
  date,
}: TotalCommentsProps) {
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

      setValue(data.comments.total);
      setTrendValue(data.comments.in_period);
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
      title="Total Comments"
      value={value}
      icon={MessageCircle}
      iconBgColor="#C1EDCC"
      iconColor="#34C759"
      trend={trend}
      trendValue={trendValue}
      trendPeriod={getTrendPeriodText(selectedRange)}
    />
  );
}
