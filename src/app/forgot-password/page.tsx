"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

import { forgotPassword } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword(data);
      toast.success("OTP sent to your email");
      router.push(`/verify-otp?email=${data.email}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <div className="flex justify-center mb-6">
          <Image
            src="/Forgot password-amico.svg"
            alt="Logo"
            width={200}
            height={100}
          />
        </div>
        <h2 className="text-xl font-bold text-center text-[#7F56D9] mb-6">
          FORGOT PASSWORD
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full bg-[#7F56D9]" type="submit">
              Send OTP
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
