import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "owner" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
  role: AuthUser["role"] | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    address: string,
    role: "user" | "owner" | "admin"
  ) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ------------------------------------------------
  // LOGIN
  // ------------------------------------------------
  async function login(email: string, password: string) {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { error: data.error || "Login failed" };

      const loggedUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };

      localStorage.setItem("auth_user", JSON.stringify(loggedUser));
      localStorage.setItem("token", data.token);

      setUser(loggedUser);
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  }

  // ------------------------------------------------
  // SIGN UP
  // ------------------------------------------------
  async function signUp(
    email: string,
    password: string,
    name: string,
    address: string,
    role: "user" | "owner" | "admin"
  ) {
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, address, role }),
      });

      const data = await res.json();
      if (!res.ok) return { error: data.error || "Registration failed" };

      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  }

  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
