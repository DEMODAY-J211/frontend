import styled from "styled-components";
import React from "react";
import Kakaologo from "../../assets/Kakaologo.svg";

export default function KakaoLogin() {
  const handleKakaoLogin = () => {
    // 백엔드 카카오 OAuth 로그인 URL로 리다이렉트
    // const KAKAO_AUTH_URL = `${
    //   import.meta.env.VITE_API_URL
    // }/oauth2/authorization/kakao`;
    // window.location.href = KAKAO_AUTH_URL;
    const KAKAO_AUTH_URL = `${
      import.meta.env.VITE_API_URL
    }/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(
      import.meta.env.VITE_FRONTEND_URL + "/auth/kakao/callback"
    )}`;
    window.location.href = KAKAO_AUTH_URL;

    console.log(KAKAO_AUTH_URL);
    console.log("handlekakaologin");
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
