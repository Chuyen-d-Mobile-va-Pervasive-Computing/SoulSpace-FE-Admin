"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useRef } from "react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const schema = z.object({
  otp: z.array(z.string().length(1)).length(6, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { otp: ["", "", "", "", "", ""] },
  });

  const onSubmit = (data: FormData) => {
    const otp = data.otp.join("");

    if (otp.length !== 6) {
      toast.error("Please enter full OTP");
      return;
    }

    toast.success("OTP entered");
    router.push(`/reset-password?email=${email}&otp=${otp}`);
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const otp = [...form.getValues("otp")];
    otp[index] = value;
    form.setValue("otp", otp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      const otp = [...form.getValues("otp")];

      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <div className="flex justify-center mb-6">
          <Image
            src="/Contact us-amico.svg"
            alt="Verify OTP"
            width={200}
            height={100}
          />
        </div>

        <h2 className="text-xl font-bold text-center text-[#7F56D9] mb-6">
          VERIFY OTP
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-center gap-3 mb-6">
              {form.watch("otp").map((_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg border rounded-lg focus:outline-none focus:border-[#7F56D9]"
                  value={form.watch("otp")[index]}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#7F56D9] hover:bg-[#6b45c8]"
            >
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
