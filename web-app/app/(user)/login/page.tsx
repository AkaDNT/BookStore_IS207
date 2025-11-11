"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser } from "./action";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginUser, null);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 md:px-8 py-10 sm:py-14">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2 sm:mb-3">
          Login
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6 sm:mb-8">
          Enter your credentials to continue.
        </p>

        <form action={formAction} className="space-y-4 sm:space-y-5" noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
            >
              User Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              inputMode="text"
              autoComplete="username"
              placeholder="Your user name"
              required
              className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
              autoComplete="current-password"
              placeholder="••••••••"
              required
              className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="text-right -mt-1">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full h-11 sm:h-12 rounded-xl bg-blue-600 text-white text-sm sm:text-base font-medium
                       hover:bg-blue-700 transition"
          >
            Log in
          </button>

          <div role="status" aria-live="polite" className="min-h-[1.25rem]">
            {state?.message && (
              <p className="text-red-500 text-center text-sm mt-2">
                {state.message}
              </p>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
