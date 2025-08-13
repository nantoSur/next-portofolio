"use client";

import { useState } from "react";
import { Button } from "../primitives/button";
import { Textarea } from "../primitives/textarea";
import { X } from "lucide-react";

interface ListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}

export default function ListInput({ label, items, onChange }: ListInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onChange([...items, trimmed]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleEdit = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>

      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Textarea
            value={item}
            rows={2}
            onChange={(e) => handleEdit(index, e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <div className="flex gap-2 items-start">
        <Textarea
          placeholder="Tambah item..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
          rows={2}
          className="flex-1"
        />
        <Button type="button" onClick={handleAdd}>
          Tambah
        </Button>
      </div>
    </div>
  );
}
