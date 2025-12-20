"use client";

import StatCard from "./StatCard";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";

interface TotalPostsProps {
  selectedRange: "Day" | "Week" | "Month" | "Year";
  date: string;
}

export default function TotalPosts({ selectedRange, date }: TotalPostsProps) {
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

      const posts = data.total_posts;

      setValue(posts.value);
      setTrendValue(posts.percent_change);
      setTrend(posts.trend === "down" ? "down" : "up");
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
      title="Total Posts"
      value={value}
      icon={FileText}
      iconBgColor="#FFECDB"
      iconColor="#FF912C"
      trend={trend}
      trendValue={trendValue}
      trendPeriod={getTrendPeriodText(selectedRange)}
    />
  );
}
