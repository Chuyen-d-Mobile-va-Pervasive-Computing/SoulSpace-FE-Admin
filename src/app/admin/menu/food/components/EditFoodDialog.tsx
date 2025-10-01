"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Category = {
  danh_muc_id: number;
  ten_danh_muc: string;
};

type EditFoodDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food: any | null;
  onUpdated: () => void;
};

export default function EditFoodDialog({
  open,
  onOpenChange,
  food,
  onUpdated,
}: EditFoodDialogProps) {
    const [tenMonAn, setTenMonAn] = useState("");
    const [moTa, setMoTa] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [hinh_anh, sethinh_anh] = useState<string>("");
    const [trangThai, setTrangThai] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [danhMucId, setDanhMucId] = useState("");
    const [loaiTonKho, setLoaiTonKho] = useState("");
    const [saving, setSaving] = useState(false);
    const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

    // Load danh mục
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_PATH}/api/v1/danh-muc/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            });
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
        };
        fetchCategories();
    }, [API_PATH]);

    useEffect(() => {
    const fetchFood = async () => {
        if (!open || !food?.mon_an_id) return;
        try {
        const res = await fetch(`${API_PATH}/api/v1/mon-an/${food.mon_an_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Không load được chi tiết món ăn");
        const data = await res.json();

        setTenMonAn(data.ten_mon_an || "");
        setMoTa(data.mo_ta || "");
        sethinh_anh(data.hinh_anh || "");
        setLoaiTonKho(data.loai_ton_kho || "Reset");
        setDanhMucId(data.danh_muc_id ? String(data.danh_muc_id) : "");
    setTrangThai(data.trang_thai || "");
        setFile(null);
        } catch (err) {
        console.error(err);
        }
    };
    fetchFood();
    }, [open, food?.mon_an_id, API_PATH]);

    // đồng bộ danh mục theo tên
    useEffect(() => {
    if (food?.ten_danh_muc && categories.length > 0 && !danhMucId) {
        const cat = categories.find((c) => c.ten_danh_muc === food.ten_danh_muc);
        if (cat) setDanhMucId(String(cat.danh_muc_id));
    }
    }, [categories, food?.ten_danh_muc, danhMucId]);

    const handleUpdate = async () => {
        if (!food) return;
        setSaving(true);
        try {
            let imageUrl = hinh_anh;

            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const uploadRes = await fetch(
                `${API_PATH}/api/v1/upload-cloudinary/image`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                }
                );

                if (!uploadRes.ok) throw new Error("Upload ảnh thất bại");
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.file_url;
            }

            const body = {
                ten_mon_an: tenMonAn,
                mo_ta: moTa || null,
                hinh_anh: imageUrl,
                danh_muc_id: Number(danhMucId),
                loai_ton_kho: loaiTonKho || null,
                trang_thai: trangThai || null,
            };

            const res = await fetch(`${API_PATH}/api/v1/mon-an/${food.mon_an_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });

            if (!res.ok) {
                toast.error("Sửa món ăn thất bại");
            } else {
                toast.success("Sửa món ăn thành công");
                onOpenChange(false);
                onUpdated();
            }
        } catch (error) {
        console.error(error);
        toast.error("Có lỗi xảy ra khi sửa món ăn");
        } finally {
        setSaving(false);
        }
    };

    const LOAI_TON_KHO_OPTIONS = [
        { value: "Reset", label: "Reset" },
        { value: "Chuyển tồn", label: "Chuyển tồn" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#1E40AF]">
                        Sửa món ăn
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Tên món ăn</label>
                        <Input
                        placeholder="Tên món ăn"
                        value={tenMonAn}
                        onChange={(e) => setTenMonAn(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Mô tả ({moTa.length}/500)</label>
                        <Textarea
                            placeholder="Mô tả món ăn"
                            value={moTa}
                            onChange={(e) => setMoTa(e.target.value)}
                            maxLength={500}
                        />
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {hinh_anh && !file && (
                        <div className="mt-2">
                            <img
                            src={hinh_anh}
                            alt="Ảnh món ăn"
                            className="w-32 h-32 object-cover rounded"
                            />
                        </div>
                    )}

                    {file && (
                        <div className="mt-2">
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Ảnh mới chọn"
                            className="w-32 h-32 object-cover rounded"
                        />
                        </div>
                    )}
                    {/* Dropdown danh mục */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phân loại món ăn
                        </label>
                        <Select value={danhMucId} onValueChange={setDanhMucId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.danh_muc_id} value={String(cat.danh_muc_id)}>
                                    {cat.ten_danh_muc}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Dropdown loại tồn kho */}
                        <div className="w-full md:w-1/2">
                            <label className="block text-sm font-medium mb-2">Loại tồn kho</label>
                            <Select value={loaiTonKho} onValueChange={setLoaiTonKho}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn loại tồn kho" />
                            </SelectTrigger>
                            <SelectContent>
                                {LOAI_TON_KHO_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>

                        {/* Dropdown trạng thái */}
                        <div className="w-full md:w-1/2">
                            <label className="block text-sm font-medium mb-2">Trạng thái</label>
                            <Select value={trangThai} onValueChange={setTrangThai}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Đang bán">Đang bán</SelectItem>
                                <SelectItem value="Ngừng bán">Ngừng bán</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button className="cursor-pointer" variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        className="bg-[#16a34a] hover:bg-[#16a34a]/80 cursor-pointer"
                        onClick={handleUpdate}
                        disabled={saving}
                    >
                        {saving ? "Đang lưu..." : "Cập nhật"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
  );
}