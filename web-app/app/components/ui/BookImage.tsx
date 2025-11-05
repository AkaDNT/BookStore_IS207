"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Props {
  title: string;
  imageUrl: string;
  // fit: cover (mặc định) hoặc contain để ảnh không bị crop
  fit?: "cover" | "contain";
  // cho phép override sizes khi cần tối ưu responsive
  sizes?: string;
  // thêm className nếu cần style container
  className?: string;
  // ưu tiên load (hero image)
  priority?: boolean;
}

export default function BookImage({
  title,
  imageUrl,
  fit = "cover",
  sizes = "100vw",
  className = "",
  priority = false,
}: Props) {
  const [isLoading, setLoading] = useState(true);
  const [src, setSrc] = useState<string>("");
  const slug = (title || "book").toLowerCase().trim().replace(/\s+/g, "-");

  function pickSrc(v?: string | null) {
    if (
      typeof v === "string" &&
      v.trim() !== "" &&
      v !== "null" &&
      v !== "undefined"
    ) {
      return v;
    }
    return `/assets/${slug}.jpg`;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={pickSrc(imageUrl)}
        alt={title || "book"}
        fill
        sizes={sizes}
        priority={priority}
        // dùng objectFit động để phù hợp nhiều bố cục
        style={{ objectFit: fit, objectPosition: "center" }}
        // hiệu ứng loading nhẹ, không scale quá mức để tránh “nhảy” layout
        className={`rounded-md duration-500 ease-in-out
          ${isLoading ? "opacity-0" : "opacity-100"}
        `}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          const fallback = `/assets/${slug}.jpg`;
          if (src !== fallback) setSrc(fallback);
          setLoading(false);
        }}
      />

      {/* skeleton mờ khi đang tải */}
      {isLoading && (
        <div className="absolute inset-0 rounded-md bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
