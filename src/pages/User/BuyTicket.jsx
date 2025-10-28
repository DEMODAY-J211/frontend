import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import Footerbtn from "../../components/Save/Footerbtn";
import ReservationComplete from "../../components/Modal/ReservationComplete";
// s01101
export default function BuyTicket() {
  // 공연 정보 (이전 페이지에서 전달받음)
  const [showInfo, setShowInfo] = useState({
    showName: "제11회정기공연",
    showtimeName: "1회차(15:00)",
    ticketType: "일반예매",
    quantity: 2,
    totalPrice: 18000,
  });
  // 예매 성공 팝업
  const [isComplete, setIsComplete] = useState(false);

  const handleBooking = () => {
    setIsComplete(true);
  };

  return (
    <PageWrapper>
      {isComplete && (
        <ReservationComplete onClose={() => setIsComplete(false)} />
      )}
      <HomeUserContainer>
        <NavbarUser Backmode={true} text="예매하기" />
        <BuyTicketContainer>
          {/* 공연 정보 */}
          <InfoSection>
            <ShowInfoHeader>
              <ShowTitle>{showInfo.showName}</ShowTitle>
              <ShowTime>{showInfo.showtimeName}</ShowTime>
            </ShowInfoHeader>
            <TicketInfo>
              <TicketType>
                {showInfo.ticketType}·{showInfo.quantity}매
              </TicketType>
            </TicketInfo>
          </InfoSection>
          {/* 예매 정보 */}
          <InfoSection>
            <Title>예매정보</Title>
            <Subtitle>예매 안내를 위해 전화번호를 입력해주세요.</Subtitle>
            <InputWrapper placeholder="-을 제외하고 작성해주세요." />
          </InfoSection>
          {/* 환불 정보 */}
          <InfoSection>
            <Title>환불정보</Title>
            <Subtitle>예매 취소 시 환불받을 계좌를 입력해주세요.</Subtitle>
            <Subtitle>은행</Subtitle>
            <SelectWrapper>
              <div class="selectBox ">
                <button class="label">----계좌선택----</button>
                <ul class="optionList">
                  <li class="optionItem">국민은행</li>
                  <li class="optionItem">기업은행</li>
                  <li class="optionItem">농협은행</li>
                  <li class="optionItem">신한은행</li>
                  <li class="optionItem">우체국</li>
                  <li class="optionItem">하나은행</li>
                  <li class="optionItem">우리은행</li>
                  <li class="optionItem">카카오뱅크</li>
                  <li class="optionItem">토스뱅크</li>
                </ul>
              </div>
            </SelectWrapper>
            <Subtitle>계좌번호</Subtitle>
            <InputWrapper placeholder="-을 제외하고 작성해주세요." />
            <Subtitle>예금주</Subtitle>
            <InputWrapper placeholder="(예금주) 홍길동" />
          </InfoSection>
          {/* 결제 정보 */}
          <InfoSection>
            <Title>결제정보</Title>
            <Subtitle>입금자명은 '강길동'으로 해주세요.</Subtitle>
            <TicketInfo>
              <Title>입금 계좌</Title>
              <Toggle>계좌복사</Toggle>
            </TicketInfo>
            <Subtitle>우리 0000-000-000000 (예금주) 홍길동</Subtitle>
          </InfoSection>
          {/* 판매 정보 */}
          <InfoSection className="gray">
            <Title>판매정보</Title>
            <ContentWrapper>
              <p>• 티킷타 서비스 티켓 종류 안내 </p>
              예매시에 공연 관리자가 안내하는 입금계좌로 입금하시고, 공연
              관리자의 입금 확인을 통해 티켓을 발급 받으실 수 있습니다. 공연
              관리자가 입금을 확인해야 하므로 티켓 발급까지 시간이 걸릴 수
              있습니다. 입금 확인 시 예매 확정 문자를 보내 드립니다.
              <br />
              <p>• 티켓 수령 안내 </p>
              티킷타 서비스를 통해 티켓을 예매하면 공연 시작 1시간 전, 서비스
              내에서 조회가능한 QR코드 형태로 티켓이 발급됩니다. 해당 티켓의
              QR코드는 내 예매 내역/모바일 티켓에서 조회가능합니다. 공연 입장시
              빠른 입장을 위해 QR코드를 미리 준비해 주세요
              <br />
              <p>• 티켓 환불 안내 </p>
              공연이라는 상품의 특성상 공연이 종료되면 상품 가치가 소멸합니다.
              따라서 공연 시작 이후에는 환불이 어렵습니다. 공연 시작 시간은 각
              공연 상세 페이지에서 확인하실 수 있습니다. 취소 수수료는 따로
              없습니다. 환불은 공연 종료 후 영업일 기준 4~5일 이내에 일괄
              환불됩니다.
            </ContentWrapper>
          </InfoSection>
        </BuyTicketContainer>
        <FooterWrapper>
          <InfoSection>
            <ShowInfoHeader>
              <ShowTitle>내 티켓 확인하기</ShowTitle>
              <ShowTime>{showInfo.showtimeName}</ShowTime>
            </ShowInfoHeader>
            <TicketInfo>
              <TicketType>
                {showInfo.ticketType}·{showInfo.quantity}매
              </TicketType>
              <TotalPrice>{showInfo.totalPrice.toLocaleString()}원</TotalPrice>
            </TicketInfo>
            <PriceInfo>
              총 결제금액
              <span>{showInfo.totalPrice.toLocaleString()}원</span>
            </PriceInfo>
          </InfoSection>
          <Footerbtn
            buttons={[
              {
                text: "18,000원 결제하기",
                color: "red",
                onClick: handleBooking,
              },
            ]}
            text="위 내용을 확인하였으며 결제에 동의합니다."
          />
        </FooterWrapper>
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

const BuyTicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 10px;
  flex: 1 0 0;
  background: #ebebeb;
`;

const InfoSection = styled.div`
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: stretch;

  &.gray {
    display: flex;
    padding: 10px 20px 20px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    background: #ebebeb;
  }
`;

const Toggle = styled.span`
  display: flex;
  padding: 7px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: var(--tertiary, #fff1f0);
  color: var(--secondary, #d60033);
  font-size: 13px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  cursor: pointer;
`;

const ShowInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ShowTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin: 0;
`;

const ShowTime = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #940c0c;
`;

const TicketInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TicketType = styled.span`
  font-size: 15px;
  font-weight: 300;
  color: #000000;
`;

const TotalPrice = styled.span`
  font-size: 15px;
  font-weight: 300;
  color: #000000;
`;

const InputWrapper = styled.input`
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid #c5c5c5;
  background: #fff;

  &:focus {
    border: 1px solid #c5c5c5;
    background: #fff;
  }
`;

const SelectWrapper = styled.div`
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  flex: 1 0 0;
  color: #000;
  font-size: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;

  .selectBox * {
    box-sizing: border-box;
  }
  .selectBox {
    position: relative;
    height: 35px;
    border-radius: 8px;
    border: 1px solid #c5c5c5;
    background: #fff;
    background: url("https://freepikpsd.com/media/2019/10/down-arrow-icon-png-7-Transparent-Images.png")
      calc(100% - 7px) center no-repeat;
    background-size: 20px;
    cursor: pointer;
  }

  .selectBox:after {
    content: "";
    display: block;
    width: 2px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 35px;
    background: lightcoral;
  }

  .selectBox .label {
    display: flex;
    align-items: center;
    width: inherit;
    height: inherit;
    border: 0 none;
    outline: 0 none;
    padding-left: 15px;
    background: transparent;
    cursor: pointer;
  }

  .selectBox .optionList {
    position: absolute;
    top: 28px;
    left: 0;
    width: 100%;
    background: lightcoral;
    color: #fff;
    list-style-type: none;
    padding: 0;
    border-radius: 6px;
    overflow: hidden;
    max-height: 0;
    transition: 0.3s ease-in;
  }

  .selectBox .optionList::-webkit-scrollbar {
    width: 6px;
  }
  .selectBox .optionList::-webkit-scrollbar-track {
    background: transparent;
  }
  .selectBox .optionList::-webkit-scrollbar-thumb {
    background: #303030;
    border-radius: 45px;
  }
  .selectBox .optionList::-webkit-scrollbar-thumb:hover {
    background: #303030;
  }

  .selectBox.active .optionList {
    max-height: 500px;
  }

  .selectBox .optionItem {
    border-bottom: 1px dashed rgb(170, 72, 72);
    padding: 5px 15px 5px;
    transition: 0.1s;
  }

  .selectBox .optionItem:hover {
    background: rgb(175, 93, 93);
  }

  .selectBox .optionItem:last-child {
    border-bottom: 0 none;
  }
`;

const PriceInfo = styled.div`
  display: flex;
  padding-top: 20px;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  border-top: 1px solid #909090;
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const FooterWrapper = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  box-shadow: 0 -4px 14.8px 0 rgba(0, 0, 0, 0.25);
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin: 0;
`;

const Subtitle = styled.span`
  font-size: 15px;
  font-weight: 300;
  color: #000000;
`;

const ContentWrapper = styled.div`
  display: flex;
  //   padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  text-align: justify;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.2;

  p {
    align-self: stretch;
    font-size: 15px;
    font-weight: 300;
  }
`;
