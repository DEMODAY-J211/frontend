import React, { useState, useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSolidTrash } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import { useToast } from "../../../components/Toast/useToast";

const RegisterVenue3 = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const gridRef = useRef(null);
  const sectionsRef = useRef([]);

  // 2단계 데이터 불러오기 (useMemo로 메모이제이션)
  const { initialSeatLayout, initialFloors } = useMemo(() => {
    const venue1Data = JSON.parse(
      localStorage.getItem("registerVenue1") || "{}"
    );
    const venue2Data = JSON.parse(
      localStorage.getItem("registerVenue2") || "{}"
    );

    // 1단계에서 설정한 층수 가져오기
    const floorCount = venue1Data.floorCount
      ? Number(venue1Data.floorCount)
      : 1;
    const floors = Array.from({ length: floorCount }, (_, i) => i + 1);

    return {
      initialSeatLayout: venue2Data.seatLayout || [],
      initialFloors: floors,
    };
  }, []);

  // 상태 관리
  const [currentFloor, setCurrentFloor] = useState(1);
  const [rowLabeling, setRowLabeling] = useState(false);
  const [sectionLabeling, setSectionLabeling] = useState(false);
  const [rowOrder, setRowOrder] = useState("korean");
  const [rowStart, setRowStart] = useState("top"); // 'top', 'bottom', 'left', 'right'
  const [sections, setSections] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState(null);
  const [currentDragCoords, setCurrentDragCoords] = useState(null);
  const [seatLayout] = useState(initialSeatLayout);
  const [labeledSeats, setLabeledSeats] = useState(initialSeatLayout);
  const [floors] = useState(initialFloors);
  // 각 층별 라벨링 설정 저장
  const [floorSettings, setFloorSettings] = useState({});

  // 구역 색상
  const SECTION_COLORS = [
    "#D72B2B",
    "#E38A03",
    "#7CD550",
    "#03C2E3",
    "#A974C5",
  ];

  // 드롭다운 옵션
  const rowOrderOptions = [
    { value: "korean", label: "가나다 순" },
    { value: "number", label: "123 순" },
    { value: "lowercase", label: "abc 순" },
    { value: "uppercase", label: "ABC 순" },
  ];

  const rowStartOptions = [
    { value: "top", label: "위에서 시작" },
    { value: "bottom", label: "아래에서 시작" },
    { value: "left", label: "왼쪽에서 시작" },
    { value: "right", label: "오른쪽에서 시작" },
  ];

  // 행 라벨 생성 함수
  const generateRowLabel = (index, type) => {
    switch (type) {
      case "korean":
        const koreanChars = [
          "가",
          "나",
          "다",
          "라",
          "마",
          "바",
          "사",
          "아",
          "자",
          "차",
          "카",
          "타",
          "파",
          "하",
        ];
        return koreanChars[index % koreanChars.length];
      case "number":
        return (index + 1).toString();
      case "lowercase":
        return String.fromCharCode(97 + (index % 26)); // a-z
      case "uppercase":
        return String.fromCharCode(65 + (index % 26)); // A-Z
      default:
        return (index + 1).toString();
    }
  };

  // sections ref 업데이트
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  // 행 라벨링 적용
  useEffect(() => {
    // 행 라벨링도 구역 라벨링도 선택 안 했으면 원본 유지
    if (!rowLabeling && !sectionLabeling) {
      setLabeledSeats(seatLayout);
      return;
    }

    let newLabeledSeats = [...seatLayout];

    // 행 라벨링 적용 (구역 라벨링이 꺼져있을 때만)
    if (rowLabeling && !sectionLabeling) {
      // 모든 층에 대해 라벨링 적용 (각 층의 설정에 따라)
      floors.forEach((floor) => {
        // 현재 층이면 현재 설정 사용, 아니면 저장된 설정 사용
        const floorSetting =
          floor === currentFloor
            ? { rowLabeling, rowOrder, rowStart }
            : floorSettings[floor] || {
                rowLabeling: false,
                rowOrder: "korean",
                rowStart: "top",
              };

        if (!floorSetting.rowLabeling) return;

      const floorSeats = seatLayout.filter((seat) => seat.floor === floor);
      if (floorSeats.length === 0) return;

      // 행별로 그룹화
      const rowMap = new Map();
      floorSeats.forEach((seat) => {
        if (!rowMap.has(seat.row)) {
          rowMap.set(seat.row, []);
        }
        rowMap.get(seat.row).push(seat);
      });

      // 방향에 따라 순서 변경
      if (
        floorSetting.rowStart === "left" ||
        floorSetting.rowStart === "right"
      ) {
        // 열 기준 정렬 (좌우)
        const colMap = new Map();
        floorSeats.forEach((seat) => {
          if (!colMap.has(seat.col)) {
            colMap.set(seat.col, []);
          }
          colMap.get(seat.col).push(seat);
        });

        const sortedCols = Array.from(colMap.keys()).sort((a, b) => a - b);
        if (floorSetting.rowStart === "right") {
          sortedCols.reverse();
        }

        // 열 기준으로 라벨링
        newLabeledSeats = newLabeledSeats.map((seat) => {
          if (seat.floor !== floor) return seat;

          const colIndex = sortedCols.indexOf(seat.col);
          if (colIndex === -1) return seat;

          const rowLabel = generateRowLabel(colIndex, floorSetting.rowOrder);
          // 기존 라벨에서 열 번호만 추출
          const originalLabel =
            seatLayout.find((s) => s.id === seat.id)?.label || "";
          const colMatch = originalLabel.match(/\d+$/);
          const colNumber = colMatch ? colMatch[0] : "";

          return {
            ...seat,
            label: rowLabel + "-" + colNumber,
          };
        });
      } else {
        // 상하 방향 라벨링 (top 또는 bottom)
        const sortedRows = Array.from(rowMap.keys()).sort((a, b) => a - b);

        // 아래에서 시작인 경우 역순
        if (floorSetting.rowStart === "bottom") {
          sortedRows.reverse();
        }

        newLabeledSeats = newLabeledSeats.map((seat) => {
          if (seat.floor !== floor) return seat;

          const rowIndex = sortedRows.indexOf(seat.row);
          if (rowIndex === -1) return seat;

          const rowLabel = generateRowLabel(rowIndex, floorSetting.rowOrder);
          // 기존 라벨에서 열 번호만 추출
          const originalLabel =
            seatLayout.find((s) => s.id === seat.id)?.label || "";
          const colMatch = originalLabel.match(/\d+$/);
          const colNumber = colMatch ? colMatch[0] : "";

          return {
            ...seat,
            label: rowLabel + "-" + colNumber,
          };
        });
      }
      });
    }

    // 구역별 라벨링 적용
    if (sectionLabeling && sections.length > 0) {
      newLabeledSeats = newLabeledSeats.map((seat) => {
        if (seat.type !== "seat") return seat;

        // 좌석이 속한 구역 찾기
        const section = sections.find((s) => s.seats.includes(seat.id));
        if (!section) return seat;

        // 원본 좌석 라벨에서 열 번호만 추출
        const originalLabel = seatLayout.find((s) => s.id === seat.id)?.label || "";
        const colMatch = originalLabel.match(/\d+$/);
        const colNumber = colMatch ? colMatch[0] : "";

        // 구역명-열번호 형태로 라벨 생성
        return {
          ...seat,
          label: `${section.name}-${colNumber}`,
        };
      });
    }

    setLabeledSeats(newLabeledSeats);
  }, [
    rowLabeling,
    rowOrder,
    rowStart,
    currentFloor,
    sectionLabeling,
    sections,
    floorSettings,
    floors,
    seatLayout,
  ]);

  // 드래그 종료 글로벌 이벤트
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStartCell(null);
        setCurrentDragCoords(null);
      }
    };
    window.addEventListener("mouseup", handleMouseUpGlobal);
    return () => window.removeEventListener("mouseup", handleMouseUpGlobal);
  }, [isDragging]);

  // 마우스 다운 - 드래그 시작
  const handleMouseDown = (row, col) => {
    if (!sectionLabeling) return;
    setIsDragging(true);
    setDragStartCell({ row, col });
    setSelectedSeats(new Set());
  };

  // 마우스 무브 - 드래그 중
  const handleMouseMove = (row, col) => {
    if (!isDragging || !dragStartCell || !sectionLabeling) return;

    setCurrentDragCoords({ row, col });

    const minRow = Math.min(dragStartCell.row, row);
    const maxRow = Math.max(dragStartCell.row, row);
    const minCol = Math.min(dragStartCell.col, col);
    const maxCol = Math.max(dragStartCell.col, col);

    const newSelected = new Set();
    labeledSeats.forEach((seat) => {
      if (
        seat.row >= minRow &&
        seat.row <= maxRow &&
        seat.col >= minCol &&
        seat.col <= maxCol &&
        seat.floor === currentFloor &&
        seat.type === "seat"
      ) {
        newSelected.add(seat.id);
      }
    });
    setSelectedSeats(newSelected);
  };

  // 마우스 업 - 드래그 종료
  const handleMouseUp = (row, col) => {
    if (!isDragging || !dragStartCell || !sectionLabeling) return;
    setIsDragging(false);
    setDragStartCell(null);
    setCurrentDragCoords(null);
  };

  // 새 구역 생성
  const createSection = (seatIds) => {
    if (seatIds.size === 0) return;

    const sectionIndex = sections.filter(
      (s) => s.floor === currentFloor
    ).length;
    const sectionName = String.fromCharCode(65 + (sectionIndex % 26)); // A, B, C...
    const color = SECTION_COLORS[sectionIndex % SECTION_COLORS.length];

    const newSection = {
      id: `section-${Date.now()}`,
      name: sectionName,
      color,
      seats: Array.from(seatIds),
      floor: currentFloor,
    };

    setSections([...sections, newSection]);
    setSelectedSeats(new Set());
    addToast(`${sectionName} 구역이 생성되었습니다.`, "success");
  };

  // 구역 삭제
  const deleteSection = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    setSections(sections.filter((s) => s.id !== sectionId));
    addToast(`${section?.name} 구역이 삭제되었습니다.`, "success");
  };

  // 구역 색상 변경
  const changeSectionColor = (sectionId, color) => {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, color } : s))
    );
  };

  // 구역 이름 변경
  const changeSectionName = (sectionId, name) => {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, name } : s)));
  };

  // 층 변경 시 현재 층의 설정 저장 및 새 층 설정 불러오기
  const handleFloorChange = (floor) => {
    // 현재 층의 설정 저장
    setFloorSettings((prev) => ({
      ...prev,
      [currentFloor]: {
        rowLabeling,
        sectionLabeling,
        rowOrder,
        rowStart,
        sections: sections.filter((s) => s.floor === currentFloor),
      },
    }));

    // 새 층으로 이동
    setCurrentFloor(floor);

    // 새 층의 설정 불러오기
    const newFloorSettings = floorSettings[floor] || {
      rowLabeling: false,
      sectionLabeling: false,
      rowOrder: "korean",
      rowStart: "top",
      sections: [],
    };

    setRowLabeling(newFloorSettings.rowLabeling);
    setSectionLabeling(newFloorSettings.sectionLabeling);
    setRowOrder(newFloorSettings.rowOrder);
    setRowStart(newFloorSettings.rowStart);

    // 기존 sections에서 다른 층 것은 유지하고 현재 층 것만 교체
    setSections((prev) => [
      ...prev.filter((s) => s.floor !== floor),
      ...newFloorSettings.sections,
    ]);

    setSelectedSeats(new Set());
    addToast(`${floor}층으로 이동`, "info");
  };

  // 좌석이 어느 구역에 속하는지 확인
  const getSeatSection = (seatId) => {
    return sections.find((section) => section.seats.includes(seatId));
  };

  // 드래그 오버레이 스타일
  const getDragOverlayStyle = () => {
    if (!isDragging || !dragStartCell) return null;
    return {}; // CSS로 처리
  };

  // 이전 단계로
  const handlePrevious = () => {
    navigate("/register-venue/step2");
  };

  // 등록하기
  const handleSubmit = async () => {
    // 행 또는 구역 중 하나는 반드시 선택되어야 함
    if (!rowLabeling && !sectionLabeling) {
      addToast("행 라벨링 또는 구역 라벨링 중 하나는 필수로 선택해야 합니다.", "error");
      return;
    }

    // 구역 라벨링을 선택했는데 구역을 생성하지 않은 경우
    if (sectionLabeling && sections.length === 0) {
      addToast("구역을 최소 1개 이상 생성해주세요.", "error");
      return;
    }

    // 현재 층 설정 저장
    setFloorSettings((prev) => ({
      ...prev,
      [currentFloor]: {
        rowLabeling,
        sectionLabeling,
        rowOrder,
        rowStart,
        sections: sections.filter((s) => s.floor === currentFloor),
      },
    }));

    // 좌석 라벨 검증
    const invalidSeats = labeledSeats.filter((seat) => {
      if (seat.type !== "seat") return false; // 무대 등은 제외

      const label = seat.label || "";
      // 라벨이 비어있는 경우
      if (!label || label.length === 0) {
        return true;
      }

      // "행-열" 형태 체크 (A-1, 가-1, 1-1 등)
      const parts = label.split("-");
      if (parts.length !== 2) {
        return true; // "-"로 구분되지 않으면 유효하지 않음
      }

      const [row, col] = parts;
      // 행과 열 모두 비어있지 않아야 함
      if (!row || !col || row.trim() === "" || col.trim() === "") {
        return true;
      }

      // 열은 반드시 숫자여야 함
      if (!/^\d+$/.test(col)) {
        return true;
      }

      return false;
    });

    if (invalidSeats.length > 0) {
      console.log("Invalid seats:", invalidSeats);
      addToast(
        "모든 좌석에 행과 열 정보가 필요합니다. 누락된 좌석을 확인해주세요.",
        "error"
      );
      return;
    }

    // 전체 그리드 크기 계산 (최대 row, col 값 찾기)
    let maxRow = 0;
    let maxCol = 0;
    labeledSeats.forEach((seat) => {
      if (seat.row > maxRow) maxRow = seat.row;
      if (seat.col > maxCol) maxCol = seat.col;
    });

    // seat_map 생성 (0으로 초기화)
    const seatMap = Array.from({ length: maxRow + 1 }, () =>
      Array.from({ length: maxCol + 1 }, () => 0)
    );

    // seat_data 객체 생성
    const seatData = {};

    // 좌석 정보를 seat_map과 seat_data에 배치
    labeledSeats.forEach((seat) => {
      if (seat.type === "stage") {
        // 무대는 -1
        seatMap[seat.row][seat.col] = -1;
      } else if (seat.type === "seat") {
        // 좌석은 라벨 사용 (이미 "행-열" 형태)
        const label = seat.label || "";
        const seatId = label; // 이미 "A-1", "가-1", "1-1" 형태

        seatMap[seat.row][seat.col] = seatId;

        // 좌석이 속한 구역 찾기
        const section = sections.find((s) => s.seats.includes(seat.id));
        const sectionName = section ? section.name : "X"; // 구역 없으면 기본값 'X'

        // seat_data에 상세 정보 저장
        seatData[seatId] = {
          seatFloor: seat.floor,
          seatSection: sectionName,
          seatTable: seatId,
          seat_Row: seat.row,
          seat_Column: seat.col,
        };
      }
      // type이 없거나 다른 경우는 0 (빈 공간)으로 유지
    });

    // 1단계에서 저장한 공연장 정보 불러오기
    const venue1Data = JSON.parse(
      localStorage.getItem("registerVenue1") || "{}"
    );

    // 1단계에서 저장해 둔 location_id 불러오기
    // RegisterVenue1에서 registerVenue1.locationId 또는 별도의 localStorage('locationId')에 저장됨
    const storedLocationId =
      venue1Data.locationId || localStorage.getItem("locationId");
    const location_id = storedLocationId ? Number(storedLocationId) : undefined;

    // API 요청 데이터 준비
    const requestData = {
      location_id, // ✅ 백엔드에 함께 전달
      layout_width: maxCol + 1,
      layout_height: maxRow + 1,
      seat_map: seatMap,
      seat_data: seatData,
    };

    console.log("=== 공연장 등록 API 요청 ===");
    console.log("Request Data:", JSON.stringify(requestData, null, 2));

    try {
      // API 호출
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manager/venue/seatmap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키 포함
          body: JSON.stringify(requestData),
        }
      );

      console.log("Response Status:", response.status);

      const result = await response.json();
      console.log("Response Data:", result);

      if (response.ok && result.success) {
        // localStorage에 저장
        const labelingData = {
          rowLabeling,
          sectionLabeling,
          rowOrder,
          rowStart,
          sections,
          labeledSeats,
          venueData: requestData,
        };
        localStorage.setItem("registerVenue3", JSON.stringify(labelingData));

        addToast("좌석 배치 정보가 성공적으로 등록되었습니다!", "success");

        // 홈화면으로 이동
        setTimeout(() => {
          navigate("/homemanager");
        }, 1000);
      } else {
        // 에러 처리
        console.error("API 에러 응답:", result);
        addToast(result.message || "좌석 배치 등록에 실패했습니다.", "error");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
      addToast("서버와의 통신 중 오류가 발생했습니다.", "error");
    }
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
              <StepItem
                active={false}
                onClick={() => navigate("/register-venue/step1")}
              >
                ① 공연장 기본 정보 입력
              </StepItem>
              <ArrowIcon />
              <StepItem
                active={false}
                onClick={() => navigate("/register-venue/step2")}
              >
                ② 좌석배치표 업로드 및 수정
              </StepItem>
              <ArrowIcon />
              <StepItem active={true}>③ 좌석 라벨링</StepItem>
            </ProgressSteps>
          </HeaderRow>

          {/* 편집 영역 */}
          <EditorCard>
            <EditorArea>
              {/* 좌석표 영역 */}
              <SeatingChartArea ref={gridRef}>
                {/* 좌석 렌더링 */}
                {labeledSeats.length > 0 && (
                  <SeatGrid>
                    {labeledSeats
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
                            onMouseDown={() =>
                              handleMouseDown(seat.row, seat.col)
                            }
                            onMouseMove={() =>
                              handleMouseMove(seat.row, seat.col)
                            }
                            onMouseUp={() => handleMouseUp(seat.row, seat.col)}
                          >
                            {seat.label}
                          </SeatCell>
                        );
                      })}
                  </SeatGrid>
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
                      disabled={sectionLabeling}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSectionLabeling(false);
                        }
                        setRowLabeling(e.target.checked);
                      }}
                    />
                    <CheckboxLabel disabled={sectionLabeling}>행(필수)</CheckboxLabel>
                  </CheckboxRow>

                  {rowLabeling && (
                    <OptionsPanel>
                      <DropdownContainer>
                        <Dropdown
                          value={rowOrder}
                          onChange={(e) => setRowOrder(e.target.value)}
                        >
                          {rowOrderOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Dropdown>

                        <Dropdown
                          value={rowStart}
                          onChange={(e) => setRowStart(e.target.value)}
                        >
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
                      disabled={rowLabeling}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRowLabeling(false);
                        }
                        setSectionLabeling(e.target.checked);
                      }}
                    />
                    <CheckboxLabel disabled={rowLabeling}>구역 별 생성(필수)</CheckboxLabel>
                  </CheckboxRow>

                  {sectionLabeling && (
                    <InstructionText>
                      * 생성할 구역을 드래그 해주세요.
                    </InstructionText>
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
                              onChange={(e) =>
                                changeSectionName(section.id, e.target.value)
                              }
                              maxLength={10}
                            />
                            <SectionText>구역</SectionText>
                            <DeleteButton
                              onClick={() => deleteSection(section.id)}
                            >
                              <BiSolidTrash size={21} />
                            </DeleteButton>
                          </SectionHeader>

                          {/* 색상 팔레트 */}
                          <ColorPalette>
                            {SECTION_COLORS.map((color) => (
                              <ColorCircle
                                key={color}
                                color={color}
                                active={section.color === color}
                                onClick={() =>
                                  changeSectionColor(section.id, color)
                                }
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
                        addToast("좌석을 드래그하여 선택해주세요.", "warning");
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
  width: 100%;
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
  font-weight: 500;
  font-size: 30px;
  color: #000000;
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
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const StepItem = styled.div`
  font-weight: 500;
  font-size: 20px;
  padding: 10px;
  color: ${(props) => (props.active ? "#FC2847" : "#737373")};
  border-bottom: ${(props) => (props.active ? "2px solid #FC2847" : "none")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
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
  width: 800px;
  height: 667px;
  background: #f9f9f9;
  border-radius: 20px;
  overflow: hidden;
  user-select: none;

  @media (max-width: 1400px) {
    width: 650px;
  }

  @media (max-width: 1024px) {
    width: 500px;
    height: 550px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 450px;
  }
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
  width: 28px;
  height: 20px;
  background: ${(props) =>
    props.sectionColor
      ? props.sectionColor
      : props.type === "stage"
      ? "#FFD700"
      : "#9E5656"};
  border: ${(props) =>
    props.selected ? "2px solid #ff0000" : "0.5px solid #000000"};
  box-shadow: ${(props) =>
    props.selected ? "0 0 8px rgba(255, 0, 0, 0.7)" : "none"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.selected ? 1 : 0.8)};
  font-weight: 500;

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
  gap: 15px;
`;

const FloorTabs = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FloorTab = styled.div`
  font-weight: 500;
  font-size: 16px;
  padding: 4px 8px;
  color: ${(props) => (props.active ? "#FC2847" : "#787878")};
  border-bottom: ${(props) =>
    props.active ? "1px solid #FC2847" : "1px solid #787878"};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const SettingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StyledCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const CheckboxLabel = styled.label`
  font-weight: 500;
  font-size: 16px;
  color: ${(props) => (props.disabled ? "#999999" : "#000000")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const OptionsPanel = styled.div`
  background: #fff1f0;
  border-radius: 15px;
  padding: 12px;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Dropdown = styled.select`
  background: #ffffff;
  border: 1px solid #c5c5c5;
  border-radius: 8px;
  padding: 6px 8px;
  font-weight: 500;
  font-size: 13px;
  color: #000000;
  width: 100px;
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
  gap: 12px;
  max-height: 350px;
  overflow-y: auto;
`;

const SectionCard = styled.div`
  background: #fff1f0;
  border-radius: 15px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ColorIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => props.color};
`;

const SectionLabel = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: #000000;
`;

const SectionInput = styled.input`
  background: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 3px 6px;
  font-weight: 500;
  font-size: 13px;
  color: #000000;
  width: 45px;
  text-align: right;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #fc2847;
  }
`;

const SectionText = styled.span`
  font-weight: 500;
  font-size: 12px;
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

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 6px;
  background: #ffffff;
  border-radius: 10px;
  padding: 4px 8px;
  width: fit-content;
`;

const ColorCircle = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${(props) => props.color};
  cursor: pointer;
  border: ${(props) => (props.active ? "2px solid #000000" : "none")};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const CreateSectionButton = styled.button`
  background: #fc2847;
  border: none;
  border-radius: 10px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

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
