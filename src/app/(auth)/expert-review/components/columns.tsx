"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, X } from "lucide-react";
import Link from "next/link";

export interface ExpertPost {
  user_id: string;
  profile_id: string;
  full_name: string;
  content: string;
  img: string;
  post_img: string;
  status: string;
  action: string;
}

export const columns: ColumnDef<ExpertPost>[] = [
  {
    accessorKey: "user_id",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        ID
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("user_id")}</div>,
  },
  {
    accessorKey: "full_name",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Expert Name
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
  },
  {
    accessorKey: "content",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Content
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("content")}</div>,
  },
  {
    accessorKey: "status",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Status
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const color =
        status === "approved"
          ? "text-green-600 bg-green-100"
          : status === "pending"
            ? "text-yellow-600 bg-yellow-100"
            : "text-red-600 bg-red-100";

      return (
        <span className={`px-2 py-1 rounded-md text-sm font-medium ${color}`}>
          {status}
        </span>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value === "" || row.getValue(id) === value;
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const expert = row.original;
      return (
        <div className="inline-flex justify-center items-center gap-2.5">
          <Link href={`/expert-review/view/${expert.profile_id}`}>
            <Eye color="#7F56D9" className="hover:cursor-pointer" />
          </Link>
        </div>
      );
    },
  },
];
