"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import AccountSidebar from "./AccountSidebar";

export default function MobileAccountSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Menu className="w-5 h-5" />
        <span className="text-sm font-medium">Account Menu</span>
      </button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Drawer trái */}
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white z-50 shadow-xl transform transition-transform duration-150 ease-out"
            style={{ transform: "translateX(0)" }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-base font-semibold">Account</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <AccountSidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
