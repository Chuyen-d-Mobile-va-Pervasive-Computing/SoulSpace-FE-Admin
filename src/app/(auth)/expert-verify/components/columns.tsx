"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, X } from "lucide-react";
import Link from "next/link";

export interface Expert {
  id: string;
  name: string;
  certificate: string;
  dob: string;
  expertise: string;
  phone: string;
  email: string;
  action: string;
}

export const columns: ColumnDef<Expert>[] = [
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
    accessorKey: "name",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Expert Name
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "certificate",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Certificate
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("certificate")}</div>,
  },
  {
    accessorKey: "dob",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Date of Birth
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("dob")}</div>,
  },
  {
    accessorKey: "expertise",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Expertise
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("expertise")}</div>,
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
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const expert = row.original;
      return (
        <div className="inline-flex justify-center items-center gap-2.5">
          <Link href={`/expert-verify/view/${expert.id}`}>
            <Eye color="#7F56D9" className="hover:cursor-pointer" />
          </Link>
        </div>
      );
    },
  },
];
