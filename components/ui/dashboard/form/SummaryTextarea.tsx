"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/dashboard/primitives/textarea";
import { Label } from "@/components/ui/dashboard/primitives/label";

interface SummaryTextareaProps {
  name: string;
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function SummaryTextarea({
  name,
  label = "Summary",
  value,
  onChange,
}: SummaryTextareaProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onChange([...value, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  return (
    <div>
      <Label htmlFor={name}>{label} (tekan Enter untuk tambah)</Label>
      <Textarea
        id={name}
        name={name}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
        placeholder="Ketik lalu tekan Enter..."
      />

      <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
        {value.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
