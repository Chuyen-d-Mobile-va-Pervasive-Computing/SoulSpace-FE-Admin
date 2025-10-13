import StatCard from "./StatCard";
import { FileText } from "lucide-react";

interface TotalPostsProps {
  selectedRange: "Day" | "Week" | "Month" | "Year";
}

export default function TotalPosts({ selectedRange }: TotalPostsProps) {
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
      title="Total Posts"
      value={3200}
      icon={FileText}
      iconBgColor="#FFECDB"
      iconColor="#FF912C"
      trend={trend}
      trendValue={trendValue}
      trendPeriod={getTrendPeriodText(selectedRange)}
    />
  );
}
