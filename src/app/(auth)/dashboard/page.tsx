"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import TotalUsers from "./components/TotalUsers";
import TotalPosts from "./components/TotalPosts";
import PositivePosts from "./components/PositivePosts";
import FlaggedPosts from "./components/FlaggedPost";

export default function Page() {
  const [date, setDate] = React.useState<Date>();
  const [selectedRange, setSelectedRange] = React.useState<
    "Day" | "Week" | "Month" | "Year"
  >("Day");

  const ranges: Array<"Day" | "Week" | "Month" | "Year"> = [
    "Day",
    "Week",
    "Month",
    "Year",
  ];

  return (
    <div className="w-full flex-col">
      {/* First row */}
      <div className="w-full flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>

        <div className="flex gap-2">
          {ranges.map((range) => (
            <Button
              key={range}
              variant="outline"
              onClick={() => setSelectedRange(range)}
              className={
                selectedRange === range ? "text-[#7F56D9]" : "text-[#ABABAB]"
              }
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <TotalUsers selectedRange={selectedRange} />
        <TotalPosts selectedRange={selectedRange} />
        <PositivePosts selectedRange={selectedRange} />
        <FlaggedPosts selectedRange={selectedRange} />
      </div>
    </div>
  );
}
