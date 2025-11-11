"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { sendResetPasswordRequest } from "./action";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Invalid reset link.");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");

    setLoading(true);
    try {
      const result = await sendResetPasswordRequest(password, token);
      toast.success(result.message || "Password reset successfully.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      toast.error("Failed to reset password. Please try again. Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 md:px-8 py-10 sm:py-14">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2 sm:mb-3">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6 sm:mb-8">
          Enter a new password for your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5"
          noValidate
        >
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              required
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-12 bg-blue-600 text-white rounded-xl text-sm sm:text-base font-medium
                       hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
