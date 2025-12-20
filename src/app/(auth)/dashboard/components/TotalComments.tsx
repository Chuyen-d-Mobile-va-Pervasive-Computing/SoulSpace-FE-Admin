"use client";

import StatCard from "./StatCard";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";

interface PositivePostsProps {
  selectedRange: "Day" | "Week" | "Month" | "Year";
  date: string;
}

export default function PositivePosts({
  selectedRange,
  date,
}: PositivePostsProps) {
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

      const positive = data.positive_posts;

      setValue(positive.value);
      setTrendValue(positive.percent_change);
      setTrend(positive.trend === "down" ? "down" : "up");
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
      title="Positive Posts"
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
