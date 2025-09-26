// app/actions/loginUser.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(prevState: unknown, formData: FormData) {
  const res = await fetch(`${process.env.API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
  });

  if (!res.ok) {
    return { success: false, message: "Invalid credentials" };
  }

  const { jwtToken, roles } = await res.json();
  const cookieStore = cookies();

  (await cookieStore).set("jwtToken", jwtToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2h
  });
  if (roles.includes("ROLE_ADMIN")) redirect("/admin");
  redirect("/");
}
