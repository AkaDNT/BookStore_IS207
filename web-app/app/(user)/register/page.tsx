"use client";

import { useActionState } from "react";
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

    if (username.length < 3) {
      errors.userName = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }

    if (password.length < 7) {
      errors.password = "Password must be at least 7 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);

    return !Object.values(errors).some((err) => err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    if (!validateForm(formData)) {
      e.preventDefault(); // Block submission if validation fails
    }
  };

  useEffect(() => {
    if (state?.success) {
      toast.success("Sign up successfully");
    } else if (state?.success === false) {
      toast.error(state.message || "Failed to sign up");
    }
  }, [state]);

  return (
    <div className="py-20 px-4 bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name
            </label>
            <input
              name="userName"
              autoComplete="off"
              type="text"
              placeholder="Your user name"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.userName && (
              <p className="text-red-500 text-sm mt-1">{formErrors.userName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              autoComplete="off"
              type="email"
              placeholder="email@example.com"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Sign up
          </button>

          {state?.message && !state.success && (
            <p className="text-red-500 text-center text-sm mt-2">
              {state.message}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
