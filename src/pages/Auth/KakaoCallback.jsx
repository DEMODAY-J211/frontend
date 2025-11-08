import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        // URL에서 code 파라미터 가져오기
        const code = searchParams.get("code");

        if (!code) {
          throw new Error("인증 코드가 없습니다.");
        }

        // 백엔드로 code 전송하여 카카오 로그인 처리
        // const response = await fetch(
        //   `${import.meta.env.VITE_API_URL}/kakao/callback?code=${code}`,
        //   {
        //     method: "GET",
        //     headers: { credentials: "include" },
        //   }
        // );
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/kakao/callback?code=${code}`,
          {
            method: "GET",
            credentials: "include", // 여기로 옮겨야 함
          }
        );

        if (!response.ok) {
          throw new Error("로그인에 실패했습니다.");
        }

        const result = await response.json();
        console.log("result입니다", result);
        // API 응답 확인
        if (!result.success) {
          throw new Error(result.message || "로그인에 실패했습니다.");
        }

        const { isNewUser, user } = result.data;
        // 세션 기반 로그인: 쿠키는 credentials: 'include'로 자동 저장됨

        // 신규 유저인 경우
        if (isNewUser) {
          // 사용자 정보 임시 저장
          localStorage.setItem("tempUser", JSON.stringify(user));
          alert("회원가입이 필요합니다. 추가 정보를 입력해주세요.");
          navigate("/signup"); // 회원가입 페이지로 이동
          return;
        }

        // 기존 유저인 경우 - 로그인 성공

        // 사용자 정보만 저장 (UI 표시용)
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        // role에 따라 다른 페이지로 이동
        alert(`${user.name}님, 환영합니다!`);
        if (user.role === "manager") {
          navigate("/homemanager");
        } else {
          navigate("/homeuser");
        }
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
        alert(`로그인에 실패했습니다: ${error.message}`);
        navigate("/login");
      }
    };

    handleKakaoCallback();
  }, [navigate, searchParams]);

  return (
    <Container>
      <LoadingText>로그인 중...</LoadingText>
      <Spinner />
    </Container>
  );
};

export default KakaoCallback;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ffffff;
`;

const LoadingText = styled.p`
  font-size: 24px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #fc2847;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
