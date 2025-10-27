import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const SelectSeat = () => {
  const navigate = useNavigate();
  const { showtimeId } = useParams();
  const location = useLocation();

  // 공연 정보 (이전 페이지에서 전달받음)
  const [showInfo, setShowInfo] = useState({
    showName: '제11회정기공연',
    showtimeName: '1회차(15:00)',
    ticketType: '일반예매',
    quantity: 2,
    totalPrice: 18000
  });

  // API로부터 받아올 데이터
  const [availableSeats, setAvailableSeats] = useState([]);
  const [ticketOptions, setTicketOptions] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);

  useEffect(() => {
    // location.state에서 공연 정보 받기
    if (location.state) {
      setShowInfo(location.state);
    }

    // API 호출
    fetchAvailableSeats();
  }, [showtimeId]);

  const fetchAvailableSeats = async () => {
    try {
      // const token = localStorage.getItem('accessToken');
      // const response = await fetch(`/api/showtimes/${showtimeId}/seats`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const result = await response.json();

      // Mock 데이터
      const mockData = {
        success: true,
        code: 200,
        message: "success",
        data: {
          showtimeId: 2,
          showStartTime: "2025-10-28T15:00",
          availableSeats: [
            { seatId: 101, seatTable: "A3-7" },
            { seatId: 102, seatTable: "A3-8" },
            { seatId: 103, seatTable: "B1-2" },
            { seatId: 104, seatTable: "B2-5" },
            { seatId: 105, seatTable: "C1-3" },
          ],
          ticketOptionList: [
            {
              ticketOptionId: 1,
              ticketOptionName: "일반예매가",
              ticketOptionPrice: 9000,
              selectedQuantity: 0
            },
            {
              ticketOptionId: 2,
              ticketOptionName: "학생할인가",
              ticketOptionPrice: 8000,
              selectedQuantity: 0
            }
          ],
          totalPrice: 18000
        }
      };

      if (mockData.success) {
        setAvailableSeats(mockData.data.availableSeats);
        setTicketOptions(mockData.data.ticketOptionList);
        generateSeatLayout(mockData.data.availableSeats);
      }
    } catch (error) {
      console.error('좌석 조회 실패:', error);
      alert('좌석 정보를 불러오는데 실패했습니다.');
    }
  };

  const generateSeatLayout = (available) => {
    // 좌석 레이아웃 생성 (8행 x 10열)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = 10;

    const layout = rows.map((row, rowIndex) => {
      return Array.from({ length: cols }, (_, colIndex) => {
        const seatLabel = `${row}${colIndex + 1}`;

        // 예매 가능한 좌석인지 확인
        const isAvailable = available.some(seat => {
          // seatTable 형식: "A3-7" -> A행 3-7번 범위 또는 단일 좌석
          const [seatRow, seatNum] = seat.seatTable.split(/(\d+)/);
          return seatRow === row && seatNum.includes(String(colIndex + 1));
        });

        return {
          id: `seat-${rowIndex}-${colIndex}`,
          label: seatLabel,
          row,
          col: colIndex + 1,
          isAvailable,
          isReserved: !isAvailable, // 예매 불가능한 좌석은 이미 예약된 것
          seatId: available.find(s => s.seatTable === seatLabel)?.seatId || null
        };
      });
    });

    setSeatLayout(layout);
  };

  const handleSeatClick = (seat) => {
    if (seat.isReserved) {
      alert('이미 예약된 좌석입니다.');
      return;
    }

    if (!seat.isAvailable) return;

    // 좌석 선택/해제
    const isSelected = selectedSeats.find(s => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      // 최대 선택 개수 체크 (예: 티켓 수량만큼)
      if (selectedSeats.length >= showInfo.quantity) {
        alert(`최대 ${showInfo.quantity}개의 좌석만 선택할 수 있습니다.`);
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert('좌석을 선택해주세요.');
      return;
    }

    if (selectedSeats.length !== showInfo.quantity) {
      alert(`${showInfo.quantity}개의 좌석을 선택해주세요.`);
      return;
    }

    // 선택된 좌석 정보와 함께 다음 페이지로 이동
    navigate('/payment', {
      state: {
        ...showInfo,
        selectedSeats: selectedSeats.map(s => s.label),
        seatIds: selectedSeats.map(s => s.seatId)
      }
    });
  };

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <IoArrowBack size={32} />
        </BackButton>
        <Title>좌석 선택</Title>
        <Spacer />
      </Header>

      {/* 공연 정보 */}
      <InfoSection>
        <ShowInfoHeader>
          <ShowTitle>{showInfo.showName}</ShowTitle>
          <ShowTime>{showInfo.showtimeName}</ShowTime>
        </ShowInfoHeader>
        <TicketInfo>
          <TicketType>{showInfo.ticketType}·{showInfo.quantity}매</TicketType>
          <TotalPrice>{showInfo.totalPrice.toLocaleString()}원</TotalPrice>
        </TicketInfo>
      </InfoSection>

      {/* 좌석표 */}
      <SeatMapSection>
        <SeatMapTitle>Maryhall Grand Theater Seating Plan</SeatMapTitle>
        <SeatMapGrid>
          {seatLayout.map((row, rowIndex) => (
            <SeatRow key={rowIndex}>
              {row.map((seat, colIndex) => (
                <SeatButton
                  key={colIndex}
                  isAvailable={seat.isAvailable}
                  isReserved={seat.isReserved}
                  isSelected={selectedSeats.some(s => s.id === seat.id)}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.isReserved}
                >
                  {seat.label}
                </SeatButton>
              ))}
            </SeatRow>
          ))}
        </SeatMapGrid>

        {/* 선택된 좌석 표시 */}
        {selectedSeats.length > 0 && (
          <SelectedSeatsInfo>
            선택된 좌석: {selectedSeats.map(s => s.label).join(', ')}
          </SelectedSeatsInfo>
        )}
      </SeatMapSection>

      {/* 하단 버튼 */}
      <BottomSection>
        <NextButton onClick={handleNext}>다음</NextButton>
      </BottomSection>
    </Container>
  );
};

export default SelectSeat;

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 393px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background-color: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 100;
  border-bottom: 1px solid #F0F0F0;
`;

const BackButton = styled.button`
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
`;

const Title = styled.h1`
  font-size: 25px;
  font-weight: 500;
  color: #000000;
  margin: 0;
`;

const Spacer = styled.div`
  width: 32px;
`;

const InfoSection = styled.div`
  background-color: #FFFFFF;
  padding: 20px;
  display: flex;
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
  color: #940C0C;
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
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  cursor: ${props => props.isReserved ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  /* 예약된 좌석 - 회색 */
  ${props => props.isReserved && `
    background-color: #CCCCCC;
    color: #666666;
    border-color: #999999;
  `}

  /* 예매 가능한 좌석 - 흰색 */
  ${props => props.isAvailable && !props.isSelected && !props.isReserved && `
    background-color: #FFFFFF;
    color: #000000;
    border-color: #333333;
  `}

  /* 선택된 좌석 - 노란색 */
  ${props => props.isSelected && `
    background-color: #FFF4D2;
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
  background-color: #FFF4D2;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #940C0C;
  text-align: center;
`;

const BottomSection = styled.div`
  padding: 10px;
  background-color: #FFFFFF;
  border-top: 1px solid #F0F0F0;
`;

const NextButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #FFF4D2;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FFE699;
  }

  &:active {
    transform: scale(0.98);
  }
`;
