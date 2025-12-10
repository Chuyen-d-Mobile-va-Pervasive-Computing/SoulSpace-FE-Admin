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
import React, { useState } from "react";
import { toast } from "sonner";
import { resolveReport } from "@/lib/api";

interface ReportDetailSheetProps {
  report: Report;
  trigger: React.ReactNode;
  onUpdated?: () => void; // 🔥 callback refresh table
}

export function ReportDetailSheet({
  report,
  trigger,
  onUpdated,
}: ReportDetailSheetProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(report.status);

  const createdDate = new Date(report.created_at).toLocaleString();

  const handleResolve = async (
    action: "delete_content" | "warn_user" | "dismiss"
  ) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token") || "";
      const res = await resolveReport(report._id, action, token);

      // 🔥 UPDATE STATUS REAL-TIME
      setLocalStatus(res.status ?? "resolved");

      toast.success("Report updated successfully!");

      // 🔥 CLOSE SHEET
      setOpen(false);

      // 🔥 CALL PARENT TO REFRESH TABLE
      onUpdated?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to process report");
    } finally {
      setLoading(false);
    }
  };

  const statusColor =
    localStatus === "pending"
      ? "bg-[#FFF4CC] text-[#E6A100]"
      : localStatus === "resolved"
        ? "bg-[#CCF0EB] text-[#009688]"
        : "bg-gray-200 text-gray-700";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
              <p>
                <strong>Status:</strong>
              </p>
              <Badge className={`${statusColor} border-none capitalize`}>
                {localStatus}
              </Badge>

              <p>
                <strong>Reporter ID:</strong> {report.reporter_id}
              </p>
              <p>
                <strong>Target ID:</strong> {report.target_id}
              </p>
              <p>
                <strong>Reason:</strong> {report.reason}
              </p>
              <p>
                <strong>Created At:</strong> {createdDate}
              </p>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <div className="flex gap-3 w-full">
            <Button
              disabled={loading}
              className="bg-[#34D1BF] text-white flex-1"
              onClick={() => handleResolve("dismiss")}
            >
              <Check className="mr-2" />
              Mark as Resolved
            </Button>

            <Button
              disabled={loading}
              className="bg-[#706E6C] text-white flex-1"
              onClick={() => handleResolve("delete_content")}
            >
              <EyeOff className="mr-2" />
              Hide Target
            </Button>

            <Button
              disabled={loading}
              className="bg-[#FFCC00] text-black flex-1"
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
