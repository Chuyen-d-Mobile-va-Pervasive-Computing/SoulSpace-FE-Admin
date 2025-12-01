"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MessageCircle, ThumbsUp, Trash2, User } from "lucide-react";

interface PostDetailDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  post: {
    created_at: string;
    user: string;
    content: string;
    likes: number;
    comments: number;
  };
}

export default function PostDetailDialog({
  open,
  onClose,
  post,
}: PostDetailDialogProps) {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteNote, setDeleteNote] = useState("");

  // Mock comments
  const comments = [
    {
      id: 1,
      user: "Anna",
      content: "Stay strong! You're not alone.",
      created_at: "1 hour ago",
    },
    {
      id: 2,
      user: "Mark",
      content: "Try meditation, it helps a lot.",
      created_at: "3 hours ago",
    },
  ];

  return (
    <>
      {/* MAIN POPUP */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          style={{ width: "80vw", maxWidth: "80vw" }}
          className="!w-1/2 max-h-[90vh] overflow-y-auto p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Post Details
            </DialogTitle>
          </DialogHeader>

          {/* USER INFO */}
          <div className="flex items-center gap-3 my-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <p className="font-semibold">Anonymous User</p>
              <p className="text-sm text-gray-500">{post?.created_at}</p>
            </div>
          </div>

          {/* REAL IDENTITY */}
          <p className="text-xs p-2 bg-gray-100 rounded mb-3">
            Real Author: <b>{post?.user}</b>
          </p>

          {/* CONTENT */}
          <p className="text-gray-800 mb-4">{post?.content}</p>

          {/* LIKE & COMMENT COUNT */}
          <div className="flex gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1 cursor-pointer">
              <ThumbsUp size={16} /> {post?.likes}
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <MessageCircle size={16} /> {post?.comments}
            </div>
          </div>

          {/* DELETE POST BUTTON */}
          <Button
            variant="destructive"
            className="w-full mb-6"
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2 size={16} className="mr-1" />
            Delete Post
          </Button>

          {/* COMMENTS SECTION */}
          <h3 className="font-semibold text-lg mb-2">Comments</h3>

          {comments.map((cmt) => (
            <div key={cmt.id} className="border p-3 rounded-lg mb-3 relative">
              <p className="font-semibold">{cmt.user}</p>
              <p className="text-gray-700">{cmt.content}</p>
              <p className="text-xs text-gray-500 mt-1">{cmt.created_at}</p>

              {/* DELETE COMMENT */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => setDeleteDialog(true)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION POPUP */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            Would you like to send a note to the author? (optional)
          </p>

          <Textarea
            className="resize-none placeholder:text-gray-400"
            maxLength={200}
            placeholder="Write your note here... (max 200 characters)"
            value={deleteNote}
            onChange={(e) => setDeleteNote(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Confirm Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
