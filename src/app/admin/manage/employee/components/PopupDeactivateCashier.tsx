"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface PopupDeactivateCashierProps {
  open: boolean;
  onClose: () => void;
  cashierId: number | null;
  onDeactivated: () => void;
}

const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

export default function PopupDeactivateCashier({
  open,
  onClose,
  cashierId,
  onDeactivated,
}: PopupDeactivateCashierProps) {
  const handleDeactivate = async () => {
    if (!cashierId) return;
    try {
      const res = await fetch(
        `${API_PATH}/api/v1/nhan-vien/${cashierId}/deactivate`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Deactivate error:", err);
        toast(
          "Vô hiệu hóa nhân viên thất bại",
          {
            description: err.message || "Đã có lỗi xảy ra",
          }
        );
        return;
      }

      toast.success("Vô hiệu hóa nhân viên thành công");

      onDeactivated();
      onClose();
    } catch (e) {
      console.error("Request failed:", e);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận vô hiệu hóa</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn vô hiệu hóa nhân viên này không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
          <AlertDialogAction className="bg-[#16a34a] hover:bg-[#16a34a]/80 cursor-pointer"onClick={handleDeactivate}>
            Đồng ý
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}