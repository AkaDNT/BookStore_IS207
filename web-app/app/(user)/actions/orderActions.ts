"use server";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { Order } from "../models/Order";

export const orderItemsInCart = async (
  data: FieldValues,
  paymentMethod: string
) => {
  return await fetchWrapper.post(
    `/order/users/payments/${paymentMethod}`,
    data
  );
};

export const getMyOrders = async (): Promise<Order[]> => {
  return await fetchWrapper.get(`/user/my-orders`);
};

export const getAllOrders = async (): Promise<Order[]> => {
  return await fetchWrapper.get(`/order`);
};
