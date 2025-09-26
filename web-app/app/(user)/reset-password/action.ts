"use server";

export async function sendResetPasswordRequest(
  password: string,
  query: string
): Promise<{ message: string }> {
  const res = await fetch(`${process.env.API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      newPassword: password,
      token: query,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to send reset email");
  }
  return res.json();
}
