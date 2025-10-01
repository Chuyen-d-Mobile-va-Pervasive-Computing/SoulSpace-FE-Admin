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
import { PlusCircle, Hamburger, Search } from "lucide-react";
import { TableFilter } from "./components/table-filter";
import FoodList from "./components/FoodList";
import { toast } from "sonner";
import EditFoodDialog from "./components/EditFoodDialog";

type Category = {
  danh_muc_id: number;
  ten_danh_muc: string;
};

export default function PageMenuFood() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [tenMonAn, setTenMonAn] = useState("");
  const [moTa, setMoTa] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [danhMucId, setDanhMucId] = useState("");
  const [loaiTonKho, setLoaiTonKho] = useState("Reset");
  const [saving, setSaving] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_PATH}/api/v1/danh-muc/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Không thể tải danh mục");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [API_PATH]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      let imageUrl: string | null = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(`${API_PATH}/api/v1/upload-cloudinary/image`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!uploadRes.ok) throw new Error("Upload ảnh thất bại");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.file_url;
      }

      const body = {
        ten_mon_an: tenMonAn,
        mo_ta: moTa || null,
        hinh_anh: imageUrl,
        danh_muc_id: Number(danhMucId),
        loai_ton_kho: loaiTonKho,
        trang_thai: "Đang bán", // mặc định
      };

      const res = await fetch(`${API_PATH}/api/v1/mon-an/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!res.ok) {
        // throw new Error("Thêm món ăn thất bại");
        toast.error("Có lỗi xảy ra khi thêm món ăn");
      }
      toast.success("Thêm món ăn thành công");
      setOpen(false);
      setTenMonAn("");
      setMoTa("");
      setFile(null);
      setDanhMucId("");
      setLoaiTonKho("Reset");

      // gọi callback refresh FoodList
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi thêm món ăn");
    }
    finally {
      setSaving(false); // kết thúc loading
    }
  };

  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      <div className="w-full px-7 py-5 bg-white rounded-[10px] inline-flex flex-col justify-start items-start gap-2 overflow-hidden">
        <div className="inline-flex justify-start items-center gap-5">
          <Hamburger color="#1E40AF" strokeWidth={2.75} />
          <p className="text-blue-800 text-xl font-bold font-['Inter']">
            Quản lý món ăn
          </p>
        </div>

        <div className="w-full flex items-center justify-between h-[60px]">
          <div className="flex justify-end items-center h-full gap-4">
            <div className="relative flex items-center">
              <TableFilter value={searchQuery} onChange={setSearchQuery} />
              <Search className="absolute right-2 top-2/4 -translate-y-1/2 text-gray-500" />
            </div>
            <div className="relative flex items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Đang bán">Đang bán</SelectItem>
                  <SelectItem value="Ngừng bán">Ngừng bán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="h-[40px] bg-[#16A34A] hover:bg-[#16A34A]/80 flex items-center gap-2 cursor-pointer" onClick={() => setOpen(true)}>
            <PlusCircle className="w-4 h-4" />
            Thêm món ăn
          </Button>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 gap-4 mt-4">
        <FoodList 
          searchQuery={searchQuery} 
          statusFilter={statusFilter}  
          refreshKey={refreshKey} 
          onEdit={(food) => {
            setSelectedFood(food);
            setOpenEdit(true);
          }} 
          onRefresh={() => setRefreshKey(prev => prev + 1)}/>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1E40AF]">Thêm món ăn</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên món ăn</label>
              <Input
                placeholder="Cơm tấm"
                value={tenMonAn}
                onChange={(e) => setTenMonAn(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả (0/500)</label>
              <Textarea
                placeholder="Món ăn gồm có sườn, bì, chả, 2 quả trứng kèm thêm mỡ hành."
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

            {/* Dropdown danh mục */}
            <div>
              <label className="block text-sm font-medium mb-2">Phân loại món ăn</label>                
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

            {/* Dropdown loại tồn kho */}
            <div>
              <label className="block text-sm font-medium mb-2">Loại tồn kho</label>
              <Select value={loaiTonKho} onValueChange={setLoaiTonKho}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại tồn kho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reset">Reset</SelectItem>
                  <SelectItem value="Chuyển tồn">Chuyển tồn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button className="cursor-pointer" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-[#16a34a] hover:bg-[#16a34a]/80 cursor-pointer" onClick={handleSubmit} disabled={saving}>
              {saving ? "Đang lưu..." : "Thêm món ăn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditFoodDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        food={selectedFood}
        onUpdated={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}