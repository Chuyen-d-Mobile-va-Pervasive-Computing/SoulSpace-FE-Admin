"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UserCircle, User, Lock, LogIn, Eye, EyeOff } from "lucide-react";

// Schema validate
const loginSchema = z.object({
  cashier_id: z.string().min(1, "Mã thu ngân không được để trống"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

export default function PageLogin() {
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cashier_id: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_PATH}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          username_or_email: data.cashier_id,
          password: data.password,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Đăng nhập thất bại");
      }

      const result = await res.json();

      // Lưu thông tin user (metadata) vào localStorage
      localStorage.setItem("user", JSON.stringify(result));

      toast.success("Đăng nhập thành công");

      if (result.chuc_vu === "admin") {
        router.push("/admin/statics");
      } else if (result.chuc_vu === "cashier") {
        router.push("/cashier");
      } else {
        // fallback nếu có role khác
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Đăng nhập thất bại", {
        className: "bg-red-500 text-white shadow-md",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[600px] rounded-[20px] overflow-hidden flex flex-col items-center justify-center shadow-md bg-white">
        {/* Header */}
        <div className="w-full rounded-t-[20px] bg-[#1E40AF] flex flex-col items-center justify-start py-6 px-4 sm:px-6 gap-4 text-center">
          <UserCircle width={50} height={50} color="white" />
          <div className="flex flex-col items-center gap-1 text-white">
            <div className="font-extrabold text-base sm:text-lg">
              THU NGÂN ĐĂNG NHẬP
            </div>
            <b className="text-sm sm:text-base font-medium">
              Bắt đầu ca làm việc của bạn
            </b>
          </div>
        </div>

        {/* Body */}
        <div className="w-full flex flex-col items-center p-6 sm:p-8 gap-5 text-sm sm:text-base text-black">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-5"
            >
              {/* Mã thu ngân */}
              <FormField
                control={form.control}
                name="cashier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã thu ngân</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <Input
                          type="text"
                          placeholder="Nhập mã thu ngân"
                          className="w-full h-12 sm:h-[44px] pl-10 pr-3 rounded-[5px] placeholder:text-gray-400"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mật khẩu"
                          className="w-full h-12 sm:h-[44px] pl-10 pr-10 rounded-[5px] placeholder:text-gray-400"
                          {...field}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? (
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 cursor-pointer bg-[#1E40AF] hover:bg-[#1E40AF]/80 transition-colors disabled:opacity-70 rounded-[5px] inline-flex justify-center items-center gap-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  "Đang đăng nhập..."
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Đăng nhập và bắt đầu ca làm</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Remember + Forgot */}
          {/* <div className="w-full flex flex-row items-center justify-between text-sm">
            <div className="flex flex-row items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(!!checked)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Nhớ mật khẩu
              </label>
            </div>
            <button
              type="button"
              className="text-[#1E40AF] hover:underline text-sm"
            >
              Quên mật khẩu?
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
