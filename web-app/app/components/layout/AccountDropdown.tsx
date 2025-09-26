"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CurrentUser } from "@/app/actions/getCurrentUser";
import { User } from "lucide-react";

export default function AccountDropdown({
  user,
}: {
  user: CurrentUser | null;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <User size={24} />
        <span className="text-sm mt-1">
          {!user ? "Account" : user.userName}
        </span>
      </div>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden">
          {!user ? (
            <button
              onClick={() => {
                router.push("/login");
                setShowDropdown(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Log in
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  router.push("/account/profile");
                  setShowDropdown(false);
                }}
                className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Profile
              </button>
              <form action="/logout" method="POST">
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
