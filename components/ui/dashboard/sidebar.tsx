"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  UserPlus,
  Layers,
} from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-500",
  },
  {
    label: "Hero",
    icon: Sparkles,
    href: "/dashboard/hero-section",
    color: "text-indigo-500",
  },
  {
    label: "Skills",
    icon: Layers,
    href: "/dashboard/skills",
    color: "text-purple-500",
  },
  {
    label: "Works",
    icon: Briefcase,
    href: "/dashboard/work-experience",
    color: "text-emerald-500",
  },
  {
    label: "Users",
    icon: UserPlus,
    href: "/dashboard/users",
    color: "text-rose-500",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 px-6 py-8 space-y-10">
      {/* Logo */}
      <div className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
          <LayoutDashboard className="w-6 h-6 text-blue-500" />
        </div>
        TailAdmin
      </div>

      {/* Menu Title */}
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">
        Menu
      </p>

      {/* Menu Items */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition",
                {
                  "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white":
                    isActive,
                  "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800":
                    !isActive,
                }
              )}
            >
              <item.icon
                className={clsx("w-5 h-5", {
                  [item.color]: isActive,
                  "text-gray-500 dark:text-gray-400": !isActive,
                })}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
