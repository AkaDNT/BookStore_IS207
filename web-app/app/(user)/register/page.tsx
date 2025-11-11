"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signupUser } from "./action";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [state, formAction] = useActionState(signupUser, null);

  const [formErrors, setFormErrors] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = (formData: FormData) => {
    const errors = {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    const username = formData.get("userName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    if (username.length < 3)
      errors.userName = "Username must be at least 3 characters";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = "Invalid email format";
    if (password.length < 7)
      errors.password = "Password must be at least 7 characters";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    if (!validateForm(formData)) e.preventDefault();
  };

  useEffect(() => {
    if (state?.success) toast.success("Sign up successfully");
    else if (state?.success === false)
      toast.error(state.message || "Failed to sign up");
  }, [state]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 md:px-8 py-10 sm:py-14">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2 sm:mb-3">
          Sign Up
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6 sm:mb-8">
          Create your account to get started.
        </p>

        <form
          action={formAction}
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5"
          noValidate
        >
          <div>
            <label
              htmlFor="userName"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
            >
              User Name
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              autoComplete="username"
              placeholder="Your user name"
              required
              className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.userName && (
              <p className="text-red-500 text-sm mt-1">{formErrors.userName}</p>
            )}
          </div>

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
              placeholder="email@example.com"
              required
              className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-11 sm:h-12 bg-blue-600 text-white rounded-xl text-sm sm:text-base font-medium
                       hover:bg-blue-700 transition"
          >
            Sign up
          </button>

          <div role="status" aria-live="polite" className="min-h-[1.25rem]">
            {state?.message && !state.success && (
              <p className="text-red-500 text-center text-sm mt-2">
                {state.message}
              </p>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
