"use server";

import { fetchWrapper } from "@/lib/fetchWrapper";
import type { Order } from "../models/Order";

export type OrderApiResult =
  | Order
  | { error: { status: string; message: string } };

type ApiError = { error: { status: string; message: string } };
export type VnpayCreateResult = VnpayCreateResponse | ApiError;

export type VnpayCreateResponse = {
  code: string;
  message: string;
  data: string;
  orderCode: string;
};

export const getOrderByOrderCode = async (
  orderCode: string
): Promise<OrderApiResult> => {
  return await fetchWrapper.get(`/orders/by-code/${orderCode}`);
};

export const createVnpayPayment = async (
  addressId: number
): Promise<VnpayCreateResult> => {
  return await fetchWrapper.post("/payments/vnpay/create", { addressId });
};
