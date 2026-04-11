"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: string;
  email: string;
  createdAt?: string;
};

export type AuthAccess = {
  phase: "trial" | "subscribed" | "expired";
  subscriptionTier: "free" | "pro" | "premium";
  trialStartedAt: string | null;
  trialEndsAt: string | null;
  accessibleStyles: string[];
  lockedPreview: string[];
};

type AuthMeResponse = {
  user: AuthUser;
  access: AuthAccess;
};

type AuthContextValue = {
  user: AuthUser | null;
  access: AuthAccess | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (payload: AuthMeResponse | AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

async function fetchCurrentUser(): Promise<AuthMeResponse | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data = (await response.json()) as AuthMeResponse;
  return data;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [access, setAccess] = useState<AuthAccess | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const refreshUser = async (): Promise<AuthUser | null> => {
    try {
      const current = await fetchCurrentUser();

      if (!current) {
        setUser(null);
        setAccess(null);
        return null;
      }

      setUser(current.user);
      setAccess(current.access);
      return current.user;
    } catch (error) {
      console.error("Auth refresh failed:", error);
      setUser(null);
      setAccess(null);
      return null;
    } finally {
      setIsHydrated(true);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const login = (payload: AuthMeResponse | AuthUser) => {
    if ("user" in payload) {
      setUser(payload.user);
      setAccess(payload.access);
    } else {
      setUser(payload);
      setAccess(null);
    }

    setIsHydrated(true);
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setAccess(null);
      setIsHydrated(true);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      access,
      isAuthenticated: !!user,
      isHydrated,
      login,
      logout,
      refreshUser,
    }),
    [user, access, isHydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
