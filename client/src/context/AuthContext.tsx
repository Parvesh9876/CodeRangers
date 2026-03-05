import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchProfile, loginUser, registerUser } from "../api/client";
import type { LoginPayload, RegisterPayload, User } from "../types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = "crms_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    if (!token) {
      setUser(null);
      return;
    }

    const profile = await fetchProfile(token);
    setUser(profile);
  };

  useEffect(() => {
    let active = true;

    const init = async () => {
      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const profile = await fetchProfile(token);
        if (active) {
          setUser(profile);
        }
      } catch {
        if (active) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      active = false;
    };
  }, [token]);

  const handleLogin = async (payload: LoginPayload) => {
    const response = await loginUser(payload);
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    const profile = await fetchProfile(response.token);
    setUser(profile);
  };

  const handleRegister = async (payload: RegisterPayload) => {
    const response = await registerUser(payload);
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    if (response.user) {
      setUser(response.user);
      return;
    }
    const profile = await fetchProfile(response.token);
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAdmin: user?.role === "admin",
      login: handleLogin,
      register: handleRegister,
      logout,
      refreshProfile
    }),
    [loading, token, user]
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
