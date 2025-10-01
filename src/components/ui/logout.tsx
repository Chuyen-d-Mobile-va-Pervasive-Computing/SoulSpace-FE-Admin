"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const handleLogout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    console.error("Logout failed", e);
  } finally {
    localStorage.removeItem("user");
    localStorage.setItem("justLoggedOut", "1");
    window.location.href = "/login";
  }
};

export function LogoutButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Thoát
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn chắc chắn muốn đăng xuất?</AlertDialogTitle>
          <AlertDialogDescription>
            Sau khi đăng xuất, bạn cần đăng nhập lại để tiếp tục sử dụng hệ
            thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            Đăng xuất
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
