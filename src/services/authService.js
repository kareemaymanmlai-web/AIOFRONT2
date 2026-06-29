import { roles } from "../data/mockData";
import { httpClient, shouldUseMockApi } from "./httpClient";

const storageKey = "aiofront_user";
const tokenKey = "aiofront_token";

export const authService = {
  currentUser() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      window.localStorage.removeItem(storageKey);
      window.localStorage.removeItem(tokenKey);
      return null;
    }
  },

  async login({ email, password, role }) {
    if (!shouldUseMockApi()) {
      const result = await httpClient("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role })
      });
      window.localStorage.setItem(storageKey, JSON.stringify(result.user));
      window.localStorage.setItem(tokenKey, result.token);
      return result.user;
    }

    const profile = roles.find((item) => item.id === role) || roles[0];
    const user = {
      id: role,
      name: role === "end-user" ? "محمد أحمد" : role === "tenant-admin" ? "أحمد مصطفى" : "Platform Admin",
      email,
      role,
      roleLabel: profile.label,
      company: profile.company
    };

    window.localStorage.setItem(storageKey, JSON.stringify(user));
    window.localStorage.setItem(tokenKey, `mock-token-${role}-${Date.now()}`);
    return user;
  },

  logout() {
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(tokenKey);
  }
};
