import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { authApi, type AuthTokensResponse } from "./authApi";
import { configureHttpClientAuth } from "../shared/httpClient";

type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAtMs: number;
  username: string;
  roles: string[];
  centroId: string;
  mustChangePassword: boolean;
  profesionalNombre?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  username: string | null;
  profesionalNombre?: string | null;
  centroId: string | null;
  roles: string[];
  mustChangePassword: boolean;
  login: (username: string, password: string, centroId?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const SESSION_STORAGE_KEY = "vitalflow.auth.session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toSession(tokens: AuthTokensResponse): AuthSession {
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAtMs: Date.now() + Math.max(tokens.expiresInSeconds, 1) * 1000,
    username: tokens.username,
    roles: tokens.roles,
    centroId: tokens.centroId,
    mustChangePassword: Boolean(tokens.mustChangePassword),
    profesionalNombre: tokens.profesionalNombre,
  };
}

function loadSessionFromStorage(): AuthSession | null {
  const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed.accessToken || !parsed.refreshToken || !parsed.expiresAtMs) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const refreshInFlightRef = useRef<Promise<boolean> | null>(null);

  useEffect(() => {
    setSession(loadSessionFromStorage());
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (session) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session]);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (!session?.refreshToken) {
      clearSession();
      return false;
    }

    if (refreshInFlightRef.current) {
      return refreshInFlightRef.current;
    }

    const refreshPromise = (async () => {
      try {
        const refreshed = await authApi.refresh({
          refreshToken: session.refreshToken,
          centroId: session.centroId && session.centroId !== "global" ? session.centroId : undefined,
        });
        setSession(toSession(refreshed));
        return true;
      } catch {
        clearSession();
        return false;
      } finally {
        refreshInFlightRef.current = null;
      }
    })();

    refreshInFlightRef.current = refreshPromise;
    return refreshPromise;
  }, [clearSession, session?.refreshToken]);

  const login = useCallback(async (username: string, password: string, centroId?: string) => {
    const tokens = await authApi.login({ username, password, centroId: centroId || undefined });
    setSession(toSession(tokens));
  }, []);

  const logout = useCallback(async () => {
    try {
      if (session?.refreshToken) {
        await authApi.logout({ refreshToken: session.refreshToken });
      }
    } finally {
      clearSession();
    }
  }, [clearSession, session?.refreshToken]);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      await authApi.changePassword({ currentPassword, newPassword });

      setSession((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          mustChangePassword: false,
        };
      });
    },
    [],
  );

  useEffect(() => {
    configureHttpClientAuth({
      getAccessToken: () => session?.accessToken ?? null,
      refreshSession,
      onAuthFailure: clearSession,
    });

    return () => configureHttpClientAuth(null);
  }, [clearSession, refreshSession, session?.accessToken]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const timer = window.setInterval(() => {
      const remainingMs = session.expiresAtMs - Date.now();
      if (remainingMs <= 60_000) {
        void refreshSession();
      }
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [refreshSession, session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session?.accessToken),
      isInitializing,
      username: session?.username ?? null,
      profesionalNombre: session?.profesionalNombre ?? null,
      centroId: session?.centroId ?? null,
      roles: session?.roles ?? [],
      mustChangePassword: Boolean(session?.mustChangePassword),
      login,
      logout,
      refreshSession,
      changePassword,
    }),
    [changePassword, isInitializing, login, logout, refreshSession, session?.accessToken, session?.centroId, session?.mustChangePassword, session?.profesionalNombre, session?.roles, session?.username],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
