"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export interface ExpertArticle {
  _id: string;
  expert_id: string;
  title: string;
  content: string;
  image_url: string;
  status: string;
  created_at: string;
  approved_at: string | null;
}

export const columns: ColumnDef<ExpertArticle>[] = [
  {
    accessorKey: "_id",
    header: () => (
      <Button className="pl-0" variant="ghost">
        ID
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("_id")}</div>,
  },

  {
    accessorKey: "expert_id",
    header: () => (
      <Button className="pl-0" variant="ghost">
        Expert ID
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("expert_id")}</div>,
  },

  {
    accessorKey: "title",
    header: () => (
      <Button className="pl-0" variant="ghost">
        Title
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },

  {
    accessorKey: "content",
    header: () => (
      <Button className="pl-0" variant="ghost">
        Content
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("content")}</div>,
  },

  {
    accessorKey: "status",
    header: () => (
      <Button className="pl-0" variant="ghost">
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
  },

  {
    accessorKey: "created_at",
    header: () => (
      <Button className="pl-0" variant="ghost">
        Created At
      </Button>
    ),
    cell: ({ row }) =>
      new Date(row.getValue("created_at") as string).toLocaleString(),
  },

  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const article = row.original;
      const router = useRouter();
      return (
        <div className="inline-flex items-center gap-2.5">
          <Eye
            color="#7F56D9"
            className="cursor-pointer"
            onClick={() => {
              router.push(`/expert-review/view/${article._id}`);
            }}
          />
        </div>
      );
    },
  },
];
