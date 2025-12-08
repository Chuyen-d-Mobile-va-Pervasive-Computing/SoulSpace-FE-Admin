"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Report } from "./columns";
import { Check, EyeOff } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useState } from "react";
import { resolveReport } from "@/lib/api";

interface ReportDetailSheetProps {
  report: Report;
  trigger: React.ReactNode;
}

export function ReportDetailSheet({ report, trigger }: ReportDetailSheetProps) {
  const createdDate = new Date(report.created_at).toLocaleString();
  const [loading, setLoading] = useState(false);

  const handleResolve = async (
    action: "delete_content" | "warn_user" | "dismiss"
  ) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token") || "";
      await resolveReport(report._id, action, token);

      toast.success("Report updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to process report");
    } finally {
      setLoading(false);
    }
  };
  const statusColor =
    report.status === "pending"
      ? "bg-[#FFF4CC] text-[#E6A100]"
      : report.status === "resolved"
        ? "bg-[#CCF0EB] text-[#009688]"
        : "bg-gray-200 text-gray-700";

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent className="w-[600px] sm:max-w-[90vw] overflow-y-auto p-6">
        <SheetHeader className="p-0">
          <SheetTitle className="text-[20px]">Report Details</SheetTitle>
          <SheetDescription className="text-[16px]">
            Review user report information and take moderation actions.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-4">
          {/* REPORT INFO SECTION */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Report Information</h3>
            <div className="border border-[#CCCCCC] rounded-2xl p-4 bg-[#F2F3F4] text-sm space-y-3">
              <div>
                <p className="text-gray-600">Report ID</p>
                <p className="font-semibold">{report._id}</p>
              </div>

              <div>
                <p className="text-gray-600">Reporter ID</p>
                <p className="font-semibold">{report.reporter_id}</p>
              </div>

              <div>
                <p className="text-gray-600">Target ID</p>
                <p className="font-semibold">{report.target_id}</p>
              </div>

              <div>
                <p className="text-gray-600">Target Type</p>
                <p className="font-semibold capitalize">{report.target_type}</p>
              </div>

              <div>
                <p className="text-gray-600">Status</p>
                <Badge className={`${statusColor} border-none`}>
                  {report.status}
                </Badge>
              </div>

              <div>
                <p className="text-gray-600">Created At</p>
                <p className="font-semibold">{createdDate}</p>
              </div>
            </div>
          </div>

          {/* REPORT REASON */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Reported Reason</h3>
            <div className="border border-[#CCCCCC] rounded-2xl p-4 bg-[#F2F3F4] text-sm">
              <p>{report.reason}</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <SheetFooter className="mt-6">
          <div className="flex gap-3 w-full">
            {/* DISMISS REPORT */}
            <Button
              disabled={loading}
              className="bg-[#34D1BF] hover:bg-[#28b3a7] text-white flex-1"
              onClick={() => handleResolve("dismiss")}
            >
              <Check className="mr-2" />
              Mark as Resolved
            </Button>

            {/* DELETE CONTENT */}
            <Button
              disabled={loading}
              className="bg-[#706E6C] hover:bg-[#1A1A1A] text-white flex-1"
              onClick={() => handleResolve("delete_content")}
            >
              <EyeOff className="mr-2" />
              Hide Target
            </Button>

            {/* WARN USER */}
            <Button
              disabled={loading}
              className="bg-[#FFCC00] hover:bg-[#E6B800] text-black flex-1"
              onClick={() => handleResolve("warn_user")}
            >
              ⚠ Warn User
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
