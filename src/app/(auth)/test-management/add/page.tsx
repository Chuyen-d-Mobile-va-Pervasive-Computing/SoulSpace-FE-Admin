"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Question {
  text: string;
  answers: string[];
}

export default function TestBuilderPage() {
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", answers: [""] },
    { text: "", answers: [""] },
    { text: "", answers: [""] },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { text: "", answers: [""] }]);
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | string[]
  ) => {
    const updated = [...questions];
    // only allow updating text safely here
    if (field === "text" && typeof value === "string") {
      updated[index].text = value;
      setQuestions(updated);
    }
    // if you need to update answers as a whole, handle field === "answers" with appropriate type
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

  return (
    <div className="p-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Test Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Test Name (VD: PHQ-9)" />
          <Input placeholder="Test Code" />
          <Textarea
            placeholder="Description"
            className="resize-none placeholder:text-[#8391A1]"
            maxLength={200}
          />
          <Input placeholder="Severe Threshold (VD: 15)" type="number" />
          <Textarea
            placeholder="Expert Recommendation"
            className="resize-none placeholder:text-[#8391A1]"
            maxLength={200}
          />
          <Input placeholder="Image URL (Link trên mạng)" />
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
              <div className="space-y-3">
                <Input
                  placeholder={`Question ${qIndex + 1}`}
                  value={q.text}
                  onChange={(e) =>
                    updateQuestion(qIndex, "text", e.target.value)
                  }
                />

                {/* Answers */}
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

      {/* API Button */}
      <Button className="w-full mt-4">Save & Create Test</Button>
    </div>
  );
}
