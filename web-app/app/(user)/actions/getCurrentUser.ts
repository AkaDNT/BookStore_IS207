"use server";

import { cookies } from "next/headers";
import { UserAddress } from "../models/Address";

export interface CurrentUser {
  userName: string;
  email: string;
  addresses: UserAddress[];
  phoneNumber: string;
  roles: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const jwtToken = (await cookies()).get("jwtToken")?.value;
  if (!jwtToken) return null;

  const res = await fetch(`${process.env.API_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();

  return {
    userName: data.userName,
    email: data.email,
    addresses: data.addresses,
    roles: data.roles,
    phoneNumber: data.phoneNumber,
  };
}
