import { useState, useEffect } from "react";
import styled from "styled-components";
import NavbarUser from "../../components/Navbar/NavbarUser";
import Footerbtn from "../../components/Save/Footerbtn";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RiArrowRightWideFill } from "react-icons/ri";
import { formatKoreanDate } from "../../utils/dateFormat";

const MockData = [
  {
    reservationNumber: 12345,
    showTitle: "제11회 정기공연",
    showDateTime: "2025-09-25T15:00:00",
    showLocation: "서강대학교 메리홀 소극장",
    userName: "강길동",
    ticketOption: {
      ticketOptionId: 1,
      ticketOptionName: "일반예매가",
      ticketOptionPrice: 9000,
    },
    tickets: [
      {
        ReservationItemId: 1,
        seat: {
          //STANDING 아닐 경우
          seatId: 101,
          seatNumber: "A17",
        },
        qrCode: "https://example.com/qr/booking12345_ticket1.png",
      },
      {
        ReservationItemId: 2,
        seat: {
          seatId: 102,
          seatNumber: "A8",
        },
        qrCode: "https://example.com/qr/booking12345_ticket2.png",
      },
    ],
  },
];

export default function MobileTicket() {
  const { managerId } = useParams();
  const { reservationId } = useParams();
  const [showInfo, setShowInfo] = useState(MockData[0]);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [IsOpen, setIsOpen] = useState(false);

  function handleNext() {
    setCurrentIndex((prev) => Math.min(prev + 1, showInfo.tickets.length - 1));
  }
  function handlePrev() {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }
  function openModal(qrSrc) {
    setSelectedQR(qrSrc);
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
    setSelectedQR("");
  }

  const handleCheckTicket = () => {
    navigate(`/${managerId}/checkticket/${reservationId}`);
  };
  const fetchticket = async () => {
    try {
      // const response = await fetch(
      //   `${
      //     import.meta.env.VITE_API_URL
      //   }/user/${managerId}/ticket/${reservationId}`,
      //   {
      //     method: "GET",
      //     credentials: "include",
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Credentials": "true",
      //     },
      //   }
      // );
      // if (!response.ok) {
      //   throw new Error(`HTTP error: ${response.status}`);
      // }
      // const data = await response.json();
      // if (data.success) {
      //   setShowInfo(data.data);
      //   console.log("response의 data", data);
      // }
    } catch (error) {
      console.error("예매한 공연 조회 실패:", error);
      alert("예매한 공연을 찾을 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchticket();
  }, []);
  return (
    <PageWrapper>
      <HomeUserContainer>
        <NavbarUser Backmode={true} text="모바일 티켓" />
        <TicketContainer>
          <ShowContainer>
            <h3>{showInfo.showTitle}</h3>
            <p>
              {formatKoreanDate(showInfo.showDateTime)}
              <br />
              {showInfo.showLocation}
            </p>
            <p>
              {showInfo.ticketOption.ticketOptionName} |{" "}
              {showInfo.ticketOption.ticketOptionPrice.toLocaleString()}원
            </p>
          </ShowContainer>
          QR을 통해 입장하실 수 있습니다.
          <br />
          즐거운 관람되세요!
          <QrWrapper>
            <QrContainer>
              <button
                className="buttoncontainer"
                onClick={handlePrev}
                style={{
                  visibility: currentIndex === 0 ? "hidden" : "visible",
                }}
              >
                <RiArrowLeftWideFill size="40px" />
              </button>
              <QrList index={currentIndex}>
                {showInfo.tickets.map((ticket) => {
                  return (
                    <QRItem onClick={() => openModal(ticket.qrCode)}>
                      <img src={ticket?.qrCode} alt={`QR-${currentIndex}`} />
                      {/* <div className="overlay">전체 화면으로 확인하기</div>" */}
                    </QRItem>
                  );
                })}
              </QrList>

              <button
                className="buttoncontainer"
                onClick={handleNext}
                style={{
                  visibility:
                    currentIndex === showInfo.tickets.length - 1
                      ? "hidden"
                      : "visible",
                }}
              >
                <RiArrowRightWideFill size="40px" />
              </button>
            </QrContainer>
            {/* 🔵 페이지 네비게이션 버튼 */}
            <Pagination_container>
              {showInfo.tickets.map((_, i) => (
                <div
                  key={i}
                  className={`dot ${currentIndex === i ? "active" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                />
              ))}
            </Pagination_container>
          </QrWrapper>
        </TicketContainer>
        {IsOpen && (
          <QRModal onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseBtn onClick={closeModal}>✕</CloseBtn>
              <ShowContainer>
                <h3>{showInfo.showTitle}</h3>
                <p>
                  {formatKoreanDate(showInfo.showDateTime)}
                  <br />
                  {showInfo.showLocation}
                </p>
                <p>
                  {showInfo.ticketOption.ticketOptionName} |{" "}
                  {showInfo.ticketOption.ticketOptionPrice.toLocaleString()}원
                </p>
                <p>
                  {showInfo?.userName}님의 좌석은{" "}
                  {showInfo?.tickets?.[currentIndex]?.seat?.seatNumber}
                  입니다.
                  <br />
                  즐거운 관람되세요!
                </p>
              </ShowContainer>
              <img
                src={showInfo?.tickets?.[currentIndex]?.qrCode}
                alt="QR Modal"
              />
            </ModalContent>
          </QRModal>
        )}
        <Footerbtn
          buttons={[
            {
              text: "예매 내역 확인하기",
              color: "red",
              onClick: handleCheckTicket,
            },
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

  .buttoncontainer {
    display: flex;
    aspect-ratio: 1/1;
    background: none;
    border: none;
    cursor: pointer;
  }
`;
const QrWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const Pagination_container = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
  align-items: center;
  width: 100%;
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #d1d1d1;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .dot.active {
    background-color: #555;
  }
`;
const QrList = styled.div`
  // align-items: center;
  // align-self: stretch;
  display: flex;
  width: 100%;
  overflow: hidden;
  gap: 15px;
`;

const QRItem = styled.div`
  position: relative;
  width: 260px;
  height: 260px;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 240px;
    height: 240px;
    aspect-ratio: 1/1;
    border-radius: 20px;
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
    object-fit: cover;
  }

  &::after {
    content: "전체 화면으로 확인하기";
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 20px;
    cursor: pointer;
    opacity: 0; // 초기에는 안보이게
    transition: opacity 0.3s ease; // 부드럽게 나타나도록
  }

  &:hover::after {
    opacity: 1; // hover 시 서서히 나타남
  }
`;

// 모달 스타일
const QRModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  justify-content: center;
  z-index: 1000;
  display: flex;

  padding: 20px;
  flex-direction: column;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  align-items: flex-end;
  gap: 15px;
  width: 350px;

  img {
    width: 300px;
    height: 300px;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 20px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;
