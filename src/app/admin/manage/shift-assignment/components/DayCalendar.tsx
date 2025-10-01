// DayCalendar.tsx
"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
type Shift = {
  nhan_vien_id?: number;
  name: string;
  start: string;
  end: string;
};

type DayAssignments = { [date: string]: Shift[] };

interface DayCalendarProps {
  currentDate: Date;
  assignments: DayAssignments;
}

const pastelColors = ["#3B82F6", "#36C495", "#F5A51E", "#9A41EB", "#EE62A7"];
function stringToPastelForShift(start: string, end: string) {
  const key = `${start}-${end}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return pastelColors[Math.abs(hash) % pastelColors.length];
}

function toMinutes(t?: string) {
  if (!t) return 0;
  const d = new Date(t);
  if (!isNaN(d.getTime())) return d.getHours() * 60 + d.getMinutes();
  const [h = "0", m = "0"] = t.split(":");
  return parseInt(h, 10) * 60 + parseInt(m, 10);
}
function layoutDay(shifts: Shift[]) {
  type Item = Shift & {
    _start: number;
    _end: number;
    lane: number;
    laneCount: number;
  };
  const items: Item[] = shifts
    .map((s) => {
      const st = toMinutes(s.start);
      const en = Math.max(toMinutes(s.end), st + 15);
      return { ...s, _start: st, _end: en, lane: 0, laneCount: 1 };
    })
    .sort((a, b) => a._start - b._start || a._end - b._end);

  const lanesEnd: number[] = [];
  items.forEach((ev) => {
    let lane = 0;
    while (lane < lanesEnd.length && ev._start < lanesEnd[lane]) lane++;
    if (lane === lanesEnd.length) lanesEnd.push(0);
    ev.lane = lane;
    lanesEnd[lane] = Math.max(lanesEnd[lane], ev._end);
  });
  const laneCount = Math.max(1, lanesEnd.length);
  return items.map((ev) => ({ ...ev, laneCount }));
}

export default function DayCalendar({
  currentDate,
  assignments,
}: DayCalendarProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const isoDate = format(currentDate, "yyyy-MM-dd");
  const shifts = assignments[isoDate] || [];
  const items = layoutDay(shifts);

  const rowHeight = 48;
  const pxPerMin = rowHeight / 60;

  return (
    <div className="border border-gray-300">
      <div className="text-center font-semibold p-2 border-b">
        {format(currentDate, "EEEE, dd/MM/yyyy", { locale: vi })}
      </div>

      <div className="grid grid-cols-2">
        {/* Cột giờ */}
        <div className="flex flex-col">
          {hours.map((h) => (
            <div
              key={h}
              className="h-12 border-b flex items-start justify-end pr-2 text-xs"
            >
              {h}:00
            </div>
          ))}
        </div>

        {/* Cột ca làm */}
        <div className="relative border-l">
          {hours.map((h) => (
            <div key={h} className="h-12 border-b"></div>
          ))}

          {items.map((ev, idx) => {
            const color = stringToPastelForShift(ev.start, ev.end); // 🔵 mỗi ca một màu
            const leftPct = (100 / ev.laneCount) * ev.lane;
            const widthPct = 100 / ev.laneCount;
            return (
              <div
                key={idx}
                className="absolute z-10 text-xs p-2 rounded-lg shadow-sm overflow-hidden"
                style={{
                  top: `${ev._start * pxPerMin}px`,
                  height: `${(ev._end - ev._start) * pxPerMin}px`,
                  left: `calc(${leftPct}% + 2px)`,
                  width: `calc(${widthPct}% - 4px)`,
                  backgroundColor: `${color}`,
                  border: `1px solid ${color}`,
                  color: "#1f2937",
                  lineHeight: 1.2,
                }}
                title={`${ev.start} - ${ev.end} • ${ev.name}`}
              >
                <div className="font-medium">
                  {ev.start} - {ev.end}
                </div>
                <div className="truncate">{ev.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
