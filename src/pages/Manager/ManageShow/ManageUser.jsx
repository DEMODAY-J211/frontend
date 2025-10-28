import React from "react";
import styled from "styled-components";
import NavbarManager from "../../../components/Navbar/NavbarManager";
import { useNavigate } from "react-router-dom";
import { MdOutlineUnfoldMore } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

const ManageUser = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("입금대기");
  const [activeStatus, setActiveStatus] = useState("입금대기");

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

        {/* 유저 검색 */}
        <SearchWrapper>
          <InputWrapper>
            <SearchInput type="text" placeholder="예매자 검색하기" />
            <SearchIcon />
          </InputWrapper>

          <Result>
            {/* 더미데이터 */}
            <User>
              홍길동
              <CloseIcon />
            </User>
          </Result>
        </SearchWrapper>

        {/* 탭 */}
        <TabContainer>
          <TabItem
            $active={activeTab === "입금대기"}
            onClick={() => setActiveTab("입금대기")}
          >
            입금대기
          </TabItem>
          <TabItem
            $active={activeTab === "입금확정"}
            onClick={() => setActiveTab("입금확정")}
          >
            입금확정
          </TabItem>
          <TabItem
            $active={activeTab === "환불대기"}
            onClick={() => setActiveTab("환불대기")}
          >
            환불대기
          </TabItem>
          <TabItem
            $active={activeTab === "취소완료"}
            onClick={() => setActiveTab("취소완료")}
          >
            취소완료
          </TabItem>
        </TabContainer>

        {/* 전체선택, 선택적용, 검색, 엑셀 내보내기 */}
        <ControlContainer>잡다한것들...</ControlContainer>

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
          {[...Array(15)].map((_, i) => (
            <TableRow key={i}>
              <Checkbox type="checkbox" />
              <TableData>00000000</TableData>
              <TableData>홍길동</TableData>
              <TableData>010-1234-5678</TableData>
              <TableData>2025.09.25 19:23</TableData>
              <StatusContainer>
                <Status
                  $active={activeStatus === "입금대기"}
                  onClick={() => setActiveStatus("입금대기")}
                >
                  입금대기
                </Status>
                <Status
                  $active={activeStatus === "입금완료"}
                  onClick={() => setActiveStatus("입금완료")}
                >
                  입금완료
                </Status>
                <Status
                  $active={activeStatus === "환불대기"}
                  onClick={() => setActiveStatus("환불대기")}
                >
                  환불대기
                </Status>
                <Status
                  $active={activeStatus === "취소완료"}
                  onClick={() => setActiveStatus("취소완료")}
                >
                  취소완료
                </Status>
              </StatusContainer>

              <TableDataDetail>일반예매(9000원) · 3매</TableDataDetail>
            </TableRow>
          ))}
        </TableSection>

        {/* footer */}
        <Footer>
          <PrevButton onClick={() => navigate(-1)}>←이전</PrevButton>
          <SaveContainer>
            <WarningText>
              변경사항이 있습니다. 저장하기를 눌러 변경상태를 확정해주세요!
            </WarningText>
            <SaveButton>저장하기</SaveButton>
          </SaveContainer>
        </Footer>
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
  padding: 7px 35px 7px 10px; /* 오른쪽 여백을 아이콘 공간만큼 확보 */
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
  transform: translateY(-50%);

  right: 10px;
  color: #aaa;

  pointer-events: none; /* 아이콘 눌러도 input 포커스 가능 */
`;

const Result = styled.div`
  margin-left: 10px;
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
  background-color: var(--color-tertiary);
`;

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
  font-weight: 700;
  display: flex;
  padding: 7px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: ${({ $active }) => ($active ? "#fff" : "#121212")};

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
