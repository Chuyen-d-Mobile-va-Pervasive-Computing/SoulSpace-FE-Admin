"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { updateExpertArticleStatus, getPendingExpertArticles } from "@/lib/api";
import { useRouter } from "next/navigation";

interface ExpertArticle {
  _id: string;
  expert_id: string;
  title: string;
  content: string;
  image_url: string;
  status: string;
  created_at: string;
  approved_at: string | null;
}

export default function ExpertPostDetailClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [article, setArticle] = useState<ExpertArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        console.log("Fetching articles for ID:", id);
        // Lấy tất cả articles từ API
        const articles = await getPendingExpertArticles();
        console.log("Articles received:", articles);
        // Tìm article theo ID
        const found = articles.find((item: ExpertArticle) => item._id === id);
        console.log("Found article:", found);

        if (found) {
          setArticle(found);
          setNotFound(false);
        } else {
          setArticle(null);
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setNotFound(true);
      }
    };

    fetchArticle();
  }, [id]);

  // Nếu không tìm thấy bài viết
  if (notFound) return <div className="p-4">Article not found</div>;
  if (!article) return <div className="p-4">Loading...</div>;

  const statusColor =
    article.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : article.status === "approved"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";

  const handleUpdate = async (newStatus: "approved" | "rejected") => {
    try {
      setLoading(true);
      const updated = await updateExpertArticleStatus(id, newStatus);
      setArticle(updated); // cập nhật UI
      toast.success(`Article ${newStatus}!`);

      // Đợi 2 giây rồi quay lại trang chính
      setTimeout(() => {
        router.push("/expert-review");
      }, 2000);
    } catch (err) {
      toast.error("Failed to update article");
      setLoading(false);
    }
  };

  return (
    <div className="p-1">
      <h1 className="text-xl font-semibold">Expert Article Details</h1>

      <Card className="shadow-lg border rounded-2xl mt-4">
        <CardContent className="p-6 space-y-6">
          <div>
            <p className="text-gray-600 mb-1 font-medium">Status</p>
            <Badge className={`${statusColor} px-3 py-1 rounded-full`}>
              {article.status}
            </Badge>
          </div>

          <div>
            <p className="text-gray-600 mb-1 font-medium">Title</p>
            <p className="text-lg font-semibold">{article.title}</p>
          </div>

          <div>
            <p className="text-gray-600 mb-1 font-medium">Content</p>
            <div className="border rounded-xl bg-gray-50 p-4">
              {article.content}
            </div>
          </div>

          {article.image_url && (
            <div>
              <p className="text-gray-600 mb-1 font-medium">Image</p>
              <img src={article.image_url} className="rounded-xl max-h-72" />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleUpdate("approved")}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Approve
            </Button>

            <Button
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => handleUpdate("rejected")}
            >
              <XCircle className="mr-2 h-5 w-5" />
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
