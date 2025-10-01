"use client";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";

type Assignment = { name: string };
type Assignments = { [date: string]: Assignment[] };

interface MonthCalendarProps {
  currentDate: Date;
  assignments: Assignments;
}

const colorClasses = [
  "bg-red-600",
  "bg-green-600",
  "bg-blue-600",
  "bg-yellow-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-teal-600",
  "bg-orange-600",
];

function stringToColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorClasses[Math.abs(hash) % colorClasses.length];
}

export default function MonthCalendar({
  currentDate,
  assignments,
}: MonthCalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const daysHeader = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const rows = [];
  let day = startDate;
  let days = [];

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const isoDate = format(day, "yyyy-MM-dd");
      days.push(
        <div
          key={day.toString()}
          className={`min-h-[100px] border-r border-b p-2 text-sm relative ${
            !isSameMonth(day, monthStart) ? "bg-gray-100 text-gray-400" : ""
          }`}
        >
          <span className="absolute top-1 right-2 text-xs">
            {format(day, "d")}
          </span>
          <div className="mt-5 flex flex-col gap-1">
            {assignments[isoDate]?.map((person, idx) => {
              const color = stringToColor(person.name);
              return (
                <div key={idx} className="flex items-center gap-1 text-xs">
                  <span className={`w-2 h-2 rounded-full ${color}`}></span>
                  {person.name}
                </div>
              );
            })}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div>
      {/* Header ngày trong tuần */}
      <div className="grid grid-cols-7 border border-gray-300">
        {daysHeader.map((day) => (
          <div
            key={day}
            className="p-2 text-center font-semibold border-r border-b last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Các ô ngày */}
      <div className="border-l border-t border-gray-300">{rows}</div>
    </div>
  );
}
