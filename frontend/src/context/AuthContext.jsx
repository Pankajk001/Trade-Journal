import { createContext, useEffect, useState } from "react";
import authService, { userView } from "../services/authService";
import { supabase } from "../lib/supabase";
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(userView(session?.user));
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  async function login(email, password) {
    setUser(await authService.login(email, password));
  }
  async function register(name, email, password) {
    const result = await authService.register(name, email, password);
    setUser(result);
    return result;
  }
  async function logout() {
    await authService.logout();
    setUser(null);
  }
  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
