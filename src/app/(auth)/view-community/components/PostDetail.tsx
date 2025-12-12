"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MessageCircle, Trash2, User, ThumbsUp } from "lucide-react";
import { getAdminComments, AdminComment } from "@/lib/api";

interface PostDetailDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  post: {
    user: string;
    content: string;
    likes: number;
    comments: number;
    created_at: string;
  };
  post_id?: string;
}

export default function PostDetail({
  open,
  onClose,
  post,
  post_id,
}: PostDetailDialogProps) {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !post_id) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getAdminComments(post_id);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [open, post_id]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!w-1/2 max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Post Details</DialogTitle>
        </DialogHeader>

        {/* USER INFO */}
        <div className="flex items-center gap-3 my-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <p className="font-semibold">Author: {post.user}</p>
            <p className="text-sm text-gray-500">{post.created_at}</p>
          </div>
        </div>

        {/* CONTENT */}
        <p className="text-gray-800 mb-4">{post.content}</p>

        {/* LIKE & COMMENT COUNT */}
        <div className="flex gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <ThumbsUp size={16} /> {post.likes}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} /> {post.comments}
          </div>
        </div>

        {/* COMMENTS */}
        <h3 className="font-semibold text-lg mb-3">Comments</h3>

        {loading && (
          <p className="text-sm text-gray-500">Loading comments...</p>
        )}

        {!loading && comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments for this post.</p>
        )}

        {comments.map((cmt) => (
          <div key={cmt._id} className="border p-3 rounded-lg mb-3 relative">
            <p className="font-semibold">{cmt.username}</p>
            <p className="text-gray-700">{cmt.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(cmt.created_at).toLocaleString()}
            </p>

            {/* ADMIN ACTION */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
