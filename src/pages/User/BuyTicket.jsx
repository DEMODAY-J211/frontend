import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import Footerbtn from "../../components/Save/Footerbtn";
import ReservationComplete from "../../components/Modal/ReservationComplete";
import { formatKoreanDate } from "../../utils/dateFormat";

// s01101
const serverUrl = import.meta.env.VITE_API_URL;
// const serverUrl = "http://15.164.218.55:8080";
const managerId = 1;

export default function BuyTicket() {
  const location = useLocation();
  const { selectedShowtime, selectedOption, quantity, showData } =
    location.state || {};
  // console.log(selectedShowtime, selectedOption, quantity, showData);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [accountBank, setAccountBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  // 예매 성공 팝업
  const [isComplete, setIsComplete] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const backOptions = [
    { id: 1, name: "국민은행" },
    { id: 2, name: "기업은행" },
    { id: 3, name: "농협은행" },
    { id: 4, name: "신한은행" },
    { id: 5, name: "하나은행" },
    { id: 6, name: "우리은행" },
    { id: 7, name: "우체국" },
    { id: 8, name: "카카오뱅크" },
    { id: 9, name: "토스뱅크" },
  ];

  const handleBooking = async () => {
    try {
      const payload = {
        phone: phoneNumber,
        refundBank: selectedBank,
        refundAccount: accountNumber,
        refundHolder: accountHolder,
      };
      console.log(payload);

      const response = await fetch(
        `${serverUrl}/user/${managerId}/booking/details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("서버 오류");
      const result = await response.json();
      console.log("서버 응답:", result);
      setIsComplete(true);
    } catch (error) {
      console.error("전송 실패:", error);
      // api 연결 후 삭제하기
      setIsComplete(true);
    }
  };

  const handleSelectOption = (option) => {
    setSelectedBank(option);
    setIsOptionOpen(false);
  };

  const totalPrice = selectedOption
    ? selectedOption.ticketoptionPrice * quantity
    : 0;
  // console.log(totalPrice);

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
              <ShowTitle>{showData.showTitle}</ShowTitle>
              <ShowTime>
                {selectedShowtime.showtimeId}회차(
                {formatKoreanDate(selectedShowtime.showtimeStart).split(" ")[1]}
                )
              </ShowTime>
            </ShowInfoHeader>
            <TicketInfo>
              <TicketType>
                {selectedOption.ticketoptionName}·{quantity}매
              </TicketType>
            </TicketInfo>
          </InfoSection>
          {/* 예매 정보 */}
          <InfoSection>
            <Title>예매정보</Title>
            <Subtitle>예매 안내를 위해 성함을 입력해주세요.</Subtitle>
            <InputWrapper
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Subtitle>예매 안내를 위해 전화번호를 입력해주세요.</Subtitle>
            <InputWrapper
              placeholder="-을 제외하고 작성해주세요."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </InfoSection>
          {/* 환불 정보 */}
          <InfoSection>
            <Title>환불정보</Title>
            <Subtitle>예매 취소 시 환불받을 계좌를 입력해주세요.</Subtitle>
            <Subtitle>은행</Subtitle>
            <Container>
              <DropdownButton onClick={() => setIsOptionOpen(!isOptionOpen)}>
                {selectedBank ? `${selectedBank.name}` : "---- 계좌선택 ----"}
                <Arrow open={isOptionOpen}>▼</Arrow>
              </DropdownButton>

              <>
                {isOptionOpen && (
                  <div key="option-list">
                    <DropdownList>
                      {backOptions.map((option) => (
                        <DropdownItem
                          key={option.id}
                          onClick={() => handleSelectOption(option)}
                          selected={selectedBank === option.id}
                        >
                          {option.name}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  </div>
                )}
              </>
            </Container>
            <Subtitle>계좌번호</Subtitle>
            <InputWrapper
              placeholder="-을 제외하고 작성해주세요."
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <Subtitle>예금주</Subtitle>
            <InputWrapper
              placeholder="홍길동"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />
          </InfoSection>
          {/* 결제 정보 */}
          {/* <InfoSection>
            <Title>결제정보</Title>
            <Subtitle>입금자명은 {"강길동"}으로 해주세요.</Subtitle>
            <TicketInfo>
              <Title>입금 계좌</Title>
              <Toggle>계좌복사</Toggle>
            </TicketInfo>
            <Subtitle>우리 0000-000-000000 (예금주) 홍길동</Subtitle>
          </InfoSection> */}
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
              <ShowTime>
                {selectedShowtime.showtimeId}회차(
                {formatKoreanDate(selectedShowtime.showtimeStart).split(" ")[1]}
                )
              </ShowTime>
            </ShowInfoHeader>
            <TicketInfo>
              <TicketType>
                {selectedOption.ticketoptionName}·{quantity}매
              </TicketType>
              <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
            </TicketInfo>
            <PriceInfo>
              총 결제금액
              <span>{totalPrice.toLocaleString()}원</span>
            </PriceInfo>
          </InfoSection>
          <Footerbtn
            buttons={[
              {
                text: `${totalPrice.toLocaleString()}원 결제하기`,
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
  padding: 9px 16px;
  // padding: 7px 35px 7px 10px; /* 오른쪽 여백을 아이콘 공간만큼 확보 */
  border-radius: 10px;
  border: 1px solid #c5c5c5;
  background: #fff;
  font-size: 14px;
  color: #000;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(252, 40, 71, 0.1);
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  font-size: 15px;
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  border: 1px solid #c5c5c5;
  background: #fff;
  font-weight: 300;

  font-family: GyeonggiMillenniumTitle;
  list-style: none;
  // overflow: hidden;
  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(252, 40, 71, 0.1);
  }
`;

const Arrow = styled.span`
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: 0.2s;
`;

const DropdownList = styled.ul`
  font-size: 15px;
  font-weight: 300;
  display: flex;
  width: 100%;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #c5c5c5;
  background: #fff;

  list-style: none;
  margin-top: 8px;
  overflow: hidden;
`;

const DropdownItem = styled.li`
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ selected }) =>
    selected ? "var(--color-tertiary)" : "transparent"};
  &:hover {
    background: #f5f5f5;
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
  gap: 5px;
  align-self: stretch;
  text-align: justify;
  font-size: 12px;
  font-weight: 300;

  p {
    align-self: stretch;
    font-size: 15px;
    font-weight: 300;
  }
`;
