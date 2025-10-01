"use client";

import { format, startOfWeek, addDays } from "date-fns";
import { vi } from "date-fns/locale";
type Shift = {
  nhan_vien_id?: number;
  name: string;
  start: string; // "HH:mm" | "HH:mm:ss" | ISO
  end: string; // idem
};

type WeekAssignments = { [date: string]: Shift[] };

interface WeekCalendarProps {
  currentDate: Date;
  assignments: WeekAssignments;
}

const pastelColors = ["#3B82F6", "#36C495", "#F5A51E", "#9A41EB", "#EE62A7"];

function stringToPastel(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return pastelColors[Math.abs(hash) % pastelColors.length];
}

function toMinutes(t?: string): number {
  if (!t) return 0;
  const d = new Date(t);
  if (!isNaN(d.getTime())) return d.getHours() * 60 + d.getMinutes();
  const parts = t.split(":");
  const h = parseInt(parts[0] || "0", 10);
  const m = parseInt(parts[1] || "0", 10);
  return h * 60 + m;
}

/** Gán làn (columns) cho các ca trong 1 ngày */
/** Gán lane và gộp nhân viên trùng ca */
function layoutDay(shifts: Shift[]) {
  type Group = {
    start: string;
    end: string;
    names: string[];
    lane?: number;
  };

  // Gom nhóm theo start-end
  const map = new Map<string, Group>();
  shifts.forEach((s) => {
    const key = `${s.start}-${s.end}`;
    if (!map.has(key)) {
      map.set(key, { start: s.start, end: s.end, names: [] });
    }
    map.get(key)!.names.push(s.name);
  });

  const groups = Array.from(map.values()).map((g) => {
    const _start = toMinutes(g.start);
    const _end = Math.max(toMinutes(g.end), _start + 15);
    return { ...g, _start, _end };
  });

  // Sắp xếp và gán lane để tránh chồng block khác giờ
  groups.sort((a, b) => a._start - b._start || a._end - b._end);
  const lanesEnd: number[] = [];
  groups.forEach((ev) => {
    let lane = 0;
    while (lane < lanesEnd.length && ev._start < lanesEnd[lane]) lane++;
    if (lane === lanesEnd.length) lanesEnd.push(0);
    ev["lane"] = lane;
    lanesEnd[lane] = Math.max(lanesEnd[lane], ev._end);
  });
  const laneCount = Math.max(1, lanesEnd.length);

  return groups.map((g) => ({ ...g, laneCount, lane: g["lane"] }));
}

export default function WeekCalendar({
  currentDate,
  assignments,
}: WeekCalendarProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const rowHeight = 48; // px cho mỗi giờ
  const pxPerMin = rowHeight / 60; // 0.8px / phút

  return (
    <div className="border border-gray-300">
      {/* Header ngày */}
      <div className="grid grid-cols-8 border-b">
        <div className="p-2"></div>
        {days.map((d, i) => (
          <div
            key={i}
            className="p-2 text-center font-semibold border-l text-sm"
          >
            {format(d, "EEE dd/MM", { locale: vi })}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="grid grid-cols-8">
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

        {/* Các cột ngày */}
        {days.map((d, i) => {
          const isoDate = format(d, "yyyy-MM-dd");
          const dayShifts = assignments[isoDate] || [];
          const items = layoutDay(dayShifts);

          return (
            <div key={i} className="relative border-l">
              {hours.map((h) => (
                <div key={h} className="h-12 border-b"></div>
              ))}

              {/* Render từng ca với layout tránh chồng */}
              {items.map((ev, idx) => {
                // Tạo màu dựa trên start-end thay vì tên nhân viên
                const color = stringToPastel(`${ev.start}-${ev.end}`);
                const leftPct = (100 / ev.laneCount) * (ev.lane ?? 0);
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
                      pointerEvents: "auto",
                    }}
                    title={`${ev.start} - ${ev.end}`}
                  >
                    <div className="font-medium">
                      {ev.start} - {ev.end}
                    </div>
                    <ul className="list-disc list-inside">
                      {ev.names.map((n, i) => (
                        <li key={i} className="truncate">
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
