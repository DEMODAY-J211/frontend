import styled from "styled-components";
import tikitta_big from "../assets/tikitta_big.svg";
import KakaoLogin from "../components/Modal/KakaoLogin.jsx";

const serverUrl = import.meta.env.VITE_API_URL;
const authorization_code = "176F530BC2413E63A36A93E2C2663037";

export default function Login() {
  // const handlelogin = () => {
  //   window.location.href = `${serverUrl}/oauth2/authorization/kakao`;
  // };

  //   const handlelogin = async () => {
  //     try {
  //       const response = await fetch(
  //         `${serverUrl}/auth/kakao/callback?code=${authorization_code}`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const result = await response.json();
  //       console.log("서버 응답:", result);
  //       // 성공 시 다음 페이지 이동
  //       // navigate(`../payment`, {
  //       //   state: {
  //       //     selectedShowtime,
  //       //     selectedOption,
  //       //     quantity,
  //       //     showData,
  //       //   },
  //       // });
  //     } catch (error) {
  //       console.error("예약 요청 실패:", error);
  //       alert("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
  //     }
  // };

  return (
    <PageWrapper>
      <HomeUserContainer>
        <LoginContainer>
          <img
            src={tikitta_big}
            alt="tikitta_big"
            style={{ cursor: "pointer" }}
          />
          <a>
            티킷타 로그인 후,
            <br />
            '좌석-결제-QR 입장'까지 한번에!
          </a>
          <KakaoLogin />
        </LoginContainer>
      </HomeUserContainer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  // background-color: #fff;
  background-color: ${(props) => (props.dimmed ? "rgba(0,0,0,0.2)" : "#fff")};
  transition: background-color 0.3s ease;

  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const HomeUserContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // width: 393px;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 0 30px 5px rgba(0, 0, 0, 0.25);

  @media (min-width: 768px) {
    flex-direction: row;
    display: flex;
    min-width: 768px;
    max-width: 1440px;
    min-height: 1024px;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    background: #fff;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  padding: 20px 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 29px;
  flex: 1 0 0;
  align-self: stretch;

  a {
    align-self: stretch;
    color: #fc2847;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;
