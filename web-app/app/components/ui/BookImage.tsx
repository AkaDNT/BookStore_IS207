"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Props {
  title: string;
  imageUrl: string;
}

export default function BookImage({ title, imageUrl }: Props) {
  const [isLoading, setLoading] = useState(true);
  const slug = title.toLowerCase().trim().replace(/\s+/g, "-");

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
    <Image
      src={pickSrc(imageUrl)}
      alt={`${title}`}
      fill
      style={{ objectFit: "cover" }}
      className={`rounded-md cursor-pointer duration-700 ease-in-out
        ${
          isLoading
            ? "grayscale blur-2xl scale-110"
            : "grayscale-0 blur-0 scale-100"
        }`}
      onLoad={() => setLoading(false)}
    />
  );
}
