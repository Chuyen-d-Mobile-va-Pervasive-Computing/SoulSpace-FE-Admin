"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { PostDetailSheet } from "./PostDetailSheet";

export interface Post {
  id: string;
  date: string;
  post_review: string;
  ai_analysis: string;
  report_count: number;
  status: string;
  action: string;
}

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "id",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        ID
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "date",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        DATE
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "post_review",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        POST REVIEW
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("post_review") as string;
      const truncated =
        value.length > 20 ? value.substring(0, 20).trim() + "..." : value;
      return <div title={value}>{truncated}</div>;
    },
  },
  {
    accessorKey: "ai_analysis",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        AI ANALYSIS
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("ai_analysis") as string;

      let badgeColor = "bg-[#CCF0EB] text-[#00B69B] border-none"; // default
      if (value === "Negative/Medium")
        badgeColor = "bg-[#FFEACC] text-[#FF9800] border-none";
      if (value === "Negative/High")
        badgeColor = "bg-[#FFE5E5] text-[#FF6B6B] border-none";

      return <Badge className={badgeColor}>{value}</Badge>;
    },
  },
  {
    accessorKey: "report_count",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        REPORT
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("report_count")}</div>,
  },
  {
    accessorKey: "status",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        STATUS
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("status") as string;

      let badgeColor = "bg-[#CCF0EB] text-[#00B69B] border-none"; // default Approved
      if (value === "Pending")
        badgeColor = "bg-[#FFEACC] text-[#FF9800] border-none";
      if (value === "AI Flagged")
        badgeColor = "bg-[#FFE5E5] text-[#FF6B6B] border-none";

      return <Badge className={badgeColor}>{value}</Badge>;
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="inline-flex justify-center items-center gap-2.5">
          <PostDetailSheet
            post={post}
            trigger={<Eye color="#7F56D9" className="hover:cursor-pointer" />}
          />
        </div>
      );
    },
  },
];
