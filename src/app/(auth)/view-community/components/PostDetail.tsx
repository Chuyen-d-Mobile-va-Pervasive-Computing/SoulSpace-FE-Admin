"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MessageCircle, Trash2, User, ThumbsUp } from "lucide-react";
import { getAdminComments, AdminComment } from "@/lib/api";
import { deleteAdminPost, deleteAdminComment } from "@/lib/api";

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
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [commentReason, setCommentReason] = useState("");
  const [deletingComment, setDeletingComment] = useState(false);

  const handleDeletePost = async () => {
    if (!post_id || !reason.trim()) return;

    try {
      setDeleting(true);
      await deleteAdminPost(post_id, reason);

      toast.success("Post deleted successfully");

      setConfirmOpen(false);
      onClose(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete the post");
    } finally {
      setDeleting(false);
      setReason("");
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId || !commentReason.trim()) return;

    try {
      setDeletingComment(true);

      await deleteAdminComment(deleteCommentId, commentReason);

      toast.success("Comment deleted successfully");

      // remove comment khỏi UI
      setComments((prev) => prev.filter((cmt) => cmt._id !== deleteCommentId));

      setDeleteCommentId(null);
      setCommentReason("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to delete the comment"
      );
    } finally {
      setDeletingComment(false);
    }
  };

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

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4">
              <Trash2 className="mr-2" size={16} />
              Delete Post
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this post?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The post will be permanently
                removed and the user will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-4">
              <label className="text-sm font-medium mb-1 block">
                Reason for deletion
              </label>
              <Input
                placeholder="e.g. Too toxic, spam, harassment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePost}
                disabled={deleting || !reason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
              onClick={() => setDeleteCommentId(cmt._id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </DialogContent>
      <AlertDialog
        open={!!deleteCommentId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCommentId(null);
            setCommentReason("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The comment will be permanently
              removed and the user will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <label className="text-sm font-medium mb-1 block">
              Reason for deletion
            </label>
            <Input
              placeholder="e.g. Spam, harassment, nonsense..."
              value={commentReason}
              onChange={(e) => setCommentReason(e.target.value)}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingComment}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              disabled={deletingComment || !commentReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingComment ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
