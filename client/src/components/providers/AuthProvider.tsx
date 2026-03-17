import {
  createContext,
  useCallback,
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

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
};

const AUTH_STORAGE_KEY = "inkplan_auth_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as AuthUser;

    if (!parsed?.id || !parsed?.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

type AuthMeResponse = {
  user?: AuthUser;
};

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<AuthUser | null>(() => readStoredUser());
  const [isHydrating, setIsHydrating] = useState(true);

  const setUser = useCallback((nextUser: AuthUser | null) => {
    setUserState(nextUser);
    persistUser(nextUser);
  }, []);

  const login = useCallback(
    (nextUser: AuthUser) => {
      setUser(nextUser);
    },
    [setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateAuth() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (!cancelled) {
            setUser(null);
            setIsHydrating(false);
          }
          return;
        }

        const data = (await response.json()) as AuthMeResponse;
        const verifiedUser = data.user ?? null;

        if (!cancelled) {
          setUser(verifiedUser);
          setIsHydrating(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setIsHydrating(false);
        }
      }
    }

    void hydrateAuth();

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isHydrating,
      login,
      logout,
      setUser,
    }),
    [user, isHydrating, login, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}