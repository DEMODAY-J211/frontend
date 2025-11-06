import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiSolidTrash } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import NavbarManager from '../../../components/Navbar/NavbarManager';
import { useToast } from '../../../components/Toast/UseToast';

const RegisterVenue3 = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 2단계 데이터 불러오기
  const venue2Data = JSON.parse(localStorage.getItem('registerVenue2') || '{}');
  const { seatLayout = [], floors = [1, 2] } = venue2Data;

  // 상태 관리
  const [currentFloor, setCurrentFloor] = useState(1);
  const [rowLabeling, setRowLabeling] = useState(false);
  const [sectionLabeling, setSectionLabeling] = useState(false);
  const [rowOrder, setRowOrder] = useState('asc'); // 'asc' = 가나다순, 'desc' = 123순
  const [rowStart, setRowStart] = useState('top'); // 'top', 'bottom', 'left', 'right'
  const [sections, setSections] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState(null);
  const [currentDragCoords, setCurrentDragCoords] = useState(null);
  const gridRef = useRef(null);

  // 구역 색상
  const SECTION_COLORS = ['#D72B2B', '#E38A03', '#7CD550', '#03C2E3', '#A974C5'];

  // 드롭다운 옵션
  const rowOrderOptions = [
    { value: 'asc', label: '가나다 순' },
    { value: 'desc', label: '123 순' },
  ];

  const rowStartOptions = [
    { value: 'top', label: '위에서 시작' },
    { value: 'bottom', label: '아래에서 시작' },
    { value: 'left', label: '왼쪽에서 시작' },
    { value: 'right', label: '오른쪽에서 시작' },
  ];

  // 드래그 종료 글로벌 이벤트
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (isDragging && selectedSeats.size > 0 && sectionLabeling) {
        // 새 구역 생성
        createSection(selectedSeats);
      }
      setIsDragging(false);
      setDragStartCell(null);
      setCurrentDragCoords(null);
    };
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, [isDragging, selectedSeats, sectionLabeling]);

  // 그리드에서 좌표 계산
  const getCellCoordsFromEvent = (e) => {
    if (!gridRef.current) return null;
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellWidth = 24;
    const cellHeight = 18;

    const x = e.clientX - gridRect.left;
    const y = e.clientY - gridRect.top;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    return { row, col };
  };

  // 드래그 시작
  const handleMouseDownOnGrid = (e) => {
    if (!sectionLabeling) return;

    const coords = getCellCoordsFromEvent(e);
    if (!coords) return;

    setIsDragging(true);
    setDragStartCell(coords);
    setCurrentDragCoords(coords);
    setSelectedSeats(new Set());
  };

  // 드래그 중
  const handleMouseMoveOnGrid = (e) => {
    if (!isDragging || !dragStartCell || !sectionLabeling) return;
    const currentCoords = getCellCoordsFromEvent(e);
    if (!currentCoords) return;

    setCurrentDragCoords(currentCoords);

    const startRow = Math.min(dragStartCell.row, currentCoords.row);
    const endRow = Math.max(dragStartCell.row, currentCoords.row);
    const startCol = Math.min(dragStartCell.col, currentCoords.col);
    const endCol = Math.max(dragStartCell.col, currentCoords.col);

    // 드래그 영역 내의 좌석들 선택
    const newSelected = new Set();
    seatLayout.forEach((seat) => {
      if (
        seat.row >= startRow &&
        seat.row <= endRow &&
        seat.col >= startCol &&
        seat.col <= endCol &&
        seat.floor === currentFloor &&
        seat.type === 'seat'
      ) {
        newSelected.add(seat.id);
      }
    });
    setSelectedSeats(newSelected);
  };

  // 새 구역 생성
  const createSection = (seatIds) => {
    if (seatIds.size === 0) return;

    const sectionIndex = sections.filter((s) => s.floor === currentFloor).length;
    const sectionName = String.fromCharCode(65 + (sectionIndex % 26)); // A, B, C...
    const color = SECTION_COLORS[sectionIndex % SECTION_COLORS.length];

    const newSection = {
      id: `section-${Date.now()}`,
      name: sectionName,
      color,
      seats: Array.from(seatIds),
      rowOrder: 'asc',
      rowStart: 'top',
      floor: currentFloor,
    };

    setSections([...sections, newSection]);
    setSelectedSeats(new Set());
    addToast(`${sectionName} 구역이 생성되었습니다.`, 'success');
  };

  // 구역 삭제
  const deleteSection = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    setSections(sections.filter((s) => s.id !== sectionId));
    addToast(`${section?.name} 구역이 삭제되었습니다.`, 'success');
  };

  // 구역 색상 변경
  const changeSectionColor = (sectionId, color) => {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, color } : s)));
  };

  // 구역 이름 변경
  const changeSectionName = (sectionId, name) => {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, name } : s)));
  };

  // 구역 설정 변경
  const changeSectionSetting = (sectionId, key, value) => {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, [key]: value } : s)));
  };

  // 층 변경
  const handleFloorChange = (floor) => {
    setCurrentFloor(floor);
    addToast(`${floor}층으로 이동`, 'info');
  };

  // 좌석이 어느 구역에 속하는지 확인
  const getSeatSection = (seatId) => {
    return sections.find((section) => section.seats.includes(seatId));
  };

  // 선택 영역 계산
  const getSelectionOverlayStyle = () => {
    if (!isDragging || !dragStartCell || !currentDragCoords) return null;

    const startRow = Math.min(dragStartCell.row, currentDragCoords.row);
    const startCol = Math.min(dragStartCell.col, currentDragCoords.col);
    const endRow = Math.max(dragStartCell.row, currentDragCoords.row);
    const endCol = Math.max(dragStartCell.col, currentDragCoords.col);

    return {
      left: `${startCol * 24 + 20}px`,
      top: `${startRow * 18 + 20}px`,
      width: `${(endCol - startCol + 1) * 24}px`,
      height: `${(endRow - startRow + 1) * 18}px`,
    };
  };

  // 이전 단계로
  const handlePrevious = () => {
    navigate('/register-venue/step2');
  };

  // 등록하기
  const handleSubmit = () => {
    const labelingData = {
      rowLabeling,
      sectionLabeling,
      rowOrder,
      rowStart,
      sections,
    };
    localStorage.setItem('registerVenue3', JSON.stringify(labelingData));
    addToast('좌석 라벨링이 완료되었습니다!', 'success');

    // TODO: API 호출하여 공연장 등록 완료
    // 여기서 localStorage의 모든 데이터를 종합하여 서버로 전송

    navigate('/manager/venues');
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
            <StepItem active={false}>② 좌석배치표 업로드 및 수정</StepItem>
            <ArrowIcon />
            <StepItem active={true}>③ 좌석 라벨링</StepItem>
          </ProgressSteps>

          {/* 편집 영역 */}
          <EditorCard>
            <EditorArea>
              {/* 좌석표 영역 */}
              <SeatingChartArea
                onMouseDown={handleMouseDownOnGrid}
                onMouseMove={handleMouseMoveOnGrid}
                ref={gridRef}
              >
                {/* 좌석 렌더링 */}
                {seatLayout.length > 0 && (
                  <SeatGrid>
                    {seatLayout
                      .filter((seat) => seat.floor === currentFloor)
                      .map((seat) => {
                        const section = getSeatSection(seat.id);
                        const isSelected = selectedSeats.has(seat.id);
                        return (
                          <SeatCell
                            key={seat.id}
                            style={{
                              gridRow: seat.row + 1,
                              gridColumn: seat.col + 1,
                            }}
                            type={seat.type}
                            sectionColor={section?.color}
                            selected={isSelected}
                          >
                            {seat.label}
                          </SeatCell>
                        );
                      })}
                  </SeatGrid>
                )}

                {/* 선택 영역 오버레이 */}
                {isDragging && dragStartCell && currentDragCoords && (
                  <SelectionOverlay style={getSelectionOverlayStyle()} />
                )}
              </SeatingChartArea>

              {/* 라벨링 설정 영역 */}
              <LabelingSettings>
                {/* 층 탭 */}
                <FloorTabs>
                  {floors.map((floor) => (
                    <FloorTab
                      key={floor}
                      active={currentFloor === floor}
                      onClick={() => handleFloorChange(floor)}
                    >
                      {floor}층
                    </FloorTab>
                  ))}
                </FloorTabs>

                {/* 행 설정 */}
                <SettingSection>
                  <CheckboxRow>
                    <StyledCheckbox
                      type="checkbox"
                      checked={rowLabeling}
                      onChange={(e) => setRowLabeling(e.target.checked)}
                    />
                    <CheckboxLabel>행</CheckboxLabel>
                  </CheckboxRow>

                  {rowLabeling && (
                    <OptionsPanel>
                      <DropdownContainer>
                        <Dropdown value={rowOrder} onChange={(e) => setRowOrder(e.target.value)}>
                          {rowOrderOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Dropdown>

                        <Dropdown value={rowStart} onChange={(e) => setRowStart(e.target.value)}>
                          {rowStartOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Dropdown>
                      </DropdownContainer>
                    </OptionsPanel>
                  )}
                </SettingSection>

                {/* 구역 별 생성 */}
                <SettingSection>
                  <CheckboxRow>
                    <StyledCheckbox
                      type="checkbox"
                      checked={sectionLabeling}
                      onChange={(e) => setSectionLabeling(e.target.checked)}
                    />
                    <CheckboxLabel>구역 별 생성</CheckboxLabel>
                  </CheckboxRow>

                  {sectionLabeling && (
                    <InstructionText>* 생성할 구역을 드래그 해주세요.</InstructionText>
                  )}
                </SettingSection>

                {/* 구역 목록 */}
                {sectionLabeling && sections.length > 0 && (
                  <SectionList>
                    {sections
                      .filter((section) => section.floor === currentFloor)
                      .map((section) => (
                        <SectionCard key={section.id}>
                          <SectionHeader>
                            <ColorIndicator color={section.color} />
                            <SectionLabel>구역 명칭</SectionLabel>
                            <SectionInput
                              value={section.name}
                              onChange={(e) => changeSectionName(section.id, e.target.value)}
                              maxLength={10}
                            />
                            <SectionText>구역</SectionText>
                            <DeleteButton onClick={() => deleteSection(section.id)}>
                              <BiSolidTrash size={21} />
                            </DeleteButton>
                          </SectionHeader>

                          <DropdownContainer>
                            <Dropdown
                              value={section.rowOrder}
                              onChange={(e) =>
                                changeSectionSetting(section.id, 'rowOrder', e.target.value)
                              }
                            >
                              {rowOrderOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </Dropdown>

                            <Dropdown
                              value={section.rowStart}
                              onChange={(e) =>
                                changeSectionSetting(section.id, 'rowStart', e.target.value)
                              }
                            >
                              {rowStartOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </Dropdown>
                          </DropdownContainer>

                          {/* 색상 팔레트 */}
                          <ColorPalette>
                            {SECTION_COLORS.map((color) => (
                              <ColorCircle
                                key={color}
                                color={color}
                                active={section.color === color}
                                onClick={() => changeSectionColor(section.id, color)}
                              />
                            ))}
                          </ColorPalette>
                        </SectionCard>
                      ))}
                  </SectionList>
                )}

                {/* 구역 생성 버튼 */}
                {sectionLabeling && (
                  <CreateSectionButton
                    onClick={() => {
                      if (selectedSeats.size > 0) {
                        createSection(selectedSeats);
                      } else {
                        addToast('좌석을 드래그하여 선택해주세요.', 'warning');
                      }
                    }}
                  >
                    <AiOutlinePlus size={24} />
                    <span>구역 생성</span>
                  </CreateSectionButton>
                )}
              </LabelingSettings>
            </EditorArea>
          </EditorCard>
        </MainContent>

        {/* 하단 버튼 */}
        <Footer>
          <PrevButton onClick={handlePrevious}>←이전</PrevButton>
          <SubmitButton onClick={handleSubmit}>등록하기</SubmitButton>
        </Footer>
      </Container>
    </>
  );
};

export default RegisterVenue3;

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
  gap: 20px;
  flex: 1;
`;

const EditorArea = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const SeatingChartArea = styled.div`
  position: relative;
  width: 509px;
  height: 667px;
  background: #f9f9f9;
  border-radius: 20px;
  overflow: hidden;
  user-select: none;
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

const SeatCell = styled.div`
  width: 22px;
  height: 16px;
  background: ${(props) =>
    props.sectionColor ? props.sectionColor : props.type === 'stage' ? '#FFD700' : '#9E5656'};
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

const SelectionOverlay = styled.div`
  position: absolute;
  background: rgba(215, 43, 43, 0.5);
  pointer-events: none;
  z-index: 10;
`;

const LabelingSettings = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FloorTabs = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FloorTab = styled.div`
  font-weight: 500;
  font-size: 20px;
  padding: 5px 10px;
  color: ${(props) => (props.active ? '#FC2847' : '#787878')};
  border-bottom: ${(props) => (props.active ? '1px solid #FC2847' : '1px solid #787878')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const SettingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-weight: 500;
  font-size: 20px;
  color: #000000;
  cursor: pointer;
`;

const OptionsPanel = styled.div`
  background: #fff1f0;
  border-radius: 20px;
  padding: 20px;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 17px;
`;

const Dropdown = styled.select`
  background: #ffffff;
  border: 1px solid #c5c5c5;
  border-radius: 10px;
  padding: 10px;
  font-weight: 500;
  font-size: 15px;
  color: #000000;
  width: 113px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #fc2847;
  }
`;

const InstructionText = styled.p`
  font-weight: 500;
  font-size: 10px;
  color: #d72b2b;
  margin: 0;
  height: 12px;
`;

const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 400px;
  overflow-y: auto;
`;

const SectionCard = styled.div`
  background: #fff1f0;
  border-radius: 20px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 17px;
  position: relative;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ColorIndicator = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(props) => props.color};
`;

const SectionLabel = styled.span`
  font-weight: 500;
  font-size: 15px;
  color: #000000;
`;

const SectionInput = styled.input`
  background: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
  font-weight: 500;
  font-size: 15px;
  color: #000000;
  width: 50px;
  text-align: right;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #fc2847;
  }
`;

const SectionText = styled.span`
  font-weight: 500;
  font-size: 15px;
  color: #000000;
  flex: 1;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #fc2847;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.7;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 10px;
  background: #ffffff;
  border-radius: 13px;
  padding: 5px 10px;
  width: fit-content;
`;

const ColorCircle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(props) => props.color};
  cursor: pointer;
  border: ${(props) => (props.active ? '2px solid #000000' : 'none')};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const CreateSectionButton = styled.button`
  background: #fc2847;
  border: none;
  border-radius: 11px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #ffffff;
  font-weight: 500;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(252, 40, 71, 0.3);
  }
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

const SubmitButton = styled(NavButton)``;
