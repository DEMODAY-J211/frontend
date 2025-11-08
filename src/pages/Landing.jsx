import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


import tikitta_big from "../assets/tikitta_big.svg";
import landing_user from "../assets/landing_user.png";
import landing_manager from "../assets/landing_manager.png";
import NavbarLanding from "../components/Navbar/NavbarLanding";

export default function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 역할 선택 요청
  const handleSelectRole = async (role) => {
    try {
      setLoading(true);

      const response = await fetch(
        ` https://back-tikitta.duckdns.org/auth/kakao/select-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키 기반 세션 유지용
          body: JSON.stringify({ role }), // role: "USER" or "MANAGER"
        }
      );

      if (!response.ok) {
        throw new Error("역할 선택 실패");
      }

      const data = await response.json();
      console.log("✅ 역할 선택 성공:", data);

      // 역할에 따라 이동
      if (role === "USER") {
        navigate("/homeuser");
      } else if (role === "MANAGER") {
        navigate("/homemanager");
      }
    } catch (error) {
      console.error("❌ 역할 선택 중 오류:", error);
      alert("역할 선택에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <NavbarLanding />
      <HomeUserContainer>
        <TopContainer>
          <img
            src={tikitta_big}
            alt="tikitta_big"
            style={{ cursor: "pointer" }}
          />
          <a>
            좌석·결제·QR 입장까지 한 번에!
            <br />
            예매자와 관리자를 위한
            <br />
            올인원 티켓 플랫폼, 티킷타
          </a>
        </TopContainer>

        <CardContainer>
          <Card onClick={() => handleSelectRole("USER")}>
            <img src={landing_user} alt="랜딩유저" />
            <h2>예매자로 시작하기</h2>
            <p>공연·전시 티켓을 간편하게 예매하세요</p>
          </Card>

          <Card onClick={() => handleSelectRole("MANAGER")}>
            <img src={landing_manager} alt="랜딩매니저" />
            <h2>관리자로 시작하기</h2>
            <p>판매부터 입장까지 한 번에 관리하세요</p>
          </Card>
        </CardContainer>

        {loading && <LoadingMsg>역할을 설정 중입니다...</LoadingMsg>}
      </HomeUserContainer>
    </PageWrapper>
  );
}

// --- 스타일 정의 ---
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
`;

const HomeUserContainer = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1440px;
  background: #fff;
`;

const TopContainer = styled.div`
  display: flex;
  padding: 20px 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 29px;

  a {
    color: #333;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--color-tertiary);
  color: var(--color-secondary);
  border-radius: 30px;
  padding: 5%;
  cursor: pointer;
  width: 90%;
  aspect-ratio: 590 / 370;
  text-align: center;
  box-sizing: border-box;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 20%;
    height: auto;
  }

  h2 {
    font-size: clamp(1.2rem, 4vw, 2.5rem);
  }

  p {
    font-size: clamp(0.8rem, 2vw, 1.3rem);
  }
`;

const LoadingMsg = styled.p`
  margin-top: 30px;
  color: gray;
  font-size: 16px;
`;
