"use server";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { CartResponse } from "../models/CartResponse";

export const getTotalCartsItem = async (): Promise<number> => {
  return await fetchWrapper.get(`/carts/total-items`);
};

export const getUsersCart = async (): Promise<CartResponse> => {
  return await fetchWrapper.get("/carts/users/cart");
};

export const addOrDeleteItem = async (
  id: string,
  action: string
): Promise<CartResponse> => {
  return await fetchWrapper.patch(`/carts/book/${id}/quantity/${action}`, null);
};

export const addToCart = async (
  id: string,
  quantity: number
): Promise<CartResponse> => {
  return await fetchWrapper.postWithoutBody(
    `/carts/books/${id}/quantity/${quantity}`
  );
};

export const deleteBookFromCart = async (bookId: string) => {
  return await fetchWrapper.del(`/carts/book/${bookId}`);
};
