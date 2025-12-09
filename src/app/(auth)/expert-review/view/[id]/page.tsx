"use client";

import React from "react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { posts } from "../../data/expert-data";

export default function ExpertPostDetailPage({ params }: any) {
  // 🔥 Unwrap params PROMISE
  const { id } = React.use(params as Promise<{ id: string }>);

  const post = posts.find((p) => p.profile_id === id);

  if (!post) return notFound();

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }[post.status];

  return (
    <div className="p-1">
      <h1 className="text-xl font-semibold">Expert Post Details</h1>

      <Card className="shadow-lg border rounded-2xl mt-4">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={post.img}
              alt={post.full_name}
              className="w-16 h-16 rounded-full border shadow-sm"
            />
            <div>
              <p className="text-lg font-semibold">{post.full_name}</p>
              <p className="text-gray-500 text-sm">User ID: {post.user_id}</p>
              <p className="text-gray-500 text-sm">
                Profile ID: {post.profile_id}
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-600 mb-1 font-medium">Status</p>
            <Badge className={`${statusColor} px-3 py-1 rounded-full`}>
              {post.status}
            </Badge>
          </div>

          <div>
            <p className="text-gray-600 mb-1 font-medium">Content</p>
            <div className="border rounded-xl bg-gray-50 p-4 text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* POST IMAGE */}
          {post.post_img && (
            <div>
              <p className="text-gray-600 mb-1 font-medium">Image</p>
              <img
                src={post.post_img}
                alt="post image"
                className="max-h-72 w-auto rounded-xl border shadow-sm object-contain"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="mr-2 h-5 w-5" />
              Approve
            </Button>

            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              <XCircle className="mr-2 h-5 w-5" />
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
