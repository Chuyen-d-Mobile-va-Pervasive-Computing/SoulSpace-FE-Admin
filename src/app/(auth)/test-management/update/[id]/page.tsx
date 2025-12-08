"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { getTestById, updateTestById } from "@/lib/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Question {
  text: string;
  answers: string[];
}

export default function TestBuilderPage() {
  const params = useParams();
  const testId = params?.id as string;

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // test info
  const [title, setTitle] = useState("");
  const [testCode, setTestCode] = useState("");
  const [description, setDescription] = useState("");
  const [severeThreshold, setSevereThreshold] = useState<number | string>("");
  const [expertRecommendation, setExpertRecommendation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // questions
  const [questions, setQuestions] = useState<Question[]>([]);

  // --- LOAD DATA ---
  useEffect(() => {
    const fetchTest = async () => {
      console.log("testId loaded from params:", testId);

      if (!testId) {
        console.error("Missing testId from params");
        return;
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";
      if (!token) {
        console.error("No token found → cannot call getTestById");
        return;
      }

      try {
        setLoading(true);

        const res = await getTestById(testId, token);

        // Fill test info
        setTitle(res.title);
        setTestCode(res.test_code);
        setDescription(res.description);
        setSevereThreshold(res.severe_threshold);
        setExpertRecommendation(res.expert_recommendation);
        setImageUrl(res.image_url);

        // Convert backend format → UI format
        const q = res.questions.map((q: any) => ({
          text: q.question_text,
          answers: q.options.map((op: any) => op.option_text),
        }));

        setQuestions(q);
      } catch (err) {
        console.error("Failed to load test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { text: "", answers: [""] }]);
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const addAnswer = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.push("");
    setQuestions(updated);
  };

  const updateAnswer = (qIndex: number, aIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex] = value;
    setQuestions(updated);
  };

  const removeAnswer = (qIndex: number, aIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.splice(aIndex, 1);
    setQuestions(updated);
  };

  const updateTest = async () => {
    console.log("TEST ID FE gửi lên:", testId);

    try {
      const token = localStorage.getItem("token") || "";
      if (!token) {
        alert("No token found!");
        return;
      }

      const payload = {
        update_data: {
          title,
          test_code: testCode,
          description,
          severe_threshold: Number(severeThreshold),
          expert_recommendation: expertRecommendation,
          image_url: imageUrl,
          num_questions: questions.length,
        },
      };

      console.log("Sending payload:", payload);

      await updateTestById(testId, payload, token);
      toast.success("Test updated successfully!");
      router.push("/test-management");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update test. Please try again.");
    }
  };

  if (loading) return <div className="p-4">Loading test...</div>;

  return (
    <div className="p-1 space-y-6">
      {/* Test Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Test Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Test Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Test Code"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
          />
          <Input
            placeholder="Severe Threshold"
            type="number"
            value={severeThreshold}
            onChange={(e) => setSevereThreshold(e.target.value)}
          />
          <Textarea
            placeholder="Expert Recommendation"
            value={expertRecommendation}
            onChange={(e) => setExpertRecommendation(e.target.value)}
            className="resize-none"
          />
          <Input
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl">Questions</CardTitle>
          <Button onClick={addQuestion} className="flex gap-1">
            <Plus size={16} /> Add Question
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {questions.map((q, qIndex) => (
            <Card key={qIndex} className="p-4 border">
              <div className="space-y-3">
                <Input
                  placeholder={`Question ${qIndex + 1}`}
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                />

                <div className="pl-3 space-y-2">
                  {q.answers.map((ans, aIndex) => (
                    <div key={aIndex} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Answer ${aIndex + 1}`}
                        value={ans}
                        onChange={(e) =>
                          updateAnswer(qIndex, aIndex, e.target.value)
                        }
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeAnswer(qIndex, aIndex)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-1 mt-2"
                    onClick={() => addAnswer(qIndex)}
                  >
                    <Plus size={14} /> Add Answer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Button className="w-full mt-4" onClick={updateTest}>
        Save & Update Test
      </Button>
    </div>
  );
}
