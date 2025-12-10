"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { updateExpertArticleStatus } from "@/lib/api";
import { toast } from "sonner";

export default function ExpertPostDetailClient({
  id,
  data,
}: {
  id: string;
  data: any | null;
}) {
  const [article, setArticle] = useState(data);

  if (!article) return <div className="p-4">Article not found</div>;

  const handleUpdate = async (status: "approved" | "rejected") => {
    try {
      const updated = await updateExpertArticleStatus(id, status);
      setArticle(updated);
      toast.success(`Article ${status}!`);
    } catch {
      toast.error("Error updating article");
    }
  };

  const color =
    article.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : article.status === "approved"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Expert Article Details</h1>

      <Badge className={`${color} mt-4 px-3 py-1`}>{article.status}</Badge>

      <div className="mt-4 space-y-3">
        <p className="font-semibold">{article.title}</p>
        <p>{article.content}</p>

        {article.image_url && (
          <img src={article.image_url} className="max-h-72 rounded-xl" />
        )}

        <div className="flex gap-3 mt-6">
          <Button
            className="flex-1 bg-green-600 text-white"
            onClick={() => handleUpdate("approved")}
          >
            <CheckCircle className="mr-2" /> Approve
          </Button>

          <Button
            className="flex-1 bg-red-600 text-white"
            onClick={() => handleUpdate("rejected")}
          >
            <XCircle className="mr-2" /> Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
