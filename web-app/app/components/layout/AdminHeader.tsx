"use client";

import { CurrentUser } from "@/app/(user)/actions/getCurrentUser";
import AccountDropdown from "./AccountDropdown";
import { CalendarDays } from "lucide-react";

interface Props {
  currentUser: CurrentUser | null;
}

export default function AdminHeader({ currentUser }: Props) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-8 py-4 bg-gradient-to-r from-purple-100 via-rose-100 to-white border-b border-gray-200 shadow-md rounded-b-xl">
      {/* Left Spacer - For balance */}
      <div className="flex-1"></div>

      {/* Centered Welcome Text */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-xl font-semibold text-gray-800 text-center">
          Welcome{" "}
          <span className="text-purple-700 font-bold">
            {currentUser?.userName}
          </span>{" "}
          to RGBunny Dashboard
        </h1>
      </div>

      {/* Right Section - Date and Account */}
      <div className="flex-1 flex items-center justify-end gap-6">
        {/* Date Section with increased gap */}
        <div className="hidden md:flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 text-gray-700">
          <CalendarDays className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>

        {/* Account Dropdown with margin */}
        <div className="ml-4">
          <AccountDropdown user={currentUser} />
        </div>
      </div>
    </header>
  );
}
