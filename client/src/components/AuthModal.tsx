"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth, type AuthUser } from "@/components/providers/AuthProvider";

type AuthMode = "signin" | "signup";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

type AuthResponseShape = {
  user?: AuthUser;
  id?: string;
  email?: string;
  createdAt?: string;
  error?: string;
  message?: string;
};

function extractUser(data: AuthResponseShape): AuthUser | null {
  if (data.user?.id && data.user?.email) {
    return data.user;
  }

  if (data.id && data.email) {
    return {
      id: data.id,
      email: data.email,
      createdAt: data.createdAt,
    };
  }

  return null;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const endpoint =
        mode === "signin" ? "/api/auth/login" : "/api/auth/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = (await response.json()) as AuthResponseShape;

      if (!response.ok) {
        setError(data.error || data.message || "Authentication failed");
        return;
      }

      const user = extractUser(data);

      if (!user) {
        setError("Authentication succeeded, but no user was returned");
        return;
      }

      login(user);
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (submitting) return;
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
          aria-label="Close auth modal"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === "signin"
              ? "Log in to continue into InkPlan."
              : "Create your InkPlan account to get started."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-black"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="Enter your password"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-black px-4 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting
              ? mode === "signin"
                ? "Signing In..."
                : "Creating Account..."
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}
            className="font-semibold text-black underline"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
