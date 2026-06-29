import { createContext, useContext, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.currentUser());

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    async login(payload) {
      const nextUser = await authService.login(payload);
      setUser(nextUser);
      return nextUser;
    },
    logout() {
      authService.logout();
      setUser(null);
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
