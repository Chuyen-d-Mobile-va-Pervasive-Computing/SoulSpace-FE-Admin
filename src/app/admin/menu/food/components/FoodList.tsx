"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Food = {
    mon_an_id: number;
    ten_mon_an: string;
    hinh_anh?: string | null;
    mo_ta?: string | null;
    trang_thai?: string;
    ten_danh_muc?: string | null;
};

interface FoodListProps {
    searchQuery: string;
    statusFilter: string;
    refreshKey: number;
    onEdit: (food: Food) => void;
    onRefresh: () => void;
}

export default function FoodList({ searchQuery, statusFilter, refreshKey, onEdit, onRefresh }: FoodListProps) {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

    useEffect(() => {
        const fetchFoods = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_PATH}/api/v1/mon-an/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch foods");

            const data = await res.json();
            setFoods(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        fetchFoods();
    }, [API_PATH, refreshKey]);

    const filteredFoods = useMemo(() => {
        return foods.filter((food) => {
            const matchesSearch =
            food.ten_mon_an.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (food.mo_ta?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

            const matchesStatus =
            statusFilter === "all" || food.trang_thai === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [foods, searchQuery, statusFilter]);

    // lấy danh mục
    const categories = useMemo(() => {
        const set = new Set(filteredFoods.map((f) => f.ten_danh_muc).filter(Boolean));
        return Array.from(set) as string[];
    }, [filteredFoods]);

    const handleDeactivate = async () => {
        if (!selectedFood) return;
        try {
        const res = await fetch(
            `${API_PATH}/api/v1/mon-an/${selectedFood.mon_an_id}/deactivate`,
            {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            credentials: "include",
            }
        );

        if (!res.ok) {
            // throw new Error("Deactivate failed");
            toast.error("Ngưng phục vụ món thất bại");
        } else {
            toast.success("Ngưng phục vụ món thành công");
        }
        setConfirmOpen(false);
        onRefresh();
        } catch (err) {
        console.error(err);
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="w-full gap-4 bg-white p-4 rounded-[10px]">
            <Tabs defaultValue="all" className="w-full">
                {/* Thanh tab */}
                <TabsList className="flex flex-wrap gap-2 mb-4">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    {categories.map((cat) => (
                    <TabsTrigger key={cat} value={cat}>
                        {cat}
                    </TabsTrigger>
                    ))}
                </TabsList>

                {/* Tab tất cả → group theo danh mục */}
                <TabsContent value="all" className="space-y-6">
                    {filteredFoods.length === 0 ? (
                        <p className="text-center text-gray-500">Chưa có món ăn nào</p>
                    ) : (
                        categories.map((cat) => {
                            const items = filteredFoods.filter((f) => f.ten_danh_muc === cat);
                            if (items.length === 0) return null;
                            return (
                                <div key={cat}>
                                    <h3 className="text-lg font-semibold mb-2">{cat}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {items.map((food) => (
                                            <FoodCard
                                                key={food.mon_an_id}
                                                food={food}
                                                router={router}
                                                onEdit={() => onEdit(food)}
                                                onDeactivate={() => {
                                                    setSelectedFood(food);
                                                    setConfirmOpen(true);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </TabsContent>

                {/* Các tab theo từng danh mục */}
                {categories.map((cat) => (
                    <TabsContent key={cat} value={cat}>
                    {filteredFoods.filter((food) => food.ten_danh_muc === cat).length === 0 ? (
                        <p className="text-center text-gray-500">Chưa có món ăn nào</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredFoods
                            .filter((food) => food.ten_danh_muc === cat)
                            .map((food) => (
                                <FoodCard
                                    key={food.mon_an_id}
                                    food={food}
                                    router={router}
                                    onEdit={() => onEdit(food)}
                                    onDeactivate={() => {
                                        setSelectedFood(food);
                                        setConfirmOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    </TabsContent>
                ))}
            </Tabs>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Ngừng bán món{" "}
                            <span className="font-semibold">{selectedFood?.ten_mon_an}</span>?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Bạn có chắc chắn muốn ngừng bán món ăn này?
                    </p>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <Button className="cursor-pointer" variant="outline" onClick={() => setConfirmOpen(false)}>
                            Hủy
                        </Button>
                        <Button className="bg-[#EF4444] hover:bg-[#EF4444]/80 cursor-pointer" onClick={handleDeactivate}>
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function FoodCard({ food, router, onEdit, onDeactivate }: { food: Food; router: any, onEdit: (food: Food) => void, onDeactivate: (food: Food) => void }) {
    return (
        <div
            className="p-4 rounded-lg text-center hover:shadow-lg hover:bg-[#1E40AF]/10 transition"
        >
            <div
                className={`shadow rounded w-full overflow-hidden flex flex-col text-left text-base text-black font-inter
                    ${food.trang_thai === "Ngừng bán" ? "grayscale" : "bg-white"}
                `}
            >
                {/* Ảnh + trạng thái */}
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    {food.hinh_anh ? (
                        <img
                            src={food.hinh_anh}
                            alt={food.ten_mon_an}
                            className="object-cover w-full h-full"
                        />
                        ) : (
                        <span className="text-gray-500 text-sm">Không có ảnh</span>
                    )}

                    {/* Badge trạng thái */}
                    <span
                        className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-medium shadow
                            ${food.trang_thai === "Đang bán" ? "bg-green-500 text-white" : ""}
                            ${food.trang_thai === "Ngừng bán" ? "bg-gray-500 text-white" : ""}
                        `}
                    >
                        {food.trang_thai || "Không rõ"}
                    </span>
                </div>

                {/* Tên + mô tả */}
                <div className="p-2.5 flex flex-col gap-2.5">
                    <div className="flex flex-row items-center justify-between">
                        <div className="font-semibold truncate">{food.ten_mon_an}</div>
                        <div className="flex flex-row items-center gap-2">
                            <button className="cursor-pointer" onClick={() => onEdit(food)}>
                                <Pencil color="#1E40AF" size={18} />
                            </button>
                            {food.trang_thai === "Đang bán" && (
                                <button className="cursor-pointer" onClick={() => onDeactivate(food)}>
                                <Trash2 color="#EF4444" size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="text-xs text-darkslategray line-break">
                        {food.mo_ta}
                    </div>
                </div>
            </div>
        </div>
    );
}