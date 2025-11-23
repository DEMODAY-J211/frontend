import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine, RiInformationLine } from "react-icons/ri";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import { useToast } from "../../../components/Toast/useToast";
import SeatSelectionModal from "../../../components/Modal/SeatSelectionModal";
import RegisterShowNavbar from "./RegisterShowNavbar";

const RegisterShowStep3 = ({ viewer = false }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 상태 관리
  const [selectedVenue, setSelectedVenue] = useState(null); // 단일 선택
  const [selectedMethod, setSelectedMethod] = useState(null); // 기본 선택 없음
  const [quantity, setQuantity] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [excludedSeats, setExcludedSeats] = useState([]); // 제외된 좌석
  const [totalAvailableSeats, setTotalAvailableSeats] = useState(null); // 총 판매 가능 좌석
  const [updatedSeatCount, setUpdatedSeatCount] = useState(0); // 제외/VIP 좌석 수

  // 공연 장소 목록 (API에서 가져옴)
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 페이지 로드 시 즐겨찾기 공연장 목록 불러오기
  useEffect(() => {
    const fetchFavoriteVenues = async () => {
      try {
        setIsLoading(true);
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

          if (result.success && result.data && Array.isArray(result.data)) {
            // API 응답에서 공연장 목록 설정
            setVenues(result.data);
          } else {
            setVenues([]);
            addToast("즐겨찾기한 공연장이 없습니다.", "info");
          }
        } else {
          console.error("Failed to fetch venues:", response.status);
          addToast("공연장 목록을 불러오는데 실패했습니다.", "error");
          // API 실패 시 더미 데이터 사용
          setVenues([
            { id: 1, name: "올림픽공원 KSPO DOME" },
            { id: 2, name: "잠실실내체육관" },
            { id: 3, name: "고척스카이돔" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching favorite venues:", error);
        addToast("서버와의 통신 중 오류가 발생했습니다.", "error");
        // 네트워크 오류 시 더미 데이터 사용
        setVenues([
          { id: 1, name: "올림픽공원 KSPO DOME" },
          { id: 2, name: "잠실실내체육관" },
          { id: 3, name: "고척스카이돔" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteVenues();
  }, []);

  // 좌석 판매 방법 옵션
  const salesMethods = ["스탠딩석", "주최 측 배정", "예매자 선택", "자동 배정"];

  // 공연 장소 선택 핸들러 (단일 선택)
  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
  };

  // 좌석 판매 방법 선택 핸들러 (단일 선택)
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);

    // 예매자 선택 또는 자동 배정인 경우 모달 열기
    if (method === "예매자 선택" || method === "자동 배정") {
      // 공연장이 선택되어 있는지 확인
      if (!selectedVenue) {
        addToast("먼저 공연 장소를 선택해주세요!", "error");
        setSelectedMethod(null); // 선택 취소
        return;
      }
      setIsModalOpen(true);
    }
  };

  // 모달에서 좌석 저장
  const handleSaveSeats = (seatData) => {
    // totalAvailableSeats 저장
    if (seatData.totalAvailableSeats !== undefined) {
      setTotalAvailableSeats(seatData.totalAvailableSeats);
      setQuantity(seatData.totalAvailableSeats);
    }

    // 예매자 선택인 경우
    if (selectedMethod === "예매자 선택") {
      setExcludedSeats(seatData.excludedSeats || []);
      setUpdatedSeatCount(seatData.excludedSeats?.length || 0);
      addToast(
        `${seatData.excludedSeats?.length || 0}개의 좌석이 제외되었습니다.`,
        "success"
      );
    }
    // 자동 배정인 경우
    else if (selectedMethod === "자동 배정") {
      setExcludedSeats(seatData.vipSeats || []);
      setUpdatedSeatCount(seatData.vipSeats?.length || 0);
      addToast(
        `${seatData.vipSeats?.length || 0}개의 VIP석이 지정되었습니다.`,
        "success"
      );
    }
  };

  // 임시 저장 핸들러
  const handleTempSave = () => {
    const formData = {
      venue: selectedVenue,
      salesMethod: selectedMethod,
      quantity: quantity,
    };
    localStorage.setItem("registerShowStep3", JSON.stringify(formData));
    addToast("임시 저장되었습니다!", "success");
  };

  // 이전 단계로
  const handlePrevious = () => {
    // TODO: 2단계 페이지로 이동
    navigate("/register-show/step2");
  };

  // 다음 단계로
  const handleNext = () => {
    // 유효성 검사
    if (!selectedVenue) {
      addToast("공연 장소를 선택해주세요!", "error");
      return;
    }

    if (!selectedMethod) {
      addToast("좌석 판매 방법을 선택해주세요!", "error");
      return;
    }

    if (!quantity || quantity <= 0) {
      addToast("판매 수량을 확인해주세요!", "error");
      return;
    }

    // TODO: 4단계 페이지로 이동
    navigate("/register-show/step4");
  };

  return (
    <>
      {/* <NavbarManager /> */}
      <Container>
        <MainContent>
          {/* <RegisterShowNavbar currentStep={3} /> */}

          <FormContent>
            {/* 공연 장소 섹션 */}
            <Section>
              <SectionTitle>공연 장소</SectionTitle>
              <ButtonGroup>
                {venues.map((venue) => (
                  <SelectButton
                    key={venue.id}
                    active={selectedVenue?.id === venue.id}
                    onClick={() => handleVenueSelect(venue)}
                  >
                    {selectedVenue?.id === venue.id ? (
                      <CheckboxIconSelected />
                    ) : (
                      <CheckboxIcon />
                    )}
                    {venue.name || venue}
                  </SelectButton>
                ))}
              </ButtonGroup>
            </Section>

            {/* 좌석 판매 방법 섹션 */}
            <Section>
              <SectionTitle>좌석 판매 방법</SectionTitle>
              <ButtonGroup>
                {salesMethods.map((method) => (
                  <SelectButton
                    key={method}
                    active={selectedMethod === method}
                    onClick={() => handleMethodSelect(method)}
                  >
                    {selectedMethod === method ? (
                      <CheckboxIconSelected />
                    ) : (
                      <CheckboxIcon />
                    )}
                    {method}
                  </SelectButton>
                ))}
              </ButtonGroup>
              <InfoMessage>
                <InfoIcon />
                <InfoText>좌석이 없는 공연은 스탠딩석을 골라주세요!</InfoText>
              </InfoMessage>
            </Section>

            {/* 판매 수량 섹션 */}
            <Section>
              <SectionTitle>판매 수량</SectionTitle>
              {selectedMethod === "예매자 선택" &&
              totalAvailableSeats !== null ? (
                <QuantityInfoWrapper>
                  <QuantityInfoRow>
                    <QuantityLabel>판매 가능 좌석:</QuantityLabel>
                    <QuantityValue>{totalAvailableSeats}개</QuantityValue>
                  </QuantityInfoRow>
                  <QuantityInfoRow>
                    <QuantityLabel>제외한 좌석:</QuantityLabel>
                    <QuantityValue>{updatedSeatCount}개</QuantityValue>
                  </QuantityInfoRow>
                </QuantityInfoWrapper>
              ) : selectedMethod === "자동 배정" &&
                totalAvailableSeats !== null ? (
                <QuantityInfoWrapper>
                  <QuantityInfoRow>
                    <QuantityLabel>판매 가능 좌석:</QuantityLabel>
                    <QuantityValue>{totalAvailableSeats}개</QuantityValue>
                  </QuantityInfoRow>
                  <QuantityInfoRow>
                    <QuantityLabel>VIP 좌석:</QuantityLabel>
                    <QuantityValue>{updatedSeatCount}개</QuantityValue>
                  </QuantityInfoRow>
                </QuantityInfoWrapper>
              ) : (
                <QuantityControl>
                  <QuantityButtons>
                    <QuantityDisplay>{quantity}</QuantityDisplay>
                  </QuantityButtons>
                  <Unit>개</Unit>
                </QuantityControl>
              )}
            </Section>
          </FormContent>
        </MainContent>

        {/* 하단 버튼 */}
        {!viewer && (
          <Footer>
            <PrevButton onClick={handlePrevious}>←이전</PrevButton>
            <RightButtonGroup>
              <TempSaveButton onClick={handleTempSave}>임시저장</TempSaveButton>
              <NextButton onClick={handleNext}>다음→</NextButton>
            </RightButtonGroup>
          </Footer>
        )}
      </Container>

      {/* 좌석 선택 모달 */}
      <SeatSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSeats}
        salesMethod={selectedMethod}
        locationId={selectedVenue?.id || null}
      />
    </>
  );
};

export default RegisterShowStep3;

// Styled Components
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

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 12px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  font-weight: 500;
  font-size: 25px;
  color: #000000;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const SelectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 121px;
  height: 45px;
  padding: 5px 10px;
  border-radius: 10px;
  border: ${(props) => (props.active ? "none" : "1px solid #C5C5C5")};
  background: ${(props) => (props.active ? "#FC2847" : "#FFFFFE")};
  color: ${(props) => (props.active ? "#FFFFFE" : "#333333")};

  font-weight: ${(props) => (props.active ? "bold" : "300")};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CheckboxIcon = styled(GrCheckbox)`
  width: 16px;
  height: 16px;
  color: #333333;
`;

const CheckboxIconSelected = styled(GrCheckboxSelected)`
  width: 16px;
  height: 16px;
  color: #fffffe;
`;

const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

const InfoIcon = styled(RiInformationLine)`
  width: 16px;
  height: 16px;
  color: #d72b2b;
`;

const InfoText = styled.span`
  font-weight: 300;
  font-size: 15px;
  color: #d72b2b;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const QuantityButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fc2847;
  border-radius: 20px;
  padding: 3px 10px;
`;

const MinusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  color: #fffffe;
  cursor: pointer;
  padding: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PlusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  color: #fffffe;
  cursor: pointer;
  padding: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const QuantityDisplay = styled.div`
  font-weight: 500;
  font-size: 20px;
  color: #fffffe;
  width: 36px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Unit = styled.span`
  font-weight: 500;
  font-size: 20px;
  color: #000000;
`;

const QuantityInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 0;
`;

const QuantityInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const QuantityLabel = styled.span`
  font-weight: 500;
  font-size: 20px;
  color: #333333;
  min-width: 160px;
`;

const QuantityValue = styled.span`
  font-weight: 700;
  font-size: 24px;
  color: #fc2847;
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
