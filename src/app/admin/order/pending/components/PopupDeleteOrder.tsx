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

interface PopupDeleteOrderProps {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
  onDelete: () => void;
}

const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

export default function PopupDeleteOrder({
  open,
  onClose,
  orderId,
  onDelete,
}: PopupDeleteOrderProps) {
  const handleDelete = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(
        `${API_PATH}/api/v1/don-hang/${orderId}/cancel`,
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
          "Xóa đơn hàng thất bại",
          {
            description: err.message || "Đã có lỗi xảy ra",
          }
        );
        return;
      }

      toast.success("Xóa đơn hàng thành công");

      onDelete();
      onClose();
    } catch (e) {
      console.error("Request failed:", e);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có muốn xóa đơn hàng không?</AlertDialogTitle>
          <AlertDialogDescription>
            Sau khi xóa, hành động sẽ không được hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Không</AlertDialogCancel>
          <AlertDialogAction className="bg-[#EF4444] hover:bg-[#EF4444]/80 cursor-pointer"onClick={handleDelete}>
            Có
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}