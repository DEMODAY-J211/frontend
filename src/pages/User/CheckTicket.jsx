import React from "react";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import Footerbtn from "../../components/Save/Footerbtn";
// s01201
export default function CheckTicket() {
  return (
    <PageWrapper>
      <HomeUserContainer>
        <NavbarUser Backmode={true} text="예매 상세 내역" />
        <TicketWrapper>
          <ShowContainer>
            <img className="poster" />
            <div className="showcontent">
              <Title>제11회 정기공연</Title>
              <Subcontent>2025.09.25 (목) 15:00</Subcontent>
              <Subcontent>서강대학교 메리홀 소극장</Subcontent>
            </div>
          </ShowContainer>
          {/* 예매정보 */}
          <Wrapper>
            <Title>예매정보</Title>
            <Content>
              <p>예매번호</p>
              <p>000000</p>
            </Content>
            <Content>
              <p>좌석번호</p>
              <p>J4,J5 (2매)</p>
            </Content>
            <Content>
              <p>예매자명</p>
              <p>강길동</p>
            </Content>
            <Content>
              <p>예매자 연락처</p>
              <p>000-0000-0000</p>
            </Content>
            <Content>
              <p>예매일시</p>
              <p>2025.09.24 (수) 22:23</p>
            </Content>
          </Wrapper>
          {/* 결제정보 */}
          <Wrapper>
            <Title>결제정보</Title>
            <Content>
              <p>결제상태</p>
              <p>승인대기중</p>
            </Content>
            <Content>
              <p>결제금액</p>
              <p>18,000원</p>
            </Content>
          </Wrapper>
          {/* 환불정보 */}
          <Wrapper>
            <Title>환불정보</Title>
            <Content>
              <p>환불 계좌</p>
              <p>우리 0000-000-000000</p>
            </Content>
            <Content>
              <p>예금주</p>
              <p>강길동</p>
            </Content>
          </Wrapper>
        </TicketWrapper>
        <Footerbtn
          buttons={[
            { text: "예매 취소", color: "red", onClick: "/" },
            { text: "좌석 변경", color: "red", onClick: "/" },
          ]}
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

const TicketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
  background: #ebebeb;
`;
const ShowContainer = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  background: #fff;

  .poster {
    width: 66px;
    height: 91px;
    border-radius: 8px;
    background: var(--tertiary, #fff1f0);
  }
  .showcontent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 5px;
    flex: 1 0 0;
  }
`;

const Wrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  background: #fff;
`;

const Title = styled.div`
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Subcontent = styled.span`
  color: #626262;
  font-size: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  color: #000;
  font-size: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;
