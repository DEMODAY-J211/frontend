import React, { useEffect } from "react";
import styled from "styled-components";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { formatKoreanDate } from "../../../utils/dateFormat";
import SelectUserModal from "../../../components/Modal/SelectUserModal";
import ChangeUserStatusModal from "../../../components/Modal/ChangeUserStatusModal";
import * as XLSX from "xlsx";

import { useParams } from "react-router-dom";

import { useReservationData } from "./UseReservationData";


const ManageUser = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentShowtimeId, setCurrentShowtimeId] = useState(null);

  const { showId } = useParams();

  const {
    reservationData,
    setReservationData,
    initialData,
    showTitle,
    showTimeList,
    isLoading,
    error
  } = useReservationData(showId, currentShowtimeId);




  // ✅ 검색 기능
    const filteredData = reservationData.filter((data) => {
    const matchesSearch =
        data.name.includes(searchQuery) || data.phone.includes(searchQuery);

    if (activeTab === "전체") return matchesSearch;
    return data.status === activeTab && matchesSearch;
    });


  // ✅ 체크박스 선택
  const handleCheckboxChange = (user) => {
    setSelectedUsers((prev) => {
      if (prev.find((u) => u.reservationId === user.reservationId)) {
        return prev.filter((u) => u.reservationId !== user.reservationId);
      } else {
        return [...prev, user];
      }
    });
  };

  // ✅ 전체 선택
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredData);
    } else {
      setSelectedUsers([]);
    }
  };

  const [isChanged, setIsChanged] = useState(false);

// 1️⃣ 초기 상태 저장

const [changedUsers, setChangedUsers] = useState([]);

// 2️⃣ 상태 변경 함수
const handleStatusChange = (id, newStatus) => {
  const updatedData = reservationData.map((item) => {
    if (selectedUsers.length === 0 && item.reservationId === id) {
      return { ...item, status: newStatus };
    }
    if (selectedUsers.some((u) => u.reservationId === item.reservationId)) {
      return { ...item, status: newStatus };
    }
    return item;
  });

  setReservationData(updatedData);
  setIsChanged(true);

  // 3️⃣ changedUsers 계산: 초기값과 다른 것만
  const changed = updatedData.filter((item) => {
    const original = initialData.find(
      (u) => u.reservationId === item.reservationId
    );
    return original.status !== item.status;
  });

  setChangedUsers(changed);

};

  console.log(changedUsers);





const handleSave = async () => {
  if (changedUsers.length === 0) {
    alert("변경된 내용이 없습니다.");
    return;
  }

  // // 한글 상태를 영어로 매핑
  // const statusToEnglish = {
  //   "입금대기": "PENDING_PAYMENT",
  //   "입금확정": "CONFIRMED",
  //   "입금확인": "CONFIRMED", // 백엔드에서 입금확인으로 오는 경우도 처리
  //   "환불대기": "PENDING_REFUND",
  //   "취소완료": "CANCELED"
  // };

  try {
    // changedUsers에서 변경된 예매자 정보만 추출
    const changedReservations = changedUsers.map(reservation => ({
      reservationId: reservation.reservationId,
      name: reservation.name,
      status: reservation.status,
      isReserved: reservation.isReserved
    }));

    console.log('=== PATCH 요청 데이터 ===');
    console.log('변경된 예매자 수:', changedReservations.length);
    console.log('요청 데이터:', { reservations: changedReservations });

    // Query parameter 구성
    const queryParams = currentShowtimeId ? `?showtimeId=${currentShowtimeId}` : '';

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/customers${queryParams}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservations: changedReservations
        })
      }
    );

    const result = await response.json();

    console.log('=== PATCH 응답 ===');
    console.log('응답 데이터:', result);

    if (!response.ok || result.success !== true) {
      throw new Error(result.message || '예매 상태 변경 실패');
    }

    const { updatedCount, failedIds = [] } = result.data;

    if (failedIds.length > 0) {
      alert(`일부 예매 정보 업데이트에 실패했습니다.\n성공: ${updatedCount}건\n실패 ID: ${failedIds.join(', ')}`);
    } else {
      alert(`${updatedCount}건의 예매 정보가 성공적으로 업데이트되었습니다.`);
    }

    // 변경 상태 초기화
    setIsChanged(false);
    setChangedUsers([]);

    // 데이터 새로고침 - currentShowtimeId를 토글해서 useEffect 재실행
    setCurrentShowtimeId(prev => prev === null ? prev : prev);

  } catch (error) {
    console.error('예매 상태 변경 중 오류:', error);
    alert(`저장 실패: ${error.message}`);
  }
};

const handleExportExcel = () => {
  // 1. 내보낼 데이터 선택 (선택된 유저가 있으면 선택된 유저, 없으면 전체)
  const dataToExport = selectedUsers.length > 0 ? selectedUsers : filteredData;

  // 2. 엑셀용 데이터 형식 맞추기
  const excelData = dataToExport.map((item) => ({
    "예매번호": item.reservationNumber,
    "이름": item.name,
    "전화번호": item.phone,
    "예매 시간": formatKoreanDate(item.reservationTime),
    "예매 현황": item.status,
    "티켓 종류": item.detailed.ticketOptionName,
    "티켓 가격": item.detailed.ticketPrice,
    "수량": item.detailed.quantity,
  }));

  // 3. 내보낸 시점 추가 (맨 위 행으로)
  const exportTime = new Date();
  const exportTimeStr = `${exportTime.getFullYear()}-${String(exportTime.getMonth() + 1).padStart(2, '0')}-${String(exportTime.getDate()).padStart(2, '0')} ${String(exportTime.getHours()).padStart(2,'0')}:${String(exportTime.getMinutes()).padStart(2,'0')}:${String(exportTime.getSeconds()).padStart(2,'0')}`;
  
  excelData.unshift({ "예매번호": `엑셀 내보내기 시점: ${exportTimeStr}` });

  // 4. 워크북 생성
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "예매자 관리");

  // 5. 파일로 저장
  const safeTimeStr = exportTimeStr.replace(/:/g, '-');
XLSX.writeFile(workbook, `예매자관리_${safeTimeStr}.xlsx`);

};


const [showSelectUserModal, setShowSelectUserModal] = useState(false);
const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);

// 모달 열기
const openModal = () => {
  if (selectedUsers.length === 0) {
    alert("상태를 변경할 예매자를 선택해주세요.");
    return;
  }
  setShowSelectUserModal(true);
};


// 모달 닫기
const closeModal = () => {
setShowSelectUserModal(false);
};

const openSaveModal = () => {
  setShowChangeStatusModal(true);
};


// 모달 닫기
const closeSaveModal = () => {
setShowChangeStatusModal(false);
};

// 회차 선택 핸들러
  const handleShowtimeChange = (showtimeId) => {
    setCurrentShowtimeId(showtimeId);
    setSelectedUsers([]); // 회차 변경 시 선택 초기화
  };

  useEffect(() => {
  if (showTimeList.length > 0 && currentShowtimeId === null) {
    setCurrentShowtimeId(showTimeList[0].showTimeId);
  }
}, [showTimeList]);


  // 로딩 및 에러 처리
  if (isLoading) {
    return (
      <Content>
        <NavbarManager />
        <ManageUserContent>
          <div style={{ padding: '100px', textAlign: 'center', fontSize: '20px' }}>
            불러오는 중...
          </div>
        </ManageUserContent>
      </Content>
    );
  }

  if (error) {
    return (
      <Content>
        <NavbarManager />
        <ManageUserContent>
          <div style={{ padding: '100px', textAlign: 'center', fontSize: '20px', color: 'red' }}>
            {error}
          </div>
        </ManageUserContent>
      </Content>
    );
  }

  return (
    <Content>
      <NavbarManager />
      <ManageUserContent>
        {/* 제목 + 시간 선택 */}
        <Header>
          <Title>예매자 관리</Title>
          {showTimeList && showTimeList.length > 0 && (
  <ShowtimeDropdown
 
    value={currentShowtimeId || showTimeList[0].showTimeId}
    onChange={(e) => handleShowtimeChange(Number(e.target.value))}
  >
    {showTimeList.map((showtime) => (
      <option key={showtime.showTimeId} value={showtime.showTimeId}>
        <h2>{showTitle}&nbsp;&nbsp;&nbsp;&nbsp;</h2>
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
)}

        </Header>


        {/* 탭 */}
        <TabContainer>
          {["전체", "입금대기", "입금확정", "환불대기", "취소완료"].map(
            (tab) => (
              <TabItem
                key={tab}
                $active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </TabItem>
            )
          )}
        </TabContainer>

        {/* 유저 검색 */}
        <SearchWrapper>
          <InputWrapper>
            <SearchInput
            type="text"
            placeholder="이름 또는 전화번호로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />

            <SearchIcon />
          </InputWrapper>

          <Result>
            {selectedUsers.map((user) => (
            <User key={user.reservationId}>
            {user.name}
            <CloseIcon onClick={() => handleCheckboxChange(user)} />
            </User>
  ))}
          </Result>
        </SearchWrapper>

        {/* 전체선택, 선택적용, 검색, 엑셀 내보내기 */}
        <ControlContainer>
            <ControlLeft>
            <Label>
                  <BoxLabel>
                    <CtrlCheckbox
                    type="checkbox"
                    checked={selectedUsers.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    />
                </BoxLabel>전체 선택 
            </Label>

            <Btn onClick={openModal}>선택 적용하기</Btn>
            </ControlLeft>

            <Btn onClick={handleExportExcel}>Excel 내보내기</Btn>
        </ControlContainer>

        {/* 예매자 테이블 영역 */}
        <TableSection>
          <TableHeader>
            <ColumnTitle></ColumnTitle>
            <ColumnTitle>예매번호</ColumnTitle>
            <ColumnTitle>이름</ColumnTitle>
            <ColumnTitle>전화번호</ColumnTitle>
            <ColumnTitle>예매 시간</ColumnTitle>
            <ColumnTitle>예매 현황</ColumnTitle>
            <ColumnTitle>상세 내역</ColumnTitle>
          </TableHeader>

          {/* 예매자 데이터 */}
          {filteredData.length > 0 ? (
            filteredData.map((data, index) => {
              // 각 예매자의 상태 로그
              if (index === 0) {
                console.log('=== 렌더링 중인 예매자 데이터 (첫번째) ===');
                console.log('예매자 상태:', data.status);
                console.log('전체 데이터:', data);
              }

              return (
                <TableRow key={data.reservationId}>
                  <Checkbox
                    type="checkbox"
                    checked={selectedUsers.some(u => u.reservationId === data.reservationId)}
                    onChange={() => handleCheckboxChange(data)}
                  />

                  <TableData>{data.reservationNumber}</TableData>
                  <TableData>{data.name}</TableData>
                  <TableData>{data.phone}</TableData>
                  <TableData>{formatKoreanDate(data.reservationTime)}</TableData>

                  {/* ✅ 각 행별 상태 변경 */}
                  <StatusContainer>
                    {["입금대기", "입금확정", "환불대기", "취소완료"].map((status) => {
                      const isActive = data.status === status;
                      if (index === 0) {
                        console.log(`상태버튼 "${status}": ${isActive ? '활성' : '비활성'}`);
                      }
                      return (
                        <Status
                          key={status}
                          $active={isActive}
                          onClick={() => handleStatusChange(data.reservationId, status)}
                        >
                          {status}
                        </Status>
                      );
                    })}
                  </StatusContainer>

                  <TableDataDetail>
                    {data.detailed.ticketOptionName} ({data.detailed.ticketPrice.toLocaleString()}원) ·{" "}
                    {data.detailed.quantity}매
                  </TableDataDetail>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <NoDataRow>검색 결과가 없습니다.</NoDataRow>
            </TableRow>
          )}
        </TableSection>

     

        {/* footer */}
        <Footer>
          <PrevButton onClick={() => navigate(-1)}>←이전</PrevButton>
          
            <SaveContainer>
           <WarningText $visible={isChanged && changedUsers.length > 0}>
            변경사항이 있습니다. 저장하기를 눌러 변경상태를 확정해주세요!
            </WarningText>


            <SaveButton
                onClick={openSaveModal}
                disabled={!isChanged || changedUsers.length === 0}
            >
                저장하기
            </SaveButton>

            </SaveContainer>
        
        </Footer>

        {showSelectUserModal && (
        <SelectUserModal
    onClose={closeModal}
    selectedUsers={selectedUsers} 
    onConfirm={(newStatus) => {
        selectedUsers.forEach(user => handleStatusChange(user.reservationId, newStatus));
        setShowSelectUserModal(false);
    }}
/>

        )}
        {showChangeStatusModal && (
        <ChangeUserStatusModal
            onClose={closeSaveModal}
            changedUsers={changedUsers}
            onConfirm={(newStatus) => {
            handleStatusChange(null, newStatus);
            handleSave();
            setShowChangeStatusModal(false);
            }}
        />
        )}




      </ManageUserContent>
    </Content>
  );
};

export default ManageUser;

/* ---------------- Styled Components ---------------- */

const Content = styled.div``;

const ManageUserContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 100px;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  gap: 20px;
`;

/* ---------------- 제목 + 시간 ---------------- */

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

const ShowtimeSelectWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const ShowtimeButton = styled.button`
  padding: 8px 16px;
  border-radius: 15px;
  border: 1px solid var(--color-primary);
  background: ${({ $active }) => ($active ? 'var(--color-primary)' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : 'var(--color-primary)')};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-tertiary)')};
    transform: translateY(-2px);
  }
`;

const ShowtimeDropdown = styled.select`
  padding: 8px 16px;
  border-radius: 15px;
  border: 1px solid var(--color-primary);
    background: ${({ $active }) => ($active ? 'var(--color-primary)' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : 'var(--color-primary)')};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(252, 40, 71, 0.2);
  }
`;

/* ---------------- 검색 ---------------- */

const SearchWrapper = styled.div`
  align-self: stretch;
  display: flex;
  justify-content: flex-start;
`;

const SearchInput = styled.input`
  width: 220px;
  padding: 7px 30px 7px 10px; /* 오른쪽 여백 30px 확보 */

  border-radius: 10px;
  border: 1px solid #c5c5c5;
  background: #fff;
  font-size: 16px;
  color: #333;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(252, 40, 71, 0.1);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const SearchIcon = styled(BiSearch)`
  font-size: 18px;
  position: absolute;
  top: 50%;
  right: 10px; /* input 안쪽에서 10px 떨어진 위치 */
  transform: translateY(-50%);
  color: #aaa;
  pointer-events: none;
`;


const Result = styled.div`
  margin-left: 10px;
  display: flex;
  gap: 10px;
`;

const User = styled.div`
  display: flex;
  padding: 7px 10px;
  justify-content: center;
  align-items: center;
  gap: 5px;

  border-radius: 10px;
  background: var(--color-tertiary);
  color: var(--color-primary);
`;

const CloseIcon = styled(AiOutlineClose)``;

const NoDataRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;       /* grid 대신 전체 폭 사용 */
  padding: 20px 0;
  font-size: 18px;
  color: #333;
  grid-column: span 7;  /* 기존 TableRow의 grid span 제거 */
`;


/* ---------------- 탭 ---------------- */
const TabContainer = styled.div`
  display: flex;
  align-self: stretch;
  gap: 5px;

  border-bottom: 1px solid #787878;
`;

const TabItem = styled.div`
  padding: 10px 10px;
  font-size: 20px;
  cursor: pointer;

  color: ${({ $active }) => ($active ? "var(--color-primary)" : "#737373")};
  border-bottom: ${({ $active }) =>
    $active ? "2px solid var(--color-primary)" : "2px solid transparent"};
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

/* ---------------- 전체선택, 선택적용, 검색, 엑셀내보내기 ---------------- */
const ControlContainer = styled.div`
  height: 30px;
  align-self: stretch;
  justify-content: space-between;
  display: flex;
  
`;

const ControlLeft = styled.div`
    display: flex;
    gap: 23px;
`

const CtrlCheckbox = styled.input`
    width: 16px;
    height: 16px;

`

const BoxLabel = styled.div`
    padding: 4px;
    display: flex;
`

const Label = styled.div`
    font-size: 20px;
    font-weight: 200;
    display: flex;
    align-items: center;
    gap: 7px;
    
`

const Btn = styled.button`
    display: flex;
    padding: 7px 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 10px;
    border: none;
    background: var(--color-primary);
    color: #FFFFFE;
    
    font-size: 13px;
    font-weight: 300;
    cursor: pointer;
`

/* ====================== Table Section ====================== */

const TableSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 50px 120px 100px 150px 180px 400px 200px;
  padding: 15px 10px;
  border-bottom: 1px solid #979797;
  align-items: center;

  color: #000;

  font-size: 20px;
  font-weight: 300;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 50px 120px 100px 150px 180px 400px 200px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  align-items: center;

  &:hover {
    background-color: #fafafa;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  
`;

const ColumnTitle = styled.div`
  font-size: 16px;
  color: #333;
`;

const TableData = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TableDataDetail = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Status = styled.button`
  font-size: 11px;
  display: flex;
  padding: 5px 8px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  color: ${({ $active }) => ($active ? "#fff" : "#121212")};
  font-weight: ${({ $active }) => ($active ? "700" : "300")};

  border-radius: 8px;
  border: none;

  background-color: ${({ $active }) =>
    $active ? "var(--color-primary)" : "#f0f0f0"};

  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? "#d63232" : "#e0e0e0"};
  }
`;


/* ====================== Footer  ====================== */

const Footer = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
`;

const WarningText = styled.div`
  text-align: center;
  color: var(--color-primary);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const PrevButton = styled.button`
  background-color: var(--color-primary);
  color: #fffffe;
  border: none;

  border-radius: 20px;
  font-size: 15px;
  font-weight: 300;
  cursor: pointer;

  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const SaveContainer = styled.div`
  display: flex;
  gap: 30px;
`;

const SaveButton = styled.button`
  background-color: ${({ disabled }) =>
    disabled ? "#d3d3d3" : "var(--color-primary)"};
  color: #fffffe;
  border: none;

  border-radius: 20px;
  font-size: 15px;
  font-weight: 300;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  transition: all 0.3s ease;


`;


