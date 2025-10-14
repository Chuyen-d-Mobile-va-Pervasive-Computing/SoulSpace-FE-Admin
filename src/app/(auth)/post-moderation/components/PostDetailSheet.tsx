"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";
import type { Post } from "./columns";
import { Check, EyeOff, Send } from "lucide-react";

interface PostDetailSheetProps {
  post: Post;
  trigger: React.ReactNode;
}

export function PostDetailSheet({ post, trigger }: PostDetailSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[90vw] overflow-y-auto p-6">
        <SheetHeader className="p-0 m-0">
          <SheetTitle className="text-[20px]">Post Details</SheetTitle>
          <SheetDescription className="text-[16px]">
            Review AI analysis, reports, and take moderation actions.
          </SheetDescription>
        </SheetHeader>

        {/* Content */}
        <div className=" space-y-6">
          {/* Post Content */}
          <h3 className="text-lg font-semibold mb-2">Post Content</h3>
          <div className="border border-[#CCCCCC] rounded-2xl p-4 bg-[#F2F3F4]">
            <p className="text-sm text-muted-foreground">{post.post_review}</p>
          </div>

          {/* Information */}
          <h3 className="text-lg font-semibold mb-2">Information</h3>
          <div className="border border-[#CCCCCC] rounded-2xl p-4 bg-[#F2F3F4]">
            <div className="grid grid-cols-2 gap-x-6 text-sm">
              {/* Cột trái */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[#6B7280]">Anonymous User</p>
                  <p className="font-semibold">ID: U-7X9P2</p>
                </div>
                <div>
                  <p className="text-[#6B7280]">Post Info</p>
                  <p className="font-semibold">ID: #{post.id}</p>
                </div>
              </div>

              {/* Cột phải */}
              <div className="flex flex-col gap-4 text-left">
                <div>
                  <p className="text-[#6B7280]">Past Violations</p>
                  <p className="font-semibold">1</p>
                </div>
                <div>
                  <p className="text-[#6B7280]">Created Date</p>
                  <p className="font-semibold">{post.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
          <div className="border border-[#CCCCCC] rounded-2xl p-4 bg-[#F2F3F4]">
            <div className="grid grid-cols-2 gap-x-6 text-sm">
              {/* Cột trái */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[#6B7280]">Sensiment</p>
                  <p className="font-semibold">Neutral</p>
                </div>
                <div>
                  <p className="text-[#6B7280]">AI Decision</p>
                  <p className="font-semibold">Urgent Intervention Needed</p>
                </div>
              </div>

              {/* Cột phải */}
              <div className="flex flex-col gap-4 text-left">
                <div>
                  <p className="text-[#6B7280]">Risk level</p>
                  <p className="font-semibold">{post.ai_analysis}</p>
                </div>
                <div>
                  <p className="text-[#6B7280]">Source</p>
                  <p className="font-semibold">User Reported</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[14px]">Key Phrases Detected</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "shit",
                  "fuck",
                  "damn",
                  "bitch",
                  "ass",
                  "asshole",
                  "dick",
                ].map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-[13px] bg-[#E9E1FF] text-[#7F56D9] font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* User Reported */}
          <h3 className="text-lg font-semibold mb-2">User Reported</h3>
          <div className="border border-[#CCCCCC] rounded-2xl p-4 bg-[#F2F3F4]">
            <p className="text-sm text-muted-foreground">
              <strong>{post.report_count}</strong> report(s){" "}
            </p>
            {post.report_count > 0 ? (
              <div className="space-y-3 mt-4">
                {[
                  {
                    content: "This post contains inappropriate language",
                    date: "12/10/2025",
                  },
                  {
                    content: "Offensive towards a specific group",
                    date: "13/10/2025",
                  },
                ]
                  .slice(0, post.report_count)
                  .map((report, index) => (
                    <div
                      key={index}
                      className="bg-[#FCDDDD] rounded-xl p-3 text-sm flex flex-col gap-1"
                    >
                      <p className="text-gray-800">{report.content}</p>
                      <p className="text-xs text-gray-600 italic">
                        Reported on {report.date}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No user reports.</p>
            )}
          </div>
        </div>

        {/* Footer */}

        <SheetFooter className="mt-6 flex justify-between gap-2">
          <h3 className="text-lg font-semibold mb-2">Actions</h3>
          <div className="flex-row w-full justify-between inline-flex items-center">
            <Button
              variant="default"
              className="bg-[#34D1BF] hover:bg-[#28b3a7] text-white"
            >
              <Check />
              Approve Post
            </Button>
            <Button className="bg-[#706E6C] hover:bg-[#1A1A1A]">
              <EyeOff />
              Hide Post
            </Button>
            <Button className="bg-[#FF912C] hover:bg-[#D15743]">
              <Send /> Send AI Feedback
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
