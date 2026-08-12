import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, clearTokens, setTokens } from "../api";
import type { Utilisateur } from "../types";

interface AuthState {
  user: Utilisateur | null;
  chargement: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("csp_access_token"));
    if (!hasToken) {
      setChargement(false);
      return;
    }
    api
      .me()
      .then(setUser)
      .catch(() => {
        clearTokens();
        setUser(null);
      })
      .finally(() => setChargement(false));
  }, []);

  async function login(email: string, password: string) {
    const tokens = await api.login(email, password);
    setTokens(tokens.access_token, tokens.refresh_token);
    const me = await api.me();
    setUser(me);
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, chargement, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
