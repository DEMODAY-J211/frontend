import styled from "styled-components";
import Kakaologo from "../../assets/Kakaologo.svg";

const serverUrl = import.meta.env.VITE_API_URL;
export default function KakaoLogin() {
  return (
    <KakaoWrapper>
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
    font-family: GyeonggiTitle;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 30px */
  }
`;
