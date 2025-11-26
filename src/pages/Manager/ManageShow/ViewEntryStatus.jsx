import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import { IoMdRefresh, IoMdClose } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";

import { BiSearch } from "react-icons/bi";

import { MdOutlineUnfoldMore } from "react-icons/md";

const ViewEntryStatus = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("seat");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSelected, setShowSelected] = useState(false);

  const [showTitle, setShowTitle] = useState("");
  const [showTimeList, setShowTimeList] = useState([]);

  // 리스트
  const [filterTab, setFilterTab] = useState("all"); // 'all', 'entered', 'notEntered'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]); // 체크박스 선택된 이름들

  // 좌석 데이터
  const [seatLayout, setSeatLayout] = useState([]);
  const [reservationData, setReservationData] = useState([]); // 실제 데이터 (저장된 데이터)
  const [displayData, setDisplayData] = useState([]); // UI에 표시되는 임시 데이터
  const [initialData, setInitialData] = useState([]); // 초기 데이터 저장
  const [isChanged, setIsChanged] = useState(false); // 변경사항 여부
  const [changedItems, setChangedItems] = useState([]); // 변경된 항목들
  const [loading, setLoading] = useState(false); // 로딩 상태

  const [currentShowtimeId, setCurrentShowtimeId] = useState(null);
  const [hasSeatData, setHasSeatData] = useState(false);

  // URL 파라미터에서 showId 가져오기
  const { showId } = useParams();

  // 회차 선택 핸들러
  const handleShowtimeChange = (showtimeId) => {
    setCurrentShowtimeId(showtimeId);
    setSelectedSeats([]); // 회차 변경 시 선택 초기화
    setSelectedRows([]); // 회차 변경 시 선택 초기화
    setSelectedNames([]); // 회차 변경 시 선택 초기화
  };

  // showId 변경 시 데이터 로딩
  useEffect(() => {
    if (showId) {
      loadSeatData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId, currentShowtimeId]);

  // showTimeList를 받아온 후 첫 번째 showtimeId 자동 설정
  useEffect(() => {
    if (showTimeList.length > 0 && currentShowtimeId === null) {
      setCurrentShowtimeId(showTimeList[0].showTimeId);
    }
  }, [showTimeList, currentShowtimeId]);

  const loadSeatData = async () => {
    try {
      setLoading(true);

      // Query parameter 구성 (ManageUser와 동일한 방식)
      const queryParams = currentShowtimeId
        ? `?showtimeId=${currentShowtimeId}`
        : "";

      // (debug log removed)

      // 세션 기반 로그인: 쿠키로 인증
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/manager/shows/${showId}/checkin${queryParams}`,
        {
          credentials: "include", // 세션 쿠키 자동 전송
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 401 Unauthorized - 세션 만료 또는 인증 실패
      if (response.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("예매 데이터를 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      // (debug log removed)
      // showTitle, showTimeList, seat 레이아웃, reservation 추출
      const {
        showTitle: apiShowTitle = "",
        showTimeList = [],
        reservation = [],
        seat: seatLayoutFromAPI = [],
      } = result.data;

      // 좌석 데이터 존재 여부 확인
      const hasSeatLayout = seatLayoutFromAPI && seatLayoutFromAPI.length > 0;
      setHasSeatData(hasSeatLayout);

      // 좌석 데이터가 없으면 리스트 뷰로 강제 전환
      if (!hasSeatLayout) {
        setViewMode("list");
      }

      setShowTitle(apiShowTitle);
      setShowTimeList(showTimeList);

      // 전화번호 포맷팅 및 필드명 변환
      const formattedData = reservation.map((item) => ({
        ...item,
        // API 응답 필드명 변환
        isEntered: item.entered ?? item.isEntered ?? false,
        isReserved: item.reserved ?? item.isReserved ?? true,
        // 전화번호 포맷팅
        phone:
          item.phone && item.phone.includes("-")
            ? item.phone
            : item.phone
            ? item.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
            : "",
      }));

      // seat 배열과 reservation 배열을 조합하여 좌석 레이아웃 생성
      const newSeatLayout = generateSeatLayoutFromAPI(
        seatLayoutFromAPI,
        formattedData
      );

      setReservationData(formattedData);
      setDisplayData(JSON.parse(JSON.stringify(formattedData))); // displayData 초기화
      setSeatLayout(newSeatLayout);
      setInitialData(JSON.parse(JSON.stringify(formattedData))); // 깊은 복사로 초기 데이터 저장
    } catch (error) {
      console.error("좌석 데이터 조회 실패:", error);
      alert("좌석 데이터를 불러오는데 실패했습니다. Mock 데이터를 사용합니다.");

      // 에러 발생 시 Mock 데이터 사용
      const mockReservationData = [
        {
          reservationItemId: 1001,
          reservationId: 501,
          userId: 3001,
          userName: "홍길동",
          phone: "010-1234-5678",
          seat: "A1",
          row: 0,
          col: 0,
          ticketOptionId: 2,
          isEntered: true,
          isReserved: true,
          reservationTime: "2025-10-02T14:25:00",
        },
        {
          reservationItemId: 1002,
          reservationId: 502,
          userId: 3002,
          userName: "김철수",
          phone: "010-2345-6789",
          seat: "A2",
          row: 0,
          col: 1,
          ticketOptionId: 2,
          isEntered: false,
          isReserved: true,
          reservationTime: "2025-10-02T14:30:00",
        },
        {
          reservationItemId: 1003,
          reservationId: 503,
          userId: 3003,
          userName: "이영희",
          phone: "010-3456-7890",
          seat: "B1",
          row: 1,
          col: 0,
          ticketOptionId: 2,
          isEntered: false,
          isReserved: true,
          reservationTime: "2025-10-02T14:35:00",
        },
        {
          reservationItemId: 1004,
          reservationId: 504,
          userId: 3004,
          userName: "박민수",
          phone: "010-4567-8901",
          seat: "B2",
          row: 1,
          col: 1,
          ticketOptionId: 2,
          isEntered: true,
          isReserved: true,
          reservationTime: "2025-10-02T14:40:00",
        },
        {
          reservationItemId: 1005,
          reservationId: 505,
          userId: 3005,
          userName: "정수진",
          phone: "010-5678-9012",
          seat: "C1",
          row: 2,
          col: 0,
          ticketOptionId: 2,
          isEntered: false,
          isReserved: true,
          reservationTime: "2025-10-02T14:45:00",
        },
      ];

      // Mock 데이터는 빈 레이아웃 사용
      setReservationData(mockReservationData);
      setDisplayData(JSON.parse(JSON.stringify(mockReservationData)));
      setSeatLayout([]);
      setInitialData(JSON.parse(JSON.stringify(mockReservationData)));
    } finally {
      setLoading(false);
    }
  };

  const generateSeatLayoutFromAPI = (seatLayoutFromAPI, reservations) => {
    // 백엔드에서 받은 seat 배열과 reservation 데이터를 조합
    if (!seatLayoutFromAPI || seatLayoutFromAPI.length === 0) {
      return [];
    }

    // reservation 데이터를 seat 이름으로 빠르게 찾기 위한 Map 생성
    const reservationMap = new Map();
    reservations.forEach((reservation) => {
      if (reservation.seat) {
        reservationMap.set(reservation.seat, reservation);
      }
    });

    // seat 배열을 순회하며 레이아웃 생성
    const layout = seatLayoutFromAPI.map((row, rowIndex) => {
      return row.map((seatLabel, colIndex) => {
        // 0이면 빈 공간
        if (seatLabel === 0 || !seatLabel) {
          return null;
        }

        // 좌석명이 있으면 해당 좌석의 예매 정보 찾기
        const reservation = reservationMap.get(seatLabel);

        return {
          id: `seat-${rowIndex}-${colIndex}`,
          label: seatLabel,
          row: rowIndex,
          col: colIndex,
          // 예매 정보가 있으면 포함, 없으면 기본값
          isReserved: reservation ? reservation.isReserved : false,
          isEntered: reservation ? reservation.isEntered : false,
          userName: reservation ? reservation.userName : null,
          phone: reservation ? reservation.phone : null,
          reservationItemId: reservation ? reservation.reservationItemId : null,
          reservationId: reservation ? reservation.reservationId : null,
          userId: reservation ? reservation.userId : null,
        };
      });
    });

    return layout;
  };

  const handleRefresh = () => {
    // 새로고침
    console.log("Refreshing...");
    setSearchQuery("");
    loadSeatData();
  };

  const handleSeatClick = (seat) => {
    // 모든 좌석 클릭 가능 (예약 안 된 좌석 포함)
    // 선택된 좌석 토글
    const isSelected = selectedSeats.find((s) => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }

    setShowSelected(true);
  };

  const handleToggleSeatStatus = (seat) => {
    // 예약 안된 좌석도 입장 완료 가능하도록 제약 제거
    // 좌석 상태 토글 (입장완료 <-> 미입장) - null 체크 추가
    const newLayout = seatLayout.map((row) =>
      row.map((s) => {
        if (s && s.id === seat.id) {
          return { ...s, isEntered: !s.isEntered };
        }
        return s;
      })
    );

    setSeatLayout(newLayout);

    // 좌석 라벨이 있으면 변경사항 추적 (예약 여부 무관)
    if (seat.label) {
      // 예약된 좌석인 경우 displayData 업데이트
      if (seat.reservationItemId) {
        const newData = reservationData.map((r) => {
          if (r.reservationItemId === seat.reservationItemId) {
            return { ...r, isEntered: !r.isEntered };
          }
          return r;
        });

        const newDisplayData = displayData.map((r) => {
          if (r.reservationItemId === seat.reservationItemId) {
            return { ...r, isEntered: !r.isEntered };
          }
          return r;
        });

        setReservationData(newData);
        setDisplayData(newDisplayData);
      }

      setIsChanged(true);

      // 변경된 좌석을 좌석명 기준으로 추적
      const updatedSeat = {
        seat: seat.label,
        isEntered: !seat.isEntered,
        isReserved: seat.isReserved,
        reservationItemId: seat.reservationItemId || null,
      };
      // (debug log removed)

      // 이미 변경사항에 있는 좌석인지 확인
      const existingIndex = changedItems.findIndex(
        (item) => item.seat === seat.label
      );

      if (existingIndex >= 0) {
        // 기존 변경사항 업데이트
        const newChangedItems = [...changedItems];
        newChangedItems[existingIndex] = updatedSeat;
        setChangedItems(newChangedItems);
      } else {
        // 새로운 변경사항 추가
        setChangedItems([...changedItems, updatedSeat]);
      }
    }
    // (debug log removed)
  };

  const handleRemoveSeat = (seat) => {
    setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    if (selectedSeats.length <= 1) {
      setShowSelected(false);
    }
  };

  const handleCompleteEntry = () => {
    // 선택된 좌석들의 입장완료 처리
    const seatIds = selectedSeats
      .map((s) => s.reservationItemId)
      .filter((id) => id);
    console.log("Complete entry for:", seatIds);

    // 좌석 상태 업데이트 (null 체크 추가)
    const newLayout = seatLayout.map((row) =>
      row.map((s) => {
        // s가 null이 아니고, 선택된 좌석인 경우에만 업데이트
        if (s && selectedSeats.find((selected) => selected.id === s.id)) {
          return { ...s, isEntered: true };
        }
        return s;
      })
    );
    setSeatLayout(newLayout);

    // reservationData와 displayData 모두 업데이트 (예약된 좌석에 한해)
    if (seatIds.length > 0) {
      const newData = reservationData.map((r) => {
        if (seatIds.includes(r.reservationItemId)) {
          return { ...r, isEntered: true };
        }
        return r;
      });

      const newDisplayData = displayData.map((r) => {
        if (seatIds.includes(r.reservationItemId)) {
          return { ...r, isEntered: true };
        }
        return r;
      });

      setReservationData(newData);
      setDisplayData(newDisplayData);
    }

    // ✅ 변경된 좌석들(예약 여부와 상관없이)을 changedItems에 반영
    if (selectedSeats.length > 0) {
      setIsChanged(true);
      setChangedItems((prev) => {
        const updated = [...prev];

        selectedSeats.forEach((s) => {
          if (!s.label) return;
          const idx = updated.findIndex((item) => item.seat === s.label);
          const updatedSeat = {
            seat: s.label,
            isEntered: true,
            isReserved: s.isReserved,
            reservationItemId: s.reservationItemId || null,
          };

          if (idx >= 0) {
            updated[idx] = updatedSeat;
          } else {
            updated.push(updatedSeat);
          }
        });

        return updated;
      });
    }

    setSelectedSeats([]);
    setShowSelected(false);

    // API 호출
    alert(`${selectedSeats.length}개 좌석 입장완료 처리되었습니다.`);
  };

  // 리스트 뷰 함수들 - ManageUser 방식으로 변경
  const filteredReservations = displayData.filter((data) => {
    // 검색 필터 (예약자명만)
    const matchesSearch = data.userName.includes(searchQuery);

    // 탭 필터 적용
    if (filterTab === "all") return matchesSearch;
    if (filterTab === "entered") return data.isEntered && matchesSearch;
    if (filterTab === "notEntered") return !data.isEntered && matchesSearch;

    return matchesSearch;
  });

  const handleRowCheckbox = (reservation) => {
    const isSelected = selectedRows.find(
      (r) => r.reservationItemId === reservation.reservationItemId
    );

    if (isSelected) {
      setSelectedRows(
        selectedRows.filter(
          (r) => r.reservationItemId !== reservation.reservationItemId
        )
      );
      setSelectedNames(
        selectedNames.filter((name) => name !== reservation.userName)
      );
    } else {
      setSelectedRows([...selectedRows, reservation]);
      setSelectedNames([...selectedNames, reservation.userName]);
    }
  };

  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelectedRows(filteredReservations);
      setSelectedNames(filteredReservations.map((r) => r.userName));
    } else {
      setSelectedRows([]);
      setSelectedNames([]);
    }
  };

  const handleRemoveNameTag = (name) => {
    // 이름 태그 제거
    const updatedNames = selectedNames.filter((n) => n !== name);
    const updatedRows = selectedRows.filter((r) => r.userName !== name);
    setSelectedNames(updatedNames);
    setSelectedRows(updatedRows);
  };

  const handleToggleEntryStatus = (reservation) => {
    // 선택된 행이 있으면 모든 선택된 행의 상태를 변경
    if (selectedRows.length > 0) {
      const selectedIds = selectedRows.map((r) => r.reservationItemId);

      // displayData만 업데이트 (UI에만 반영)
      const newDisplayData = displayData.map((r) => {
        if (selectedIds.includes(r.reservationItemId)) {
          return { ...r, isEntered: !reservation.isEntered };
        }
        return r;
      });

      setDisplayData(newDisplayData);
      setIsChanged(true);

      // 변경된 항목 계산 (initialData와 비교)
      const changed = newDisplayData.filter((item) => {
        const original = initialData.find(
          (u) => u.reservationItemId === item.reservationItemId
        );
        return original && original.isEntered !== item.isEntered;
      });
      setChangedItems(changed);
      // (debug log removed)
    } else {
      // 선택된 행이 없으면 단일 행만 변경
      const newDisplayData = displayData.map((r) => {
        if (r.reservationItemId === reservation.reservationItemId) {
          return { ...r, isEntered: !r.isEntered };
        }
        return r;
      });

      setDisplayData(newDisplayData);
      setIsChanged(true);

      // 변경된 항목 계산
      const changed = newDisplayData.filter((item) => {
        const original = initialData.find(
          (u) => u.reservationItemId === item.reservationItemId
        );
        return original && original.isEntered !== item.isEntered;
      });
      setChangedItems(changed);
      // (debug log removed)
    }
  };

  const handleCancelSeat = (reservation) => {
    if (
      window.confirm(
        `${reservation.userName}님의 ${reservation.seat} 좌석을 취소하시겠습니까?`
      )
    ) {
      // displayData에서 해당 항목 제거 (UI에서만 제거)
      const newDisplayData = displayData.filter(
        (r) => r.reservationItemId !== reservation.reservationItemId
      );
      setDisplayData(newDisplayData);
      setIsChanged(true);

      // 변경된 항목 계산 - 삭제된 항목도 추적
      const changed = initialData.filter((item) => {
        // displayData에 없으면 삭제된 것
        const exists = newDisplayData.find(
          (u) => u.reservationItemId === item.reservationItemId
        );
        if (!exists) return true;

        // 상태가 변경된 것
        const displayItem = newDisplayData.find(
          (u) => u.reservationItemId === item.reservationItemId
        );
        return displayItem && displayItem.isEntered !== item.isEntered;
      });
      setChangedItems(changed);

      // 선택된 행에서도 제거
      setSelectedRows(
        selectedRows.filter(
          (r) => r.reservationItemId !== reservation.reservationItemId
        )
      );
      setSelectedNames(
        selectedNames.filter((name) => name !== reservation.userName)
      );
      // (debug log removed)
      alert("좌석이 취소되었습니다.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      // API 요청 데이터 생성 - 좌석명 기반으로 전송 (항상 seat, isEntered, isReserved만 포함)
      const checkinStatusUpdateRequest = changedItems.map((item) => {
        const isEntered = item.isEntered;
        const isReserved = isEntered ? true : item.isReserved;
        return {
          seat: item.seat,
          isEntered,
          isReserved,
        };
      });

      console.log("=== 저장 직전 변경 좌석 상태 ===");
      console.table(
        checkinStatusUpdateRequest.map((item) => ({
          seat: item.seat,
          isEntered: item.isEntered,
          isReserved: item.isReserved,
        }))
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/checkin`,
        {
          method: "PATCH",
          credentials: "include", // 세션 쿠키 자동 전송
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            showtimeId: currentShowtimeId,
            checkinStatusUpdateRequest,
          }),
        }
      );

      console.log("PATCH /checkin 응답 상태코드:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "저장 실패 - 상태코드 / 응답 본문:",
          response.status,
          errorText
        );
        throw new Error("저장에 실패했습니다.");
      }

      const result = await response.json();
      console.log("=== 저장 응답 JSON ===");
      console.log(result);
      if (result.success) {
        console.log("=== 저장 완료 - 반영된 좌석 상태(변경 요청 기준) ===");
        console.table(
          checkinStatusUpdateRequest.map((item) => ({
            seat: item.seat,
            isEntered: item.isEntered,
            isReserved: item.isReserved,
          }))
        );
        alert(`${result.data.updatedCount}개 항목이 저장되었습니다.`);

        // 저장 시 displayData를 실제 reservationData에 반영
        setReservationData(JSON.parse(JSON.stringify(displayData)));

        // 좌석 레이아웃 재조회 (저장 후 새로고침)
        loadSeatData();

        // 저장 후 초기 데이터 업데이트 및 변경사항 리셋
        setInitialData(JSON.parse(JSON.stringify(displayData)));
        setIsChanged(false);
        setChangedItems([]);

        // 실패한 항목이 있으면 알림
        if (result.data.failedIds && result.data.failedIds.length > 0) {
          alert(
            `일부 항목 저장에 실패했습니다. 실패한 ID: ${result.data.failedIds.join(
              ", "
            )}`
          );
        }
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <NavbarManager />

      <MainContent>
        {/* 상단 타이틀 섹션 */}
        <Header>
          <Title>입장 현황</Title>
          {showTimeList.length > 0 ? (
            <ShowtimeDropdown
              value={currentShowtimeId || showTimeList[0]?.showTimeId || ""}
              onChange={(e) => handleShowtimeChange(Number(e.target.value))}
            >
              {showTimeList.map((showtime) => (
                <option key={showtime.showTimeId} value={showtime.showTimeId}>
                  {showTitle || "공연명"} ·{" "}
                  {new Date(showtime.showTime).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </option>
              ))}
            </ShowtimeDropdown>
          ) : (
            <ShowtimeDropdown disabled>
              <option>회차 정보를 불러오는 중...</option>
            </ShowtimeDropdown>
          )}
        </Header>

        {/* 좌석 현황 헤더 */}
        <StatusHeader>
          <LeftControls>
            <StatusTitle>실시간 좌석 현황</StatusTitle>
            <RefreshButton onClick={handleRefresh}>
              <IoMdRefresh size={24} color="#fff" />
            </RefreshButton>
            <OnSiteButton>현장예매 좌석 관리</OnSiteButton>
          </LeftControls>

          {hasSeatData && (
            <ViewToggle>
              <ToggleOption
                $active={viewMode === "seat"}
                onClick={() => setViewMode("seat")}
              >
                좌석표
              </ToggleOption>
              <ToggleOption
                $active={viewMode === "list"}
                onClick={() => setViewMode("list")}
              >
                리스트
              </ToggleOption>
            </ViewToggle>
          )}
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
                    style={{ cursor: "pointer" }}
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
        {viewMode === "seat" && hasSeatData && (
          <>
            <SeatMapContainer>
              {seatLayout.length > 0 ? (
                <SeatMapGrid>
                  {seatLayout.map((row, rowIndex) => (
                    <SeatRow key={rowIndex}>
                      {row.map((seat, colIndex) => {
                        const isEmpty = !seat;
                        const isReserved = seat && seat.isReserved;
                        const isSelected =
                          seat && selectedSeats.some((s) => s.id === seat.id);

                        if (isEmpty) {
                          return <EmptySeat key={`${rowIndex}-${colIndex}`} />;
                        }

                        return (
                          <SeatCell
                            key={seat.id || `${rowIndex}-${colIndex}`}
                            $isReserved={isReserved}
                            $isEntered={seat.isEntered}
                            $isSelected={isSelected}
                            onClick={() => handleSeatClick(seat)}
                            onDoubleClick={() => handleToggleSeatStatus(seat)}
                          >
                            {seat.label}
                          </SeatCell>
                        );
                      })}
                    </SeatRow>
                  ))}
                </SeatMapGrid>
              ) : (
                <div style={{ fontSize: "16px", color: "#999" }}>
                  좌석 정보를 불러오는 중...
                </div>
              )}
            </SeatMapContainer>

            {/* 범례 */}
            <Legend>
              <LegendItem>
                <ColorBox color="#FFB6C1" />
                <LegendText>예약 가능</LegendText>
              </LegendItem>
              <LegendItem>
                <ColorBox color="#9E5656" />
                <LegendText>예약됨</LegendText>
              </LegendItem>
              <LegendItem>
                <ColorBox color="#FFCC00" />
                <LegendText>입장완료</LegendText>
              </LegendItem>
            </Legend>
          </>
        )}

        {/* 리스트 뷰 */}
        {viewMode === "list" && (
          <ListViewContainer>
            {/* 필터 탭 영역 */}
            <FilterTabsArea>
              <TabFilters>
                <TabButton
                  $active={filterTab === "all"}
                  onClick={() => setFilterTab("all")}
                >
                  전체
                </TabButton>
                <TabButton
                  $active={filterTab === "entered"}
                  onClick={() => setFilterTab("entered")}
                >
                  입장 완료
                </TabButton>
                <TabButton
                  $active={filterTab === "notEntered"}
                  onClick={() => setFilterTab("notEntered")}
                >
                  미입장
                </TabButton>
              </TabFilters>
            </FilterTabsArea>

            {/* 검색 영역 및 필터 태그 */}
            <SearchFilterArea>
              <InputWrapper>
                <SearchInput
                  type="text"
                  placeholder="이름 또는 전화번호로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIconStyled />
              </InputWrapper>

              {/* 선택된 이름 필터 태그 */}
              {selectedNames.length > 0 && (
                <FilterTagsContainer>
                  {selectedNames.map((name, index) => (
                    <FilterTag key={index}>
                      {name}
                      <IoMdClose
                        size={12}
                        color="#D60033"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveNameTag(name)}
                      />
                    </FilterTag>
                  ))}
                </FilterTagsContainer>
              )}
            </SearchFilterArea>

            {/* 테이블 */}
            <TableContainer>
              <Table>
                <TableHeader>
                  <HeaderRow>
                    <HeaderCell width="50px">
                      <Checkbox
                        type="checkbox"
                        onChange={(e) => handleSelectAllRows(e.target.checked)}
                        checked={
                          selectedRows.length === filteredReservations.length &&
                          filteredReservations.length > 0
                        }
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
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.reservationItemId}>
                      <TableCell>
                        <Checkbox
                          type="checkbox"
                          checked={selectedRows.some(
                            (r) =>
                              r.reservationItemId ===
                              reservation.reservationItemId
                          )}
                          onChange={() => handleRowCheckbox(reservation)}
                        />
                      </TableCell>
                      <TableCell>{reservation.seat}</TableCell>
                      <TableCell>{reservation.userName}</TableCell>
                      <TableCell>{reservation.phone}</TableCell>
                      <TableCell>
                        <StatusButtonGroup>
                          <StatusButton
                            $active={!reservation.isEntered}
                            onClick={() =>
                              !reservation.isEntered ||
                              handleToggleEntryStatus(reservation)
                            }
                          >
                            미입장
                          </StatusButton>
                          <StatusButton
                            $active={reservation.isEntered}
                            $inactive={!reservation.isEntered}
                            onClick={() =>
                              reservation.isEntered ||
                              handleToggleEntryStatus(reservation)
                            }
                          >
                            입장 완료
                          </StatusButton>
                        </StatusButtonGroup>
                      </TableCell>
                      <TableCell>
                        <CancelButton
                          onClick={() => handleCancelSeat(reservation)}
                        >
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
        <BackButton onClick={() => navigate("/manageshow")}>←이전</BackButton>
        <SaveContainer>
          <WarningText $visible={isChanged || changedItems.length > 0}>
            변경사항이 있습니다. 저장하기를 눌러 변경상태를 확정해주세요!
          </WarningText>
          <SaveButton
            onClick={handleSaveChanges}
            disabled={changedItems.length === 0}
          >
            저장하기
          </SaveButton>
        </SaveContainer>
      </BottomButtons>
    </Container>
  );
};

export default ViewEntryStatus;

const Container = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
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

const Header = styled.div`
  display: flex;
  align-self: stretch;
  gap: 30px;
`;

const Title = styled.div`
  align-self: stretch;
  font-size: 30px;
  font-weight: 500;
  padding-left: 5px;
`;

const SelectTime = styled.div`
  display: flex;
  border-radius: 15px;
  border: 1px solid var(--color-primary);
  background: #fff;
  padding: 5px 20px;
  gap: 40px;
`;

const ShowName = styled.div`
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 500;
`;

const ShowTime = styled.div`
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 500;
`;

const Time = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const ShowtimeDropdown = styled.select`
  padding: 8px 16px;
  border-radius: 15px;
  border: 1px solid var(--color-primary);
  background: ${({ $active }) => ($active ? "var(--color-primary)" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "var(--color-primary)")};
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(252, 40, 71, 0.2);
  }
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
  background-color: #fc2847;
  color: #ffffff;

  font-size: 15px;
  font-weight: 300;
  padding: 7px 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #d60033;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #d60033;
  border-radius: 20px;
  padding: 5px;
`;

const ToggleOption = styled.div`
  padding: 5px 15px;

  font-size: 20px;
  font-weight: ${(props) => (props.$active ? "500" : "300")};
  color: ${(props) => (props.$active ? "#FFFFFF" : "#d60033")};
  background-color: ${(props) => (props.$active ? "#FC2847" : "transparent")};
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active ? "#FC2847" : "rgba(252, 40, 71, 0.1)"};
  }
`;

const SelectedSeatsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #fc2847;
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
  background-color: #fff1f0;
  color: #d60033;

  font-size: 13px;
  font-weight: 300;
  border-radius: 10px;
`;

const CompleteButton = styled.button`
  padding: 3px 7px;
  background-color: #fc2847;
  color: #ffffff;

  font-size: 13px;
  font-weight: 300;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #d60033;
  }
`;

const SeatMapContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 20px;
  padding: 30px;
  overflow: auto;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SeatMapGrid = styled.div`
  display: grid;
  gap: 2px;
  width: fit-content;
  margin: auto;
`;

const SeatRow = styled.div`
  display: flex;
  gap: 2px;
`;

const SeatCell = styled.div`
  width: 28px;
  height: 20px;
  background: ${(props) => {
    // 3가지 상태: 예약안됨(핑크), 예약됨(갈색), 입장완료(노란색)
    if (props.$isEntered) return "#FFCC00"; // 입장완료: 노란색
    if (props.$isReserved) return "#9E5656"; // 예약됨: 갈색
    return "#FFB6C1"; // 예약되지 않은 좌석: 핑크색
  }};
  border: 0.5px solid #000000;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => {
    if (props.$isSelected) return 1;
    return 0.7;
  }};
  font-size: 8px;
  font-weight: 500;
  color: ${(props) => {
    if (props.$isEntered) return "#000000"; // 입장완료: 검정색
    return "#FFFFFF"; // 나머지: 흰색
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  /* 선택된 좌석 */
  ${(props) =>
    props.$isSelected &&
    `
    outline: 2px solid #FC2847;
    outline-offset: 1px;
    opacity: 1;
  `}

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const SeatButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  cursor: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const EmptySeat = styled.div`
  width: 28px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
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
  background-color: ${(props) => props.color};
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
  background-color: #fc2847;
  color: #fffffe;
  font-size: 20px;
  font-weight: 300;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #d60033;
  }
`;

const SaveContainer = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const WarningText = styled.div`
  text-align: center;
  color: #fc2847;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ disabled }) => (disabled ? "#d3d3d3" : "#fc2847")};
  color: #fffffe;
  font-size: 20px;
  font-weight: 300;
  border: none;
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#d3d3d3" : "#d60033")};
  }

  transition: all 0.3s ease;
`;

// 리스트 뷰 스타일
const ListViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FilterTabsArea = styled.div`
  border-bottom: 1px solid #787878;
  padding-bottom: 10px;
`;

const TabFilters = styled.div`
  display: flex;
  gap: 30px;
`;

const TabButton = styled.button`
  padding: 0;

  font-size: 20px;
  font-weight: ${(props) => (props.active ? "500" : "300")};
  color: ${(props) => (props.active ? "#FC2847" : "#737373")};
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -11px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${(props) => (props.active ? "#FC2847" : "transparent")};
  }

  &:hover {
    color: #fc2847;
  }
`;

const SearchFilterArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const SearchInput = styled.input`
  width: 220px;
  padding: 7px 30px 7px 10px;
  border-radius: 10px;
  border: 1px solid #c5c5c5;
  background: #fff;
  font-size: 14px;
  color: #333;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #fc2847;
    box-shadow: 0 0 0 2px rgba(252, 40, 71, 0.1);
  }
`;

const SearchIconStyled = styled(BiSearch)`
  font-size: 18px;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #aaa;
  pointer-events: none;
`;

const FilterTagsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  background-color: #fff1f0;
  color: #d60033;

  font-size: 13px;
  font-weight: 500;
  border-radius: 10px;
`;

const TableContainer = styled.div`
  margin-top: 30px;
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
  width: ${(props) => props.width || "auto"};
  padding: 15px 10px;

  font-size: 20px;
  font-weight: 300;
  color: #000000;
  text-align: center;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }

  &:hover {
    background-color: #fffefb;
  }
`;

const TableCell = styled.td`
  padding: 15px 10px;

  font-size: 20px;
  font-weight: 300;
  color: #000000;
  text-align: center;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #fc2847;
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

  ${(props) =>
    props.$active
      ? `
    background-color: #FC2847;
    color: #FFFFFE;
  `
      : `
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
  background-color: #fffefb;
  color: #121212;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;
