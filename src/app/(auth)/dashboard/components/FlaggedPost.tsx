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

      setValue(data.reports.total);
      setTrendValue(data.reports.in_period);
      setTrend(data.users.in_period >= 0 ? "up" : "down");
    }
    load();
  }, [selectedRange, date]);
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
