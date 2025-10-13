import StatCard from "./StatCard";
import { Heart } from "lucide-react";

interface PositivePostsProps {
  selectedRange: "Day" | "Week" | "Month" | "Year";
}

export default function PositivePosts({ selectedRange }: PositivePostsProps) {
  const trendMap = {
    Day: { value: 5, trend: "up" as const },
    Week: { value: 2.5, trend: "down" as const },
    Month: { value: 15, trend: "up" as const },
    Year: { value: 60, trend: "up" as const },
  };

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

  const { value: trendValue, trend } = trendMap[selectedRange];

  return (
    <StatCard
      title="Positive Posts"
      value={3200}
      icon={Heart}
      iconBgColor="#C1EDCC"
      iconColor="#34C759"
      trend={trend}
      trendValue={trendValue}
      trendPeriod={getTrendPeriodText(selectedRange)}
    />
  );
}
