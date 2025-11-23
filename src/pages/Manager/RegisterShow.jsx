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
  // const [posterImage, setPosterImage] = useState(null);
  // const [showTimes, setShowTimes] = useState([]);
  // const [ticketOptions, setTicketOptions] = useState([]);

  // const location = useLocation();
  // const navigate = useNavigate();
  // const handleNext = () => {
  //   if (currentStep < 5) setCurrentStep(currentStep + 1);
  //   navigate(`/register-show/step${currentStep + 1}`);
  // };

  // const handlePrevious = () => {
  //   if (currentStep > 1) setCurrentStep(currentStep - 1);
  //   navigate(`/register-show/step${currentStep - 1}`);
  // };

  // useEffect(() => {
  //   const step = location.pathname.split("/").pop(); // step1, step2...
  //   const stepNum = Number(step.replace("step", "")); // 숫자만 추출

  //   if (!isNaN(stepNum)) {
  //     setCurrentStep(stepNum);
  //   }
  // }, [location.pathname]);

  // // 공연 회차 추가
  // const handleAddShowtime = () => {
  //   setShowTimes([
  //     ...showTimes,
  //     {
  //       id: Date.now(),
  //       date: "",
  //       startTime: "",
  //       endTime: "",
  //     },
  //   ]);
  // };

  // // 공연 회차 삭제
  // const handleRemoveShowtime = (id) => {
  //   setShowTimes(showTimes.filter((st) => st.id !== id));
  // };

  // // 티켓 옵션 추가
  // const handleAddTicketOption = () => {
  //   setTicketOptions([
  //     ...ticketOptions,
  //     {
  //       id: Date.now(),
  //       name: "",
  //       description: "",
  //       price: "",
  //     },
  //   ]);
  // };

  // // 티켓 옵션 삭제
  // const handleRemoveTicketOption = (id) => {
  //   setTicketOptions(ticketOptions.filter((to) => to.id !== id));
  // };

  // // 포스터 업로드
  // const handlePosterUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPosterImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const steps = [
  //   { num: 1, name: "공연 기본정보" },
  //   { num: 2, name: "공연 상세정보" },
  //   { num: 3, name: "공연 장소·좌석" },
  //   { num: 4, name: "알림 메시지" },
  //   { num: 5, name: "미리 보기" },
  // ];

  return (
    <Container>
      <NavbarManager />
      {/* 단계 표시 */}
      <MainContent>
      <RegisterShowNavbar
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      {/* 메인 컨텐츠 */}
      {currentStep === 1 && <RegisterShowStep1 />}
      {currentStep === 2 && <RegisterShowStep2 />}
      {currentStep === 3 && <RegisterShowStep3 />}
      {currentStep === 4 && <RegisterShowStep4 />}
      {currentStep === 5 && <RegisterShowStep5 />}
      
        
      </MainContent>
 
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


const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 50px 100px;
`;


