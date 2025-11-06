import styled from "styled-components";
import tikitta_big from "../assets/tikitta_big.svg";
import NavbarManager from "../components/Navbar/NavbarManager";

import landing_user from "../assets/landing_user.png";
import landing_manager from "../assets/landing_manager.png";
import NavbarLanding from "../components/Navbar/NavbarLanding";


export default function Landing() {
 

  return (
    <PageWrapper>
        <NavbarLanding/>
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
            <Card>
                <img src={landing_user} alt="랜딩유저" />
                <h2>예매자로 시작하기</h2>
                <p>공연·전시 티켓을 간편하게 예매하세요</p>
            </Card>
            <Card>
                <img src={landing_manager} alt="랜딩매니저" />
                <h2>관리자로 시작하기</h2>
                <p>판매부터 입장까지 한 번에 관리하세요</p>
            </Card>
        </CardContainer>
      </HomeUserContainer>
    </PageWrapper>
  );
}

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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  box-shadow: 0 0 30px 5px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 1440px;

  @media (min-width: 768px) {
    flex-direction: column;
    box-shadow: none;
  }
`;


const TopContainer = styled.div`
  display: flex;
  padding: 20px 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 29px;
  align-self: stretch;

  a {
    align-self: stretch;
    color: #333;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const CardContainer = styled.div`
    display: flex;
    flex-direction: column; /* 기본: 세로 */
    justify-content: center;
    align-items: center;
    gap: 50px;

      @media (min-width: 768px) {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-secondary);
  background-color: var(--color-tertiary);
  gap: 10px;
  cursor: pointer;

  /* 💡 크기 대신 비율로 제어 */
  width: 90%; /* 부모 너비의 90% (화면에 따라 자동 조절) */
  aspect-ratio: 590 / 370; /* 원래 가로:세로 비율 */

  border-radius: 30px;
  padding: 5%;
  box-sizing: border-box;
  text-align: center;

  img {
    width: 20%; /* 비율 유지 */
    height: auto;
  }

  h2 {
    font-size: clamp(1.2rem, 4vw, 2.5rem); /* 화면 크기에 맞게 반응형 폰트 */
    font-weight: 500;
  }

  p {
    font-size: clamp(0.8rem, 2vw, 1.3rem);
    font-weight: 400;
  }
`;

