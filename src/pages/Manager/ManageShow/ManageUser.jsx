import React from "react";
import styled from "styled-components";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineUnfoldMore } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { formatKoreanDate } from "../../../utils/dateFormat";
import SelectUserModal from "../../../components/Modal/SelectUserModal";
import ChangeUserStatusModal from "../../../components/Modal/ChangeUserStatusModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { useParams } from "react-router-dom";


const ManageUser = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

    const {showId} = useParams();
  

const [reservationData, setReservationData] = useState([]);
const [initialData, setInitialData] = useState([]); // 초기 데이터 저장





  

// 🔹 초기 데이터 불러올 때 한번만 복제해서 저장
useEffect(() => {

  const data =[
    {
      reservationId: 101,
      showtimeId: 45,
      kakaoId: 1,
      reservationNumber: "10010010",
      name: "홍길동",
      phone: "010-1234-5678",
      reservationTime: "2025-10-06T14:30:00",
      status: "입금확정",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 2,
      },
    },
    {
      reservationId: 102,
      showtimeId: 45,
      kakaoId: 2,
      reservationNumber: "10010011",
      name: "김철수",
      phone: "010-2345-6789",
      reservationTime: "2025-10-06T14:35:00",
      status: "입금대기",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 3,
      },
    },
    {
      reservationId: 103,
      showtimeId: 45,
      kakaoId: 3,
      reservationNumber: "10010012",
      name: "이영희",
      phone: "010-3456-7890",
      reservationTime: "2025-10-06T14:40:00",
      status: "환불대기",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 1,
      },
    },
    {
      reservationId: 104,
      showtimeId: 45,
      kakaoId: 4,
      reservationNumber: "10010013",
      name: "박민수",
      phone: "010-4567-8901",
      reservationTime: "2025-10-06T14:45:00",
      status: "취소완료",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 4,
      },
    },
    {
      reservationId: 105,
      showtimeId: 45,
      kakaoId: 5,
      reservationNumber: "10010014",
      name: "정수진",
      phone: "010-5678-9012",
      reservationTime: "2025-10-06T14:50:00",
      status: "입금확정",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 2,
      },
    },
  ];
    
   setReservationData(data);
  setInitialData(JSON.parse(JSON.stringify(data))); // 깊은 복사 (원본 보존)
}, []);


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





const handleSave = () => {
  // 이 자리에 API 요청 코드 들어갈 수도 있음
  console.log("저장 완료:", reservationData);
  setIsChanged(false); // ✅ 저장 후 변경상태 리셋
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

//api
// const [userlist, setUserlist] = useState([]);

// const [loading, setLoading] = useState(false);
// const [error, setError] = useState("");

//     const viewUsers = async() => {
//       try{
//         setError("");
    
//         const response = await fetch(
//          `${import.meta.env.VITE_API_URL}/manager/shows/${showId}/customers`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//               Accept: "application/json",
//               "Content-type": "application/json",
//             },
//           }
//         );
    
    
    
//         const result = await response.json();
      
//         if(!response.ok || result.success !== true) {
//           throw new Error(result.message || "예매자 리스트 조회에 실패했습니다.");
//         }
        
//         setUserlist(result.data ?? []);
//         console.log(result.data);
//       }catch(error){
//         console.error("Error fetching applied labors:", error);
//         setError(error.message);
//       }
//     };
    	


//     useEffect(() => {
//   const fetchData = async () => {
//     setLoading(true);
//     await viewUsers(); // ✅ 실제 API 호출
//     setLoading(false);
//   };

//   fetchData();
// }, [userlist]); // festivalId가 바뀌면 새로 호출

// if (loading) return <p style={{ padding: "150px" }}>불러오는 중...</p>;
// if (error) return <p style={{ padding: "150px", color: "red" }}>{error}</p>;
  return (
    <Content>
      <NavbarManager />
      <ManageUserContent>
        {/* 제목 + 시간 선택 */}
        <Header>
          <Title>예매자 관리</Title>
          <SelectTime>
            <ShowName>제21회 정기공연</ShowName>
            <Time>
              <ShowTime>2025.10.14 15:00</ShowTime>
              <MdOutlineUnfoldMore size={16} color="var(--color-primary)" />
            </Time>
          </SelectTime>
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
            placeholder="예매자 검색하기"
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

          {/* 더미데이터!! */}
          {filteredData.length > 0 ? (
            filteredData.map((data) => (
            <TableRow key={data.reservationId}>
            <Checkbox type="checkbox" checked={selectedUsers.some(u => u.reservationId === data.reservationId)}
        onChange={() => handleCheckboxChange(data)}/>

            <TableData>{data.reservationNumber}</TableData>
            <TableData>{data.name}</TableData>
            <TableData>{data.phone}</TableData>
            {/* ✅ 여기에서 formatKoreanDate 사용 */}
          <TableData>{formatKoreanDate(data.reservationTime)}</TableData>

              {/* ✅ 각 행별 상태 변경 */}
                <StatusContainer>
                  {["입금대기", "입금확정", "환불대기", "취소완료"].map(
                    (status) => (
                      <Status
                        key={status}
                        $active={data.status === status}
                        onClick={() =>
                          handleStatusChange(data.reservationId, status)
                        }
                      >
                        {status}
                      </Status>
                    )
                  )}
                </StatusContainer>

              <TableDataDetail>
                {data.detailed.ticketOptionName} ({data.detailed.ticketPrice.toLocaleString()}원) ·{" "}
            {data.detailed.quantity}매
            </TableDataDetail>
            </TableRow>
          ))
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
            selectedUsers={selectedUsers} // 선택된 사용자 전달
            onConfirm={(newStatus) => {
            setReservationData((prev) =>
                prev.map((item) =>
                selectedUsers.some(u => u.reservationId === item.reservationId)
                    ? { ...item, status: newStatus }
                    : item
                )
            );
            setIsChanged(true);
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
  font-size: 14px;
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
  grid-template-columns: 50px 100px 150px 200px 200px 350px 1fr;
  padding: 15px 10px;
  border-bottom: 1px solid #979797;
  align-items: center;

  color: #000;

  font-size: 20px;
  font-weight: 300;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 50px 100px 150px 200px 200px 350px 1fr;
  padding: 5px 10px;
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
  font-size: 18px;
  font-weight: 300;
  color: #333;
`;

const TableDataDetail = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: #333;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const Status = styled.button`
  font-size: 13px;
  display: flex;
  padding: 7px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  color: ${({ $active }) => ($active ? "#fff" : "#121212")};
  font-weight: ${({ $active }) => ($active ? "700" : "300")};

  border-radius: 10px;
  border: none;

  background-color: ${({ $active }) =>
    $active ? "var(--color-primary)" : "#fff"};
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

