"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { ReportDetailSheet } from "./PostDetailSheet"; // nếu bạn có sheet này
// (Theo file JSON bạn upload)
export interface Report {
  target_author_username: string;
  target_content: string;
  _id: string;
  reporter_username: string;
  target_id: string;
  target_type: string;
  reason: string;
  status: string;
  created_at: string;
}

export const columns: (refreshData?: () => void) => ColumnDef<Report>[] = (
  refreshData
) => [
  {
    accessorKey: "_id",
    header: () => (
      <Button variant="ghost" className="pl-0 bg-transparent">
        ID
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("_id")}</div>,
  },

  {
    accessorKey: "reporter_username",
    header: () => (
      <Button variant="ghost" className="pl-0 bg-transparent">
        Reporter
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("reporter_username")}</div>,
  },

  {
    accessorKey: "target_id",
    header: () => (
      <Button variant="ghost" className="pl-0 bg-transparent">
        Target
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("target_id")}</div>,
  },

  {
    accessorKey: "reason",
    header: () => (
      <Button variant="ghost" className="pl-0 bg-transparent">
        Reason
      </Button>
    ),
    cell: ({ row }) => {
      const text = row.getValue("reason") as string;
      const truncated = text.length > 20 ? text.slice(0, 20) + "..." : text;
      return <div title={text}>{truncated}</div>;
    },
  },

  {
    accessorKey: "status",
    header: () => (
      <Button variant="ghost" className="pl-0 bg-transparent">
        Status
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("status") as string;

      let badge = "bg-[#E0F7FA] text-[#00796B]"; // default
      if (value === "pending") badge = "bg-[#FFF4CC] text-[#E6A100]";
      if (value === "resolved") badge = "bg-[#CCF0EB] text-[#009688]";
      if (value === "rejected") badge = "bg-[#FCE8E6] text-[#C62828]";

      return <Badge className={`${badge} border-none`}>{value}</Badge>;
    },
  },

  {
    accessorKey: "created_at",
    header: () => (
      <Button variant="ghost" className="pl-0 bg-transparent">
        Created At
      </Button>
    ),
    cell: ({ row }) => {
      const dt = new Date(
        row.getValue("created_at") as string
      ).toLocaleString();
      return <div>{dt}</div>;
    },
  },

  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <div className="flex items-center gap-2">
          <ReportDetailSheet
            report={report}
            trigger={<Eye color="#7F56D9" className="cursor-pointer" />}
            onUpdated={() => refreshData?.()}
          />
        </div>
      );
    },
  },
];
