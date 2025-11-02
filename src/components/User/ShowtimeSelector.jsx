import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { formatKoreanDate } from "../../utils/dateFormat";
import Footerbtn from "../Save/Footerbtn";
const MockData = [
  {
    showId: 12,
    showTitle: "제11회 정기공연",
    showtimeList: [
      {
        showtimeId: 1,
        showtimeStart: "2025-10-28T15:00",
        availableSeats: 0,
      },
      {
        showtimeId: 2,
        showtimeStart: "2025-10-28T15:00",
        availableSeats: 20,
      },
    ],
    ticketOptionList: [
      {
        ticketoptionName: "학생할인",
        ticketoptionPrice: 8000,
      },
      {
        ticketoptionName: "학생할인",
        ticketoptionPrice: 8000,
      },
    ],
  },
];

export default function ShowtimeSelector({
  showtimes = [],
  ticketOptionList = [],
  selectedShowtime,
  setSelectedShowtime,
  selectedOption,
  setSelectedOption,
  quantity,
  setQuantity,
  handlebtn,
}) {
  const [isShowtimeOpen, setIsShowtimeOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  console.log("showtime", showtimes);
  console.log("ticketoptionlist", ticketOptionList);
  console.log("selectedoption", selectedOption);
  // const showtimes = [
  //   { id: 1, time: "2025-11-10 18:00" },
  //   { id: 2, time: "2025-11-11 19:00" },
  //   { id: 3, time: "2025-11-12 19:00" },
  // ];

  // const ticketOptions = [
  //   { id: 1, name: "일반", price: 20000 },
  //   { id: 2, name: "중/고등학생", price: 10000 },
  //   { id: 3, name: "대학생", price: 15000 },
  // ];

  const handleSelectShowtime = (show) => {
    console.log("선택된 회차:", show);
    setSelectedShowtime(show);
    setIsShowtimeOpen(false);
    setSelectedOption(null);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsOptionOpen(false);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const totalPrice = selectedOption
    ? selectedOption.ticketoptionPrice * quantity
    : 0;

  const handleDelete = () => {
    setSelectedShowtime(null);
    setSelectedOption(null);
    setQuantity(1);
    setIsShowtimeOpen(false);
    setIsOptionOpen(false);
  };

  useEffect(() => {
    console.log("selectedShowtime 변경됨:", selectedShowtime);
  }, [selectedShowtime]);

  return (
    <TopWrapper>
      <Wrapper>
        <h3>예매 회차 선택</h3>
        <Container>
          <DropdownButton onClick={() => setIsShowtimeOpen(!isShowtimeOpen)}>
            {selectedShowtime
              ? selectedShowtime.showtimeStart
              : "회차를 선택하세요"}
            <Arrow open={isShowtimeOpen}>▼</Arrow>
          </DropdownButton>

          <AnimatePresence initial={false}>
            {isShowtimeOpen && (
              <motion.div
                key="showtime-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <DropdownList>
                  {showtimes?.map((show) => (
                    <DropdownItem
                      key={show.showtimeId}
                      onClick={() => handleSelectShowtime(show)}
                      selected={
                        selectedShowtime?.showtimeId === show.showtimeId
                      }
                    >
                      {show.showtimeStart}
                    </DropdownItem>
                  ))}
                </DropdownList>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>

        {/*  티켓 옵션 선택 */}
        {selectedShowtime && (
          <>
            <h3 style={{ marginTop: "16px" }}>티켓 옵션 선택</h3>
            <Container>
              <DropdownButton onClick={() => setIsOptionOpen(!isOptionOpen)}>
                {selectedOption
                  ? `${selectedOption?.ticketoptionName} (${selectedOption?.ticketoptionPrice}원)`
                  : "티켓 옵션을 선택하세요"}
                <Arrow open={isOptionOpen}>▼</Arrow>
              </DropdownButton>

              <AnimatePresence initial={false}>
                {isOptionOpen && (
                  <motion.div
                    key="option-list"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <DropdownList>
                      {ticketOptionList.map((option, idx) => (
                        <DropdownItem
                          key={idx}
                          onClick={() => handleSelectOption(option)}
                          selected={
                            selectedOption?.ticketoptionName ===
                            option.ticketoptionName
                          }
                        >
                          {option.ticketoptionName} ({option.ticketoptionPrice}
                          원)
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  </motion.div>
                )}
              </AnimatePresence>
            </Container>
          </>
        )}
        {selectedShowtime && selectedOption && (
          <>
            <h3 style={{ marginTop: "16px" }}>매수 선택</h3>
            <TicketContainer>
              <TotalPrice>
                <strong>{selectedShowtime.showtimeId}회차</strong>
                <strong>{selectedOption.ticketoptionName}</strong>
                <strong>{selectedOption.ticketoptionPrice}원</strong>
              </TotalPrice>
              <QuantityContainer>
                <QtyButton onClick={() => handleQuantityChange(-1)}>
                  -
                </QtyButton>
                <QuantityText>{quantity}</QuantityText>
                <QtyButton onClick={() => handleQuantityChange(1)}>+</QtyButton>
              </QuantityContainer>
              <AiOutlineClose
                onClick={handleDelete}
                style={{ cursor: "pointer" }}
              />
            </TicketContainer>
          </>
        )}
      </Wrapper>
      <Footerbtn
        buttons={[{ text: "예매하기", color: "red", onClick: handlebtn }]}
      />
    </TopWrapper>
  );
}
const TopWrapper = styled.div`
  width: 80%;
  min-width: 375px;
  max-width: 430px;
  width: 100vw;
  background: #fff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 18px;
  display: flex;
  border-radius: 20px 20px 0 0;
  background: #fff;

  h3 {
    color: #000;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;
const Wrapper = styled.div`
  // display: flex;
  // padding: 0 10px;
  // flex-direction: column;
  // align-items: flex-start;
  // gap: 15px;
  // align-self: stretch;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Arrow = styled.span`
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: 0.2s;
`;

const DropdownList = styled.ul`
  display: flex;
  width: 100%;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #c5c5c5;
  background: #fff;

  list-style: none;
  margin-top: 8px;
  padding: 0;
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

const QuantityContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  align-self: stretch;
  border-radius: 10px;
  background: #fff;
`;

const QtyButton = styled.button`
  width: 36px;
  height: 36px;
  font-size: 20px;
  border: 1px solid var(--color-tertiary);
  border-radius: 8px;
  background: var(--color-tertiary);
  cursor: pointer;
`;

const QuantityText = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const TotalPrice = styled.div`
  font-size: 16px;
  text-align: right;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
  gap: 2px;
`;

const TicketContainer = styled.div`
  display: flex;
  padding: 10px 20px;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid var(--color-secondary);
`;
