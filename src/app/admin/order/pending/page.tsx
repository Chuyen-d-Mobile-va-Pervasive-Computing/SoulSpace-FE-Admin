"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { getColumns, Order } from "./components/columns";
import PopupDeleteOrder from "./components/PopupDeleteOrder";
import PopupOrderDetail from "./components/PopupOrderDetail";

export default function PageManageOrder() {
  const [data, setData] = useState<Order[]>([]);
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  const handleOpenDetail = async (order: Order) => {
    try {
      const res = await fetch(`${API_PATH}/api/v1/don-hang/${order.don_hang_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch order detail");
      const data = await res.json();
      setSelectedOrder(data);
      setDetailOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    fetch(`${API_PATH}/api/v1/don-hang/all/cho-thanh-toan`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [API_PATH]);

  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      <DataTable
        columns={getColumns(handleOpenDetail, handleDelete)} 
        data={data}
        isLoading={isLoading}
        error={error}
        refetch={fetchData}
      />

      <PopupDeleteOrder
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        orderId={selectedOrder?.don_hang_id ?? null}
        onDelete={fetchData}
      />

      <PopupOrderDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        order={selectedOrder}
      />
    </div>
  );
}