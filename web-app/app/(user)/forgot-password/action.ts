"use server";

export async function sendForgotPasswordRequest(
  email: string
): Promise<{ message: string }> {
  const res = await fetch(`${process.env.API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Failed to send reset email");
  }
  return res.json();
}
