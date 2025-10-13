import StatCard from "./StatCard";
import { Users } from "lucide-react";

interface TotalUsersProps {
  selectedRange: "Day" | "Week" | "Month" | "Year";
}

export default function TotalUsers({ selectedRange }: TotalUsersProps) {
  const trendMap = {
    Day: { value: 12.5, trend: "up" as const },
    Week: { value: 8.2, trend: "down" as const },
    Month: { value: 25, trend: "up" as const },
    Year: { value: 110, trend: "up" as const },
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
      title="Total Users"
      value={1520}
      icon={Users}
      iconBgColor="#B0E4F8"
      iconColor="#00A7E7"
      trend={trend}
      trendValue={trendValue}
      trendPeriod={getTrendPeriodText(selectedRange)}
    />
  );
}
