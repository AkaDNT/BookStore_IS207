"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navStatistic = [{ label: "Statistics", href: "/admin" }];

const navItems = [
  { label: "Books", href: "/admin/manage-books" },
  { label: "Users", href: "/admin/manage-users" },
  { label: "Customers", href: "/admin/manage-customers" },
  { label: "Employees", href: "/admin/manage-employees" },
  { label: "Orders", href: "/admin/manage-orders" },
];

export default function NavAdmin() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen px-4 py-8 bg-gradient-to-b from-purple-100 via-rose-100 to-white border-r border-gray-200 flex flex-col transition-all duration-300">
      <h2 className="text-2xl font-bold text-purple-700 mb-8">RGBunny</h2>

      {/* Main Navigation */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        ANALYTICS
      </h3>
      <nav className="flex flex-col space-y-1">
        {navStatistic.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === item.href
                ? "bg-purple-200 text-purple-800 shadow-sm"
                : "text-gray-700 hover:bg-purple-50"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          SALES
        </h3>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-purple-200 text-purple-800 shadow-sm"
                  : "text-gray-700 hover:bg-purple-50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* CTA / Footer */}
      <div className="mt-auto bg-gradient-to-r from-rose-100 to-purple-100 rounded-xl p-4 border border-purple-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          Upgrade Pro
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Unlock premium features with Pro
        </p>
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Upgrade $50
        </button>
      </div>
    </aside>
  );
}
