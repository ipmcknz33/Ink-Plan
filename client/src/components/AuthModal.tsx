import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  if (data.user && data.user.id && data.user.email) {
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

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const endpoint =
        mode === "signup" ? "/api/auth/register" : "/api/auth/login";

      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data: AuthResponseShape = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Authentication failed");
      }

      const user = extractUser(data);

      if (!user) {
        throw new Error("Auth succeeded but no user payload was returned");
      }

      login(user);

      setEmail("");
      setPassword("");
      setError("");
      setMode("signin");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 text-neutral-500 transition hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close auth modal"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            {mode === "signup"
              ? "Create an InkPlan account to save your progress."
              : "Sign in to continue to InkPlan."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="auth-email"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="Enter your password"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl"
          >
            {submitting
              ? mode === "signup"
                ? "Creating account..."
                : "Signing in..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-neutral-600">
          {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setError("");
              setMode(mode === "signup" ? "signin" : "signup");
            }}
            className="font-medium text-neutral-900 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
