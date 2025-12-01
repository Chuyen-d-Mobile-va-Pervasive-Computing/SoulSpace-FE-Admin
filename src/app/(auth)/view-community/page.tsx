"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, ThumbsUp, User } from "lucide-react";

// Mock topics
const topics = [
  { id: 1, name: "Mental Health" },
  { id: 2, name: "Self-care" },
  { id: 3, name: "Productivity" },
  { id: 4, name: "Life Issues" },
];

// Mock posts
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
  {
    id: 2,
    user: "Emily Tran",
    topic: "Self-care",
    content: "Share your favorite self-care routine!",
    likes: 5,
    comments: 2,
    created_at: "5 hours ago",
  },
  {
    id: 3,
    user: "Michael Lee",
    topic: "Life Issues",
    content: "How do you deal with burnout?",
    likes: 20,
    comments: 7,
    created_at: "1 day ago",
  },
];

export default function CommunityViewPage() {
  const [selectedTopic, setSelectedTopic] = useState("All");

  const filteredPosts =
    selectedTopic === "All"
      ? mockPosts
      : mockPosts.filter((post) => post.topic === selectedTopic);

  return (
    <div className="p-1 grid grid-cols-[250px_1fr] gap-6 overflow-y-hidden">
      {/* Sidebar */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={selectedTopic === "All" ? "default" : "outline"}
            className="w-full"
            onClick={() => setSelectedTopic("All")}
          >
            All Posts
          </Button>

          {topics.map((topic) => (
            <Button
              key={topic.id}
              variant={selectedTopic === topic.name ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedTopic(topic.name)}
            >
              {topic.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Posts Area */}
      <ScrollArea className="h-[85vh] pr-4">
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold">{post.user}</p>
                  <p className="text-sm text-gray-500">{post.created_at}</p>
                </div>
              </div>

              <Badge className="mb-3 w-fit">{post.topic}</Badge>

              <p className="mb-4 text-gray-800">{post.content}</p>

              <div className="flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1 cursor-pointer">
                  <ThumbsUp size={16} /> {post.likes}
                </div>
                <div className="flex items-center gap-1 cursor-pointer">
                  <MessageCircle size={16} /> {post.comments}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
