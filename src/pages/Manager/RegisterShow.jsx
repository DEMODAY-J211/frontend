import { useState, useEffect } from "react";
import styled from "styled-components";
import NavbarManager from "../../components/Navbar/NavbarManager";
import RegisterShowNavbar from "./RegisterShow/RegisterShowNavbar";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {} from "react";
import usePreventLeave from "./RegisterShow/usePreventLeave";

const RegisterShow = () => {
  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isDirty, setIsDirty] = useState(false); // 폼 수정 여부
  const [nextPath, setNextPath] = useState(null); // 이동하려던 경로 저장
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 브라우저 새로고침 방지만!
  usePreventLeave(isDirty);

  // -------------- ★ 내부 이동 제어 ---------------
  const handleProtectedNavigation = (path) => {
    if (!isDirty) {
      navigate(path);
      return;
    }

    // 수정 중이면 모달 열기
    setNextPath(path);
    setIsModalOpen(true);
  };

  // 모달에서 "이동하기" 클릭
  const confirmLeave = () => {
    console.log(showId);
    localStorage.setItem("draft_showId", showId);
    setIsModalOpen(false);
    navigate(nextPath, { replace: true });
  };

  // 모달에서 "취소" 클릭
  const cancelLeave = () => {
    setIsModalOpen(false);
    setNextPath(null);
  };

  useEffect(() => {
    const step = location.pathname.split("/").pop();
    const stepNum = Number(step.replace("step", ""));
    if (!isNaN(stepNum)) setCurrentStep(stepNum);
  }, [location.pathname]);

  useEffect(() => {
    const step = location.pathname.split("/").pop(); // step1, step2...
    const stepNum = Number(step.replace("step", "")); // 숫자만 추출

    if (!isNaN(stepNum)) {
      setCurrentStep(stepNum);
    }
  }, [location.pathname]);

  return (
    <Container>
      <NavbarManager onProtectedNavigate={handleProtectedNavigation} />
      {/* 단계 표시 */}
      <RegisterShowNavbar
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <Outlet context={{ isDirty, setIsDirty }} />
      {isModalOpen && (
        <ModalOverlay onClick={cancelLeave}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={cancelLeave}>×</CloseButton>
            <ModalTitle>
              임시저장 없이
              <br />
              공연 등록을 중단하시겠어요?
            </ModalTitle>
            <ModalSubtitle>
              * 주의! 중단 시<br />
              입력된 정보들은 사라지니 유의해주세요!
            </ModalSubtitle>
            <ModalButtonGroup>
              <ModalButton $primary onClick={confirmLeave}>
                임시 저장하기
              </ModalButton>
              <ModalButton onClick={cancelLeave}>중단하기</ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
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

// 공연 등록 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  cursor: pointer;
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 30px;
  padding: 60px;
  min-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  cursor: default;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #333;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
  color: #333;
  margin: 0;
`;

const ModalSubtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  line-height: 1.6;
  color: #666;
  margin: -20px 0 0 0;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: 15px 40px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;

  ${(props) =>
    props.$primary
      ? `
        background: var(--color-primary);
        color: white;

        &:hover {
            background: #d63232;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(234, 70, 70, 0.3);
        }
    `
      : `
        background: white;
        color: var(--color-primary);
        border: 2px solid var(--color-primary);

        &:hover {
            background: var(--color-tertiary);
            transform: translateY(-2px);
        }
    `}
`;
