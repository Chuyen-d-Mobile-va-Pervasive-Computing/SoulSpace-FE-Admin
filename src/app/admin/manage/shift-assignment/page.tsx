"use client";

import { useState, useEffect } from "react";
import CalendarHeader from "./components/CalendarHeader";
import MonthCalendar from "./components/MonthCalendar";
import WeekCalendar from "./components/WeekCalendar";
import DayCalendar from "./components/DayCalendar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import AssignShift from "./components/AssignShift";
import DeleteShift from "./components/DeleteShift";

const API_PATH = process.env.NEXT_PUBLIC_API_PATH || "";
function normalizeShifts(assignments: any) {
  const result: any = {};
  Object.entries(assignments).forEach(([date, shifts]: [string, any]) => {
    result[date] = (shifts as any[]).map((s) => {
      let startTime = s.start;
      let endTime = s.end;

      try {
        // Nếu là ISO string -> lấy HH:mm
        const startDate = new Date(s.start);
        const endDate = new Date(s.end);

        if (!isNaN(startDate.getTime())) {
          startTime = startDate.toISOString().substring(11, 16); // "HH:mm"
        }
        if (!isNaN(endDate.getTime())) {
          endTime = endDate.toISOString().substring(11, 16);
        }
      } catch {}

      return {
        ...s,
        start: startTime,
        end: endTime,
      };
    });
  });
  return result;
}

export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  const [monthAssignments, setMonthAssignments] = useState<any>({});
  const [weekAssignments, setWeekAssignments] = useState<any>({});
  const [dayAssignments, setDayAssignments] = useState<any>({});
  const [openAssign, setOpenAssign] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const fetchAssignments = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 0-11 -> 1-12
    const day = currentDate.getDate();

    let url = "";
    if (viewMode === "month") {
      url = `${API_PATH}/api/v1/phan-cong/lich-lam-viec/thang/${year}/${month}`;
    } else if (viewMode === "week") {
      url = `${API_PATH}/api/v1/phan-cong/lich-lam-viec/tuan/${year}/${month}/${day}`;
    } else {
      url = `${API_PATH}/api/v1/phan-cong/lich-lam-viec/ngay/${year}/${month}/${day}`;
    }

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const assignments = data.schedule || {};

        if (viewMode === "month") {
          setMonthAssignments(assignments);
        } else if (viewMode === "week") {
          setWeekAssignments(normalizeShifts(assignments));
        } else {
          setDayAssignments(normalizeShifts(assignments));
        }
      })
      .catch((err) => console.error("Error fetching schedule:", err));
  };

  useEffect(() => {
    fetchAssignments();
  }, [currentDate, viewMode]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="w-full flex justify-between items-center mb-5">
        <div className="inline-flex items-center gap-5">
          <Users color="#1E40AF" strokeWidth={2.75} />
          <div className="text-blue-800 text-xl font-bold">
            Quản lý ca làm việc
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            className="h-[40px] bg-red-600 hover:bg-red-700 flex items-center gap-2"
            onClick={() => setOpenDelete(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Xóa phân công
          </Button>

          <Button
            onClick={() => setOpenAssign(true)}
            className="h-[40px] bg-[#16A34A] hover:bg-green-700 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Phân công làm việc
          </Button>
        </div>

        <AssignShift
          open={openAssign}
          onClose={() => setOpenAssign(false)}
          onAssigned={fetchAssignments}
        />

        <DeleteShift
          open={openDelete}
          onOpenChange={setOpenDelete}
          onDeleted={fetchAssignments}
        />
      </div>

      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPrev={() =>
          setCurrentDate(
            new Date(
              currentDate.setDate(
                currentDate.getDate() -
                  (viewMode === "month" ? 30 : viewMode === "week" ? 7 : 1)
              )
            )
          )
        }
        onNext={() =>
          setCurrentDate(
            new Date(
              currentDate.setDate(
                currentDate.getDate() +
                  (viewMode === "month" ? 30 : viewMode === "week" ? 7 : 1)
              )
            )
          )
        }
        onToday={() => setCurrentDate(new Date())}
        onViewChange={setViewMode}
      />

      {viewMode === "month" && (
        <MonthCalendar
          currentDate={currentDate}
          assignments={monthAssignments}
        />
      )}
      {viewMode === "week" && (
        <WeekCalendar currentDate={currentDate} assignments={weekAssignments} />
      )}
      {viewMode === "day" && (
        <DayCalendar currentDate={currentDate} assignments={dayAssignments} />
      )}
    </div>
  );
}
