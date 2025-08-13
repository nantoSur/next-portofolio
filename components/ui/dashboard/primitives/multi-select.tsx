"use client";

import * as React from "react";
import { Label } from "./label";

type Option = {
  label: string;
  value: string; // Ubah dari number ke string
};

interface MultiSelectProps {
  options: Option[];
  selected: string[]; // Ubah dari number[] ke string[]
  onChange: (selected: string[]) => void; // Ubah dari number[] ke string[]
  label?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  label,
}: MultiSelectProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={`border rounded px-2 py-1 text-sm ${
              selected.includes(option.value)
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 dark:bg-gray-800 dark:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
