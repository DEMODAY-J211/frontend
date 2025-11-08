// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // 필요시 사용자 정보도 저장

  // ✅ 홈페이지나 새로고침 시 세션 쿠키 확인
  useEffect(() => {
    const jsessionId = getCookie("JSESSIONID");
    if (jsessionId) {
      setIsLoggedIn(true);
      // 필요하면 여기서 사용자 정보 fetch
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 쿠키 읽기 유틸 함수
function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return matches ? matches[2] : null;
}

export const useAuth = () => useContext(AuthContext);
