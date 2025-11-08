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
