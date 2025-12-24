"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, User } from "lucide-react";
import PostDetail from "./components/PostDetail";
import { getAdminPosts, AdminPost } from "@/lib/api";

interface SelectedPost {
  user: string;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
  image_url?: string | null;
  hashtags?: string[];
}

type PostStatus = "Approved" | "Pending" | "Blocked";

const PAGE_SIZE = 10;

export default function CommunityViewPage() {
  const searchParams = useSearchParams();
  const topicQuery = (searchParams.get("topic") || "").toLowerCase();

  const [allPosts, setAllPosts] = useState<AdminPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PostStatus>("Approved");

  const [selectedPost, setSelectedPost] = useState<SelectedPost | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  /* ================= FETCH ALL POSTS ONCE ================= */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // fetch "nhiều nhất có thể" (no status filter here)
        const data = await getAdminPosts(1, 200);
        setAllPosts(data);
      } catch (error) {
        console.error("Failed to fetch admin posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  /* ================= FILTER BY STATUS + HASHTAG ================= */
  const postsByStatus = useMemo(() => {
    return allPosts.filter((post) => post.moderation_status === status);
  }, [allPosts, status]);

  const filteredByHashtag = useMemo(() => {
    if (!topicQuery) return postsByStatus;

    return postsByStatus.filter((post) =>
      post.hashtags?.some((tag) => tag.toLowerCase() === topicQuery)
    );
  }, [postsByStatus, topicQuery]);

  /* ================= PAGINATION (CLIENT SIDE) ================= */
  const totalPages = Math.ceil(filteredByHashtag.length / PAGE_SIZE);

  const pagedPosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredByHashtag.slice(start, start + PAGE_SIZE);
  }, [filteredByHashtag, page]);

  // reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [topicQuery]);
  // reset page and close detail when status changes
  useEffect(() => {
    setPage(1);
    setSelectedPost(null);
    setSelectedPostId(null);
    setDetailOpen(false);
  }, [status]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  return (
    <div className="p-1 grid grid-cols-[250px_1fr] gap-6 overflow-y-hidden">
      {/* ================= SIDEBAR (STATUS FILTER) ================= */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <p className="text-xs text-gray-500 mt-2">
            Filter by moderation status
          </p>
        </CardHeader>

        <CardContent className="space-y-2">
          {(["Approved", "Pending", "Blocked"] as PostStatus[]).map((s) => {
            const count = allPosts.filter(
              (p) => p.moderation_status === s
            ).length;
            return (
              <Button
                key={s}
                variant={status === s ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => setStatus(s)}
              >
                {s}
                <Badge variant="secondary" className="ml-2">
                  {count}
                </Badge>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* ================= POSTS ================= */}
      <ScrollArea className="h-[80vh] pr-4">
        {loading && (
          <div className="text-center text-gray-500 py-10">
            Loading posts...
          </div>
        )}

        {!loading && pagedPosts.length === 0 && (
          <div className="text-center text-gray-500 py-10 text-sm">
            No posts found.
          </div>
        )}

        {pagedPosts.map((post) => {
          const displayName = post.is_anonymous
            ? "Anonymous"
            : post.author_display;

          return (
            <Card
              key={post._id}
              className="p-4 group relative mb-4 cursor-pointer"
              onClick={() => {
                setSelectedPostId(post._id);
                setSelectedPost({
                  user: post.username,
                  content: post.content,
                  likes: post.like_count,
                  comments: post.comment_count,
                  created_at: new Date(post.created_at).toLocaleString(),
                  image_url: post.image_url ?? null,
                  hashtags: post.hashtags,
                });
                setDetailOpen(true);
              }}
            >
              {/* USER */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold">{displayName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* REAL USERNAME */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs bg-black text-white px-2 py-1 rounded">
                Real: {post.username}
              </div>

              {/* HASHTAGS */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.hashtags.map((tag, idx) => (
                    <span
                      key={`${tag}-${idx}`}
                      className="text-[14px] text-[#7F56D9] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CONTENT */}
              <p className="mt-1">{post.content}</p>

              {post.image_url && (
                <div className="mt-3">
                  <img
                    src={post.image_url}
                    alt="post image"
                    className="w-full max-h-[350px] object-contain rounded-lg border"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                </div>
              )}

              {/* LIKE / COMMENT */}
              <div className="flex gap-4 text-sm text-gray-600 mt-3">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={16} /> {post.like_count}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} /> {post.comment_count}
                </div>
              </div>
            </Card>
          );
        })}

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && pagedPosts.length > 0 && (
          <div className="flex justify-center gap-4 py-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-sm flex items-center">
              Page {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </ScrollArea>

      {/* ================= POST DETAIL ================= */}
      {selectedPost && (
        <div className="w-[90%]">
          <PostDetail
            open={detailOpen}
            onClose={(open) => {
              setDetailOpen(open);
              if (!open) {
                // refetch posts
                getAdminPosts(1, 200).then(setAllPosts);
              }
            }}
            post={selectedPost}
            post_id={selectedPostId ?? undefined}
          />
        </div>
      )}
    </div>
  );
}
