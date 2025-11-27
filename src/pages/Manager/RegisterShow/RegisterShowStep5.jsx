import React from "react";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import RegisterShowNavbar from "./RegisterShowNavbar";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/Toast/useToast";
import { useState, useEffect } from "react";
import { BsUpload } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import RegisterShowStep1 from "./RegisterShowStep1";
import RegisterShowStep2 from "./RegisterShowStep2";
import RegisterShowStep3 from "./RegisterShowStep3";
import RegisterShowStep4 from "./RegisterShowStep4";
// UseToast -> useToast 로 수정
const RegisterShowStep5 = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { showId } = useParams();
  useEffect(() => {
    console.log(showId);
  }, [showId]);
  // 이미지 파일 저장
  const [poster, setPoster] = useState(null);
  // 미리보기 URL 저장
  const [preview, setPreview] = useState(null);

  //공연명
  const [showName, setShowName] = useState("");

  // 공연 날짜/회차들
  const [showSchedules, setShowSchedules] = useState([
    { date: "", startTime: "", endTime: "" },
  ]);

  const addSchedule = () => {
    setShowSchedules([
      ...showSchedules,
      { date: "", startTime: "", endTime: "" },
    ]);
  };

  //예매 날짜
  const [reserveStartDate, setReserveStartDate] = useState("");
  // 예매 기간 시간
  const [reserveStartTime, setReserveStartTime] = useState("");
  // 티켓
  const [ticketOptions, setTicketOptions] = useState([
    { name: "", detail: "", price: "" },
  ]);

  // 입금주
  const [accountOwner, setAccountOwner] = useState("");
  // 은행
  const [selectBank, setSelectBank] = useState("");
  const [account, setAccount] = useState("");

  // 이전 단계로
    // 이전 단계로
  const handlePrevious = () => {
    navigate(`/register-show/${showId}/step4`);
  };

  // 다음 단계로
  const handleSubmit = async () => {
    //  const payload = JSON.parse(localStorage.getItem("createShowPayload")) || {};

    try {
      const payload = {
        showId: showId,
        status: "PUBLISHED",
      };
      console.log(payload);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (!response.ok) {
        addToast(result.message || "임시저장 실패", "error");
        return;
      }
      console.log(result);
      addToast("등록되었습니다!", "success");
      //제출 후 localStorage 삭제
      localStorage.removeItem("createShowPayload");

      navigate("/homemanager", { replace: true });
    } catch (error) {
      console.error("임시저장 오류:", error);
      addToast("임시저장 중 오류 발생", "error");
    }
  };

  // 기존 임시 저장 데이터 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("registerShowStep1"));
    if (saved?.poster) {
      setPreview(saved.poster);
    }
  }, []);

  return (
    <>
      <Container>
        {/* <RegisterShowNavbar currentStep={5} /> */}
        <ViewerBlock viewer={true}>
        <RegisterShowStep1  viewer={true}/>
        <RegisterShowStep2 viewer={true} editor={false}/>
        <RegisterShowStep3 viewer={true}/>
        <RegisterShowStep4 viewer={true}/>
        </ViewerBlock>
        <Footer>
          <PrevButton onClick={handlePrevious}>←이전</PrevButton>
          <RightButtonGroup>
            {/* <TempSaveButton onClick={handleTempSave}>임시저장</TempSaveButton> */}
            <NextButton onClick={handleSubmit}>등록하기</NextButton>
          </RightButtonGroup>
        </Footer>
      </Container>
    </>
  );
};

export default RegisterShowStep5;

const ViewerBlock = styled.div`
  pointer-events: ${({ viewer }) => (viewer ? "none" : "auto")};
  opacity: ${({ viewer }) => (viewer ? 0.9 : 1)};  /* 살짝 흐리게 */

  /* viewer 모드일 때 내부 input, select, textarea, button 비활성화 스타일 */
  ${({ viewer }) =>
    viewer &&
    `
    input, select, textarea {
      background: #f0f0f0 !important; 
      color: #888 !important;
      border-color: #ccc !important;
    }

    input[type="checkbox"] {
      opacity: 0.6; /* 체크 안 되어도 전체 연하게 */
    }

    input[type="checkbox"]:checked {
      opacity: 1; /* 체크된 항목만 진하게 */
    }

    label {
      color: #888; 
    }

    input[type="checkbox"]:checked + label {
      color: #333;
    }

    button {
      opacity: 0.6 !important;
      // background: #ddd !important; 
      // color: #888 !important;
    }
  `}
`;



const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  padding: 50px 100px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background: #fc2847;
  color: #fffffe;

  font-weight: 300;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(252, 40, 71, 0.3);
  }
`;

const PrevButton = styled(NavButton)``;

const RightButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;


const NextButton = styled(NavButton)``;



