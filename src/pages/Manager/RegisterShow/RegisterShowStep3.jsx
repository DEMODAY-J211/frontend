import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { RiArrowRightSLine, RiInformationLine } from "react-icons/ri";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import { useToast } from "../../../components/Toast/useToast";
import SeatSelectionModal from "../../../components/Modal/SeatSelectionModal";
import RegisterShowNavbar from "./RegisterShowNavbar";

const RegisterShowStep3 = ({ viewer = false , initialData}) => {
  const navigate = useNavigate();
  const { showId } = useParams();
  const { addToast } = useToast();

  // 상태 관리
  const [selectedVenue, setSelectedVenue] = useState(() => {
    const saved = localStorage.getItem("selectedVenue");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedMethod, setSelectedMethod] = useState(() => {
    const saved = localStorage.getItem("selectedMethod");
    return saved ? JSON.parse(saved) : null;
  });
  // 공연 장소 목록 (API에서 가져옴)
  const [venues, setVenues] = useState(() => {
    // 로컬스토리지에 저장된 venues가 있으면 초기값으로 사용
    const saved = localStorage.getItem("venues");
    return saved ? JSON.parse(saved) : [];
  });
  const [quantity, setQuantity] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [excludedSeats, setExcludedSeats] = useState([]); // 제외된 좌석
  const [totalAvailableSeats, setTotalAvailableSeats] = useState(null); // 총 판매 가능 좌석
  const [updatedSeatCount, setUpdatedSeatCount] = useState(0); // 제외/VIP 좌석 수
  const [seatMapData, setSeatMapData] = useState(null); // 좌석표 데이터 (API 전송용)
  const [editMode, setEditMode] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  if (initialData) {
    // Set the venue based on initialData
    setSelectedVenue({
      id: initialData.locationId,
      name: initialData.locationName,
      type: initialData.seatType,  // "STANDING" or other types
      quantity: initialData.seatCount,
    });

    // Set the sales method (좌석 판매 방법) based on the initial data
    setSelectedMethod(initialData.seatType === "STANDING" ? "스탠딩석" : null);

    // Set the quantity
    setQuantity(initialData.seatCount);
  }
}, [initialData]);

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
            localStorage.setItem("venues", JSON.stringify(result.data));
          } else {
            setVenues([]);
            addToast("즐겨찾기한 공연장이 없습니다.", "info");
          }
        } else {
          console.error("Failed to fetch venues:", response.status);
          addToast("공연장 목록을 불러오는데 실패했습니다.", "error");
          // API 실패 시 더미 데이터 사용
        }
      } catch (error) {
        console.error("Error fetching favorite venues:", error);
        addToast("서버와의 통신 중 오류가 발생했습니다.", "error");
        // 네트워크 오류 시 더미 데이터 사용
      } finally {
        setIsLoading(false);
      }
    };
    // favoriteVenues가 비어있을 때만 호출
    if (!venues || venues.length === 0) {
      fetchFavoriteVenues();
    }
  }, []); // venues 상태를 의존으로 넣으면 필요 시만 호출

  // selectedVenue나 selectedMethod가 변경되면 로컬스토리지에 저장
  useEffect(() => {
    if (selectedVenue) {
      localStorage.setItem("selectedVenue", JSON.stringify(selectedVenue));
    }
  }, [selectedVenue]);

  useEffect(() => {
    if (selectedMethod) {
      localStorage.setItem("selectedMethod", JSON.stringify(selectedMethod));
    }
  }, [selectedMethod]);

  // 좌석 판매 방법 옵션
  const salesMethods = ["스탠딩석", "내가 현장에서 배정", "예매자 선택", "자동 배정"];
  const salesMethodMap = {
    스탠딩석: "STANDING",
    "내가 현장에서 배정": "EVENTHOST",
    "예매자 선택": "SELECTBYUSER",
    "자동 배정": "SCHEDULING",
  };
  useEffect(() => {
    console.log(selectedVenue);
    if (selectedVenue) {
      setQuantity(selectedVenue.quantity ?? 50);
    }
  }, [selectedVenue]);

  // 공연 장소 선택 핸들러 (단일 선택)
  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);

    // 공연장이 STANDING 타입이면 자동으로 스탠딩석 선택하고 변경 불가
    if (venue.type === "STANDING") {
      setSelectedMethod("스탠딩석");
      // 좌석 데이터 초기화
      setSeatMapData(null);
      setExcludedSeats([]);
      setTotalAvailableSeats(null);
      setUpdatedSeatCount(0);
    } else {
      // STANDING이 아닌 경우 선택 초기화
      setSelectedMethod(null);
    }
  };

  // 좌석 판매 방법 선택 핸들러 (단일 선택)
  const handleMethodSelect = (method) => {
    // STANDING 타입 공연장은 스탠딩석만 선택 가능 (변경 불가)
    if (selectedVenue?.type === "STANDING") {
      addToast("이 공연장은 스탠딩석만 선택 가능합니다.", "error");
      return;
    }

    // 이전 좌석 데이터 초기화
    setSeatMapData(null);
    setExcludedSeats([]);
    setTotalAvailableSeats(null);
    setUpdatedSeatCount(0);

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

  // 모달에서 좌석 저장 (로컬에만 저장)
  const handleSaveSeats = (seatData) => {
    // 좌석표 데이터 저장
    setSeatMapData(seatData.seatMap);

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
        `제외된 좌석: ${
          seatData.excludedSeats?.length || 0
        }개 / 판매 가능 좌석: ${seatData.totalAvailableSeats || 0}개`,
        "success"
      );
    }
    // 자동 배정인 경우
    else if (selectedMethod === "자동 배정") {
      setExcludedSeats(seatData.vipSeats || []);
      setUpdatedSeatCount(seatData.vipSeats?.length || 0);
      addToast(
        `VIP석: ${seatData.vipSeats?.length || 0}개 / 판매 가능 좌석: ${
          seatData.totalAvailableSeats || 0
        }개`,
        "success"
      );
    }
  };

  // 임시 저장 핸들러
  const handleTempSave = async () => {
    // 1) 기존 payload 불러오기
    const payload = JSON.parse(localStorage.getItem("createShowPayload")) || {};
    const selectedKey = salesMethodMap[selectedMethod]; // "standing"

    // 2) 공연장 정보 추가
    const updatedPayload = {
      ...payload,
      locationId: selectedVenue.id,
      locationName: selectedVenue.name,
      seatType: selectedKey,
      seatCount: quantity,
    };
    console.log("update", updatedPayload);
    localStorage.setItem("createShowPayload", JSON.stringify(updatedPayload));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/draft`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPayload),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (!response.ok) {
        addToast(result.message || "임시저장 실패", "error");
        return;
      }
      console.log(result);
      addToast("변경사항 저장완료!", "success");
    } catch (error) {
      console.error("임시저장 오류:", error);
      addToast("임시저장 중 오류 발생", "error");
    }
  };

  // 이전 단계로
  const handlePrevious = () => {
    navigate(`/register-show/${showId}/step2`);
  };

  // 다음 단계로
  const handleNext = async () => {
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

    // 예매자 선택 또는 자동 배정인 경우 API 호출
    if (
      (selectedMethod === "예매자 선택" || selectedMethod === "자동 배정") &&
      seatMapData
    ) {
      try {
        setIsLoading(true);

        const endpoint =
          selectedMethod === "자동 배정"
            ? `/manager/shows/${selectedVenue.id}/seatmap/vip`
            : `/manager/shows/${selectedVenue.id}/seatmap/delete`;

        const requestBody = {
          seat_map: seatMapData,
        };

        console.log("=== POST Request Data ===");
        console.log("Endpoint:", `${import.meta.env.VITE_API_URL}${endpoint}`);
        console.log("Sales Method:", selectedMethod);
        console.log("Venue ID:", selectedVenue.id);
        console.log("Request Body:", requestBody);
        console.log("Seat Map Data:", JSON.stringify(seatMapData, null, 2));
        console.log("========================");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}${endpoint}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(requestBody),
          }
        );
        console.log("Response:", response);

        if (response.ok) {
          const result = await response.json();
          console.log("Seat update result:", result);

          if (result.success) {
            console.log("✅ Success! Navigating to step 4...");
            addToast(
              selectedMethod === "자동 배정"
                ? "VIP석 선택이 완료되었습니다!"
                : "좌석 변경이 완료되었습니다!",
              "success"
            );

            // step4로 이동
            console.log(`Calling navigate('/register-show/${showId}/step4')`);
            navigate(`/register-show/${showId}/step4`);
            console.log("Navigate called");
          } else {
            console.log("❌ result.success is false");
            addToast(
              selectedMethod === "자동 배정"
                ? "VIP석 선택에 실패했습니다."
                : "좌석 변경에 실패했습니다.",
              "error"
            );
          }
        } else {
          console.log("❌ response.ok is false, status:", response.status);
          const errorData = await response.json();
          addToast(
            errorData.message ||
              (selectedMethod === "자동 배정"
                ? "VIP석 선택에 실패했습니다."
                : "좌석 변경에 실패했습니다."),
            "error"
          );
        }
      } catch (error) {
        console.error("Error saving seat changes:", error);
        addToast("서버와의 통신 중 오류가 발생했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      // 스탠딩석 또는 주최 측 배정인 경우 바로 다음 단계로
      navigate(`/register-show/${showId}/step4`);
    }
  };

  const handleSaveAndNext = async () => {
    try {
      // 1️⃣ 임시 저장 먼저
      await handleTempSave(); // handleTempSave가 async라면 await 사용

      // 2️⃣ 임시 저장 완료 후 다음 단계
      handleNext();
    } catch (error) {
      console.error("임시 저장 중 오류:", error);
      // 필요 시 사용자에게 알림
    }
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
              <SectionTitle>공연 장소
                <p>*</p>
              </SectionTitle>
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
              <SectionTitle>좌석 판매 방법
                <p>*</p>
              </SectionTitle>
              <ButtonGroup>
                {salesMethods
                  .filter((method) => {
                    // STANDING 타입 공연장은 스탠딩석만 표시
                    if (selectedVenue?.type === "STANDING") {
                      return method === "스탠딩석";
                    }
                    return true; // 다른 타입은 모든 옵션 표시
                  })
                  .map((method) => {
                    const isStandingType = selectedVenue?.type === "STANDING";
                    const isStandingMethod = method === "스탠딩석";

                    return (
                      <SelectButton
                        key={method}
                        active={selectedMethod === method}
                        $locked={isStandingType && isStandingMethod}
                        onClick={() => {
                          // STANDING 타입에서 스탠딩석 버튼은 클릭해도 아무 동작 안함
                          if (!(isStandingType && isStandingMethod)) {
                            handleMethodSelect(method);
                          }
                        }}
                      >
                        {selectedMethod === method ? (
                          <CheckboxIconSelected />
                        ) : (
                          <CheckboxIcon />
                        )}
                        {method}
                      </SelectButton>
                    );
                  })}
              </ButtonGroup>
              
                {!viewer && (
                  <InfoMessage>
                <InfoIcon />
                <InfoText>좌석이 없는 공연은 스탠딩석을 골라주세요!</InfoText>
              </InfoMessage>
                )}
                
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
                    <QuantityDisplay>
                      <div>
                        {editMode ? (
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                            onBlur={() => setEditMode(false)} // focus out 시 display 모드로
                            autoFocus
                            min={0}
                          />
                        ) : (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => setEditMode(true)}
                          >
                            {quantity}
                          </div>
                        )}
                      </div>
                    </QuantityDisplay>
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
              <NextButton onClick={handleSaveAndNext}>다음→</NextButton>
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
  display: flex;
  gap: 3px;
      p{
    font-size: 18px;
    font-weight: 300;
    color: var(--color-primary);
  }
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
  background: ${(props) => {
    if (props.disabled) return "#F5F5F5";
    if (props.$locked) return "#FC2847"; // locked 상태는 항상 활성화 색상
    return props.active ? "#FC2847" : "#FFFFFE";
  }};
  color: ${(props) => {
    if (props.disabled) return "#A0A0A0";
    if (props.$locked) return "#FFFFFE"; // locked 상태는 항상 활성화 텍스트 색상
    return props.active ? "#FFFFFE" : "#333333";
  }};

  font-weight: ${(props) => (props.active || props.$locked ? "bold" : "300")};
  font-size: 16px;
  cursor: ${(props) => {
    if (props.disabled) return "not-allowed";
    if (props.$locked) return "default"; // locked 상태는 기본 커서
    return "pointer";
  }};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover {
    transform: ${(props) =>
      props.disabled || props.$locked ? "none" : "translateY(-2px)"};
    box-shadow: ${(props) =>
      props.disabled || props.$locked
        ? "none"
        : "0 2px 8px rgba(0, 0, 0, 0.1)"};
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

const QuantityButtons = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-primary);
  border-radius: 20px;
  border: none;
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
  /* 안에 있는 input 스타일 */
  input {
    border: none;
    outline: none;
    background: transparent;
    // width: 3ch;
    text-align: center;
    font-size: inherit;
    font-family: inherit;
    cursor: text;
    color: #fffffe;
  }
`;

const QuantityInput = styled.input`
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
  
  color: var(--color-priamry);


`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;
  margin-top: 150px;
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
