"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, X } from "lucide-react";
import Link from "next/link";

export interface Expert {
  user_id: string;
  profile_id: string;
  full_name: string;
  date_of_birth: string;
  years_of_experience: string;
  phone: string;
  email: string;
  status: string;
  action: string;
}

export const columns: ColumnDef<Expert>[] = [
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
    accessorKey: "date_of_birth",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Date of Birth
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("date_of_birth")}</div>,
  },
  {
    accessorKey: "years_of_experience",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Expertise
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("years_of_experience")}</div>,
  },
  {
    accessorKey: "phone",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Phone
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "email",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Email
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
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
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const expert = row.original;
      return (
        <div className="inline-flex justify-center items-center gap-2.5">
          <Link href={`/expert-verify/view/${expert.profile_id}`}>
            <Eye color="#7F56D9" className="hover:cursor-pointer" />
          </Link>
        </div>
      );
    },
  },
];
