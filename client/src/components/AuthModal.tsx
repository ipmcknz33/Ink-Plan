"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth, type AuthUser } from "@/components/providers/AuthProvider";
import { auth, googleProvider } from "@/lib/firebase";

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

async function parseApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return { error: text || "Request failed" };
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, refreshUser } = useAuth();
  const [, navigate] = useLocation();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  const completeAuth = async (fallbackUser: AuthUser) => {
    const refreshedUser = await refreshUser();
    const nextUser = refreshedUser ?? fallbackUser;

    login(nextUser);
    resetForm();
    onClose();
    navigate("/dashboard", { replace: true });
  };

  const handleEmailAuth = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (!email.trim() || !password.trim()) {
        setErrorMessage("Email and password are required.");
        return;
      }

      if (mode === "signup") {
        if (password.length < 6) {
          setErrorMessage("Password must be at least 6 characters.");
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match.");
          return;
        }
      }

      const endpoint =
        mode === "signin" ? "/api/auth/login" : "/api/auth/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.error || data?.message || `${mode} failed`);
      }

      const user = extractUser(data);
      if (!user) {
        throw new Error("No user returned from server");
      }

      await completeAuth(user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      setErrorMessage(message);
      console.error(`${mode} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.error || "Google login failed");
      }

      const user = extractUser(data);
      if (!user) {
        throw new Error("No user returned from backend");
      }

      await completeAuth(user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google login failed";
      setErrorMessage(message);
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/auth/guest", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.error || "Guest login failed");
      }

      const user = extractUser(data);
      if (!user) {
        throw new Error("No guest user returned");
      }

      await completeAuth(user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Guest login failed";
      setErrorMessage(message);
      console.error("Guest login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
        <button
          type="button"
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute right-4 top-4 z-10 text-zinc-400 transition hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="max-h-[90vh] overflow-y-auto p-6">
          <h2 className="mb-1 text-2xl font-semibold text-white">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </h2>

          <p className="mb-4 text-sm text-zinc-400">
            Enter InkPlan and keep building with intention.
          </p>

          <div className="mb-4 flex rounded-2xl border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                mode === "signin"
                  ? "bg-red-600 text-white"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-red-600 text-white"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-red-500/60"
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-red-500/60"
              disabled={loading}
            />

            {mode === "signup" && (
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-red-500/60"
                disabled={loading}
              />
            )}

            {errorMessage ? (
              <p className="text-sm text-red-400">{errorMessage}</p>
            ) : null}

            <Button
              type="button"
              onClick={handleEmailAuth}
              disabled={loading}
              className="w-full bg-red-600 text-white hover:bg-red-500"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Continue with Email"
                  : "Create Account"}
            </Button>

            <div className="my-1 text-center text-sm text-zinc-500">or</div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="outline"
              className="w-full border-white/10 bg-transparent text-white hover:bg-white/5"
            >
              Continue with Google
            </Button>

            <Button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              variant="outline"
              className="w-full border-white/10 bg-transparent text-white hover:bg-white/5"
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
