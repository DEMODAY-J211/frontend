import styled from "styled-components";
import React from "react";
import Kakaologo from "../../assets/Kakaologo.svg";

export default function KakaoLogin() {
  const handleKakaoLogin = () => {
    console.log("=== 카카오 로그인 시작 ===");
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

    // 백엔드에서 카카오 인증 후 /homeuser 또는 /homemanager로 직접 리다이렉트
    const KAKAO_AUTH_URL = `${import.meta.env.VITE_API_URL}/oauth2/authorization/kakao`;

    console.log("최종 URL:", KAKAO_AUTH_URL);
    console.log("리다이렉트 시작...");

    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <KakaoWrapper onClick={handleKakaoLogin}>
      <div>
        <img src={Kakaologo} alt="Kakaologo" size={18} />
        <p>카카오로 시작하기</p>
      </div>
    </KakaoWrapper>
  );
}

const KakaoWrapper = styled.div`
  display: flex;
  height: 50px;
  padding: 0 14px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background: var(--kakao-bg, #fee500);
  cursor: pointer;

  div {
    display: flex;
    padding: 0 24px;
    justify-content: center;
    align-items: center;
    gap: 8px;

    @media (min-width: 768px) {
      display: flex;
      padding: 0 86px;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
  }
  p {
    color: var(--kakao-text, rgba(0, 0, 0, 0.85));
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 30px */
  }
`;
