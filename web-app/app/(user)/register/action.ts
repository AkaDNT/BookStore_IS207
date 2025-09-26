"use server";

import { handleResponse } from "@/lib/fetchWrapper";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAndSetCookie(jwtToken: string) {
  const cookieStore = cookies();
  (await cookieStore).set("jwtToken", jwtToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 1,
  });

  redirect("/");
}

export async function signupUser(prevState: unknown, formData: FormData) {
  const email = formData.get("email")?.toString();
  const username = formData.get("userName")?.toString();
  const password = formData.get("password")?.toString();

  const res = await fetch(`${process.env.API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  if (!res.ok) {
    const data = await handleResponse(res);
    return { success: false, message: data.error };
  }

  // Call login after signup
  const loginRes = await fetch(`${process.env.API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!loginRes.ok) {
    return { success: false, message: "Signup succeeded but login failed" };
  }

  const { jwtToken } = await loginRes.json();
  await loginAndSetCookie(jwtToken); // Set cookie + redirect to "/"

  return { success: true };
}
