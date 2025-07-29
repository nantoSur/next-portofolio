"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 ml-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}
