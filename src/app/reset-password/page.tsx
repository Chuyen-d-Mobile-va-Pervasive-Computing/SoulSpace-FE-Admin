"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { resetPassword } from "@/lib/api";

const schema = z.object({
  new_password: z.string().min(6, "At least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email")!;
  const otp = searchParams.get("otp")!;
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword({
        email,
        otp,
        new_password: data.new_password,
      });

      toast.success("Password reset successfully");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <div className="flex justify-center mb-6">
          <Image
            src="/Mobile Marketing-amico.svg"
            alt="Verify OTP"
            width={200}
            height={100}
          />
        </div>
        <h2 className="text-xl font-bold text-center text-[#7F56D9] mb-6">
          NEW PASSWORD
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <Label>New Password</Label>

                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="pr-10"
                        {...field}
                      />
                    </FormControl>

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full bg-[#7F56D9]" type="submit">
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
