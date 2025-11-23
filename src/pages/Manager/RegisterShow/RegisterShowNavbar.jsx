import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";

const RegisterShowNavbar = ({ currentStep, setCurrentStep }) => {
  const navigate = useNavigate();
  const handleStepClick = (step) => {
    setCurrentStep(step); // ① 상태 업데이트
    // navigate(`/register-show/step${step}`); // ② URL 이동
  };
  return (
    <>
      <Title>공연 등록하기</Title>
      <ProgressSteps>
        <StepItem active={currentStep === 1} onClick={() => handleStepClick(1)}>
          ① 공연 기본정보
        </StepItem>
        <ArrowIcon />

        <StepItem active={currentStep === 2} onClick={() => handleStepClick(2)}>
          ② 공연 상세정보
        </StepItem>
        <ArrowIcon />

        <StepItem active={currentStep === 3} onClick={() => handleStepClick(3)}>
          ③ 공연 장소·좌석
        </StepItem>
        <ArrowIcon />

        <StepItem active={currentStep === 4} onClick={() => handleStepClick(4)}>
          ④ 알림 메시지
        </StepItem>
        <ArrowIcon />

        <StepItem active={currentStep === 5} onClick={() => handleStepClick(5)}>
          ⑤ 미리 보기
        </StepItem>
      </ProgressSteps>
    </>
  );
};

export default RegisterShowNavbar;

const Title = styled.h1`
  font-weight: 500;
  font-size: 30px;
  color: #000000;
  margin: 0;
`;

const ProgressSteps = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid #c5c5c5;
  padding-bottom: 0;
`;

const StepItem = styled.div`
  font-weight: 500;
  font-size: 20px;
  padding: 10px;
  color: ${(props) => (props.active ? "#FC2847" : "#737373")};
  border-bottom: ${(props) => (props.active ? "2px solid #FC2847" : "none")};
  cursor: pointer;
`;

const ArrowIcon = styled(RiArrowRightSLine)`
  width: 32px;
  height: 32px;
  color: #737373;
`;
