"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { deleteTestById } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
export interface Test {
  _id: string;
  test_code: string;
  title: string;
  questions?: any[];
  severe_threshold: number;
  action: string;
}

export const columns: ColumnDef<Test>[] = [
  {
    accessorKey: "_id",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        ID
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("_id")}</div>,
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
    accessorKey: "title",
    header: () => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Test Name
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    id: "num_questions",
    header: "Number of Questions",
    cell: ({ row }) => {
      const questions = row.original.questions || [];
      return <div>{questions.length}</div>;
    },
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

      const [open, setOpen] = React.useState(false);

      const handleDelete = async () => {
        try {
          const token = localStorage.getItem("token") || "";
          await deleteTestById(post._id, token);

          toast.success("Test deleted successfully!");
          window.location.reload();
        } catch (err: any) {
          toast.error(err.message || "Failed to delete the test.");
        }
      };

      return (
        <div className="inline-flex justify-center items-center gap-2.5">
          <Link href={`/test-management/update/${post._id}`}>
            <Eye color="#7F56D9" className="hover:cursor-pointer" />
          </Link>

          {/* DELETE DIALOG */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Trash2 color="#F44336" className="hover:cursor-pointer" />
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete this test?
                </DialogTitle>
              </DialogHeader>

              <p className="py-4 text-sm text-muted-foreground">
                This action cannot be undone. Please confirm before deleting.
              </p>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>

                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
