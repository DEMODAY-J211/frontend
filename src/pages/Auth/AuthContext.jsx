// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // localStorage에서 초기값 가져오기 (리렌더링 방지)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get("login");
    if (loginSuccess === "success") {
      return true;
    }
    return localStorage.getItem("isLoggedIn") === "true";
  });

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
    const role = urlParams.get("role"); // role 파라미터 (manager / user)

    if (loginSuccess === "success") {
      console.log("✅ 카카오 로그인 성공 - 로그인 상태로 설정");
      localStorage.setItem("isLoggedIn", "true");

      // role이 있으면 user 상태 업데이트
      if (role) {
        console.log(role, role.toLowerCase());
        setUser({ type: role.toLowerCase() }); // 필요하면 다른 정보도 추가 가능
        localStorage.setItem("userRole", role.toLowerCase()); // 선택: 로컬에도 저장
      }
      // URL에서 파라미터 제거 (깔끔하게)
      if (role === "MANAGER") {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } else {
        // window.history.replaceState({}, "", "/2/homeuser");
        // console.log(document.cookie);
        // navigate("/2/homeuser", { replace: true });

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }

    // 초기화 완료
    setIsInitialized(true);
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);

    // 쿠키가 있다면 쿠키도 만료시키기 (선택)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 로그인 페이지로 이동
    window.location.href = "/login";
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isInitialized,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
