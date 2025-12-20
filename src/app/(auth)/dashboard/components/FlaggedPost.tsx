"use client";

import StatCard from "./StatCard";
import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";

interface FlaggedPostsProps {
  selectedRange: "Day" | "Week" | "Month" | "Year";
  date: string;
}

export default function FlaggedPosts({
  selectedRange,
  date,
}: FlaggedPostsProps) {
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

      const flagged = data.ai_flagged;

      setValue(flagged.value);
      setTrendValue(flagged.percent_change);
      setTrend(flagged.trend === "down" ? "down" : "up");
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
      title="AI Flagged Posts"
      value={value}
      icon={TriangleAlert}
      iconBgColor="#FFE2E1"
      iconColor="#FF564F"
      trend={trend}
      trendValue={trendValue}
      trendPeriod={getTrendPeriodText(selectedRange)}
    />
  );
}
