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
      addToast("저장되었습니다!", "success");
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
        <RegisterShowStep2 viewer={true} />
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

const TempSaveButton = styled(NavButton)``;

const NextButton = styled(NavButton)``;

const FormContent = styled.div`
  display: flex;
  gap: 100px;
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Name = styled.div`
  font-size: 25px;
  font-weight: 500;
  display: flex;
  gap: 20px;
`;

const Poster = styled.div`
  width: 320px;
  height: 450px;
  background: #fff;
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover div {
    opacity: 1;
  }
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 500;
  transition: 0.25s ease;
`;

const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: #aaa;
  font-size: 16px;
`;

const UploadText = styled.div`
  font-size: 18px;
  color: #999;
`;

const HiddenInput = styled.input`
  display: none;
`;
const Input = styled.input`
  width: 100%;
  height: 55px;
  padding: 0 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 18px;
  outline: none;
  color: #333;
  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #fc2847;
  }
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;

  span {
    font-size: 18px;
    color: #999;
  }
`;

const AddButton = styled.button`
  background: var(--color-tertiary);
  color: var(--color-secondary);
  border: none;
  border-radius: 20px;
  padding: 6px 18px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 300;

  &:hover {
    background: #ffd6dc;
  }
`;

const PeriodText = styled.div`
  font-size: 17px;
  color: #999;
  margin-left: 10px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 14px;
  font-size: 20px;
  font-weight: 300;

  span {
    color: #333;
  }
`;

const PriceInput = styled(Input)`
  width: 120px;
  text-align: end;
`;

const AccountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BankSelect = styled.select`
  height: 55px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 18px;
  color: #333;

  &:focus {
    border-color: #fc2847;
  }
  option {
    color: #333;
  }

  &.placeholder {
    color: #999;
  }
  option.placeholder {
    color: #999;
  }
`;

const DateInput = styled.input`
  width: 180px;
  height: 55px;
  padding: 0 45px 0 14px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  &::placeholder {
    color: #999;
  }
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  &:focus {
    border-color: #fc2847;
  }

  &.placeholder {
    color: #999;
  }
`;

const TimeSelect = styled.select`
  width: 140px;
  height: 55px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  background: #fff;
  color: #333;

  &:focus {
    border-color: #fc2847;
  }
  option {
    color: #333;
  }

  &.placeholder {
    color: #999;
  }
  option.placeholder {
    color: #999;
  }
`;

const Q = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const DateWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CalendarIcon = styled(AiOutlineCalendar)`
  position: absolute;
  right: 14px;
  font-size: 22px;
  color: #888;
  pointer-events: none;
`;

const DeleteIcon = styled(AiOutlineClose)`
  font-size: 22px;
  color: #999;
  cursor: pointer;
  margin-left: 6px;
  transition: 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const TicketContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ErrorMessage = styled.div`
  color: #fc2847;
  font-size: 15px;
  margin-top: -8px;
  margin-left: 4px;
  display: flex;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
