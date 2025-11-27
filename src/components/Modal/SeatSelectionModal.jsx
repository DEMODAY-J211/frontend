import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { RiInformationLine } from "react-icons/ri";
import { BiUndo, BiRedo } from "react-icons/bi";
import { useToast } from "../Toast/useToast";

const SeatSelectionModal = ({
  isOpen,
  onClose,
  onSave,
  salesMethod,
  locationId,
}) => {
  const { addToast } = useToast();
  // 탭 상태 관리 (예매자 선택: exclude, 자동 배정: vip)
  const [activeTab, setActiveTab] = useState(
    salesMethod === "자동 배정" ? "vip" : "exclude"
  );
  const [excludedSeats, setExcludedSeats] = useState(new Set()); // 판매 제외 좌석
  const [vipSeats, setVipSeats] = useState(new Set()); // VIP석
  const [excludeHistory, setExcludeHistory] = useState([new Set()]);
  const [vipHistory, setVipHistory] = useState([new Set()]);
  const [excludeHistoryIndex, setExcludeHistoryIndex] = useState(0);
  const [vipHistoryIndex, setVipHistoryIndex] = useState(0);

  // API에서 가져온 좌석표 데이터
  const [seatMapData, setSeatMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 드래그 상태 관리
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [tempSelectedSeats, setTempSelectedSeats] = useState(new Set());
  const [hasMoved, setHasMoved] = useState(false);

  // 모달이 열릴 때 좌석표 API 호출 및 상태 초기화
  useEffect(() => {
    const fetchSeatMap = async () => {
      if (!isOpen || !locationId) return;

      // 모달이 열릴 때마다 모든 상태 초기화
      setExcludedSeats(new Set());
      setVipSeats(new Set());
      setExcludeHistory([new Set()]);
      setVipHistory([new Set()]);
      setExcludeHistoryIndex(0);
      setVipHistoryIndex(0);
      setClearedSeats(new Set());
      setActiveTab(salesMethod === "자동 배정" ? "vip" : "exclude");

      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/manager/shows/${locationId}/seatmap`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Seat map data:", result);

          if (result.success && result.data) {
            setSeatMapData(result.data);
          } else {
            addToast("좌석표를 불러오는데 실패했습니다.", "error");
          }
        } else {
          console.error("Failed to fetch seat map:", response.status);
          addToast("좌석표를 불러오는데 실패했습니다.", "error");
        }
      } catch (error) {
        console.error("Error fetching seat map:", error);
        addToast("서버와의 통신 중 오류가 발생했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatMap();
  }, [isOpen, locationId, salesMethod, addToast]);

  // 현재 탭에 따른 좌석 상태
  const selectedSeats = activeTab === "exclude" ? excludedSeats : vipSeats;
  const setSelectedSeats =
    activeTab === "exclude" ? setExcludedSeats : setVipSeats;
  const history = activeTab === "exclude" ? excludeHistory : vipHistory;
  const setHistory =
    activeTab === "exclude" ? setExcludeHistory : setVipHistory;
  const historyIndex =
    activeTab === "exclude" ? excludeHistoryIndex : vipHistoryIndex;
  const setHistoryIndex =
    activeTab === "exclude" ? setExcludeHistoryIndex : setVipHistoryIndex;

  // 히스토리 업데이트 헬퍼 함수
  const updateHistory = (newSelected) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(new Set(newSelected));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // 부모 컴포넌트에 실시간으로 변경사항 전달
  const notifyParentOfChanges = (currentClearedSeats) => {
    if (!seatMapData || !onSave) return;

    let seatMapToSave;
    let totalSeats = 0;
    let clearedCount = currentClearedSeats.size;

    if (salesMethod === "자동 배정") {
      // VIP석을 1로 표시한 좌석표 생성
      seatMapToSave = seatMapData.seat_map.map((row) =>
        row.map((seat) => {
          if (seat === -1) return -1;
          if (typeof seat === "string") {
            totalSeats++;
            if (currentClearedSeats.has(seat)) {
              return 1;
            }
          }
          return typeof seat === "string" ? 0 : seat;
        })
      );
    } else {
      // 예매자 선택: clearedSeats에 있는 좌석들을 0으로 변경
      seatMapToSave = seatMapData.seat_map.map((row) =>
        row.map((seat) => {
          if (typeof seat === "string") {
            totalSeats++;
            if (currentClearedSeats.has(seat)) {
              return 0;
            }
          }
          return seat;
        })
      );
    }

    const totalAvailableSeats = totalSeats - clearedCount;

    // onSave 콜백으로 데이터 전달 (모달 닫지 않음)
    onSave({
      seatMap: seatMapToSave,
      excludedSeats:
        salesMethod === "예매자 선택" ? Array.from(currentClearedSeats) : [],
      vipSeats: salesMethod === "자동 배정" ? Array.from(currentClearedSeats) : [],
      totalAvailableSeats: totalAvailableSeats,
    });
  };

  // 좌석 클릭 (단일 선택)
  const handleSeatClick = (seatId) => {
    const newSelected = new Set(selectedSeats);

    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
      // 선택된 좌석은 취소된 목록에서 제거
      if (clearedSeats.has(seatId)) {
        const newClearedSeats = new Set(clearedSeats);
        newClearedSeats.delete(seatId);
        setClearedSeats(newClearedSeats);
        // 좌석 취소를 해제했으므로 실시간으로 부모에 전달
        notifyParentOfChanges(newClearedSeats);
      }
    }

    setSelectedSeats(newSelected);
    updateHistory(newSelected);
  };

  // 마우스 다운 - 드래그 시작
  const handleMouseDown = (rowIndex, colIndex, seatId) => {
    if (!seatId) return;
    setIsDragging(true);
    setDragStart({ row: rowIndex, col: colIndex });
    setTempSelectedSeats(new Set([seatId]));
    setHasMoved(false); // 초기화
  };

  // 마우스 무브 - 드래그 중
  const handleMouseMove = (rowIndex, colIndex, seatId) => {
    if (!isDragging || !dragStart || !seatId) return;

    // 마우스가 시작 위치에서 벗어났는지 확인
    if (rowIndex !== dragStart.row || colIndex !== dragStart.col) {
      setHasMoved(true);
    }

    const minRow = Math.min(dragStart.row, rowIndex);
    const maxRow = Math.max(dragStart.row, rowIndex);
    const minCol = Math.min(dragStart.col, colIndex);
    const maxCol = Math.max(dragStart.col, colIndex);

    const newTempSelected = new Set();

    if (croppedSeatMap) {
      croppedSeatMap.forEach((row, rIdx) => {
        row.forEach((seat, cIdx) => {
          if (
            rIdx >= minRow &&
            rIdx <= maxRow &&
            cIdx >= minCol &&
            cIdx <= maxCol
          ) {
            const sId = typeof seat === "string" ? seat : null;
            if (sId) {
              newTempSelected.add(sId);
            }
          }
        });
      });
    }

    setTempSelectedSeats(newTempSelected);
  };

  // 마우스 업 - 드래그 종료
  const handleMouseUp = () => {
    if (!isDragging) return;

    // 실제로 드래그가 일어났는지 확인 (마우스가 움직였으면 드래그)
    if (hasMoved && tempSelectedSeats.size > 0) {
      const newSelected = new Set(selectedSeats);
      const newClearedSeats = new Set(clearedSeats);
      let clearedSeatsChanged = false;

      tempSelectedSeats.forEach((seatId) => {
        if (newSelected.has(seatId)) {
          newSelected.delete(seatId);
        } else {
          newSelected.add(seatId);
          // 선택된 좌석은 취소된 목록에서 제거
          if (newClearedSeats.has(seatId)) {
            newClearedSeats.delete(seatId);
            clearedSeatsChanged = true;
          }
        }
      });

      setSelectedSeats(newSelected);
      setClearedSeats(newClearedSeats);
      updateHistory(newSelected);

      // 취소된 좌석이 변경되었으면 실시간으로 부모에 전달
      if (clearedSeatsChanged) {
        notifyParentOfChanges(newClearedSeats);
      }
    }

    // 항상 드래그 상태 초기화
    setIsDragging(false);
    setDragStart(null);
    setTempSelectedSeats(new Set());
    setHasMoved(false);
  };

  // 글로벌 마우스 업 이벤트
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, tempSelectedSeats, selectedSeats, historyIndex, history]); // eslint-disable-line react-hooks/exhaustive-deps

  // 실행 취소
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousSelected = new Set(history[historyIndex - 1]);
      setSelectedSeats(previousSelected);

      // clearedSeats에서 되돌린 좌석들을 제거
      const newClearedSeats = new Set(clearedSeats);
      let changed = false;
      previousSelected.forEach((seatId) => {
        if (newClearedSeats.has(seatId)) {
          newClearedSeats.delete(seatId);
          changed = true;
        }
      });

      if (changed) {
        setClearedSeats(newClearedSeats);
        notifyParentOfChanges(newClearedSeats);
      }
    }
  };

  // 재실행
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextSelected = new Set(history[historyIndex + 1]);
      setSelectedSeats(nextSelected);

      // clearedSeats에서 다시 선택된 좌석들을 제거
      const newClearedSeats = new Set(clearedSeats);
      let changed = false;
      nextSelected.forEach((seatId) => {
        if (newClearedSeats.has(seatId)) {
          newClearedSeats.delete(seatId);
          changed = true;
        }
      });

      if (changed) {
        setClearedSeats(newClearedSeats);
        notifyParentOfChanges(newClearedSeats);
      }
    }
  };

  // 이전에 취소된 좌석들 추적
  const [clearedSeats, setClearedSeats] = useState(new Set());

  // 좌석 제외/VIP 선택 (선택한 좌석들을 제외 목록에 추가)
  const handleClearSelection = () => {
    // 현재 선택된 좌석들을 취소된 좌석 목록에 추가
    const newClearedSeats = new Set([...clearedSeats, ...selectedSeats]);
    setClearedSeats(newClearedSeats);
    setSelectedSeats(new Set());
    updateHistory(new Set());

    // 실시간으로 부모 컴포넌트에 상태 전달
    notifyParentOfChanges(newClearedSeats);
  };

  // 제외/VIP 좌석 변경 취소 (이미 제외된 좌석들을 다시 선택 가능하게 되돌림)
  const handleUndoClearedSeats = () => {
    if (clearedSeats.size === 0) return;

    // 모든 제외된 좌석을 초기화
    setClearedSeats(new Set());

    // 실시간으로 부모 컴포넌트에 상태 전달
    notifyParentOfChanges(new Set());

    addToast(
      salesMethod === "자동 배정"
        ? "VIP석 선택이 취소되었습니다."
        : "좌석 제외가 취소되었습니다.",
      "info"
    );
  };

  // 로컬 저장 핸들러 (모달 닫기)
  const handleSaveSeatChanges = () => {
    // 마지막으로 한 번 더 부모에게 전달 (최종 상태 확인)
    if (seatMapData && clearedSeats.size > 0) {
      notifyParentOfChanges(clearedSeats);

      addToast(
        salesMethod === "자동 배정"
          ? `${clearedSeats.size}개의 VIP석이 선택되었습니다.`
          : `${clearedSeats.size}개의 좌석이 제외되었습니다.`,
        "success"
      );
    }

    onClose();
  };

  // 탭 전환 핸들러 (현재는 사용하지 않지만 향후 확장성을 위해 유지)
  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  // };

  // ... 기존 state 선언들 아래에 추가 ...

  // 실제 좌석이 있는 구역만 잘라내기 (Bounding Box 계산)
  const croppedSeatMap = useMemo(() => {
    if (!seatMapData?.seat_map) return null;

    const map = seatMapData.seat_map;
    let minRow = map.length,
      maxRow = 0;
    let minCol = map[0]?.length || 0,
      maxCol = 0;
    let hasSeats = false;

    // 1. 유효한 좌석이 있는 최소/최대 행, 열 찾기
    map.forEach((row, rIndex) => {
      row.forEach((seat, cIndex) => {
        // 0(공석)이 아니면 유효한 데이터로 판단 (좌석 또는 무대)
        if (seat !== 0) {
          hasSeats = true;
          if (rIndex < minRow) minRow = rIndex;
          if (rIndex > maxRow) maxRow = rIndex;
          if (cIndex < minCol) minCol = cIndex;
          if (cIndex > maxCol) maxCol = cIndex;
        }
      });
    });

    // 데이터가 하나도 없으면 빈 배열 반환
    if (!hasSeats) return [];

    // 2. 찾은 범위만큼 배열 잘라내기 (slice)
    // minRow ~ maxRow 까지, 각 row 내부에서는 minCol ~ maxCol 까지
    const newMap = map
      .slice(minRow, maxRow + 1)
      .map((row) => row.slice(minCol, maxCol + 1));

    return newMap;
  }, [seatMapData]);

  // ...

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleSaveSeatChanges}>
      <ContentCard onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <CloseButton onClick={handleSaveSeatChanges}>
          <AiOutlineClose />
        </CloseButton>

        {/* 탭 섹션 */}
        <TabSection>
          <TabHeader>
            {/* 예매자 선택: 판매제외 좌석만 표시 */}
            {salesMethod === "예매자 선택" && (
              <TabItem active={true}>판매제외 좌석</TabItem>
            )}

            {/* 자동 배정: VIP석만 표시 */}
            {salesMethod === "자동 배정" && (
              <TabItem active={true}>VIP석</TabItem>
            )}
          </TabHeader>
          <InfoMessage>
            <InfoIcon />
            <InfoText>
              {salesMethod === "예매자 선택"
                ? "제외할 좌석을 선택해주세요."
                : "🎭 자동으로 배정할 좌석을 선택해주세요! 이 좌석들은 VIP석으로 지정되어, 선착순 예매자에게 자동으로 배정돼요."}
            </InfoText>
          </InfoMessage>
        </TabSection>

        {/* 좌석표 영역 */}
        <SeatingChartArea>
          {isLoading ? (
            <LoadingMessage>좌석표를 불러오는 중...</LoadingMessage>
          ) : croppedSeatMap ? (
            <SeatGrid>
              {croppedSeatMap.map((row, rowIndex) =>
                row.map((seat, colIndex) => {
                  const seatId = typeof seat === "string" ? seat : null;
                  const isEmpty = seat === 0;
                  const isStage = seat === -1;
                  const isSelected = seatId && selectedSeats.has(seatId);
                  const isCleared = seatId && clearedSeats.has(seatId);

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

                  const isTempSelected = tempSelectedSeats.has(seatId);
                  // 취소된 좌석이 아닐 때만 선택 표시
                  const displaySelected =
                    !isCleared && (isSelected || isTempSelected);

                  return (
                    <SeatCell
                      key={seatId || `${rowIndex}-${colIndex}`}
                      selected={displaySelected}
                      $tempSelected={isTempSelected}
                      $cleared={isCleared}
                      onClick={() => {
                        // 마우스가 움직이지 않았으면 클릭으로 처리
                        if (seatId && !hasMoved) {
                          handleSeatClick(seatId);
                        }
                      }}
                      onMouseDown={() =>
                        seatId && handleMouseDown(rowIndex, colIndex, seatId)
                      }
                      onMouseMove={() =>
                        seatId && handleMouseMove(rowIndex, colIndex, seatId)
                      }
                      onMouseUp={handleMouseUp}
                      style={{
                        gridRow: rowIndex + 1,
                        gridColumn: colIndex + 1,
                        cursor: isDragging ? "grabbing" : "pointer",
                      }}
                    >
                      {seatId}
                    </SeatCell>
                  );
                })
              )}
            </SeatGrid>
          ) : null}

          {/* 확대/축소 컨트롤 */}
          {/* <ZoomControl>
              <ZoomButton onClick={handleZoomIn}>
                <AiOutlinePlus />
              </ZoomButton>
              <ZoomButton onClick={handleZoomOut}>
                <AiOutlineMinus />
              </ZoomButton>
            </ZoomControl> */}
        </SeatingChartArea>

        {/* 하단 도구 모음 */}
        <BottomButtonWrapper>
          <Toolbar>
            <ToolItem onClick={handleUndo} disabled={historyIndex === 0}>
              <BiUndo size={24} />
              <ToolLabel>실행 취소</ToolLabel>
            </ToolItem>
            <ToolItem
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <BiRedo size={24} />
              <ToolLabel>재실행</ToolLabel>
            </ToolItem>
            {selectedSeats.size > 0 && (
              <ToolItem $noBorder>
                <SelectedCount>{selectedSeats.size}</SelectedCount>
                <ToolLabel>선택한 좌석</ToolLabel>
              </ToolItem>
            )}
            <ClearButton
              onClick={handleClearSelection}
              disabled={selectedSeats.size === 0}
            >
              {salesMethod === "자동 배정" ? "VIP 좌석 선택" : "좌석 취소하기"}
            </ClearButton>
            {clearedSeats.size > 0 && (
              <UndoButton onClick={handleUndoClearedSeats}>
                {salesMethod === "자동 배정"
                  ? "VIP 선택 취소하기"
                  : "좌석 변경 취소하기"}
              </UndoButton>
            )}
          </Toolbar>
        </BottomButtonWrapper>
      </ContentCard>
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

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

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
  position: relative;
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.25);
  padding: 30px 50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 1200px;
  max-width: 90vw;
  max-height: 90vh;
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
  color: ${(props) => (props.active ? "#FC2847" : "#737373")};
  border-bottom: ${(props) => (props.active ? "2px solid #FC2847" : "none")};
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
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 20px;
  padding: 20px;
  overflow: auto;
`;

const SeatGrid = styled.div`
  display: grid;
  gap: 2px;
  width: fit-content;
  margin: auto;
`;

const SeatCell = styled.div`
  width: 28px;
  height: 20px;
  background: ${(props) => {
    if (props.$cleared) return "#6B6B6B"; // 취소된 좌석 (비활성화 색상)
    if (props.selected) return "#FC2847"; // 선택된 좌석
    return "#9E5656"; // 기본 좌석
  }};
  border: 0.5px solid #000000;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => {
    if (props.$cleared) return 0.3; // 취소된 좌석은 더 흐리게
    if (props.selected) return 1;
    return 0.5;
  }};
  font-size: 9px;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none; /* 텍스트 드래그 방지 */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */

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
  background: #ffffff;
  border: 1px solid #a8a8a8;
  border-radius: 50px;
  padding: 8px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
`;

const ToolItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: transparent;
  border: none;
  border-right: ${(props) => (props.$noBorder ? "none" : "1px solid #a8a8a8")};
  padding: 5px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  svg {
    color: ${(props) => (props.active ? "#FC2847" : "#333333")};
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
  font-size: 13px;
  color: #333333;
  white-space: nowrap;
`;

const SelectedCount = styled.div`
  font-weight: 700;
  font-size: 20px;
  color: #fc2847;
`;

const BottomButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ClearButton = styled.button`
  background: ${(props) => (props.disabled ? "#d0d0d0" : "#fc2847")};
  color: #ffffff;
  font-weight: 500;
  font-size: 13px;
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  white-space: nowrap;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 4px 12px rgba(252, 40, 71, 0.3)"};
  }
`;

const UndoButton = styled.button`
  background: #6b6b6b;
  color: #ffffff;
  font-weight: 500;
  font-size: 13px;
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(107, 107, 107, 0.3);
    background: #555555;
  }
`;
