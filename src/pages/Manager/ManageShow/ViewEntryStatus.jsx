import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NavbarManager from '../../../components/Navbar/NavbarManager';
import { IoMdRefresh, IoMdClose } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';

const ViewEntryStatus = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('seat'); 
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSelected, setShowSelected] = useState(false);

  // 리스트 
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'entered', 'notEntered'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // 좌석 데이터 
  const [seatLayout, setSeatLayout] = useState([]);
  const [reservationData, setReservationData] = useState([]);


  useEffect(() => {
    loadSeatData();
  }, []);

  const loadSeatData = () => {
    // 예시 데이터
    const mockReservationData = [
      {
        reservationItemId: 1001,
        reservationId: 501,
        userId: 3001,
        userName: "홍길동",
        phone: "010-1234-5678",
        seat: "A1",
        ticketOptionId: 2,
        isEntered: true,
        isReserved: true,
        reservationTime: "2025-10-02T14:25:00"
      },
      {
        reservationItemId: 1002,
        reservationId: 502,
        userId: 3002,
        userName: "김철수",
        phone: "010-2345-6789",
        seat: "A2",
        ticketOptionId: 2,
        isEntered: false,
        isReserved: true,
        reservationTime: "2025-10-02T14:30:00"
      },
      {
        reservationItemId: 1003,
        reservationId: 503,
        userId: 3003,
        userName: "이영희",
        phone: "010-3456-7890",
        seat: "B1",
        ticketOptionId: 2,
        isEntered: false,
        isReserved: true,
        reservationTime: "2025-10-02T14:35:00"
      },
      {
        reservationItemId: 1004,
        reservationId: 504,
        userId: 3004,
        userName: "박민수",
        phone: "010-4567-8901",
        seat: "B2",
        ticketOptionId: 2,
        isEntered: true,
        isReserved: true,
        reservationTime: "2025-10-02T14:40:00"
      },
      {
        reservationItemId: 1005,
        reservationId: 505,
        userId: 3005,
        userName: "정수진",
        phone: "010-5678-9012",
        seat: "C1",
        ticketOptionId: 2,
        isEntered: false,
        isReserved: true,
        reservationTime: "2025-10-02T14:45:00"
      },
    ];

  
    const mockSeatLayout = generateSeatLayout(mockReservationData);

    setReservationData(mockReservationData);
    setSeatLayout(mockSeatLayout);
  };

  const generateSeatLayout = (reservations) => {
  
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = 10;

    const layout = rows.map((row, rowIndex) => {
      return Array.from({ length: cols }, (_, colIndex) => {
        const seatLabel = `${row}${colIndex + 1}`;
        const reservation = reservations.find(r => r.seat === seatLabel);

        if (reservation) {
          // 예약된 좌석
          return {
            id: `seat-${rowIndex}-${colIndex}`,
            label: seatLabel,
            ...reservation
          };
        }

        // 예약 안 된 좌석도 미입장 버튼표시
        return {
          id: `seat-${rowIndex}-${colIndex}`,
          label: seatLabel,
          isReserved: true, // 모든 좌석을 예약된 것으로 표시
          isEntered: false, // 기본값: 미입장
          userName: '-',
          phone: '-',
          reservationItemId: null
        };
      });
    });

    return layout;
  };

  const handleRefresh = () => {
    // 새로고침
    console.log('Refreshing...');
    loadSeatData();
  };

  const handleSeatClick = (seat) => {
    if (!seat.isReserved) return; // 예약 안 된 좌석은 클릭 불가

    // 선택된 좌석 토글
    const isSelected = selectedSeats.find(s => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }

    setShowSelected(true);
  };

  const handleToggleSeatStatus = (seat) => {
    if (!seat.isReserved) return;

    // 좌석 상태 토글 (입장완료 <-> 미입장)
    const newLayout = seatLayout.map(row =>
      row.map(s => {
        if (s.id === seat.id) {
          return { ...s, isEntered: !s.isEntered };
        }
        return s;
      })
    );

    setSeatLayout(newLayout);

    // API 호출->상태 업데이트
    console.log('Toggle seat status:', seat.label, !seat.isEntered);
  };

  const handleRemoveSeat = (seat) => {
    setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    if (selectedSeats.length <= 1) {
      setShowSelected(false);
    }
  };

  const handleCompleteEntry = () => {
    // 선택된 좌석들의 입장완료 처리
    const seatIds = selectedSeats.map(s => s.reservationItemId);
    console.log('Complete entry for:', seatIds);

    // 좌석 상태 업데이트
    const newLayout = seatLayout.map(row =>
      row.map(s => {
        if (selectedSeats.find(selected => selected.id === s.id)) {
          return { ...s, isEntered: true };
        }
        return s;
      })
    );

    setSeatLayout(newLayout);
    setSelectedSeats([]);
    setShowSelected(false);

    // API 호출
    alert(`${selectedSeats.length}개 좌석 입장완료 처리되었습니다.`);
  };

  // 리스트 뷰 함수들
  const getFilteredReservations = () => {
    let filtered = reservationData;

    // 탭 필터 적용
    if (filterTab === 'entered') {
      filtered = filtered.filter(r => r.isEntered);
    } else if (filterTab === 'notEntered') {
      filtered = filtered.filter(r => !r.isEntered);
    }

    // 검색 필터 적용
    if (searchQuery.trim()) {
      filtered = filtered.filter(r =>
        r.userName.includes(searchQuery) ||
        r.seat.includes(searchQuery) ||
        r.phone.includes(searchQuery)
      );
    }

    return filtered;
  };

  const handleRowCheckbox = (reservation) => {
    const isSelected = selectedRows.find(r => r.reservationItemId === reservation.reservationItemId);

    if (isSelected) {
      setSelectedRows(selectedRows.filter(r => r.reservationItemId !== reservation.reservationItemId));
    } else {
      setSelectedRows([...selectedRows, reservation]);
    }
  };

  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelectedRows(getFilteredReservations());
    } else {
      setSelectedRows([]);
    }
  };

  const handleToggleEntryStatus = (reservation) => {
    const newData = reservationData.map(r => {
      if (r.reservationItemId === reservation.reservationItemId) {
        return { ...r, isEntered: !r.isEntered };
      }
      return r;
    });

    setReservationData(newData);

    // 좌석 레이아웃도 업데이트
    const newLayout = seatLayout.map(row =>
      row.map(s => {
        if (s.reservationItemId === reservation.reservationItemId) {
          return { ...s, isEntered: !s.isEntered };
        }
        return s;
      })
    );
    setSeatLayout(newLayout);

    console.log('Toggle entry status:', reservation.seat, !reservation.isEntered);
  };

  const handleCancelSeat = (reservation) => {
    if (window.confirm(`${reservation.userName}님의 ${reservation.seat} 좌석을 취소하시겠습니까?`)) {
      console.log('Cancel seat:', reservation);
      // API 호출
      alert('좌석이 취소되었습니다.');
    }
  };

  const handleSaveChanges = () => {
    console.log('Save changes');
    // API 호출
    alert('변경사항이 저장되었습니다.');
  };

  return (
    <Container>
      <NavbarManager />

      <MainContent>
        {/* 상단 타이틀 섹션 */}
        <TopSection>
          <PageTitle>입장 현황</PageTitle>
          <ShowSelector>
            <ShowInfo>
              <ShowName>제00회 정기공연</ShowName>
              <ShowDateTime>2025.10.14 15:00</ShowDateTime>
            </ShowInfo>
            <MdKeyboardArrowDown size={16} color="#FC2847" />
          </ShowSelector>
        </TopSection>

        {/* 좌석 현황 헤더 */}
        <StatusHeader>
          <LeftControls>
            <StatusTitle>실시간 좌석 현황</StatusTitle>
            <RefreshButton onClick={handleRefresh}>
              <IoMdRefresh size={24} color="#fff" />
            </RefreshButton>
            <OnSiteButton>현장예매 좌석 관리</OnSiteButton>
          </LeftControls>

          <ViewToggle>
            <ToggleOption
              active={viewMode === 'seat'}
              onClick={() => setViewMode('seat')}
            >
              좌석표
            </ToggleOption>
            <ToggleOption
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              리스트
            </ToggleOption>
          </ViewToggle>
        </StatusHeader>

        {/* 선택 좌석 영역 */}
        {showSelected && selectedSeats.length > 0 && (
          <SelectedSeatsArea>
            <SelectedLabel>현재 선택 좌석</SelectedLabel>
            <SeatsContainer>
              {selectedSeats.map((seat, idx) => (
                <SeatTag key={idx}>
                  {seat.label}
                  <IoMdClose
                    size={12}
                    color="#D60033"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveSeat(seat)}
                  />
                </SeatTag>
              ))}
              <CompleteButton onClick={handleCompleteEntry}>
                입장완료하기
              </CompleteButton>
            </SeatsContainer>
          </SelectedSeatsArea>
        )}

        {/* 좌석표 뷰 */}
        {viewMode === 'seat' && (
          <>
            <SeatMapContainer>
              <SeatMapGrid>
                {seatLayout.map((row, rowIndex) => (
                  <SeatRow key={rowIndex}>
                    {row.map((seat, colIndex) => (
                      <SeatCell key={colIndex}>
                        {seat && seat.isReserved ? (
                          <SeatButton
                            isEntered={seat.isEntered}
                            isSelected={selectedSeats.some(s => s.id === seat.id)}
                            onClick={() => handleSeatClick(seat)}
                            onDoubleClick={() => handleToggleSeatStatus(seat)}
                          >
                            {seat.label}
                          </SeatButton>
                        ) : (
                          <EmptySeat>{seat ? seat.label : ''}</EmptySeat>
                        )}
                      </SeatCell>
                    ))}
                  </SeatRow>
                ))}
              </SeatMapGrid>
            </SeatMapContainer>

            {/* 범례 */}
            <Legend>
              <LegendItem>
                <ColorBox color="#333333" />
                <LegendText>입장완료</LegendText>
              </LegendItem>
              <LegendItem>
                <ColorBox color="#FFCC00" />
                <LegendText>미입장</LegendText>
              </LegendItem>
            </Legend>
          </>
        )}

        {/* 리스트 뷰 */}
        {viewMode === 'list' && (
          <ListViewContainer>
            {/* 필터 및 검색 영역 */}
            <FilterSearchArea>
              <TabFilters>
                <TabButton
                  active={filterTab === 'all'}
                  onClick={() => setFilterTab('all')}
                >
                  전체
                </TabButton>
                <TabButton
                  active={filterTab === 'entered'}
                  onClick={() => setFilterTab('entered')}
                >
                  입장 완료
                </TabButton>
                <TabButton
                  active={filterTab === 'notEntered'}
                  onClick={() => setFilterTab('notEntered')}
                >
                  미입장
                </TabButton>
              </TabFilters>

              <SearchBox>
                <SearchInput
                  type="text"
                  placeholder="예매자 혹은 좌석번호로 검색하기"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon>🔍</SearchIcon>
              </SearchBox>
            </FilterSearchArea>

            {/* 테이블 */}
            <TableContainer>
              <Table>
                <TableHeader>
                  <HeaderRow>
                    <HeaderCell width="50px">
                      <Checkbox
                        type="checkbox"
                        onChange={(e) => handleSelectAllRows(e.target.checked)}
                        checked={selectedRows.length === getFilteredReservations().length && getFilteredReservations().length > 0}
                      />
                    </HeaderCell>
                    <HeaderCell width="99px">좌석번호</HeaderCell>
                    <HeaderCell width="52px">이름</HeaderCell>
                    <HeaderCell width="146px">전화번호</HeaderCell>
                    <HeaderCell width="217px">입장 현황</HeaderCell>
                    <HeaderCell width="145px">관리</HeaderCell>
                  </HeaderRow>
                </TableHeader>
                <TableBody>
                  {getFilteredReservations().map((reservation) => (
                    <TableRow key={reservation.reservationItemId}>
                      <TableCell>
                        <Checkbox
                          type="checkbox"
                          checked={selectedRows.some(r => r.reservationItemId === reservation.reservationItemId)}
                          onChange={() => handleRowCheckbox(reservation)}
                        />
                      </TableCell>
                      <TableCell>{reservation.seat}</TableCell>
                      <TableCell>{reservation.userName}</TableCell>
                      <TableCell>{reservation.phone}</TableCell>
                      <TableCell>
                        <StatusButtonGroup>
                          <StatusButton
                            active={!reservation.isEntered}
                            onClick={() => !reservation.isEntered || handleToggleEntryStatus(reservation)}
                          >
                            미입장
                          </StatusButton>
                          <StatusButton
                            active={reservation.isEntered}
                            inactive={!reservation.isEntered}
                            onClick={() => reservation.isEntered || handleToggleEntryStatus(reservation)}
                          >
                            입장 완료
                          </StatusButton>
                        </StatusButtonGroup>
                      </TableCell>
                      <TableCell>
                        <CancelButton onClick={() => handleCancelSeat(reservation)}>
                          좌석 취소
                        </CancelButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ListViewContainer>
        )}
      </MainContent>

      {/* 하단 버튼 */}
      <BottomButtons>
        <BackButton onClick={() => navigate('/manageshow')}>
          ←이전
        </BackButton>
        {viewMode === 'list' && (
          <SaveButton onClick={handleSaveChanges}>
            저장하기
          </SaveButton>
        )}
      </BottomButtons>
    </Container>
  );
};

export default ViewEntryStatus;

const Container = styled.div`
  min-height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  padding: 50px 100px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
`;

const PageTitle = styled.h1`
  font-size: 30px;
  font-weight: 500;
  color: #000000;
  margin: 0;
`;

const ShowSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 20px 7px 20px;
  background-color: #FFFFFF;
  border: 1px solid #FC2847;
  border-radius: 15px;
  cursor: pointer;
`;

const ShowInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ShowName = styled.span`
  font-size: 20px;
  font-weight: 500;
  color: #FC2847;
`;

const ShowDateTime = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #FC2847;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StatusTitle = styled.h2`
  font-size: 25px;
  font-weight: 500;
  color: #000000;
  margin: 0;
`;

const RefreshButton = styled.button`
  width: 32px;
  height: 32px;
  background-color: #333333;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #555555;
  }
`;

const OnSiteButton = styled.button`
  background-color: #FC2847;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 300;
  padding: 7px 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #D60033;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid #D60033;
  border-radius: 20px;
  padding: 5px;
`;

const ToggleOption = styled.div`
  padding: 5px 15px;
  font-size: 20px;
  font-weight: ${props => props.active ? '500' : '300'};
  color: #D60033;
  background-color: ${props => props.active ? '#FFF1F0' : 'transparent'};
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const SelectedSeatsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #FFFFFF;
  border: 1px solid #FC2847;
  border-radius: 15px;
`;

const SelectedLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  white-space: nowrap;
`;

const SeatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  overflow-x: auto;
`;

const SeatTag = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 7px;
  background-color: #FFF1F0;
  color: #D60033;
  font-size: 13px;
  font-weight: 300;
  border-radius: 10px;
`;

const CompleteButton = styled.button`
  padding: 3px 7px;
  background-color: #FC2847;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 300;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #D60033;
  }
`;

const SeatMapContainer = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  background-color: #F5F5F5;
  border-radius: 10px;
  padding: 30px;
  overflow: auto;
`;

const SeatMapGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

const SeatRow = styled.div`
  display: flex;
  gap: 4px;
`;

const SeatCell = styled.div`
  width: 50px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SeatButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  /* 입장완료: 회색, 미입장: 노란색 */
  background-color: ${props => props.isEntered ? '#333333' : '#FFCC00'};
  color: ${props => props.isEntered ? '#FFFFFF' : '#000000'};

  /* 선택된 좌석 */
  ${props => props.isSelected && `
    outline: 3px solid #FC2847;
    outline-offset: 2px;
  `}

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EmptySeat = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #CCCCCC;
`;

const Legend = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorBox = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${props => props.color};
  border-radius: 2px;
`;

const LegendText = styled.span`
  font-size: 15px;
  font-weight: 300;
  color: #000000;
`;

const BottomButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #FC2847;
  color: #FFFFFE;
  font-size: 20px;
  font-weight: 300;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #D60033;
  }
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #FC2847;
  color: #FFFFFE;
  font-size: 20px;
  font-weight: 300;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #D60033;
  }
`;

// 리스트 뷰 스타일
const ListViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FilterSearchArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #787878;
  padding-bottom: 10px;
`;

const TabFilters = styled.div`
  display: flex;
  gap: 0;
`;

const TabButton = styled.button`
  padding: 10px;
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.active ? '#FC2847' : '#737373'};
  background-color: transparent;
  border: none;
  border-bottom: ${props => props.active ? '2px solid #FC2847' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #FC2847;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background-color: #FFFFFF;
  border-radius: 10px;
  border: 1px solid #E0E0E0;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 13px;
  font-weight: 300;
  color: #000000;
  width: 250px;

  &::placeholder {
    color: #999999;
  }
`;

const SearchIcon = styled.span`
  font-size: 16px;
`;

const TableContainer = styled.div`
  padding: 50px 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  border-bottom: 1px solid #979797;
`;

const HeaderRow = styled.tr``;

const HeaderCell = styled.th`
  width: ${props => props.width || 'auto'};
  padding: 10px;
  font-size: 20px;
  font-weight: 300;
  color: #000000;
  text-align: center;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #F0F0F0;

  &:hover {
    background-color: #F9F9F9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  font-size: 20px;
  font-weight: 300;
  color: #000000;
  text-align: center;
`;

const Checkbox = styled.input`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const StatusButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
`;

const StatusButton = styled.button`
  padding: 7px 10px;
  font-size: 13px;
  font-weight: 300;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.active ? `
    background-color: #FC2847;
    color: #FFFFFE;
  ` : `
    background-color: #FFFEFB;
    color: #121212;
  `}

  &:hover {
    opacity: 0.8;
  }
`;

const CancelButton = styled.button`
  padding: 7px 10px;
  font-size: 13px;
  font-weight: 300;
  background-color: #FFFEFB;
  color: #121212;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #F0F0F0;
  }
`;
