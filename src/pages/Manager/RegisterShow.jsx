import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavbarManager from "../../components/Navbar/NavbarManager";
import RegisterShowNavbar from "./RegisterShow/RegisterShowNavbar";
import { Outlet, useLocation } from "react-router-dom";

const RegisterShow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();

  // URL 경로에 따라 currentStep 업데이트
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("step1")) setCurrentStep(1);
    else if (path.includes("step2")) setCurrentStep(2);
    else if (path.includes("step3")) setCurrentStep(3);
    else if (path.includes("step4")) setCurrentStep(4);
    else if (path.includes("step5")) setCurrentStep(5);
  }, [location.pathname]);
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

        {/* 중첩 라우트 렌더링 */}
        <Outlet />
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


