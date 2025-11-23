import React, { useState } from "react";
import styled from "styled-components";
import NavbarManager from "../../components/Navbar/NavbarManager";
import { RiArrowRightSLine } from "react-icons/ri";
import { BsUpload } from "react-icons/bs";
import { AiOutlineCalendar, AiOutlineClose } from "react-icons/ai";
import RegisterShowNavbar from "./RegisterShow/RegisterShowNavbar";
import RegisterShowStep1 from "./RegisterShow/RegisterShowStep1";
import RegisterShowStep2 from "./RegisterShow/RegisterShowStep2";
import RegisterShowStep3 from "./RegisterShow/RegisterShowStep3";
import RegisterShowStep4 from "./RegisterShow/RegisterShowStep4";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import RegisterShowStep5 from "./RegisterShow/RegisterShowStep5";

const RegisterShow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [posterImage, setPosterImage] = useState(null);
  const [showTimes, setShowTimes] = useState([]);
  const [ticketOptions, setTicketOptions] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    navigate(`/register-show/step${currentStep + 1}`);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    navigate(`/register-show/step${currentStep - 1}`);
  };

  useEffect(() => {
    const step = location.pathname.split("/").pop(); // step1, step2...
    const stepNum = Number(step.replace("step", "")); // 숫자만 추출

    if (!isNaN(stepNum)) {
      setCurrentStep(stepNum);
    }
  }, [location.pathname]);

  // 공연 회차 추가
  const handleAddShowtime = () => {
    setShowTimes([
      ...showTimes,
      {
        id: Date.now(),
        date: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  // 공연 회차 삭제
  const handleRemoveShowtime = (id) => {
    setShowTimes(showTimes.filter((st) => st.id !== id));
  };

  // 티켓 옵션 추가
  const handleAddTicketOption = () => {
    setTicketOptions([
      ...ticketOptions,
      {
        id: Date.now(),
        name: "",
        description: "",
        price: "",
      },
    ]);
  };

  // 티켓 옵션 삭제
  const handleRemoveTicketOption = (id) => {
    setTicketOptions(ticketOptions.filter((to) => to.id !== id));
  };

  // 포스터 업로드
  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const steps = [
    { num: 1, name: "공연 기본정보" },
    { num: 2, name: "공연 상세정보" },
    { num: 3, name: "공연 장소·좌석" },
    { num: 4, name: "알림 메시지" },
    { num: 5, name: "미리 보기" },
  ];

  return (
    <Container>
      <NavbarManager />
      {/* 단계 표시 */}
      <RegisterShowNavbar
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      {/* <StepperContainer>
        <Stepper>
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <Step active={currentStep === step.num}>
                <StepNumber>{step.num}</StepNumber>
                <StepName active={currentStep === step.num}>{step.name}</StepName>
              </Step>
              {index < steps.length - 1 && (
                <StepArrow>
                  <RiArrowRightSLine size={32} color="#737373" />
                </StepArrow>
              )}
            </React.Fragment>
          ))}
        </Stepper>
      </StepperContainer> */}
      {/* 메인 컨텐츠 */}
      {currentStep === 1 && <RegisterShowStep1 />}
      {currentStep === 2 && <RegisterShowStep2 />}
      {currentStep === 3 && <RegisterShowStep3 />}
      {currentStep === 4 && <RegisterShowStep4 />}
      {currentStep === 5 && <RegisterShowStep5 />}
      <MainContent>
        <LeftSection>
          <PageTitle>공연 등록하기</PageTitle>

          {/* 대표 포스터 */}
          <PosterUploadContainer>
            <PosterUploadLabel htmlFor="poster-upload">
              {posterImage ? (
                <PosterPreview src={posterImage} alt="포스터 미리보기" />
              ) : (
                <>
                  <BsUpload size={32} />
                  <UploadText>포스터 업로드하기</UploadText>
                </>
              )}
            </PosterUploadLabel>
            <PosterInput
              id="poster-upload"
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
            />
          </PosterUploadContainer>
        </LeftSection>

        <RightSection>
          {/* 공연명 */}
          <FormSection>
            <SectionTitle>공연명</SectionTitle>
            <Input placeholder="제11회 정기공연" />
            <RequiredMessage>
              *필수 항목을 모두 채워주셔야 다음 단계로 이동합니다.
            </RequiredMessage>
          </FormSection>

          {/* 공연 날짜/회차 */}
          <FormSection>
            <SectionTitleRow>
              <SectionTitle>공연 날짜/회차</SectionTitle>
              <AddButton onClick={handleAddShowtime}>추가하기</AddButton>
            </SectionTitleRow>

            {/* 날짜/시간 선택기 */}
            <DateTimeContainer>
              <DateInputWrapper>
                <AiOutlineCalendar size={24} />
                <DateInput type="text" placeholder="2025.09.25" />
              </DateInputWrapper>
              <TimeInputWrapper>
                <TimeInput type="text" placeholder="00:00" />
                <Separator>~</Separator>
                <TimeInput type="text" placeholder="00:00" />
              </TimeInputWrapper>
            </DateTimeContainer>

            {/* 등록된 회차 목록 */}
            {showTimes.map((showtime) => (
              <ShowtimeItem key={showtime.id}>
                <ShowtimeText>2025.10.14 15:00~16:30</ShowtimeText>
                <DeleteIcon onClick={() => handleRemoveShowtime(showtime.id)}>
                  <AiOutlineClose size={24} />
                </DeleteIcon>
              </ShowtimeItem>
            ))}
          </FormSection>

          {/* 예매 기간 */}
          <FormSection>
            <SectionTitle>예매 기간</SectionTitle>
            <ReservationPeriod>
              <DateTimeContainer>
                <DateInputWrapper>
                  <AiOutlineCalendar size={24} />
                  <DateInput type="text" placeholder="2025.10.12" />
                </DateInputWrapper>
                <TimeInputWrapper>
                  <TimeInput type="text" placeholder="00:00" />
                </TimeInputWrapper>
              </DateTimeContainer>
              <BigSeparator>~</BigSeparator>
              <EndTimeText>공연시작 1시간 전</EndTimeText>
            </ReservationPeriod>
          </FormSection>

          {/* 티켓 옵션 */}
          <FormSection>
            <SectionTitleRow>
              <SectionTitle>티켓 옵션</SectionTitle>
              <AddButton onClick={handleAddTicketOption}>추가하기</AddButton>
            </SectionTitleRow>

            <Input placeholder="티켓 옵션 이름 (일반예매/학생예매)" />
            <Input placeholder="티켓 옵션 설명" />
            <PriceInputWrapper>
              <PriceInput type="text" placeholder="0" />
              <span>원</span>
            </PriceInputWrapper>
          </FormSection>

          {/* 입금주 */}
          <FormSection>
            <SectionTitle>입금주</SectionTitle>
            <Input placeholder="홍길동" />
            <RequiredMessage>
              *필수 항목을 모두 채워주셔야 다음 단계로 이동합니다.
            </RequiredMessage>
          </FormSection>

          {/* 입금 계좌 */}
          <FormSection>
            <SectionTitle>입금 계좌</SectionTitle>
            <AccountInputWrapper>
              <BankInput placeholder="우리" />
              <AccountInput placeholder="0000-000-000000" />
            </AccountInputWrapper>
            <RequiredMessage>
              *필수 항목을 모두 채워주셔야 다음 단계로 이동합니다.
            </RequiredMessage>
          </FormSection>
        </RightSection>
      </MainContent>
      {/* Footer 버튼 */}
      {/* <Footer>
        <PrevButton onClick={handlePrevious}>←이전</PrevButton>
        <RightButtonGroup>
          <TempSaveButton onClick={handleTempSave}>임시저장</TempSaveButton>
          <NextButton onClick={handleNext}>다음→</NextButton>
        </RightButtonGroup>
      </Footer> */}
    </Container>
  );
};

export default RegisterShow;

/* ============== Styled Components ============== */

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
`;

const StepperContainer = styled.div`
  width: 100%;
  padding: 0 100px;
  border-bottom: 1px solid #c5c5c5;
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
  border-bottom: ${(props) => (props.active ? "2px solid #FC2847" : "none")};
  margin-bottom: -1px;
`;

const StepNumber = styled.div`
  font-size: 20px;
`;

const StepName = styled.div`
  font-size: 20px;
  color: ${(props) => (props.active ? "#FC2847" : "var(--text-neutral-500)")};
  font-family: ${(props) =>
    props.active ? "'GyeonggiTitle:Medium'" : "'GyeonggiTitle:Light'"};
`;

const StepArrow = styled.div`
  margin: 0 10px;
`;

const MainContent = styled.div`
  display: flex;
  gap: 100px;
  padding: 50px 100px;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const PageTitle = styled.h1`
  font-size: 30px;
  font-family: "GyeonggiTitle:Medium";
  color: #333;
  margin: 0;
`;

const PosterUploadContainer = styled.div`
  width: 286px;
  aspect-ratio: 218/333;
  background: white;
  border-radius: 20px;
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const PosterUploadLabel = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25.564px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const PosterPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadText = styled.div`
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";
  color: #333;
`;

const PosterInput = styled.input`
  display: none;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

const SectionTitle = styled.h2`
  font-size: 25px;
  font-family: "GyeonggiTitle:Medium";
  color: #333;
  margin: 0;
`;

const SectionTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  background: #fff1f0;
  color: #d60033;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 13px;
  font-family: "GyeonggiTitle:Light";
  cursor: pointer;

  &:hover {
    background: #ffe5e3;
  }
`;

const Input = styled.input`
  width: 544px;
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 16px;
  padding: 20px 10px;
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";

  &::placeholder {
    color: #878787;
  }
`;

const DateTimeContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const DateInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 16px;
  padding: 20px 10px;
`;

const DateInput = styled.input`
  border: none;
  outline: none;
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";
  width: 150px;

  &::placeholder {
    color: #6e6e6e;
  }
`;

const TimeInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 16px;
  padding: 20px 10px;
`;

const TimeInput = styled.input`
  border: none;
  outline: none;
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";
  width: 60px;

  &::placeholder {
    color: #6e6e6e;
  }
`;

const Separator = styled.span`
  font-size: 20px;
  color: #333;
`;

const BigSeparator = styled.span`
  font-size: 30px;
  color: #333;
`;

const ShowtimeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 16px;
  padding: 20px 10px;
`;

const ShowtimeText = styled.span`
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";
  color: #333;
`;

const DeleteIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    color: #fc2847;
  }
`;

const ReservationPeriod = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const EndTimeText = styled.span`
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";
  color: #787878;
`;

const PriceInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 544px;

  span {
    font-size: 20px;
    font-family: "GyeonggiTitle:Light";
  }
`;

const PriceInput = styled.input`
  width: 112px;
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 16px;
  padding: 20px 10px;
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";
  text-align: right;

  &::placeholder {
    color: #878787;
  }
`;

const AccountInputWrapper = styled.div`
  display: flex;
  gap: 10px;
  width: 544px;
`;

const BankInput = styled.input`
  width: 150px;
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 16px;
  padding: 20px 10px;
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";

  &::placeholder {
    color: #6e6e6e;
  }
`;

const AccountInput = styled.input`
  flex: 1;
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 16px;
  padding: 20px 10px;
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";

  &::placeholder {
    color: #6e6e6e;
  }
`;

const RequiredMessage = styled.p`
  font-size: 15px;
  font-family: "GyeonggiTitle:Light";
  color: #d72b2b;
  margin: 0;
  line-height: 24px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 100px;
  border-top: 1px solid #c5c5c5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 30px;
`;

const PrevButton = styled.button`
  background: #fc2847;
  color: #fffffe;
  border: none;
  border-radius: 20px;
  padding: 20px;
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const TempSaveButton = styled.button`
  background: #fc2847;
  color: #fffffe;
  border: none;
  border-radius: 20px;
  padding: 20px;
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const NextButton = styled.button`
  background: #fc2847;
  color: #fffffe;
  border: none;
  border-radius: 20px;
  padding: 20px;
  font-size: 20px;
  font-family: "GyeonggiTitle:Light";
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
