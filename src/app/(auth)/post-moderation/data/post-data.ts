import { Post } from "../components/columns";

export const posts: Post[] = [
  {
    id: "POST-001",
    date: "2025-10-01",
    post_review: "I feel great today! Loving the sunshine and good vibes.",
    ai_analysis: "Positive/Safe",
    report_count: 0,
    status: "Approved",
    action: "",
  },
  {
    id: "POST-002",
    date: "2025-10-03",
    post_review: "It's just one of those days where a profound sense of exhaustion weighs me down, deeper than just physical tiredness. It feels like no matter which direction I turn or what effort I make, things just don't fall into place. Every small setback just reinforces this overwhelming feeling that nothing is going right. I'm stuck in this cycle of hope and disappointment, and right now, the disappointment is winning. I just need to find a way to reset and catch my breath, but even that feels like a monumental task.",
    ai_analysis: "Negative/Medium",
    report_count: 2,
    status: "Pending",
    action: "",
  },
  {
    id: "POST-003",
    date: "2025-10-05",
    post_review: "I want to end it all. Life is too painful.",
    ai_analysis: "Negative/High",
    report_count: 5,
    status: "AI Flagged",
    action: "",
  },
  {
    id: "POST-004",
    date: "2025-10-06",
    post_review: "Don't forget to smile today!",
    ai_analysis: "Positive/Safe",
    report_count: 0,
    status: "Approved",
    action: "",
  },
  {
    id: "POST-005",
    date: "2025-10-07",
    post_review: "People are so annoying sometimes.",
    ai_analysis: "Negative/Medium",
    report_count: 1,
    status: "Pending",
    action: "",
  },
];
