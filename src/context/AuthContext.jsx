"use client";

import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) setStatus("authenticated");
    else setStatus("unauthenticated");
  }, []);

  const login = (token, userId, userRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    if (userRole) localStorage.setItem("userRole", userRole);

    Cookies.set("token", token, { expires: 10, path: "/" });
    Cookies.set("userId", userId, { expires: 10, path: "/" });
    if (userRole) Cookies.set("userRole", userRole, { expires: 10, path: "/" });

    setStatus("authenticated");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");

    Cookies.remove("token", { path: "/" });
    Cookies.remove("userId", { path: "/" });
    Cookies.remove("userRole", { path: "/" });

    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
