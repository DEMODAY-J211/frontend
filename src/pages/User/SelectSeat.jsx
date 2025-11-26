import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { formatKoreanDate } from "../../utils/dateFormat";
import NavbarUser from "../../components/Navbar/NavbarUser";
import Footerbtn from "../../components/Save/Footerbtn";

const getRoundNumber = (showtimeList, showtimeId) => {
  const sorted = [...showtimeList].sort(
    (a, b) => new Date(a.showtimeStart) - new Date(b.showtimeStart)
  );

  const index = sorted.findIndex((item) => item.showtimeId === showtimeId);

  return index !== -1 ? index + 1 : null;
};

const SelectSeat = () => {
  const navigate = useNavigate();
  const { managerId, showId, showtimeId } = useParams();
  const location = useLocation();

  const { selectedShowtime, selectedOption, quantity, showData } =
    location.state || {};
  console.log(
    "selectedshowtime",
    selectedShowtime,
    selectedOption,
    quantity,
    showData
  );
  const totalPrice = selectedOption?.ticketOptionPrice * quantity;
  console.log(selectedOption);
  // 공연 정보 (이전 페이지에서 전달받음)

  // API로부터 받아올 데이터
  // const [availableSeats, setAvailableSeats] = useState([]);
  // const [ticketOptions, setTicketOptions] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);

  useEffect(() => {
    // location.state에서 공연 정보 받기
    // if (location.state) {
    //   setShowInfo(location.state);
    //   console.log("location.state", location.state);
    // }

    // API 호출
    fetchAvailableSeats();
  }, [showtimeId]);
  useEffect(() => {
    console.log(selectedSeats);
  }, [selectedSeats]);

  const fetchAvailableSeats = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/user/${managerId}/booking/${showtimeId}/seats`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        console.log("result", result);
        console.log("result's data", result.data);
        // setAvailableSeats(result.data.seats);
        // setTicketOptions(result.data.ticketOptionList);
        generateSeatLayout(result.data.seats);
      }
    } catch (error) {
      console.error("좌석 조회 실패:", error);
      alert("좌석 정보를 불러오는데 실패했습니다.");
    }
  };
  // const generateSeatLayout = (seats) => {
  //   if (!seats || seats.length === 0) return;

  //   // 1️⃣ Rows(구역) 추출 (A, B, C ...)
  //   const sections = [...new Set(seats.map((s) => s.seatTable))].sort();

  //   // 2️⃣ 각 Section(예: A)에 대해 열(Column) 정렬하여 seat layout 생성
  //   const layout = sections.map((section) => {
  //     const rowSeats = seats
  //       .filter((s) => s.seatTable === section)
  //       .sort((a, b) => a.seatColumn - b.seatColumn); // A1, A2, A3 순서

  //     return rowSeats.map((s) => ({
  //       id: `seat-${s.showSeatId}`,
  //       label: `${s.seatTable}${s.seatColumn}`,
  //       row: s.seatTable,
  //       col: s.seatColumn,
  //       isAvailable: s.isAvailable, // 백엔드 값 그대로 사용
  //       isReserved: !s.isAvailable,
  //       seatId: s.seatId,
  //       showSeatId: s.showSeatId,
  //     }));
  //   });

  //   setSeatLayout(layout);
  // };
  const generateSeatLayout = (seats) => {
    if (!seats || seats.length === 0) return;

    // 1️⃣ 층별 분류 (예: 1층, 2층)
    const floors = [...new Set(seats.map((s) => s.seatFloor))].sort();

    const fullLayout = {};

    floors.forEach((floor) => {
      // 해당 floor 좌석만 필터링
      const floorSeats = seats.filter((s) => s.seatFloor === floor);

      // 2️⃣ row(행) 목록 추출
      const rows = [...new Set(floorSeats.map((s) => s.seatRow))].sort(
        (a, b) => a - b
      );

      // 3️⃣ row별로 seatColumn 기준으로 정렬하여 2D 배열 만들기
      const layout2D = rows.map((row) => {
        const rowSeats = floorSeats
          .filter((s) => s.seatRow === row)
          .sort((a, b) => a.seatColumn - b.seatColumn);

        return rowSeats.map((s) => ({
          id: `seat-${s.showSeatId}`,
          label: s.seatTable, // "가-1"
          row: s.seatRow,
          col: s.seatColumn,
          isAvailable: s.isAvailable,
          isReserved: !s.isAvailable,
          seatId: s.seatId,
          showSeatId: s.showSeatId,
          section: s.seatSection,
          floor: s.seatFloor,
        }));
      });

      fullLayout[floor] = layout2D;
    });

    setSeatLayout(fullLayout);
  };

  const handleSeatClick = (seat) => {
    if (seat.isReserved) {
      alert("이미 예약된 좌석입니다.");
      return;
    }

    if (!seat.isAvailable) return;

    // 좌석 선택 여부 (showSeatId 기준)
    const isSelected = selectedSeats.find(
      (s) => s.showSeatId === seat.showSeatId
    );

    if (isSelected) {
      // 선택 해제
      setSelectedSeats(
        selectedSeats.filter((s) => s.showSeatId !== seat.showSeatId)
      );
    } else {
      if (selectedSeats.length >= quantity) {
        alert(`최대 ${quantity}개의 좌석만 선택할 수 있습니다.`);
        return;
      }

      // 좌석 선택
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("좌석을 선택해주세요.");
      return;
    }

    if (selectedSeats.length !== quantity) {
      alert(`${quantity}개의 좌석을 선택해주세요.`);
      return;
    }
    console.log("manager,", managerId, showtimeId, selectedSeats);
    fetchSeats();

    // // 선택된 좌석 정보와 함께 다음 페이지로 이동
    navigate(`/${managerId}/payment/${showData.showId}`, {
      state: {
        selectedShowtime,
        selectedOption,
        quantity,
        showData,
      },
      replcae: true,
    });
    // navigate(`/${managerId}/payment/${showId}`, {
    //   state: {
    //     ...showInfo,
    //     selectedSeats: selectedSeats.map((s) => s.label),
    //     seatIds: selectedSeats.map((s) => s.seatId),
    //   },
    // });
  };

  const fetchSeats = async () => {
    try {
      const payload = { showSeatIds: selectedSeats.map((s) => s.showSeatId) };

      console.log("payload", payload);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/user/${managerId}/booking/${showtimeId}/seats/select`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const res = await response.json(); // 🔥 무조건 JSON으로 먼저 파싱

      if (!response.ok) {
        console.error("좌석 선택 실패:", res); // 👈 여기서 서버 메시지 확인 가능
        alert(res.message ?? "좌석 선택 실패");
        return;
      }

      console.log("좌석 선택 성공:", res);
    } catch (error) {
      console.error("요청 중 에러:", error);
      alert("요청 실패");
    }
  };
  return (
    <PageWrapper>
      <HomeUserContainer>
        {/* 헤더 */}
        <NavbarUser
          Backmode={true}
          nav={`/${managerId}/homeuser`}
          text="좌석 선택"
        />

        {/* 공연 정보 */}
        <InfoSection>
          <ShowInfoHeader>
            <ShowTitle>{showData.showTitle}</ShowTitle>
            <ShowTime>
              {getRoundNumber(
                showData.showtimeList,
                selectedShowtime.showtimeId
              )}
              회차(
              {formatKoreanDate(selectedShowtime.showtimeStart).split(" ")[1]})
            </ShowTime>
          </ShowInfoHeader>
          <TicketInfo>
            <TicketType>
              {selectedOption?.ticketOptionName}·{quantity}매
            </TicketType>
            <TotalPrice>{totalPrice?.toLocaleString()}원</TotalPrice>
          </TicketInfo>
        </InfoSection>

        {/* 좌석표 */}
        <SeatMapSection>
          <SeatMapTitle>{showData.showLocation}</SeatMapTitle>
          {/* <SeatMapGrid>
            {seatLayout.map((row, rowIndex) => (
              <SeatRow key={rowIndex}>
                {row.map((seat, colIndex) => (
                  <SeatButton
                    key={colIndex}
                    isAvailable={seat.isAvailable}
                    isReserved={seat.isReserved}
                    isSelected={selectedSeats.some((s) => s.id === seat.id)}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isReserved}
                  >
                    {seat.label}
                  </SeatButton>
                ))}
              </SeatRow>
            ))}
          </SeatMapGrid> */}
          {Object.entries(seatLayout).map(([floorName, rows]) => (
            <div key={floorName}>
              {/* 층 이름 */}
              <SeatMapTitle>{floorName}층</SeatMapTitle>

              {/* 좌석 그리드 */}
              <SeatMapGrid>
                {rows.map((row, rowIndex) => (
                  <SeatRow key={rowIndex}>
                    {row.map((seat, colIndex) => (
                      <SeatButton
                        key={colIndex}
                        isAvailable={seat.isAvailable}
                        isReserved={seat.isReserved}
                        isSelected={selectedSeats.some((s) => s.id === seat.id)}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.isReserved}
                      >
                        {seat.label}
                      </SeatButton>
                    ))}
                  </SeatRow>
                ))}
              </SeatMapGrid>
            </div>
          ))}

          {/* 선택된 좌석 표시 */}
          {selectedSeats.length > 0 && (
            <SelectedSeatsInfo>
              선택된 좌석: {selectedSeats.map((s) => s.label).join(", ")}
            </SelectedSeatsInfo>
          )}
        </SeatMapSection>

        {/* 하단 버튼 */}
        <Footerbtn
          buttons={[
            {
              text: "다음",
              color: "red",
              onClick: handleNext,
            },
          ]}
        />
      </HomeUserContainer>
    </PageWrapper>
  );
};

export default SelectSeat;

// Styled Components

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #fff;

  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const HomeUserContainer = styled.div`
  display: flex;
  // width: 393px;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  flex-direction: column;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 0 30px 5px rgba(0, 0, 0, 0.25);
`;

const InfoSection = styled.div`
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const ShowInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ShowTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin: 0;
`;

const ShowTime = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #940c0c;
`;

const TicketInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TicketType = styled.span`
  font-size: 15px;
  font-weight: 300;
  color: #000000;
`;

const TotalPrice = styled.span`
  font-size: 15px;
  font-weight: 300;
  color: #000000;
`;

const SeatMapSection = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const SeatMapTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  margin-bottom: 20px;
  text-align: center;
`;

const SeatMapGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
`;

const SeatRow = styled.div`
  display: flex;
  gap: 4px;
`;

const SeatButton = styled.button`
  width: 32px;
  height: 28px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  cursor: ${(props) => (props.isAvailable ? "pointer" : "not-allowed")};
  transition: all 0.2s ease;

  /* 예약된 좌석 - 회색 */
  ${(props) =>
    !props.isAvailable &&
    `
    background-color: #CCCCCC;
    color: #666666;
    border-color: #999999;
  `}

  /* 예매 가능한 좌석 - 흰색 */
  ${(props) =>
    props.isAvailable &&
    !props.isSelected &&
    // !props.isReserved &&
    `
    background-color: #FFFFFF;
    color: #000000;
    border-color: #333333;
  `}

  /* 선택된 좌석 - 분홍색 */
  ${(props) =>
    props.isSelected &&
    `
    background-color: var(--color-tertiary);
    color: #940C0C;
    border-color: #940C0C;
    border-width: 2px;
  `}

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const SelectedSeatsInfo = styled.div`
  margin-top: 20px;
  padding: 10px 15px;
  background-color: var(--color-tertiary);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #940c0c;
  text-align: center;
`;
