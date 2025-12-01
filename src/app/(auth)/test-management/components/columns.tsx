"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Test {
  id: string;
  test_code: string;
  test_name: string;
  num_questions: number;
  severe_threshold: number;
  action: string;
}

export const columns: ColumnDef<Test>[] = [
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
    accessorKey: "test_code",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Test Code
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("test_code")}</div>,
  },
  {
    accessorKey: "test_name",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Test Name
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("test_name")}</div>,
  },
  {
    accessorKey: "num_questions",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Number of Questions
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("num_questions")}</div>,
  },
  {
    accessorKey: "severe_threshold",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Severe Threshold
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("severe_threshold")}</div>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="inline-flex justify-center items-center gap-2.5">
          <Link href={`/test-management/update/${post.id}`}>
            <Eye color="#7F56D9" className="hover:cursor-pointer" />
          </Link>
          <Trash2 color="#F44336" className="hover:cursor-pointer" />
        </div>
      );
    },
  },
];
