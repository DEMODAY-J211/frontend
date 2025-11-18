import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineClose, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { RiInformationLine } from 'react-icons/ri';
import { FaMousePointer } from 'react-icons/fa';
import { BsFillEraserFill } from 'react-icons/bs';
import { BiUndo, BiRedo, BiSolidSave } from 'react-icons/bi';
import { useToast } from '../Toast/UseToast';

const SeatSelectionModal = ({ isOpen, onClose, onSave, salesMethod, locationId }) => {
  const { addToast } = useToast();
  // 탭 상태 관리 (예매자 선택: exclude, 자동 배정: vip)
  const [activeTab, setActiveTab] = useState(salesMethod === '자동 배정' ? 'vip' : 'exclude');
  const [excludedSeats, setExcludedSeats] = useState(new Set()); // 판매 제외 좌석
  const [vipSeats, setVipSeats] = useState(new Set()); // VIP석
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTool, setActiveTool] = useState('select'); // select, drag, erase
  const [excludeHistory, setExcludeHistory] = useState([new Set()]);
  const [vipHistory, setVipHistory] = useState([new Set()]);
  const [excludeHistoryIndex, setExcludeHistoryIndex] = useState(0);
  const [vipHistoryIndex, setVipHistoryIndex] = useState(0);

  // API에서 가져온 좌석표 데이터
  const [seatMapData, setSeatMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 모달이 열릴 때 좌석표 API 호출
  useEffect(() => {
    const fetchSeatMap = async () => {
      if (!isOpen || !locationId) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/manager/shows/${locationId}/seatmap`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('Seat map data:', result);

          if (result.success && result.data) {
            setSeatMapData(result.data);
          } else {
            addToast('좌석표를 불러오는데 실패했습니다.', 'error');
          }
        } else {
          console.error('Failed to fetch seat map:', response.status);
          addToast('좌석표를 불러오는데 실패했습니다.', 'error');
        }
      } catch (error) {
        console.error('Error fetching seat map:', error);
        addToast('서버와의 통신 중 오류가 발생했습니다.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatMap();
  }, [isOpen, locationId, addToast]);

  // 현재 탭에 따른 좌석 상태
  const selectedSeats = activeTab === 'exclude' ? excludedSeats : vipSeats;
  const setSelectedSeats = activeTab === 'exclude' ? setExcludedSeats : setVipSeats;
  const history = activeTab === 'exclude' ? excludeHistory : vipHistory;
  const setHistory = activeTab === 'exclude' ? setExcludeHistory : setVipHistory;
  const historyIndex = activeTab === 'exclude' ? excludeHistoryIndex : vipHistoryIndex;
  const setHistoryIndex = activeTab === 'exclude' ? setExcludeHistoryIndex : setVipHistoryIndex;

  // 좌석 데이터 생성 (API 데이터 또는 기본값)
  const seatRows = seatMapData?.seat_map || [
    { id: 'A', seats: 10 }, // 10개 좌석
    { id: 'B', seats: 10 }, // 10개 좌석
    { id: 'C', seats: 10 }, // 10개 좌석
    { id: 'D', seats: 10 }, // 10개 좌석
    { id: 'E', seats: 9 },  // 9개 좌석
  ];

  // 좌석 선택/해제
  const handleSeatClick = (seatId) => {
    if (activeTool === 'drag') return;

    const newSelected = new Set(selectedSeats);

    if (activeTool === 'erase') {
      newSelected.delete(seatId);
    } else {
      if (newSelected.has(seatId)) {
        newSelected.delete(seatId);
      } else {
        newSelected.add(seatId);
      }
    }

    setSelectedSeats(newSelected);

    // 히스토리 추가
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(new Set(newSelected));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // 확대
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  // 축소
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  // 실행 취소
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedSeats(new Set(history[historyIndex - 1]));
    }
  };

  // 재실행
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedSeats(new Set(history[historyIndex + 1]));
    }
  };

  // 저장
  const handleSave = () => {
    // 두 탭 데이터를 모두 전달
    onSave({
      excludedSeats: Array.from(excludedSeats),
      vipSeats: Array.from(vipSeats),
    });
    onClose();
  };

  // 탭 전환 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <Header>
          <Title>판매 좌석 확정</Title>
          <CloseButton onClick={onClose}>
            <AiOutlineClose />
          </CloseButton>
        </Header>

        {/* 컨텐츠 */}
        <ContentCard>
          {/* 탭 섹션 */}
          <TabSection>
            <TabHeader>
              {/* 예매자 선택: 판매제외 좌석만 표시 */}
              {salesMethod === '예매자 선택' && (
                <TabItem active={true}>
                  판매제외 좌석
                </TabItem>
              )}

              {/* 자동 배정: VIP석만 표시 */}
              {salesMethod === '자동 배정' && (
                <TabItem active={true}>
                  VIP석
                </TabItem>
              )}
            </TabHeader>
            <InfoMessage>
              <InfoIcon />
              <InfoText>
                {salesMethod === '예매자 선택'
                  ? '제외할 좌석을 선택해주세요.'
                  : '🎭 자동으로 배정할 좌석을 선택해주세요! 이 좌석들은 VIP석으로 지정되어, 선착순 예매자에게 자동으로 배정돼요.'}
              </InfoText>
            </InfoMessage>
          </TabSection>

          {/* 좌석표 영역 */}
          <SeatingChartArea>
            {isLoading ? (
              <LoadingMessage>좌석표를 불러오는 중...</LoadingMessage>
            ) : seatMapData ? (
              <SeatGrid>
                {seatMapData.seat_map.map((row, rowIndex) =>
                  row.map((seat, colIndex) => {
                    const seatId = typeof seat === 'string' ? seat : null;
                    const isEmpty = seat === 0;
                    const isStage = seat === -1;
                    const isSelected = seatId && selectedSeats.has(seatId);

                    if (isEmpty) {
                      return (
                        <EmptySeat
                          key={`${rowIndex}-${colIndex}`}
                          style={{
                            gridRow: rowIndex + 1,
                            gridColumn: colIndex + 1,
                          }}
                        />
                      );
                    }

                    if (isStage) {
                      return (
                        <StageSeat
                          key={`${rowIndex}-${colIndex}`}
                          style={{
                            gridRow: rowIndex + 1,
                            gridColumn: colIndex + 1,
                          }}
                        >
                          무대
                        </StageSeat>
                      );
                    }

                    return (
                      <SeatCell
                        key={seatId || `${rowIndex}-${colIndex}`}
                        selected={isSelected}
                        onClick={() => seatId && handleSeatClick(seatId)}
                        style={{
                          gridRow: rowIndex + 1,
                          gridColumn: colIndex + 1,
                          cursor: activeTool === 'drag' ? 'grab' : 'pointer',
                        }}
                      >
                        {seatId}
                      </SeatCell>
                    );
                  })
                )}
              </SeatGrid>
            ) : (
              <SeatOverlay style={{ transform: `scale(${zoomLevel})` }}>
                {seatRows.map((row) => (
                  <SeatRow key={row.id} align={row.seats === 9 ? 'end' : 'center'}>
                    {Array.from({ length: row.seats }, (_, i) => {
                      const seatId = `${row.id}${i + 1}`;
                      const isSelected = selectedSeats.has(seatId);
                      return (
                        <SeatCell
                          key={seatId}
                          selected={isSelected}
                          onClick={() => handleSeatClick(seatId)}
                          style={{ cursor: activeTool === 'drag' ? 'grab' : 'pointer' }}
                        />
                      );
                    })}
                  </SeatRow>
                ))}
              </SeatOverlay>
            )}

            {/* 확대/축소 컨트롤 */}
            <ZoomControl>
              <ZoomButton onClick={handleZoomIn}>
                <AiOutlinePlus />
              </ZoomButton>
              <ZoomButton onClick={handleZoomOut}>
                <AiOutlineMinus />
              </ZoomButton>
            </ZoomControl>

            {/* 하단 도구 모음 */}
            <Toolbar>
              <ToolItem onClick={() => setActiveTool('drag')} active={activeTool === 'drag'}>
                <FaMousePointer size={24} />
                <ToolLabel>드래그</ToolLabel>
              </ToolItem>
              <ToolItem onClick={() => setActiveTool('erase')} active={activeTool === 'erase'}>
                <BsFillEraserFill size={24} />
                <ToolLabel>좌석 상태 변경</ToolLabel>
              </ToolItem>
              <ToolItem onClick={handleZoomIn}>
                <AiOutlinePlus size={24} />
                <ToolLabel>확대</ToolLabel>
              </ToolItem>
              <ToolItem onClick={handleZoomOut}>
                <AiOutlineMinus size={24} />
                <ToolLabel>축소</ToolLabel>
              </ToolItem>
              <ToolItem onClick={handleUndo} disabled={historyIndex === 0}>
                <BiUndo size={32} />
                <ToolLabel>실행 취소</ToolLabel>
              </ToolItem>
              <ToolItem onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                <BiRedo size={32} />
                <ToolLabel>재실행</ToolLabel>
              </ToolItem>
              <ToolItem onClick={handleSave} active noBorder>
                <BiSolidSave size={32} />
                <ToolLabel>저장하기</ToolLabel>
              </ToolItem>
            </Toolbar>
          </SeatingChartArea>

          {/* 하단 저장 버튼 */}
          <BottomButtonWrapper>
            <SaveButton onClick={handleSave}>저장하기</SaveButton>
          </BottomButtonWrapper>
        </ContentCard>
      </ModalContainer>
    </Overlay>
  );
};

export default SeatSelectionModal;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.25);
  padding: 30px 50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1200px;
  max-height: 90vh;
  overflow: auto;
`;

const Header = styled.div`
  width: 1090px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-weight: 500;
  font-size: 30px;
  color: #000000;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;
    color: #000000;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const ContentCard = styled.div`
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.15);
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TabSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TabHeader = styled.div`
  border-bottom: 1px solid #737373;
  width: 100%;
`;

const TabItem = styled.div`
  font-weight: 500;
  font-size: 20px;
  padding: 10px;
  color: ${(props) => (props.active ? '#FC2847' : '#737373')};
  border-bottom: ${(props) => (props.active ? '2px solid #FC2847' : 'none')};
  display: inline-block;
  cursor: pointer;
`;

const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
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

const SeatingChartArea = styled.div`
  position: relative;
  height: 667px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: #f9f9f9;
  border-radius: 20px;
`;

const SeatOverlay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5px;
  transition: transform 0.2s ease;
`;

const SeatGrid = styled.div`
  position: absolute;
  left: 15px;
  top: 41px;
  width: calc(100% - 30px);
  height: calc(100% - 60px);
  display: grid;
  gap: 2px;
  padding: 20px;
  overflow: auto;
`;

const SeatRow = styled.div`
  display: flex;
  justify-content: ${(props) => props.align || 'center'};
  gap: 0px;
  width: 100%;
`;

const SeatCell = styled.div`
  width: 28px;
  height: 20px;
  background: ${(props) => (props.selected ? '#FC2847' : '#9E5656')};
  border: 0.5px solid #000000;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.selected ? 1 : 0.5)};
  font-size: 9px;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

const EmptySeat = styled.div`
  width: 28px;
  height: 20px;
  background: transparent;
`;

const StageSeat = styled.div`
  width: 28px;
  height: 20px;
  background: #333333;
  border: 0.5px solid #000000;
  font-size: 8px;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingMessage = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #333333;
`;

const ZoomControl = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  background: #fcfaf4;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ZoomButton = styled.button`
  background: transparent;
  border: none;
  padding: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    color: #333333;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const Toolbar = styled.div`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 772px;
  background: #ffffff;
  border: 1px solid #a8a8a8;
  border-radius: 50px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ToolItem = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  background: transparent;
  border: none;
  border-right: ${(props) => (props.noBorder ? 'none' : '1px solid #a8a8a8')};
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  svg {
    color: ${(props) => (props.active ? '#FC2847' : '#333333')};
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:last-child {
    border-right: none;
  }
`;

const ToolLabel = styled.span`
  font-weight: 500;
  font-size: 15px;
  color: inherit;
  white-space: nowrap;
`;

const BottomButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
`;

const SaveButton = styled.button`
  background: #fc2847;
  color: #fffffe;
  font-weight: 300;
  font-size: 20px;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(252, 40, 71, 0.3);
  }
`;
