// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);

  // 쿠키 읽는 함수
  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

  useEffect(() => {
    console.log("🍪 쿠키:", document.cookie);

    const jsessionId = getCookie("JSESSIONID");

    // 로그인 여부 = 쿠키 존재 여부
    setIsLoggedIn(!!jsessionId);

    // role 저장된 게 있다면 불러오기
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setUser({ type: savedRole });

    setIsInitialized(true);
  }, []);

  const logout = () => {
    localStorage.clear();
    // JSESSIONID 삭제 요청
    document.cookie =
      "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, setUser, isInitialized, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
