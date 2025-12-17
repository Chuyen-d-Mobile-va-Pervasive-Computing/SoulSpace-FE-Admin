"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
  getQuestionsByTestCode,
  uploadTestImage,
  upsertTestByCode,
} from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageZoom from "@/components/ImageZoom";
import { useSearchParams } from "next/navigation";

interface AnswerOption {
  text: string;
  score: number;
}

interface Question {
  text: string;
  answers: AnswerOption[];
}

export default function TestBuilderPage() {
  const params = useParams();
  const testCode = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // Test info states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severeThreshold, setSevereThreshold] = useState<number | string>("");
  const [expertRecommendation, setExpertRecommendation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const searchParams = useSearchParams();

  // Upload image handler
  const handleUploadImage = async (file: File) => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await uploadTestImage(file, token);

      setImageUrl(res.url);
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
  };

  useEffect(() => {
    setTitle(searchParams.get("title") || "");
    setDescription(searchParams.get("description") || "");
    setSevereThreshold(
      searchParams.get("severe_threshold")
        ? Number(searchParams.get("severe_threshold"))
        : ""
    );
    setExpertRecommendation(searchParams.get("expert_recommendation") || "");
    setImageUrl(searchParams.get("image_url") || "");
  }, []);

  // LOAD DATA FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token") || "";
      if (!token) return;

      try {
        setLoading(true);

        const res = await getQuestionsByTestCode(testCode, token);

        if (!res || res.length === 0) {
          setQuestions([]);
          return;
        }

        const mapped = res.map((q: any) => ({
          text: q.question_text,
          answers: q.options.map((op: any) => ({
            text: op.option_text,
            score: op.score_value,
          })),
        }));

        setQuestions(mapped);
      } catch (err) {
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testCode]);

  // Add question
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { text: "", answers: [{ text: "", score: 0 }] },
    ]);
  };

  // Add answer option
  const addAnswer = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.push({
      text: "",
      score: updated[qIndex].answers.length,
    });
    setQuestions(updated);
  };

  // Update question text
  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  // Update answer text
  const updateAnswer = (qIndex: number, aIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex].text = value;
    setQuestions(updated);
  };

  // Remove answer
  const removeAnswer = (qIndex: number, aIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.splice(aIndex, 1);
    setQuestions(updated);
  };

  // MAIN UPDATE FUNCTION
  const updateTest = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      if (!token) {
        toast.error("No token");
        return;
      }

      const payload = {
        title,
        description,
        severe_threshold: Number(severeThreshold),
        expert_recommendation: expertRecommendation,
        image_url: imageUrl,

        questions: questions.map((q, qIndex) => ({
          question_text: q.text,
          question_order: qIndex + 1,
          options: q.answers.map((ans) => ({
            option_text: ans.text,
            score_value: ans.score,
          })),
        })),
      };

      await upsertTestByCode(testCode, payload, token);

      toast.success("Test updated successfully!");
      router.push("/test-management");
      // wait for 1 second then reload
      setTimeout(() => {}, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-4">Loading test...</div>;

  return (
    <div className="p-1 space-y-6">
      {/* Test Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Test Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <label>Test Name</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />

          <label>Test Code</label>
          <Input value={testCode} disabled />

          <label>Description</label>
          <Textarea
            className="resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Severe Threshold</label>
          <Input
            type="number"
            value={severeThreshold}
            onChange={(e) => setSevereThreshold(e.target.value)}
          />

          <label>Expert Recommendation</label>
          <Textarea
            className="resize-none"
            value={expertRecommendation}
            onChange={(e) => setExpertRecommendation(e.target.value)}
          />

          <label>Test Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadImage(file);
            }}
          />

          {imageUrl && (
            <div className="mt-3">
              <ImageZoom
                src={imageUrl}
                alt="Test Image"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Questions</CardTitle>
          <Button onClick={addQuestion}>
            <Plus size={16} /> Add Question
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {questions.map((q, qIndex) => (
            <Card key={qIndex} className="p-4 border">
              <Input
                placeholder={`Question ${qIndex + 1}`}
                value={q.text}
                onChange={(e) => updateQuestion(qIndex, e.target.value)}
              />

              <div className="pl-5 space-y-2 mt-3">
                {q.answers.map((ans, aIndex) => (
                  <div key={aIndex} className="flex gap-2 items-center">
                    <Input
                      value={ans.text}
                      placeholder={`Answer ${aIndex + 1}`}
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
                  onClick={() => addAnswer(qIndex)}
                >
                  <Plus size={14} /> Add Answer
                </Button>
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
