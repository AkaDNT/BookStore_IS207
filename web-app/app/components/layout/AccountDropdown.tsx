"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "lucide-react";
import { CurrentUser } from "@/app/(user)/actions/getCurrentUser";

export default function AccountDropdown({
  user,
}: {
  user: CurrentUser | null;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

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

  // Đóng dropdown khi chuyển route
  useEffect(() => {
    setShowDropdown(false);
  }, [pathname]);

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <User size={24} />
        {/* Ẩn nhãn ở mobile, hiện từ md+; co chữ theo breakpoint */}
        <span className="mt-1 hidden md:block text-sm">
          {!user ? "Account" : user.userName}
        </span>
      </div>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-44 md:w-56 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden">
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
