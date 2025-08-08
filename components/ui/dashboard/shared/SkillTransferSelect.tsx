"use client";

import { useState } from "react";
import { Button } from "@/components/ui/dashboard/button";

interface Option {
  label: string;
  value: string;
}

interface SkillTransferSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function SkillTransferSelect({
  options,
  selected,
  onChange,
}: SkillTransferSelectProps) {
  const [available, setAvailable] = useState<Option[]>(
    options.filter((opt) => !selected.includes(opt.value))
  );

  const [chosen, setChosen] = useState<Option[]>(
    options.filter((opt) => selected.includes(opt.value))
  );

  const moveToSelected = (item: Option) => {
    setAvailable((prev) => prev.filter((o) => o.value !== item.value));
    setChosen((prev) => [...prev, item]);
    onChange([...chosen.map((o) => o.value), item.value]);
  };

  const moveToAvailable = (item: Option) => {
    setChosen((prev) => prev.filter((o) => o.value !== item.value));
    setAvailable((prev) => [...prev, item]);
    onChange(chosen.filter((o) => o.value !== item.value).map((o) => o.value));
  };

  return (
    <div className="flex gap-4">
      {/* Available skills */}
      <div className="flex-1 border p-2 rounded">
        <h4 className="font-semibold mb-2 text-sm">Available Skills</h4>
        <ul className="space-y-1 max-h-40 overflow-auto">
          {available.map((item) => (
            <li key={item.value}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveToSelected(item)}
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Selected skills */}
      <div className="flex-1 border p-2 rounded">
        <h4 className="font-semibold mb-2 text-sm">Selected Skills</h4>
        <ul className="space-y-1 max-h-40 overflow-auto">
          {chosen.map((item) => (
            <li key={item.value}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => moveToAvailable(item)}
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
