"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Props {
  title: string;
  imageUrl: string;
  fit?: "cover" | "contain";
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export default function BookImage({
  title,
  imageUrl,
  fit = "cover",
  sizes = "(max-width: 1024px) 100vw, 50vw", // responsive sizes
  className = "",
  priority = false,
}: Props) {
  const [isLoading, setLoading] = useState(true);
  const [src, setSrc] = useState<string>("");
  const slug = (title || "book").toLowerCase().trim().replace(/\s+/g, "-");

  function pickSrc(v?: string | null) {
    if (
      typeof v === "string" &&
      v.trim() &&
      v !== "null" &&
      v !== "undefined"
    ) {
      return v;
    }
    return `/assets/${slug}.jpg`;
  }

  const actualSrc = src || pickSrc(imageUrl); // fix fallback ảnh

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={actualSrc}
        alt={title || "book"}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: fit, objectPosition: "center" }}
        className={`rounded-md duration-500 ease-in-out ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          const fallback = `/assets/${slug}.jpg`;
          if (actualSrc !== fallback) setSrc(fallback);
          setLoading(false);
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 rounded-md bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
