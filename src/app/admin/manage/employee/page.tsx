"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { getColumns, Cashier } from "./components/columns";
import PopupUpdateCashier from "./components/PopupUpdateCashier";
import PopupDeactivateCashier from "./components/PopupDeactivateCashier";

export default function PageManageCashier() {
  const [data, setData] = useState<Cashier[]>([]);
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const handleOpenUpdate = (cashier: Cashier) => {
    console.log("Edit cashier:", cashier); 
    setSelectedCashier(cashier);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedCashier(null);
  };

  const handleUpdated = () => {
    fetchData(); 
  };

  const handleDeactivate = (cashier: Cashier) => {
  setSelectedCashier(cashier);
  setDeactivateOpen(true);
};
  const fetchData = () => {
    setIsLoading(true);
    fetch(`${API_PATH}/api/v1/nhan-vien/`, {
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
        columns={getColumns(handleOpenUpdate, handleDeactivate)}
        data={data}
        isLoading={isLoading}
        error={error}
      />

      <PopupUpdateCashier
        open={openUpdate}
        onClose={handleCloseUpdate}
        cashier={selectedCashier}
        onUpdated={handleUpdated}
      />

      <PopupDeactivateCashier
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        cashierId={selectedCashier?.nhan_vien_id ?? null}
        onDeactivated={fetchData}
      />
    </div>
  );
}