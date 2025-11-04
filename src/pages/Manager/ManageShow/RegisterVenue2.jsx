import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiSolidTrash, BiUndo, BiRedo } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import * as XLSX from 'xlsx';
import NavbarManager from '../../../components/Navbar/NavbarManager';
import { useToast } from '../../../components/Toast/UseToast';

const RegisterVenue2 = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // 상태 관리
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeTool, setActiveTool] = useState('stage'); // stage, seat, delete, floor
  const [currentFloor, setCurrentFloor] = useState(1);
  const [floors, setFloors] = useState([1, 2]);
  const [isFloorDropdownOpen, setIsFloorDropdownOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [seatLayout, setSeatLayout] = useState([]); // 좌석 레이아웃 데이터
  const [stageAreas, setStageAreas] = useState([]); // 무대 영역
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태
  const [dragStartCell, setDragStartCell] = useState(null); // 드래그 시작 좌표
  const [dragCurrentCell, setDragCurrentCell] = useState(null); // 드래그 현재 좌표
  const [selectedSeats, setSelectedSeats] = useState(new Set()); // 선택된 좌석들
  const gridRef = useRef(null);

  // 1단계 데이터 불러오기
  const venueData = JSON.parse(localStorage.getItem('registerVenue1') || '{}');

  // 키보드 단축키 (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]); // eslint-disable-line react-hooks/exhaustive-deps

  // 드래그 종료 글로벌 이벤트
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
      setDragStartCell(null);
      setDragCurrentCell(null);
    };
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, []);

  // 엑셀 파일 업로드
  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

            // 엑셀 데이터를 좌석 레이아웃으로 변환
            const parsedSeats = [];
            data.forEach((row, rowIndex) => {
              row.forEach((cell, colIndex) => {
                if (cell && cell !== null) {
                  parsedSeats.push({
                    id: `${rowIndex}-${colIndex}`,
                    row: rowIndex,
                    col: colIndex,
                    label: String(cell),
                    floor: currentFloor,
                    type: 'seat', // seat, stage, empty
                  });
                }
              });
            });

            // 히스토리 초기화
            setHistory([parsedSeats]);
            setHistoryIndex(0);
            setSeatLayout(parsedSeats);
            addToast('엑셀 파일이 업로드되었습니다.', 'success');
          } catch (error) {
            addToast('엑셀 파일 파싱 중 오류가 발생했습니다.', 'error');
          }
        };
        reader.readAsBinaryString(file);
      } else {
        addToast('엑셀 파일만 업로드 가능합니다.', 'error');
      }
    }
  };

  // 드래그 앤 드롭
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleExcelUpload({ target: { files: [file] } });
    }
  };

  // 실행 취소
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSeatLayout(history[historyIndex - 1]);
      addToast('실행 취소', 'info');
    }
  };

  // 재실행
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSeatLayout(history[historyIndex + 1]);
      addToast('재실행', 'info');
    }
  };

  // 좌석 클릭 핸들러
  const handleSeatClick = (seat, e) => {
    if (activeTool === 'delete') {
      // 삭제 모드에서는 선택/해제만 수행
      e.stopPropagation();
      const newSelected = new Set(selectedSeats);
      if (newSelected.has(seat.id)) {
        newSelected.delete(seat.id);
      } else {
        newSelected.add(seat.id);
      }
      setSelectedSeats(newSelected);
      return;
    }

    const newLayout = [...seatLayout];
    const seatIndex = newLayout.findIndex((s) => s.id === seat.id);

    if (seatIndex === -1) return;

    if (activeTool === 'stage') {
      // 무대로 변경
      newLayout[seatIndex] = { ...newLayout[seatIndex], type: 'stage' };
    } else if (activeTool === 'floor') {
      // 층 변경
      newLayout[seatIndex] = { ...newLayout[seatIndex], floor: currentFloor };
    } else {
      // 다른 도구일 경우 아무것도 하지 않음
      return;
    }

    // 히스토리 업데이트
    const newHistory = history.length === 0
      ? [seatLayout, newLayout]
      : [...history.slice(0, historyIndex + 1), newLayout];

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSeatLayout(newLayout);
  };

  // 선택된 좌석 삭제
  const deleteSelectedSeats = () => {
    if (selectedSeats.size === 0) {
      addToast('삭제할 좌석을 선택해주세요.', 'warning');
      return;
    }

    const deleteCount = selectedSeats.size;
    const newLayout = seatLayout.filter((seat) => !selectedSeats.has(seat.id));

    // 히스토리 업데이트
    const newHistory = history.length === 0
      ? [seatLayout, newLayout]
      : [...history.slice(0, historyIndex + 1), newLayout];

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSeatLayout(newLayout);
    setSelectedSeats(new Set());
    addToast(`${deleteCount}개의 좌석이 삭제되었습니다.`, 'success');
  };

  // 그리드에서 좌표 계산
  const getCellCoordsFromEvent = (e) => {
    if (!gridRef.current) return null;
    const gridRect = gridRef.current.getBoundingClientRect();

    // SeatGrid의 offset과 padding 고려
    const offsetX = 15 + 20; // left + padding
    const offsetY = 41 + 20; // top + padding
    const cellWidth = 24; // SeatCell width (22px) + gap (2px)
    const cellHeight = 18; // SeatCell height (16px) + gap (2px)

    const x = e.clientX - gridRect.left - offsetX;
    const y = e.clientY - gridRect.top - offsetY;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    return { row: Math.max(0, row), col: Math.max(0, col) };
  };

  // 드래그 시작
  const handleMouseDownOnGrid = (e) => {
    if (activeTool !== 'delete') return;

    const coords = getCellCoordsFromEvent(e);
    if (!coords) return;

    setIsDragging(true);
    setDragStartCell(coords);
    setDragCurrentCell(coords);
    setSelectedSeats(new Set());
  };

  // 드래그 중
  const handleMouseMoveOnGrid = (e) => {
    if (!isDragging || !dragStartCell) return;
    const currentCoords = getCellCoordsFromEvent(e);
    if (!currentCoords) return;

    setDragCurrentCell(currentCoords);

    const startRow = Math.min(dragStartCell.row, currentCoords.row);
    const endRow = Math.max(dragStartCell.row, currentCoords.row);
    const startCol = Math.min(dragStartCell.col, currentCoords.col);
    const endCol = Math.max(dragStartCell.col, currentCoords.col);

    if (activeTool === 'delete') {
      // 드래그 영역 내의 좌석들 선택
      const newSelected = new Set();
      seatLayout.forEach((seat) => {
        if (
          seat.row >= startRow &&
          seat.row <= endRow &&
          seat.col >= startCol &&
          seat.col <= endCol &&
          seat.floor === currentFloor
        ) {
          newSelected.add(seat.id);
        }
      });
      setSelectedSeats(newSelected);
    }
  };

  // 좌석 추가 (그리드 영역 클릭)
  const handleGridClick = (e) => {
    if (activeTool !== 'seat') return;

    const coords = getCellCoordsFromEvent(e);
    if (!coords) return;

    const { row, col } = coords;

    // 이미 해당 위치에 좌석이 있는지 확인
    const existingSeat = seatLayout.find(
      (seat) => seat.row === row && seat.col === col && seat.floor === currentFloor
    );
    if (existingSeat) {
      addToast('이미 좌석이 있는 위치입니다.', 'warning');
      return;
    }

    const newSeat = {
      id: `${row}-${col}-${Date.now()}`,
      row,
      col,
      label: `${String.fromCharCode(65 + row)}${col + 1}`,
      floor: currentFloor,
      type: 'seat',
    };

    const newLayout = [...seatLayout, newSeat];
    const newHistory = history.length === 0
      ? [seatLayout, newLayout]
      : [...history.slice(0, historyIndex + 1), newLayout];

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSeatLayout(newLayout);
    addToast('좌석이 추가되었습니다.', 'success');
  };

  // 도구 선택
  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    addToast(
      tool === 'stage'
        ? '무대 추가 모드'
        : tool === 'seat'
        ? '좌석 추가 모드'
        : tool === 'delete'
        ? '좌석 삭제 모드'
        : '층 설정 모드',
      'info'
    );
  };

  // 층 변경
  const handleFloorChange = (floor) => {
    setCurrentFloor(floor);
    setIsFloorDropdownOpen(false);
    addToast(`${floor}층으로 이동`, 'info');
  };

  // 드래그 선택 영역 스타일 계산
  const getDragOverlayStyle = () => {
    if (!isDragging || !dragStartCell || !dragCurrentCell) return null;

    const startRow = Math.min(dragStartCell.row, dragCurrentCell.row);
    const startCol = Math.min(dragStartCell.col, dragCurrentCell.col);
    const endRow = Math.max(dragStartCell.row, dragCurrentCell.row);
    const endCol = Math.max(dragStartCell.col, dragCurrentCell.col);

    // SeatGrid의 offset과 padding 고려
    const offsetX = 15 + 20; // left + padding
    const offsetY = 41 + 20; // top + padding
    const cellWidth = 24; // SeatCell width (22px) + gap (2px)
    const cellHeight = 18; // SeatCell height (16px) + gap (2px)

    return {
      left: `${startCol * cellWidth + offsetX}px`,
      top: `${startRow * cellHeight + offsetY}px`,
      width: `${(endCol - startCol + 1) * cellWidth - 2}px`,
      height: `${(endRow - startRow + 1) * cellHeight - 2}px`,
    };
  };

  // 다음 단계로
  const handleNext = () => {
    const editorData = {
      uploadedImage,
      currentFloor,
      floors,
      selectedArea,
      seatLayout,
      stageAreas,
    };
    localStorage.setItem('registerVenue2', JSON.stringify(editorData));
    addToast('좌석 배치가 저장되었습니다.', 'success');
    navigate('/register-venue/step3');
  };

  // 이전 단계로
  const handlePrevious = () => {
    navigate('/register-venue/step1');
  };

  return (
    <>
      <NavbarManager />
      <Container>
        <MainContent>
          <Title>내 공연장 등록하기</Title>

          {/* 진행 단계 표시 */}
          <ProgressSteps>
            <StepItem active={false}>① 공연장 기본 정보 입력</StepItem>
            <ArrowIcon />
            <StepItem active={true}>② 좌석배치표 업로드 및 수정</StepItem>
            <ArrowIcon />
            <StepItem active={false}>③ 좌석 라벨링</StepItem>
          </ProgressSteps>

          {/* 편집 영역 */}
          <EditorCard>
            <EditorArea>
              {/* 좌석표 영역 */}
              <SeatingChartArea
                onClick={handleGridClick}
                onMouseDown={handleMouseDownOnGrid}
                onMouseMove={handleMouseMoveOnGrid}
                ref={gridRef}
              >
                {uploadedImage && (
                  <SeatingChartImage src={URL.createObjectURL(uploadedImage)} alt="좌석표" />
                )}

                {/* 드래그 선택 영역 오버레이 */}
                {isDragging && dragStartCell && dragCurrentCell && (
                  <DragOverlay style={getDragOverlayStyle()} />
                )}

                {/* 좌석 렌더링 */}
                {seatLayout.length > 0 && (
                  <SeatGrid>
                    {seatLayout
                      .filter((seat) => seat.floor === currentFloor)
                      .map((seat) => (
                        <SeatCell
                          key={seat.id}
                          style={{
                            gridRow: seat.row + 1,
                            gridColumn: seat.col + 1,
                          }}
                          type={seat.type}
                          selected={selectedSeats.has(seat.id)}
                          onClick={(e) => {
                            handleSeatClick(seat, e);
                          }}
                          onMouseDown={(e) => {
                            if (activeTool === 'delete') {
                              e.stopPropagation();
                            }
                          }}
                        >
                          {seat.label}
                        </SeatCell>
                      ))}
                  </SeatGrid>
                )}

                {/* 우측 도구 모음 */}
                <Toolbar>
                  <ToolItem active={activeTool === 'stage'} onClick={() => handleToolSelect('stage')}>
                    <StageIcon active={activeTool === 'stage'} />
                    <ToolLabel active={activeTool === 'stage'}>무대 추가</ToolLabel>
                  </ToolItem>

                  <ToolItem active={activeTool === 'seat'} onClick={() => handleToolSelect('seat')}>
                    <AiOutlinePlus size={24} />
                    <ToolLabel>좌석 추가</ToolLabel>
                  </ToolItem>

                  <ToolItem active={activeTool === 'delete'} onClick={() => handleToolSelect('delete')}>
                    <BiSolidTrash size={24} />
                    <ToolLabel>좌석 삭제</ToolLabel>
                  </ToolItem>

                  {activeTool === 'delete' && selectedSeats.size > 0 && (
                    <ToolItem onClick={deleteSelectedSeats} style={{ backgroundColor: '#dc3545' }}>
                      <BiSolidTrash size={24} color="#fff" />
                      <ToolLabel style={{ color: '#fff' }}>삭제({selectedSeats.size})</ToolLabel>
                    </ToolItem>
                  )}

                  <ToolItem active={activeTool === 'floor'} onClick={() => handleToolSelect('floor')}>
                    <FloorIcon />
                    <ToolLabel>층 설정</ToolLabel>
                  </ToolItem>

                  <ToolItem onClick={handleUndo} disabled={historyIndex <= 0}>
                    <BiUndo size={32} />
                    <ToolLabel>실행 취소</ToolLabel>
                  </ToolItem>

                  <ToolItem onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                    <BiRedo size={32} />
                    <ToolLabel>재실행</ToolLabel>
                  </ToolItem>
                </Toolbar>
              </SeatingChartArea>

              {/* 층 선택 영역 */}
              <FloorControls>
                <FloorIndicators>
                  {floors.map((floor) => (
                    <FloorIndicator
                      key={floor}
                      active={currentFloor === floor}
                      onClick={() => handleFloorChange(floor)}
                    >
                      <FloorCircle active={currentFloor === floor} />
                      <FloorLabel>{floor}층</FloorLabel>
                    </FloorIndicator>
                  ))}
                </FloorIndicators>

                <FloorChangeText>선택 구역 층수 변경하기</FloorChangeText>

                <FloorDropdown>
                  <DropdownButton onClick={() => setIsFloorDropdownOpen(!isFloorDropdownOpen)}>
                    <FloorCircle active={true} />
                    <DropdownText>{currentFloor}층</DropdownText>
                    <IoIosArrowDown size={16} />
                  </DropdownButton>

                  {isFloorDropdownOpen && (
                    <DropdownMenu>
                      {floors.map((floor) => (
                        <DropdownOption key={floor} onClick={() => handleFloorChange(floor)}>
                          <FloorCircle active={currentFloor === floor} />
                          <DropdownText>{floor}층</DropdownText>
                        </DropdownOption>
                      ))}
                    </DropdownMenu>
                  )}
                </FloorDropdown>
              </FloorControls>
            </EditorArea>

            {/* 엑셀 업로드 */}
            <ExcelUploadSection onDragOver={handleDragOver} onDrop={handleDrop}>
              <ExcelUploadButton onClick={() => fileInputRef.current?.click()}>
                엑셀파일 업로드
              </ExcelUploadButton>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={handleExcelUpload}
              />
              <UploadInstructions>
                * '엑셀파일 업로드'를 클릭하거나 직접 끌어다 놓으세요.
              </UploadInstructions>
            </ExcelUploadSection>
          </EditorCard>
        </MainContent>

        {/* 하단 버튼 */}
        <Footer>
          <PrevButton onClick={handlePrevious}>←이전</PrevButton>
          <NextButton onClick={handleNext}>다음→</NextButton>
        </Footer>
      </Container>
    </>
  );
};

export default RegisterVenue2;

// Styled Components
const Container = styled.div`
  width: 1440px;
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
  color: ${(props) => (props.active ? '#FC2847' : '#737373')};
  border-bottom: ${(props) => (props.active ? '2px solid #FC2847' : 'none')};
  cursor: pointer;
`;

const ArrowIcon = styled(RiArrowRightSLine)`
  width: 32px;
  height: 32px;
  color: #737373;
`;

const EditorCard = styled.div`
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.15);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const EditorArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SeatingChartArea = styled.div`
  position: relative;
  width: 1196px;
  height: 667px;
  background: #f9f9f9;
  border-radius: 20px;
  overflow: hidden;
  user-select: none;
`;

const SeatingChartImage = styled.img`
  position: absolute;
  left: 15px;
  top: 41px;
  width: 85.86%;
  height: 90.28%;
  object-fit: cover;
  object-position: 50% 50%;
`;

const DragOverlay = styled.div`
  position: absolute;
  background: rgba(215, 43, 43, 0.3);
  border: 2px solid #D72B2B;
  pointer-events: none;
  z-index: 5;
`;

const SeatGrid = styled.div`
  position: absolute;
  left: 15px;
  top: 41px;
  width: 85.86%;
  height: 90.28%;
  display: grid;
  gap: 2px;
  padding: 20px;
  overflow: auto;
`;

const SeatCell = styled.div`
  width: 22px;
  height: 16px;
  background: ${(props) => (props.type === 'stage' ? '#FFD700' : '#9E5656')};
  border: ${(props) => (props.selected ? '2px solid #ff0000' : '0.5px solid #000000')};
  box-shadow: ${(props) => (props.selected ? '0 0 8px rgba(255, 0, 0, 0.7)' : 'none')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.selected ? 1 : 0.8)};

  &:hover {
    opacity: 1;
    transform: scale(1.1);
    z-index: 1;
  }
`;

const Toolbar = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  background: #ffffff;
  border: 1px solid #a8a8a8;
  border-radius: 30px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 79px;
`;

const ToolItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  height: 55px;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  svg {
    color: ${(props) => (props.active ? '#FC2847' : '#333333')};
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const ToolLabel = styled.span`
  font-weight: ${(props) => (props.active ? '500' : '300')};
  font-size: 15px;
  color: ${(props) => (props.active ? '#FC2847' : '#333333')};
  text-align: center;
  white-space: nowrap;
`;

const StageIcon = styled.div`
  width: 24px;
  height: 24px;
  background: ${(props) => (props.active ? '#FC2847' : '#333333')};
  border-radius: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 19px;
    height: 14px;
    background: #ffffff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 1px;
  }
`;

const FloorIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  &::before,
  &::after {
    content: '';
    width: 19px;
    height: 6px;
    background: #333333;
    border-radius: 2px;
  }
`;

const FloorControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 20px;
`;

const FloorIndicators = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

const FloorIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  width: 50px;

  &:hover {
    opacity: 0.7;
  }
`;

const FloorCircle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(props) => (props.active ? '#D72B2B' : '#D9D9D9')};
`;

const FloorLabel = styled.span`
  font-weight: 300;
  font-size: 15px;
  color: #333333;
`;

const FloorChangeText = styled.span`
  font-weight: 300;
  font-size: 15px;
  color: #000000;
  width: 141px;
`;

const FloorDropdown = styled.div`
  position: relative;
  background: #ffffff;
  border: 1px solid #c5c5c5;
  border-radius: 10px;
  box-shadow: 0px 0px 1.1px 0px rgba(0, 0, 0, 0.25);
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    background: #f9f9f9;
  }
`;

const DropdownText = styled.span`
  font-weight: 500;
  font-size: 15px;
  color: #333333;
  flex: 1;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #c5c5c5;
  border-radius: 10px;
  box-shadow: 0px 0px 1.1px 0px rgba(0, 0, 0, 0.25);
  margin-top: 4px;
  z-index: 10;
`;

const DropdownOption = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background: #f9f9f9;
  }

  &:last-child {
    border-radius: 0 0 10px 10px;
  }
`;

const ExcelUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 2px dashed #c5c5c5;
  border-radius: 20px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #fc2847;
    background: #fff5f7;
  }
`;

const ExcelUploadButton = styled.button`
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

const UploadInstructions = styled.p`
  font-weight: 500;
  font-size: 15px;
  color: #d72b2b;
  margin: 0;
  text-align: center;
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

const NextButton = styled(NavButton)``;
