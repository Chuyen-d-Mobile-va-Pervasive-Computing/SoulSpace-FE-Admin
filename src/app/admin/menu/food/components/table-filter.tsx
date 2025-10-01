"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface TableFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TableFilter({ value, onChange }: TableFilterProps) {
  return (
    <div className="relative">
      <Input
        placeholder="Tìm kiếm theo tên, mô tả"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[300px] pr-8"
      />
    </div>
  );
}