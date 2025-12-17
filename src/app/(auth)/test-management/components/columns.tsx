"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { deleteTestByCode } from "@/lib/api";
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
  description: string;
  expert_recommendation: string;
  image_url: string;
  _id: string;
  test_code: string;
  title: string;
  num_questions: number;
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

      const [open, setOpen] = React.useState(false);

      const handleDelete = async () => {
        try {
          const token = localStorage.getItem("token") || "";
          await deleteTestByCode(post.test_code, token);

          toast.success("Test deleted successfully!");
          // Wait for 2 second and reload
          await new Promise((resolve) => setTimeout(resolve, 2000));
          window.location.reload();
        } catch (err: any) {
          toast.error(err.message || "Failed to delete the test.");
        }
      };

      return (
        <div className="inline-flex justify-center items-center gap-2.5">
          <Link
            href={{
              pathname: `/test-management/update/${post.test_code}`,
              query: {
                title: post.title,
                description: post.description ?? "",
                severe_threshold: post.severe_threshold,
                expert_recommendation: post.expert_recommendation ?? "",
                image_url: post.image_url ?? "",
              },
            }}
          >
            <Eye color="#7F56D9" className="cursor-pointer" />
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
