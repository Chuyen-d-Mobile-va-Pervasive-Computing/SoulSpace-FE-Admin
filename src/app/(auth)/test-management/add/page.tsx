"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { createTest, getAllTests, uploadTestImage } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Question {
  text: string;
  answers: string[];
}

export default function TestBuilderPage() {
  const router = useRouter();

  // Test info states
  const [testName, setTestName] = useState("");
  const [testCode, setTestCode] = useState("");
  const [description, setDescription] = useState("");
  const [severe, setSevere] = useState<number>(0);
  const [recommendation, setRecommendation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Question list
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", answers: [""] },
    { text: "", answers: [""] },
    { text: "", answers: [""] },
  ]);

  // Add new question
  const addQuestion = () => {
    setQuestions((prev) => [...prev, { text: "", answers: [""] }]);
  };

  // Remove a question
  const removeQuestion = (qIndex: number) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  // Update question text
  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | string[]
  ) => {
    const updated = [...questions];
    if (field === "text" && typeof value === "string") {
      updated[index].text = value;
      setQuestions(updated);
    }
  };
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

  // Add answer option
  const addAnswer = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.push("");
    setQuestions(updated);
  };

  // Update answer text
  const updateAnswer = (qIndex: number, aIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex] = value;
    setQuestions(updated);
  };

  // Remove answer
  const removeAnswer = (qIndex: number, aIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.splice(aIndex, 1);
    setQuestions(updated);
  };

  // Submit API
  const handleCreateTest = async () => {
    try {
      // 1️⃣ Validate test code
      if (!testCode.trim()) {
        toast.error("Test Code is required.");
        return;
      }

      // Load danh sách test để check trùng (FE tự check vì BE trả 500)
      let tests: any[] = [];
      try {
        tests = await getAllTests();
      } catch (err) {
        console.warn("Cannot load test list to check duplicates.");
      }

      const exists = tests.some(
        (t) => t.test_code.toLowerCase() === testCode.toLowerCase()
      );

      if (exists) {
        toast.error("Test code already exists. Please choose another code.");
        return;
      }

      // 2️⃣ Validate các câu hỏi phải có ≥ 2 câu trả lời
      const invalidQuestions = questions.some((q) => q.answers.length < 2);

      if (invalidQuestions) {
        toast.error("Each question must have at least 2 answers.");
        return;
      }

      // 3️⃣ Validate câu hỏi không để trống
      const emptyQuestions = questions.some((q) => q.text.trim() === "");
      if (emptyQuestions) {
        toast.error("Question text cannot be empty.");
        return;
      }

      // 4️⃣ Validate câu trả lời không để trống
      const emptyAnswers = questions.some((q) =>
        q.answers.some((a) => a.trim() === "")
      );
      if (emptyAnswers) {
        toast.error("Answer text cannot be empty.");
        return;
      }

      // 5️⃣ Chuẩn bị payload
      const payload = {
        test_code: testCode,
        title: testName,
        description,
        severe_threshold: severe,
        expert_recommendation: recommendation,
        self_care_guidance: "", // nếu chưa dùng
        image_url: imageUrl,

        questions: questions.map((q, index) => ({
          question_text: q.text,
          question_order: index + 1,
          options: q.answers.map((ans, aIndex) => ({
            option_text: ans,
            score_value: aIndex, // ⚠️ BE dùng score_value
          })),
        })),
      };

      console.log("Payload gửi đi:", payload);

      await createTest(payload);

      toast.success("Test created successfully! Redirecting...");

      setTimeout(() => {
        router.push("/test-management");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Test Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="font-medium text-sm">Test Name</label>
          <Input
            placeholder="Test Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />

          <label className="font-medium text-sm">Test Code</label>
          <Input
            placeholder="Test Code"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
          />

          <label className="font-medium text-sm">Description</label>
          <Textarea
            placeholder="Description"
            className="resize-none placeholder:text-[#8391A1]"
            maxLength={200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="font-medium text-sm">Severe Threshold</label>
          <Input
            type="number"
            value={severe}
            onChange={(e) => setSevere(Number(e.target.value))}
          />

          <label className="font-medium text-sm">Expert Recommendation</label>
          <Textarea
            placeholder="Expert Recommendation"
            className="resize-none placeholder:text-[#8391A1]"
            maxLength={200}
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
          />

          <label className="font-medium text-sm">Image URL</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadImage(file);
            }}
          />
        </CardContent>
      </Card>

      {/* Questions Section */}
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
              {/* Question Row */}
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    placeholder={`Question ${qIndex + 1}`}
                    value={q.text}
                    onChange={(e) =>
                      updateQuestion(qIndex, "text", e.target.value)
                    }
                  />
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              {/* Answers */}
              <div className="pl-6 space-y-2">
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
            </Card>
          ))}
        </CardContent>
      </Card>

      <Button className="w-full mt-4" onClick={handleCreateTest}>
        Save & Create Test
      </Button>
    </div>
  );
}
