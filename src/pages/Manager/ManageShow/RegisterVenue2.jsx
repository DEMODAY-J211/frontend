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
  const gridRef = useRef(null);

  // 1단계 데이터 불러오기
  const venueData = JSON.parse(localStorage.getItem('registerVenue1') || '{}');

  // 층 수 계산
  const floorCount = Number(venueData.floorCount) || 2;
  const floorArray = Array.from({ length: floorCount }, (_, i) => i + 1);

  // 상태 관리
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeTool, setActiveTool] = useState('stage');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [floors, setFloors] = useState(floorArray);
  const [isFloorDropdownOpen, setIsFloorDropdownOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [seatLayout, setSeatLayout] = useState([]); // 2D 배열
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [isFloorAssignmentMode, setIsFloorAssignmentMode] = useState(false);
  const [floorAssignments, setFloorAssignments] = useState({}); // {row-col: floorNumber}
  const [assignmentTargetFloor, setAssignmentTargetFloor] = useState(1); // 할당할 층
  const [isLabelInputOpen, setIsLabelInputOpen] = useState(false);
  const [labelInputValue, setLabelInputValue] = useState('');
  const [selectedSeatForLabel, setSelectedSeatForLabel] = useState(null); // {row, col}
  const [isLabelingMode, setIsLabelingMode] = useState(false);

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

            // 2D 배열로 변환
            const layout = data.map((row) =>
              row.map((cell) => (cell && cell !== null ? { label: String(cell), type: 'seat' } : null))
            );

            setSeatLayout(layout);
            setHistory([layout]);
            setHistoryIndex(0);
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

  // 마우스 다운 - 드래그 시작
  const handleMouseDown = (row, col) => {
    // 라벨링 모드에서는 드래그 방지
    if (isLabelingMode) {
      return;
    }

    if (activeTool === 'delete' || activeTool === 'seat') {
      setIsDragging(true);
      setDragStart({ row, col });
      if (activeTool === 'delete') {
        setSelectedSeats(new Set());
      }
    } else if (isFloorAssignmentMode) {
      setIsDragging(true);
      setDragStart({ row, col });
      setSelectedSeats(new Set());
    }
  };

  // 마우스 무브 - 드래그 중
  const handleMouseMove = (row, col) => {
    if (!isDragging || !dragStart) return;

    if (activeTool === 'delete' || isFloorAssignmentMode) {
      const minRow = Math.min(dragStart.row, row);
      const maxRow = Math.max(dragStart.row, row);
      const minCol = Math.min(dragStart.col, col);
      const maxCol = Math.max(dragStart.col, col);

      const newSelected = new Set();
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          if (seatLayout[r] && seatLayout[r][c]) {
            newSelected.add(`${r}-${c}`);
          }
        }
      }
      setSelectedSeats(newSelected);
    }
  };

  // 마우스 업 - 드래그 종료
  const handleMouseUp = (row, col) => {
    if (!isDragging || !dragStart) return;

    if (activeTool === 'seat') {
      const minRow = Math.min(dragStart.row, row);
      const maxRow = Math.max(dragStart.row, row);
      const minCol = Math.min(dragStart.col, col);
      const maxCol = Math.max(dragStart.col, col);

      const newLayout = [...seatLayout];

      // 필요한 행 추가
      while (newLayout.length <= maxRow) {
        newLayout.push([]);
      }

      let addedCount = 0;
      for (let r = minRow; r <= maxRow; r++) {
        // 필요한 열 추가
        while (newLayout[r].length <= maxCol) {
          newLayout[r].push(null);
        }

        for (let c = minCol; c <= maxCol; c++) {
          if (!newLayout[r][c]) {
            newLayout[r][c] = { label: '', type: 'seat' };
            addedCount++;
          }
        }
      }

      if (addedCount > 0) {
        updateLayout(newLayout);
        addToast(`${addedCount}개의 좌석이 추가되었습니다.`, 'success');
      }
    }

    setIsDragging(false);
    setDragStart(null);
  };

  // 글로벌 마우스 업
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStart(null);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  // 레이아웃 업데이트 (히스토리 포함)
  const updateLayout = (newLayout) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newLayout];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSeatLayout(newLayout);
  };

  // 좌석 삭제
  const deleteSelectedSeats = () => {
    if (selectedSeats.size === 0) {
      addToast('삭제할 좌석을 선택해주세요.', 'warning');
      return;
    }

    const newLayout = seatLayout.map((row, rowIndex) =>
      row.map((seat, colIndex) => {
        if (selectedSeats.has(`${rowIndex}-${colIndex}`)) {
          return null;
        }
        return seat;
      })
    );

    updateLayout(newLayout);
    setSelectedSeats(new Set());
    addToast(`${selectedSeats.size}개의 좌석이 삭제되었습니다.`, 'success');
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSeatLayout(history[historyIndex - 1]);
      addToast('실행 취소', 'info');
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSeatLayout(history[historyIndex + 1]);
      addToast('재실행', 'info');
    }
  };

  // 키보드 단축키
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

  // 도구 선택
  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    setSelectedSeats(new Set());
    setIsFloorAssignmentMode(false);
    setIsLabelingMode(false);
    const toolNames = {
      stage: '무대 추가 모드',
      seat: '좌석 추가 모드',
      delete: '좌석 삭제 모드',
      floor: '층 설정 모드',
    };
    addToast(toolNames[tool] || '', 'info');
  };

  // 층수 변경 모드 활성화
  const handleFloorAssignmentModeToggle = () => {
    setIsFloorAssignmentMode(!isFloorAssignmentMode);
    setActiveTool('');
    setIsLabelingMode(false);
    setSelectedSeats(new Set());
    if (!isFloorAssignmentMode) {
      addToast('각 층수를 선택해주세요', 'info');
    } else {
      addToast('층수 변경 모드 종료', 'info');
    }
  };

  // 선택된 좌석을 특정 층에 할당
  const assignSelectedSeatsToFloor = () => {
    if (selectedSeats.size === 0) {
      addToast('할당할 좌석을 선택해주세요.', 'warning');
      return;
    }

    const count = selectedSeats.size;
    const newAssignments = { ...floorAssignments };
    selectedSeats.forEach((seatId) => {
      newAssignments[seatId] = assignmentTargetFloor;
    });

    setFloorAssignments(newAssignments);
    setSelectedSeats(new Set());
    addToast(`${count}개의 좌석이 ${assignmentTargetFloor}층에 할당되었습니다.`, 'success');
  };

  // 할당 대상 층 변경
  const handleAssignmentTargetFloorChange = (floor) => {
    setAssignmentTargetFloor(floor);
  };

  // 층 변경
  const handleFloorChange = (floor) => {
    setCurrentFloor(floor);
    setIsFloorDropdownOpen(false);
    addToast(`${floor}층으로 이동`, 'info');
  };

  // 좌석 클릭
  const handleSeatClick = (row, col) => {
    if (isLabelingMode) {
      // 라벨링 모드: 단일 좌석 선택 (드래그 안됨)
      const seat = seatLayout[row]?.[col];
      if (seat && seat.type === 'seat') {
        setSelectedSeatForLabel({ row, col });
        setLabelInputValue(seat.label || '');
        setIsLabelInputOpen(true);
      }
    } else if (activeTool === 'delete') {
      const seatId = `${row}-${col}`;
      const newSelected = new Set(selectedSeats);
      if (newSelected.has(seatId)) {
        newSelected.delete(seatId);
      } else {
        newSelected.add(seatId);
      }
      setSelectedSeats(newSelected);
    } else if (activeTool === 'stage') {
      const newLayout = [...seatLayout];
      if (newLayout[row] && newLayout[row][col]) {
        newLayout[row][col] = { ...newLayout[row][col], type: 'stage' };
        updateLayout(newLayout);
      }
    }
  };

  // 다음/이전 단계
  const handleNext = () => {
    if (seatLayout.length === 0) {
      addToast('좌석 배치표를 업로드해주세요.', 'warning');
      return;
    }

    // 모든 좌석에 열 번호(label)가 있는지 확인
    let hasEmptyLabel = false;
    seatLayout.forEach((row) => {
      row.forEach((seat) => {
        if (seat && seat.type === 'seat' && (!seat.label || seat.label.trim() === '')) {
          hasEmptyLabel = true;
        }
      });
    });

    if (hasEmptyLabel) {
      addToast('모든 좌석에 열 번호를 입력해주세요.', 'warning');
      return;
    }

    // 2D 배열을 1D 배열로 변환하여 각 좌석에 id, row, col, floor 정보 추가
    const flattenedSeats = [];
    seatLayout.forEach((row, rowIndex) => {
      row.forEach((seat, colIndex) => {
        if (seat) {
          const seatId = `${rowIndex}-${colIndex}`;
          const assignedFloor = floorAssignments[seatId] || currentFloor;

          flattenedSeats.push({
            id: `seat-${assignedFloor}-${rowIndex}-${colIndex}`,
            label: seat.label || '',
            type: seat.type || 'seat',
            row: rowIndex,
            col: colIndex,
            floor: assignedFloor,
          });
        }
      });
    });

    const editorData = {
      seatLayout: flattenedSeats,
      currentFloor,
      floors,
      floorAssignments,
    };
    localStorage.setItem('registerVenue2', JSON.stringify(editorData));
    addToast('좌석 배치가 저장되었습니다.', 'success');
    navigate('/register-venue/step3');
  };

  const handlePrevious = () => {
    navigate('/register-venue/step1');
  };

  // 라벨링 모드 토글
  const handleLabelingModeToggle = () => {
    setIsLabelingMode(!isLabelingMode);
    setActiveTool('');
    setIsFloorAssignmentMode(false);
    setSelectedSeats(new Set());
    if (!isLabelingMode) {
      addToast('좌석을 클릭하여 라벨을 입력하세요.', 'info');
    } else {
      addToast('라벨링 모드 종료', 'info');
    }
  };

  // 라벨 제출
  const handleLabelSubmit = () => {
    if (!selectedSeatForLabel) return;

    const { row, col } = selectedSeatForLabel;
    const newLayout = [...seatLayout];

    if (newLayout[row] && newLayout[row][col]) {
      newLayout[row][col] = { ...newLayout[row][col], label: labelInputValue };
      updateLayout(newLayout);
      addToast('좌석 라벨이 업데이트되었습니다.', 'success');
    }

    setIsLabelInputOpen(false);
    setLabelInputValue('');
    setSelectedSeatForLabel(null);
  };

  // 라벨 입력 취소
  const handleLabelCancel = () => {
    setIsLabelInputOpen(false);
    setLabelInputValue('');
    setSelectedSeatForLabel(null);
  };

  // 드래그 오버레이 스타일
  const getDragOverlayStyle = () => {
    if (!isDragging || !dragStart) return null;
    return {}; // CSS로 처리
  };

  return (
    <>
      <NavbarManager />
      <Container>
        <MainContent>
          {/* 제목과 진행 단계 */}
          <HeaderRow>
            <Title>내 공연장 등록하기</Title>
            <ProgressSteps>
              <StepItem active={false} onClick={() => navigate('/register-venue/step1')}>
                ① 공연장 기본 정보 입력
              </StepItem>
              <ArrowIcon />
              <StepItem active={true}>② 좌석배치표 업로드 및 수정</StepItem>
              <ArrowIcon />
              <StepItem active={false} disabled>③ 좌석 라벨링</StepItem>
            </ProgressSteps>
          </HeaderRow>

          {/* 편집 영역 */}
          <EditorCard>
            <EditorArea>
              {/* 좌석표 영역 */}
              <SeatingChartArea ref={gridRef}>
                {uploadedImage && (
                  <SeatingChartImage src={URL.createObjectURL(uploadedImage)} alt="좌석표" />
                )}

                {/* 좌석 그리드 */}
                {seatLayout.length > 0 && (
                  <SeatGrid>
                    {seatLayout.map((row, rowIndex) => (
                      <SeatRow key={rowIndex}>
                        {row.map((seat, colIndex) => {
                          const seatId = `${rowIndex}-${colIndex}`;
                          const isSelected = selectedSeats.has(seatId);
                          const assignedFloor = floorAssignments[seatId];

                          return seat ? (
                            <SeatCell
                              key={colIndex}
                              type={seat.type}
                              selected={isSelected}
                              assignedFloor={assignedFloor}
                              onClick={() => handleSeatClick(rowIndex, colIndex)}
                              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                              onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                              onMouseUp={() => handleMouseUp(rowIndex, colIndex)}
                            >
                              {seat.label}
                            </SeatCell>
                          ) : (
                            <EmptyCell
                              key={colIndex}
                              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                              onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                              onMouseUp={() => handleMouseUp(rowIndex, colIndex)}
                            />
                          );
                        })}
                      </SeatRow>
                    ))}
                  </SeatGrid>
                )}
              </SeatingChartArea>

              {/* 하단 도구 모음 */}
              <Toolbar>
                <ToolItem active={activeTool === 'stage'} onClick={() => handleToolSelect('stage')}>
                  <StageIcon active={activeTool === 'stage'} />
                  <ToolLabel active={activeTool === 'stage'}>무대 추가</ToolLabel>
                </ToolItem>

                <ToolItem active={activeTool === 'seat'} onClick={() => handleToolSelect('seat')}>
                  <AiOutlinePlus size={24} />
                  <ToolLabel active={activeTool === 'seat'}>좌석 추가</ToolLabel>
                </ToolItem>

                <ToolItem active={activeTool === 'delete'} onClick={() => handleToolSelect('delete')}>
                  <BiSolidTrash size={24} />
                  <ToolLabel active={activeTool === 'delete'}>좌석 삭제</ToolLabel>
                </ToolItem>

                {activeTool === 'delete' && selectedSeats.size > 0 && (
                  <ToolItem onClick={deleteSelectedSeats} style={{ backgroundColor: '#dc3545' }}>
                    <BiSolidTrash size={24} color="#fff" />
                    <ToolLabel style={{ color: '#fff' }}>삭제({selectedSeats.size})</ToolLabel>
                  </ToolItem>
                )}

                <ToolItem active={isLabelingMode} onClick={handleLabelingModeToggle}>
                  <AiOutlinePlus size={24} />
                  <ToolLabel active={isLabelingMode}>좌석 라벨링 추가</ToolLabel>
                </ToolItem>

                {floorCount >= 2 && (
                  <ToolItem
                    active={isFloorAssignmentMode}
                    onClick={handleFloorAssignmentModeToggle}
                  >
                    <FloorCircle active={isFloorAssignmentMode} style={{ width: '24px', height: '24px' }} />
                    <ToolLabel active={isFloorAssignmentMode}>층수 변경</ToolLabel>
                  </ToolItem>
                )}

                {isFloorAssignmentMode && selectedSeats.size > 0 && (
                  <>
                    <FloorAssignmentDropdown>
                      <FloorAssignmentButton onClick={() => setIsFloorDropdownOpen(!isFloorDropdownOpen)}>
                        <FloorCircle active={true} />
                        <span>{assignmentTargetFloor}층</span>
                        <IoIosArrowDown size={16} />
                      </FloorAssignmentButton>
                      {isFloorDropdownOpen && (
                        <DropdownMenu>
                          {floors.map((floor) => (
                            <DropdownOption
                              key={floor}
                              onClick={() => {
                                handleAssignmentTargetFloorChange(floor);
                                setIsFloorDropdownOpen(false);
                              }}
                            >
                              <FloorCircle active={assignmentTargetFloor === floor} />
                              <DropdownText>{floor}층</DropdownText>
                            </DropdownOption>
                          ))}
                        </DropdownMenu>
                      )}
                    </FloorAssignmentDropdown>
                    <ToolItem onClick={assignSelectedSeatsToFloor} style={{ backgroundColor: '#28a745' }}>
                      <AiOutlinePlus size={24} color="#fff" />
                      <ToolLabel style={{ color: '#fff' }}>층수 배정({selectedSeats.size})</ToolLabel>
                    </ToolItem>
                  </>
                )}

                <ToolItem onClick={handleUndo} disabled={historyIndex <= 0}>
                  <BiUndo size={32} />
                  <ToolLabel>실행 취소</ToolLabel>
                </ToolItem>

                <ToolItem onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                  <BiRedo size={32} />
                  <ToolLabel>재실행</ToolLabel>
                </ToolItem>
              </Toolbar>

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

        {/* 라벨 입력 모달 */}
        {isLabelInputOpen && (
          <LabelInputModal>
            <ModalOverlay onClick={handleLabelCancel} />
            <ModalContent>
              <ModalTitle>좌석 라벨 입력</ModalTitle>
              <ModalInput
                type="text"
                value={labelInputValue}
                onChange={(e) => setLabelInputValue(e.target.value)}
                placeholder="좌석 라벨을 입력하세요"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLabelSubmit();
                  }
                }}
              />
              <ModalButtons>
                <ModalCancelButton onClick={handleLabelCancel}>취소</ModalCancelButton>
                <ModalSubmitButton onClick={handleLabelSubmit}>확인</ModalSubmitButton>
              </ModalButtons>
            </ModalContent>
          </LabelInputModal>
        )}

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
  width: 100%!;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px 100px 0px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 1400px) {
    padding: 20px 50px 0px;
  }

  @media (max-width: 1024px) {
    padding: 20px 30px 0px;
  }

  @media (max-width: 768px) {
    padding: 20px 15px 0px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #c5c5c5;
  padding-bottom: 0;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 500;
  color: #333;
  margin: 0;
  padding: 10px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ProgressSteps = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 0;
  overflow: visible;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 2px;
    overflow-x: auto;
  }
`;

const StepItem = styled.div`
  font-weight: 500;
  font-size: 20px;
  padding: 10px;
  color: ${(props) => (props.active ? '#FC2847' : '#737373')};
  border-bottom: ${(props) => (props.active ? '2px solid #FC2847' : 'none')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 5px;
  }
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
  overflow-x: auto;

  @media (max-width: 1024px) {
    padding: 20px 15px;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    padding: 15px 10px;
    border-radius: 15px;
  }
`;

const EditorArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 80px;

  @media (max-width: 1024px) {
    padding-bottom: 70px;
  }

  @media (max-width: 768px) {
    padding-bottom: 60px;
  }

  @media (max-width: 480px) {
    padding-bottom: 50px;
  }
`;

const SeatingChartArea = styled.div`
  position: relative;
  width: 100%;
  max-width: 1196px;
  height: 500px;
  background: #f9f9f9;
  border-radius: 20px;
  overflow: auto;
  user-select: none;

  @media (max-width: 1400px) {
    height: 450px;
  }

  @media (max-width: 1024px) {
    height: 400px;
  }

  @media (max-width: 768px) {
    height: 320px;
  }
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

const SeatGrid = styled.div`
  position: absolute;
  left: 15px;
  top: 41px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SeatRow = styled.div`
  display: flex;
  gap: 2px;
`;

const getFloorColor = (floor) => {
  const colors = ['#9E5656', '#5656D7', '#56D756', '#D79E56', '#D756D7', '#56D7D7'];
  return colors[(floor - 1) % colors.length] || '#9E5656';
};

const SeatCell = styled.div`
  width: 22px;
  height: 16px;
  background: ${(props) => {
    if (props.type === 'stage') return '#FFD700';
    if (props.assignedFloor) return getFloorColor(props.assignedFloor);
    return '#9E5656';
  }};
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

const EmptyCell = styled.div`
  width: 22px;
  height: 16px;
  background: transparent;
  cursor: pointer;
`;

const Toolbar = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border: 1px solid #a8a8a8;
  border-radius: 30px;
  padding: 15px 30px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  z-index: 100;
  width: fit-content;
  max-width: calc(100% - 40px);
  overflow-x: auto;
  pointer-events: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    gap: 20px;
    padding: 12px 25px;
    bottom: 15px;
  }

  @media (max-width: 768px) {
    gap: 15px;
    padding: 10px 20px;
    bottom: 10px;
    border-radius: 20px;
    max-width: calc(100% - 20px);
  }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 8px 15px;
    bottom: 10px;
  }
`;

const ToolItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  padding: 5px 10px;
  border-radius: 15px;
  transition: all 0.2s ease;

  svg {
    color: ${(props) => (props.active ? '#FC2847' : '#333333')};
  }

  &:hover {
    transform: scale(1.05);
    background: #f9f9f9;
  }

  @media (max-width: 1024px) {
    gap: 3px;
    padding: 4px 8px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 768px) {
    gap: 2px;
    padding: 3px 6px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    gap: 1px;
    padding: 2px 4px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ToolLabel = styled.span`
  font-weight: ${(props) => (props.active ? '500' : '300')};
  font-size: 13px;
  color: ${(props) => (props.active ? '#FC2847' : '#333333')};
  text-align: center;
  white-space: nowrap;

  @media (max-width: 1024px) {
    font-size: 11px;
  }

  @media (max-width: 768px) {
    font-size: 10px;
  }

  @media (max-width: 480px) {
    font-size: 9px;
  }
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

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;

    &::after {
      width: 12px;
      height: 9px;
    }
  }

  @media (max-width: 480px) {
    width: 14px;
    height: 14px;

    &::after {
      width: 10px;
      height: 7px;
    }
  }
`;

const FloorControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 20px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 15px;
    padding: 0 15px;
  }

  @media (max-width: 768px) {
    gap: 10px;
    padding: 0 10px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FloorIndicators = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
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

  @media (max-width: 768px) {
    font-size: 13px;
    width: auto;
  }
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

  @media (max-width: 768px) {
    padding: 15px;
    gap: 8px;
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

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 8px 16px;
  }
`;

const UploadInstructions = styled.p`
  font-weight: 500;
  font-size: 15px;
  color: #d72b2b;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
  }
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

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 8px 16px;
  }
`;

const PrevButton = styled(NavButton)``;

const NextButton = styled(NavButton)``;

const FloorAssignmentDropdown = styled.div`
  position: relative;
  background: #ffffff;
  border: 1px solid #c5c5c5;
  border-radius: 10px;
  box-shadow: 0px 0px 1.1px 0px rgba(0, 0, 0, 0.25);
`;

const FloorAssignmentButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 10px;

  span {
    font-weight: 500;
    font-size: 13px;
    color: #333333;
    white-space: nowrap;
  }

  &:hover {
    background: #f9f9f9;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;

    span {
      font-size: 11px;
    }
  }
`;

const LabelInputModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1001;

  @media (max-width: 768px) {
    padding: 20px;
    gap: 15px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #c5c5c5;
  border-radius: 10px;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #fc2847;
    box-shadow: 0 0 0 2px rgba(252, 40, 71, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 14px;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const ModalCancelButton = styled(ModalButton)`
  background: #e0e0e0;
  color: #333;

  &:hover {
    background: #d0d0d0;
  }
`;

const ModalSubmitButton = styled(ModalButton)`
  background: #fc2847;
  color: #ffffff;

  &:hover {
    box-shadow: 0 4px 12px rgba(252, 40, 71, 0.3);
  }
`;
