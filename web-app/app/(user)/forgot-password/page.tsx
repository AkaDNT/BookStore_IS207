"use client";

import { useState } from "react";
import { sendForgotPasswordRequest } from "./action";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const result = await sendForgotPasswordRequest(email);
      setMessage(result.message || "Reset link sent successfully!");
    } catch (err) {
      setError("Failed to send reset email. Please try again. Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 md:px-8 py-10 sm:py-14">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2 sm:mb-3">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6 sm:mb-8">
          Enter your email to receive a password reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-12 rounded-xl bg-blue-600 text-white text-sm sm:text-base font-medium
                       hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div role="status" aria-live="polite" className="mt-4 min-h-[1.25rem]">
          {message && (
            <p className="text-green-600 text-center text-sm">{message}</p>
          )}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
