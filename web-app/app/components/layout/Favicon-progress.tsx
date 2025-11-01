"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FaviconProgress() {
  const pathname = usePathname();

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) return;
    const normal = "/favicon.ico";
    const spinning = "/spinner-favicon.ico"; // tự thêm file vào public/

    // Khi URL thay đổi xong, ta chớp spinner 1 khoảng ngắn
    link.href = spinning;
    const t = setTimeout(() => {
      link.href = normal;
    }, 600);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
