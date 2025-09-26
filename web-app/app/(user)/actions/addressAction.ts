"use server";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";

export const addAddress = async (data: FieldValues) => {
  return await fetchWrapper.post(`/addresses`, data);
};

export const updateAddress = async (data: FieldValues, id: number) => {
  return await fetchWrapper.patch(`/addresses/${id}`, data);
};
