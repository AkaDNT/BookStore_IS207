"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getOrderByOrderCode,
  type OrderApiResult,
} from "@/app/(user)/actions/paymentAction";
import type { Order, PaymentStatus } from "@/app/(user)/models/Order";

type OrderStatusResponse = {
  orderCode: string;
  orderStatus: string;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  currency?: string;
  paymentMethod?: string;
  paidAt?: string | null;
  createdAt?: string | null;
};

function formatMoney(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return amount.toLocaleString("vi-VN") + " " + currency;
  }
}

function getStatusConfig(status: PaymentStatus) {
  const s = status?.toUpperCase();
  if (s === "PAID" || s === "SUCCESS") {
    return {
      label: "Payment successful",
      badgeClass:
        "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40",
      iconBg:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
      emoji: "✅",
    };
  }
  if (s === "PENDING" || s === "PROCESSING") {
    return {
      label: "Payment pending",
      badgeClass:
        "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/40",
      iconBg:
        "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
      emoji: "⏳",
    };
  }
  return {
    label: "Payment failed",
    badgeClass:
      "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/40",
    iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
    emoji: "❌",
  };
}

export default function CheckoutResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderCode = searchParams.get("orderCode") ?? "";

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusCfg = useMemo(
    () => getStatusConfig(order?.paymentStatus ?? "PENDING"),
    [order?.paymentStatus]
  );

  useEffect(() => {
    if (!orderCode) {
      setError("Missing orderCode in URL.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const result: OrderApiResult = await getOrderByOrderCode(orderCode);

        if ("error" in result) {
          throw new Error(
            result.error.message || "Unable to fetch order information."
          );
        }

        if (cancelled) return;

        const o = result as Order;

        const mapped: OrderStatusResponse = {
          orderCode: o.orderCode,
          orderStatus: o.orderStatus,
          paymentStatus:
            (o.paymentStatus as PaymentStatus) ??
            (o.payment?.pgStatus as PaymentStatus) ??
            "PENDING",
          totalAmount: o.totalAmount,
          currency: "USD",
          paymentMethod:
            o.payment?.paymentMethod ?? o.payment?.pgName ?? "vnpay",
          createdAt: o.createdAt,
          paidAt: o.paidAt,
        };

        setOrder(mapped);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message || "An error occurred.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderCode]);

  const handleBackHome = () => router.push("/");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${statusCfg.iconBg}`}
            >
              {statusCfg.emoji}
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Payment result
              </p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
                {loading
                  ? "Checking payment status..."
                  : error
                  ? "Unable to verify payment"
                  : statusCfg.label}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {loading
                  ? "Please wait a moment while we verify your payment with VNPAY."
                  : error
                  ? "An error occurred while fetching your order details. You can try again or contact support."
                  : "Your order details are shown below."}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                Order code
              </span>
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                {orderCode ?? "—"}
              </span>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.badgeClass}`}
            >
              {order?.paymentStatus ?? "Checking"}
            </span>
          </div>

          <div className="mt-4 space-y-3 rounded-2xl bg-slate-50/80 p-4 text-sm dark:bg-slate-900/60">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">
                Order status
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {order?.orderStatus ?? "—"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">
                Payment method
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {order?.paymentMethod
                  ? order.paymentMethod.toUpperCase()
                  : "VNPAY"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">
                Total amount
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {order
                  ? formatMoney(order.totalAmount, order.currency ?? "USD")
                  : "—"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">
                Created at
              </span>
              <span className="text-slate-700 dark:text-slate-200">
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleString("vi-VN")
                  : "—"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">
                Paid at
              </span>
              <span className="text-slate-700 dark:text-slate-200">
                {order?.paidAt
                  ? new Date(order.paidAt).toLocaleString("vi-VN")
                  : "—"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleBackHome}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              ← Back to home
            </button>

            <div className="flex gap-2">
              <Link
                href="/order/my-orders"
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                View order history
              </Link>
              <button
                onClick={() => {
                  if (!orderCode) return;
                  router.refresh();
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Check again
              </button>
            </div>
          </div>

          {loading && (
            <p className="mt-3 text-center text-xs text-slate-400">
              Synchronizing with VNPAY payment gateway...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
