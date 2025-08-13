"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "WORK", path: "/#work" },
    { name: "RESUME", path: "/#resume" },
    { name: "ABOUT", path: "/#about" },
  ];

  return (
    <header className="w-full mt-10">
      <div className="max-w-3xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="text-lg font-bold tracking-wide">
          <Link href="/" className="hover:opacity-80 transition">
            NANTO.
          </Link>
        </div>

        {/* Menu */}
        <nav className="space-x-8 text-sm">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path.startsWith("/#") && pathname === "/");

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`font-semibold transition duration-300 ${
                  isActive
                    ? "text-gray-600 dark:text-gray-300"
                    : "text-gray-800 dark:text-gray-200"
                } hover:text-gray-500 dark:hover:text-gray-400 hover:blur-[0.3px]`}
              >
                {item.name}
              </Link>
            );
          })}
          <DarkModeToggle />
        </nav>
      </div>
      <svg
        className="block w-full h-6"
        viewBox="0 0 1440 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 20 Q180 0 360 20 T720 20 T1080 20 T1440 20"
          className="stroke-gray-400 dark:stroke-white"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
    </header>
  );
}
