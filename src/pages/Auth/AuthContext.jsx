// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  // ✅ 로그인 상태 확인: URL 파라미터 또는 localStorage
  useEffect(() => {
    console.log("=== AuthContext 초기화 ===");
    console.log("🍪 모든 쿠키:", document.cookie);
    console.log("📍 현재 URL:", window.location.href);

    // URL에서 login=success 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get("login");
    console.log("🔍 login 파라미터:", loginSuccess);

    if (loginSuccess === "success") {
      console.log("✅ 카카오 로그인 성공 - 로그인 상태로 설정");
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");

      // URL에서 파라미터 제거 (깔끔하게)
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/5/homeuser");
    } else {
      // localStorage에서 로그인 상태 확인
      const savedLoginState = localStorage.getItem("isLoggedIn");
      console.log("💾 localStorage isLoggedIn:", savedLoginState);

      if (savedLoginState === "true") {
        console.log("✅ 저장된 로그인 상태 확인");
        setIsLoggedIn(true);
      } else {
        console.log("❌ 로그아웃 상태");
        setIsLoggedIn(false);
      }
    }

    // 초기화 완료
    setIsInitialized(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
// import React, { createContext, useState, useEffect } from "react";

// // 인증 컨텍스트 생성
// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [isInitializing, setIsInitializing] = useState(true);

//     useEffect(() => {
//         try {
//             const savedUser = localStorage.getItem("loggedInUser");
//             if (savedUser) {
//                 setUser(JSON.parse(savedUser));
//             }
//         } catch (error) {
//             console.error("저장된 사용자 정보를 불러오는 데 실패했습니다.", error);
//             localStorage.removeItem("loggedInUser");
//         } finally {
//             setIsInitializing(false);
//         }
//     }, []);

//     const login = (userData) => {
//         setUser(userData);
//         localStorage.setItem("loggedInUser", JSON.stringify(userData));
//     };

//     // 쿠키에서 토큰을 가져오는 헬퍼 함수
//     const getCookie = (name) => {
//         const value = `; ${document.cookie}`;
//         const parts = value.split(`; ${name}=`);
//         if (parts.length === 2) return parts.pop().split(';').shift();
//     };

//     const logout = () => {
//         // 클라이언트 측 세션 정리
//         const clearClientSession = () => {
//             setUser(null);
//             localStorage.removeItem("loggedInUser");
//             // 쿠키 삭제
//             document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//             document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         };

//         // 클라이언트 세션 정리
//         clearClientSession();

//         // 로그인 페이지로 리디렉션
//         window.location.href = "/login";
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, isInitializing }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
