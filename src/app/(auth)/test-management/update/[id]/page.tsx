"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { getTestById, updateTestById, uploadTestImage } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageZoom from "@/components/ImageZoom";

interface AnswerOption {
  option_id?: string; // nếu có -> update, nếu không -> tạo mới
  text: string;
  score: number;
}

interface Question {
  _id?: string; // nếu có -> update, nếu không -> tạo mới
  text: string;
  answers: AnswerOption[];
}

export default function TestBuilderPage() {
  const params = useParams();
  const testId = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // Test info states
  const [title, setTitle] = useState("");
  const [testCode, setTestCode] = useState("");
  const [description, setDescription] = useState("");
  const [severeThreshold, setSevereThreshold] = useState<number | string>("");
  const [expertRecommendation, setExpertRecommendation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);

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

  // LOAD DATA FROM BACKEND
  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";
      if (!token) return;

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

        // Transform FE-friendly structure
        const q = res.questions.map((q: any) => ({
          _id: q._id,
          text: q.question_text,
          answers: q.options.map((op: any) => ({
            option_id: op._id, // giữ nguyên id để BE update đúng
            text: op.option_text,
            score: op.score,
          })),
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
        toast.error("No token found!");
        return;
      }

      // Payload BE yêu cầu
      const payload = {
        test: {
          title,
          description,
          severe_threshold: Number(severeThreshold),
          expert_recommendation: expertRecommendation,
          image_url: imageUrl,
        },

        questions: questions.map((q, index) => ({
          ...(q._id ? { _id: q._id } : {}), // nếu có id thì update, không thì tạo mới
          question_text: q.text,
          question_order: index + 1,

          options: q.answers.map((ans, aIndex) => ({
            ...(ans.option_id ? { option_id: ans.option_id } : {}),
            option_text: ans.text,
            score: ans.score ?? aIndex,
            option_order: aIndex + 1,
          })),
        })),
      };

      console.log("Payload update gửi lên:", payload);

      await updateTestById(testId, payload, token);

      toast.success("Test updated successfully!");
      router.push("/test-management");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update test.");
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
