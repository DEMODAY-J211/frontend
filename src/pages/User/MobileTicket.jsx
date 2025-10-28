import React from "react";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import Footerbtn from "../../components/Save/Footerbtn";

export default function MobileTicket() {
  return (
    <PageWrapper>
      <HomeUserContainer>
        <NavbarUser Backmode={true} text="모바일 티켓" />
        <TicketContainer>
          <ShowContainer>
            <h3>제11회 정기공연</h3>
            <p>
              2025.09.25(목) 15:00
              <br />
              서강대학교 메리홀 소극장
            </p>
            <p>0000000(일반티켓) | 9,000원</p>
          </ShowContainer>
          <QrContainer>
            QR을 통해 입장하실 수 있습니다.
            <br />
            즐거운 관람되세요!
            <QrList />
          </QrContainer>
        </TicketContainer>
        <Footerbtn
          buttons={[{ text: "예매 내역 확인하기", color: "red", onClick: "/" }]}
        />
      </HomeUserContainer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  // background-color: #fff;
  background-color: ${(props) => (props.$dimmed ? "rgba(0,0,0,0.2)" : "#fff")};
  transition: background-color 0.3s ease;

  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const HomeUserContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // width: 393px;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 0 30px 5px rgba(0, 0, 0, 0.25);
`;

const TicketContainer = styled.div`
  display: flex;
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
  gap: 100px;
  flex: 1 0 0;
  align-self: stretch;
`;

const ShowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  align-self: stretch;
`;

const QrContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  align-self: stretch;
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  text-align: center;
`;

const QrList = styled.div``;
