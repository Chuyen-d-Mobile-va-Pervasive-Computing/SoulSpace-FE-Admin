"use client";

import { format, startOfWeek, endOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: "month" | "week" | "day";
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (mode: "month" | "week" | "day") => void;
}

export default function CalendarHeader({
  currentDate,
  viewMode,
  onPrev,
  onNext,
  onToday,
  onViewChange,
}: CalendarHeaderProps) {
  let title = "";

  if (viewMode === "month") {
    title = format(currentDate, "MMMM yyyy", { locale: vi });
  } else if (viewMode === "week") {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    title = `${format(start, "dd/MM", { locale: vi })} - ${format(
      end,
      "dd/MM/yyyy",
      { locale: vi }
    )}`;
  } else {
    title = format(currentDate, "dd/MM/yyyy", { locale: vi });
  }

  return (
    <div className="flex justify-between items-center mb-4">
      {/* Buttons trái */}
      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={onPrev}
          className="bg-blue-700 hover:bg-blue-800"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="default"
          onClick={onNext}
          className="bg-blue-700 hover:bg-blue-800"
        >
          <ChevronRight />
        </Button>
        <Button
          variant="default"
          onClick={onToday}
          className="bg-blue-700 hover:bg-blue-800"
        >
          Hôm nay
        </Button>
      </div>

      {/* Tiêu đề */}
      <h2 className="text-lg font-semibold">{title}</h2>

      {/* Tabs view mode */}
      <div className="flex gap-2">
        {["month", "week", "day"].map((mode) => (
          <Button
            key={mode}
            variant={viewMode === mode ? "default" : "outline"}
            onClick={() => onViewChange(mode as "month" | "week" | "day")}
            className={
              viewMode === mode
                ? "bg-blue-700 hover:bg-blue-800"
                : "text-blue-700 border-blue-700"
            }
          >
            {mode === "month" ? "Tháng" : mode === "week" ? "Tuần" : "Ngày"}
          </Button>
        ))}
      </div>
    </div>
  );
}
