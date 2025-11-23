import React from "react";
import NavbarManager from "../../components/Navbar/NavbarManager";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import showimg from "../../assets/homemanager/show_icon.png";
import linkimg from "../../assets/homemanager/link.png";
import locationimg from "../../assets/homemanager/location_icon.png";
import myteamimg from "../../assets/homemanager/myteam.png";
import myshowimg from "../../assets/homemanager/myshow_icon.png";

import { ToastProvider } from "../../components/Toast/ToastProvider";
import { useToast } from "../../components/Toast/useToast";
import EditTeamInfo from "./EditTeamInfo";

const HomeManager = () => {
  const navigate = useNavigate();

  const { addToast } = useToast(); // 훅으로 토스트 가져오기
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [registerShowModal, setRegisterShowModal] = useState(null); // null, 'first', 'continue', 'duplicate', 'temp', 'tempDone'
  const [hasVenues, setHasVenues] = useState(false); // 공연장 등록 여부
  const [hasShows, setHasShows] = useState(false); // 공연 등록 여부

  // 페이지 로드 시 즐겨찾기 공연장 확인
  useEffect(() => {
    const fetchFavoriteVenues = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/manager/shows/venues?favorite=true`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Favorite venues:", result);

          // data가 배열이고 길이가 0보다 크면 공연장이 있는 것
          if (
            result.success &&
            result.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            setHasVenues(true);
          } else {
            setHasVenues(false);
          }
        } else {
          console.error("Failed to fetch venues:", response.status);
          setHasVenues(false);
        }
      } catch (error) {
        console.error("Error fetching favorite venues:", error);
        setHasVenues(false);
      }
    };

    fetchFavoriteVenues();
  }, []);

  const handleCopyLink = async () => {
    const link = "https://example.com"; // 실제 복사할 링크
    try {
      await navigator.clipboard.writeText(link);
      addToast("링크를 복사했어요!", "success"); // 성공 토스트
      console.log(link);
    } catch (error) {
      addToast("링크 복사 실패", "error"); // 실패 토스트
    }
  };

  const handleOpenTeamModal = () => {
    setIsEditTeamModalOpen(true);
  };

  const handleCloseTeamModal = () => {
    setIsEditTeamModalOpen(false);
  };

  const handleRegisterShowClick = () => {
    // 즐겨찾기 공연장이 없으면 'first' 모달, 있으면 'duplicate' 모달
    if (!hasVenues) {
      setRegisterShowModal("first"); // "등록된 공연장이 없습니다"
    } else {
      setRegisterShowModal("duplicate"); // "새로운 공연장 등록하시겠습니까?"
    }
  };

  const handleCloseRegisterModal = () => {
    setRegisterShowModal(null);
  };

  const onClickRegisterShow = () => {
    const fetchRegisterShow = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/manager/shows`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Register Show :", result);

          // data가 배열이고 길이가 0보다 크면 공연장이 있는 것
          if (result.success) {
            console.log(result.message);
            console.log(result.data);
            const showId = result.data.showId;
            navigate(`/register-show/${showId}/step1`);
          }
        } else {
          console.error("Failed to fetch shows:", response.status);
        }
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };

    fetchRegisterShow();
  };

  return (
    <Home>
      <NavbarManager />
      <EditTeamInfo
        isOpen={isEditTeamModalOpen}
        onClose={handleCloseTeamModal}
      />

      {/* 공연 등록 모달들 */}
      {registerShowModal === "first" && (
        <ModalOverlay onClick={handleCloseRegisterModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseRegisterModal}>×</CloseButton>
            <ModalTitle>
              등록된 공연장이 없습니다.
              <br />
              지금 첫 공연장을 등록해주세요!
            </ModalTitle>
            <ModalButtonGroup>
              <ModalButton
                $primary
                onClick={() => navigate("/register-venue/step1")}
              >
                공연장 등록하기
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {registerShowModal === "continue" && (
        <ModalOverlay onClick={handleCloseRegisterModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseRegisterModal}>×</CloseButton>
            <ModalTitle>
              등록이 완료되었습니다!
              <br />
              이어서 공연도 등록하시겠습니까?
            </ModalTitle>
            <ModalButtonGroup>
              <ModalButton $primary onClick={onClickRegisterShow}>
                네, 등록할래요
              </ModalButton>
              <ModalButton onClick={handleCloseRegisterModal}>
                아니요
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {registerShowModal === "duplicate" && (
        <ModalOverlay onClick={handleCloseRegisterModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseRegisterModal}>×</CloseButton>
            <ModalTitle>
              새로운 공연을 등록하시네요!
              <br />
              새로운 공연의 공연장소를 아직 등록하지 않으셨다면
              <br />
              공연장을 등록해주세요!
            </ModalTitle>
            <ModalButtonGroup>
              <ModalButton onClick={() => navigate("/register-venue/step1")}>
                공연장 등록하기
              </ModalButton>
              <ModalButton $primary onClick={onClickRegisterShow}>
                이미 등록했어요
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {registerShowModal === "temp" && (
        <ModalOverlay onClick={handleCloseRegisterModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseRegisterModal}>×</CloseButton>
            <ModalTitle>
              임시저장된 공연이 있어요!
              <br />
              해당 공연을 이어서 등록하시겠어요?
            </ModalTitle>
            <ModalSubtitle>
              * 주의! 새로운 공연 등록 시<br />
              임시 저장된 정보들은 사라지니 유의해주세요!
            </ModalSubtitle>
            <ModalButtonGroup>
              <ModalButton
                $primary
                onClick={() => navigate("/register-show/step1?mode=continue")}
              >
                이어서 등록하기
              </ModalButton>
              <ModalButton onClick={onClickRegisterShow}>
                새로운 공연 등록하기
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {registerShowModal === "tempDone" && (
        <ModalOverlay onClick={handleCloseRegisterModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseRegisterModal}>×</CloseButton>
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
              <ModalButton
                $primary
                onClick={() => {
                  /* 임시저장 로직 */
                }}
              >
                임시 저장하기
              </ModalButton>
              <ModalButton onClick={handleCloseRegisterModal}>
                중단하기
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      <ButtonGridTop>
        <FarLeft>
          <RegisterShow onClick={handleRegisterShowClick}>
            <BtnName>공연 등록하기</BtnName>
            <BtnIcon src={showimg} alt="공연 등록하기" />
            <BtnWriting>
              <BtnInfo>
                설명글입니다. 여기에 뭐 적을지 정해야 하구.. 어쩌구저쩌구..
                어쩌구 저쩌구..{" "}
              </BtnInfo>
              <Draft>
                <DraftNum>임시저장(1)</DraftNum>
                {/* <DraftExplained>임시저장된 공연이 1개 있어요!</DraftExplained> */}
              </Draft>
            </BtnWriting>
          </RegisterShow>

          <TeamInfo onClick={handleOpenTeamModal}>
            <MyShowContent>
              <MyShowLeft>
                <BtnName>단체 소개</BtnName>
                <BtnInfo>
                  설명글입니다. 여기에 뭐 적을지 정해야 하구.. 어쩌구저쩌구..
                  어쩌구 저쩌구..
                </BtnInfo>
              </MyShowLeft>
              <MyShowRight>
                <BtnIcon src={myteamimg} alt="단체소개" />
              </MyShowRight>
            </MyShowContent>
          </TeamInfo>
        </FarLeft>

        <TopMid>
          <MyShow onClick={() => navigate(`/manageshow`)}>
            <MyShowContent>
              <MyShowLeft>
                <BtnName>내 공연 관리</BtnName>
                <BtnInfo>
                  설명글입니다. 여기에 뭐 적을지 정해야 하구.. 어쩌구저쩌구..
                  어쩌구 저쩌구..
                </BtnInfo>
              </MyShowLeft>
              <MyShowRight>
                <BtnIcon src={myshowimg} alt="내 공연 관리" />
              </MyShowRight>
            </MyShowContent>
          </MyShow>

          <TopRight>
            <UserLink onClick={handleCopyLink}>
              <MyShowContent>
                <MyShowLeft>
                  <BtnName>예매자 링크</BtnName>
                  <BtnInfo>클릭하고 복사하기! </BtnInfo>
                </MyShowLeft>
                <MyShowRight>
                  <BtnIcon src={linkimg} alot="예매자 링크" />
                </MyShowRight>
              </MyShowContent>
            </UserLink>

            <MyLocation onClick={() => navigate(`/registeredvenues`)}>
              <BtnName>내 공연장 관리</BtnName>
              <BtnIcon src={locationimg} alt="내 공연장 관리" />
              <BtnInfo>
                설명글입니다. 여기에 뭐 적을지 정해야 하구.. 어쩌구저쩌구..
                어쩌구 저쩌구.
              </BtnInfo>
            </MyLocation>
          </TopRight>
        </TopMid>
      </ButtonGridTop>
    </Home>
  );
};

export default HomeManager;

const Home = styled.div`
  width: 100%;
`;

const ButtonGridTop = styled.div`
  width: 100%;
  padding: 0 100px;

  display: flex;
  gap: 70px;
`;

const RegisterShow = styled.div`
  display: flex;
  width: 340px;
  height: 545px;
  padding: 40px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  border-radius: 30px;
  background: var(--color-tertiary);
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    background-color: #fbdede;
  }
`;

const BtnName = styled.div`
  align-self: stretch;

  color: #333;
  font-size: 30px;
  font-weight: 500;
`;

const BtnIcon = styled.img``;

const BtnWriting = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  align-self: stretch;
`;

const BtnInfo = styled.p`
  line-height: 25px;
  flex-shrink: 0;
  align-self: stretch;
  font-size: 15px;
  font-weight: 300;
`;

const Draft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DraftNum = styled.p`
  font-size: 16px;
  text-decoration-line: underline;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    color: var(--color-primary);
  }
`;

// const DraftExplained = styled.p`
//     font-size: 16px;
// `

const TopMid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 45px;
  transform: translateX(-60%);
`;

const MyShow = styled.div`
  display: flex;
  width: 829px;
  height: 255px;
  padding: 40px;
  flex-direction: column;
  justify-content: space-between;

  border-radius: 30px;
  background: var(--color-tertiary);
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    background-color: #fbdede;
  }
`;
const MyShowContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const MyShowLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MyShowRight = styled.div``;

const UserLink = styled.div`
  display: flex;
  width: 419px;
  height: 245px;
  padding: 40px;
  flex-direction: column;
  justify-content: space-between;

  border-radius: 30px;
  background: var(--color-tertiary);
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    background-color: #fbdede;
  }
`;

const TopRight = styled.div`
  display: flex;
  gap: 70px;
`;

const MyLocation = styled.div`
  display: flex;
  width: 340px;
  height: 545px;
  padding: 40px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  border-radius: 30px;
  background: var(--color-tertiary);
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    background-color: #fbdede;
  }
`;

const FarLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 45px;
`;

const TeamInfo = styled.div`
  display: flex;
  width: 829px;
  height: 255px;
  padding: 40px;
  flex-direction: column;
  justify-content: space-between;

  z-index: 1000;

  border-radius: 30px;
  background: var(--color-tertiary);
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    background-color: #fbdede;
  }
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
