"use client";

import Link from "next/link";
import { ShoppingCart, BookText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface Props {
  totalCartsItem: number;
}

type FlyState = {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  key: number;
};

export default function CartButton({ totalCartsItem }: Props) {
  const [animate, setAnimate] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const [flyState, setFlyState] = useState<FlyState | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as CustomEvent<{ from: DOMRect }>;
      if (!cartRef.current || !e.detail?.from) return;

      const from = e.detail.from;
      const cartRect = cartRef.current.getBoundingClientRect();

      const startX = from.left + from.width / 2;
      const startY = from.top + from.height / 2;
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;

      setFlyState({
        startX,
        startY,
        deltaX: endX - startX,
        deltaY: endY - startY,
        key: Date.now(),
      });

      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    };

    window.addEventListener("fly-to-cart", handler as EventListener);
    return () =>
      window.removeEventListener("fly-to-cart", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!totalCartsItem) return;
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(t);
  }, [totalCartsItem]);

  return (
    <>
      {flyState && (
        <FlyingBookIcon fly={flyState} onDone={() => setFlyState(null)} />
      )}

      <div
        ref={cartRef}
        className={clsx(
          "relative inline-flex flex-col items-center",
          animate && "animate-bounce"
        )}
      >
        <Link href="/my-cart" aria-label="Open cart">
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />

          {totalCartsItem > 0 && (
            <span className="absolute -top-1 -right-2 md:-right-3 bg-red-500 text-white text-[10px] md:text-xs font-semibold min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 flex items-center justify-center rounded-full">
              {totalCartsItem}
            </span>
          )}

          <span className="mt-1 text-xs text-gray-700 hidden md:block">
            Cart
          </span>
          <span className="sr-only">Cart</span>
        </Link>
      </div>
    </>
  );
}

function FlyingBookIcon({
  fly,
  onDone,
}: {
  fly: FlyState;
  onDone: () => void;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setActive(true));
    const timer = setTimeout(() => {
      onDone();
    }, 700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [fly.key, onDone]);

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: fly.startX,
        top: fly.startY,
        transform: active
          ? `translate(calc(-50% + ${fly.deltaX}px), calc(-50% + ${fly.deltaY}px)) scale(0.4)`
          : "translate(-50%, -50%) scale(1)",
        opacity: active ? 0 : 1,
        transition:
          "transform 0.7s cubic-bezier(0.22,0.61,0.36,1), opacity 0.7s",
      }}
    >
      <BookText className="w-6 h-6 text-purple-600" />
    </div>
  );
}
