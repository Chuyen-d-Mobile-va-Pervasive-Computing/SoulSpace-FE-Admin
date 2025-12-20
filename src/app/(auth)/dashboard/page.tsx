"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import TotalUsers from "./components/TotalUsers";
import TotalPosts from "./components/TotalPosts";
import TotalComments from "./components/TotalComments";
import FlaggedPosts from "./components/FlaggedPost";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LineGraph from "./components/LineGraph";
import EmotionDistribution from "./components/EmotionDistribution";
import PostsByTopic from "./components/PostsByTopic";
import PostsByHashtag from "./components/PostByHastag";
import PostsByType from "./components/PostByType";
import MostActiveUsers from "./components/MostActiveUsers";
import MostPositiveMembers from "./components/MostPositiveMembers";
import { useState } from "react";

export default function Page() {
  const [date, setDate] = React.useState<Date>(new Date());
  const [selectedRange, setSelectedRange] = React.useState<
    "Day" | "Week" | "Month" | "Year"
  >("Day");

  const ranges: Array<"Day" | "Week" | "Month" | "Year"> = [
    "Day",
    "Week",
    "Month",
    "Year",
  ];

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const [chartPeriod, setChartPeriod] = useState<
    "day" | "week" | "month" | "year"
  >("month");

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
            <Calendar
              mode="single"
              required={true}
              selected={date}
              onSelect={setDate}
            />
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
        <TotalUsers selectedRange={selectedRange} date={formattedDate} />
        <TotalPosts selectedRange={selectedRange} date={formattedDate} />
        <TotalComments selectedRange={selectedRange} date={formattedDate} />
        <FlaggedPosts selectedRange={selectedRange} date={formattedDate} />
      </div>

      {/* Third row */}
      <div className="w-full bg-white rounded-2xl p-4 mt-4 shadow-sm">
        <div className="w-full inline-flex flex-row items-center justify-between">
          <h1 className="text-black font-bold text-[20px]">
            Post Creation Trend
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex-row inline-flex items-center gap-2 border border-[#D5D5D5] rounded-[10px] py-2 px-4 text-[#2B3034] font-bold text-[16px]">
              Filter By
              <ChevronDown color="#A8ABAD" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setChartPeriod("day")}>
                Day
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartPeriod("week")}>
                Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartPeriod("month")}>
                Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartPeriod("year")}>
                Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-6">
          <LineGraph period={chartPeriod} />
        </div>
      </div>

      {/* Fourth row */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmotionDistribution />
        <PostsByTopic />
      </div>

      {/* Sixth row */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MostActiveUsers />
        <MostPositiveMembers />
      </div>
    </div>
  );
}
