"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, ThumbsUp, User } from "lucide-react";

const topics = [
  { id: 1, name: "Mental Health" },
  { id: 2, name: "Self-care" },
  { id: 3, name: "Productivity" },
  { id: 4, name: "Life Issues" },
];

const mockPosts = [
  {
    id: 1,
    user: "John Doe",
    topic: "Mental Health",
    content:
      "I've been feeling overwhelmed lately. Any advice on how to manage stress better?",
    likes: 12,
    comments: 4,
    created_at: "2 hours ago",
  },
];

export default function CommunityViewPage() {
  const searchParams = useSearchParams();
  const keyword = (searchParams.get("topic") || "").toLowerCase();

  const [selectedTopic, setSelectedTopic] = useState("All");

  // Tìm topic khớp từ khóa
  const matchedTopics = topics.filter((t) =>
    t.name.toLowerCase().includes(keyword)
  );

  // Lọc bài post
  const filteredPosts =
    keyword || selectedTopic !== "All"
      ? mockPosts.filter((post) => {
          if (keyword) {
            return post.topic.toLowerCase().includes(keyword);
          }
          return post.topic === selectedTopic;
        })
      : mockPosts;

  const noTopicFound = keyword && matchedTopics.length === 0;
  const noPostsFound = filteredPosts.length === 0 && !noTopicFound;

  return (
    <div className="p-1 grid grid-cols-[250px_1fr] gap-6 overflow-hidden">
      {/* Sidebar */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Topics</CardTitle>

          <p className="text-xs text-gray-500 mt-4">Topics you may like</p>

          {keyword && (
            <p className="text-xs text-gray-500 mt-1">
              Showing results for: <b>{keyword}</b>
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-2">
          {/* Button: All Posts */}
          <Button
            variant={selectedTopic === "All" ? "default" : "outline"}
            className="w-full"
            onClick={() => setSelectedTopic("All")}
          >
            All Posts
          </Button>

          {/* Topic list */}
          {matchedTopics.map((topic) => (
            <Button
              key={topic.id}
              variant={selectedTopic === topic.name ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                setSelectedTopic(topic.name);
              }}
            >
              {topic.name}
            </Button>
          ))}

          {/* No topic found */}
          {noTopicFound && (
            <div className="text-center text-gray-500 py-3 text-sm">
              There are no topics related to your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posts section */}
      <ScrollArea className="h-[85vh] pr-4">
        {noPostsFound && (
          <div className="text-center text-gray-500 py-10 text-sm">
            There are no posts related to this topic.
          </div>
        )}

        {filteredPosts.map((post) => (
          <Card key={post.id} className="p-4 group relative mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold">Anonymous User</p>
                <p className="text-sm text-gray-500">{post.created_at}</p>
              </div>
            </div>

            {/* Reveal real name */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs bg-black text-white px-2 py-1 rounded">
              Real: {post.user}
            </div>

            <Badge className="mb-3">{post.topic}</Badge>

            <p>{post.content}</p>

            <div className="flex gap-4 text-sm text-gray-600 mt-3">
              <div className="flex items-center gap-1 cursor-pointer">
                <ThumbsUp size={16} /> {post.likes}
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <MessageCircle size={16} /> {post.comments}
              </div>
            </div>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}
