"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Props {
  title: string;
}

export default function BookImage({ title }: Props) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      src={"/assets/" + title.toLowerCase().replace(/\s+/g, "-") + ".jpg"}
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
