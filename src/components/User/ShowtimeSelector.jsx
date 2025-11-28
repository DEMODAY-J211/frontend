import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { formatKoreanDate } from "../../utils/dateFormat";
import Footerbtn from "../Save/Footerbtn";

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
  showidx,
  setShowidx,
}) {
  const [isShowtimeOpen, setIsShowtimeOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  console.log("showtime", showtimes);
  console.log("ticketoptionlist", ticketOptionList);
  console.log("selectedoption", selectedOption);

  const handleSelectShowtime = (show, idx) => {
    console.log("선택된 회차:", show);
    setSelectedShowtime(show);
    setIsShowtimeOpen(false);
    setSelectedOption(null);
    setShowidx(idx);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    console.log("option", option);
    setIsOptionOpen(false);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const totalPrice = selectedOption
    ? selectedOption.ticketOptionPrice * quantity
    : 0;

  const handleDelete = () => {
    setSelectedShowtime(null);
    setSelectedOption(null);
    setQuantity(1);
    setIsShowtimeOpen(false);
    setIsOptionOpen(false);
    setShowidx(null);
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
              ? formatKoreanDate(selectedShowtime.showtimeStart)
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
                  {showtimes?.map((show, idx) => (
                    <DropdownItem
                      key={show.showtimeId}
                      onClick={() => handleSelectShowtime(show, idx + 1)}
                      selected={
                        selectedShowtime?.showtimeId === show.showtimeId
                      }
                    >
                      {formatKoreanDate(show.showtimeStart)}
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
                  ? `${selectedOption?.ticketOptionName} (${selectedOption?.ticketOptionPrice}원)`
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
                      {ticketOptionList.map((option, idx) => {
                        // payload용 객체 생성: 기존 option에 id 추가
                        const optionWithId = {
                          ...option, // 기존 이름, 가격 등 복사

                          // ticketOptionId: idx + 1, // idx 기반으로 id 부여 (서버 요구에 맞춰 조정)
                        };

                        return (
                          <DropdownItem
                            key={idx}
                            onClick={() => handleSelectOption(optionWithId)} // id 포함 객체 전달
                            selected={
                              selectedOption?.ticketOptionName ===
                              option.ticketOptionName
                            }
                          >
                            {option.ticketOptionName} (
                            {option.ticketOptionPrice}
                            원)
                          </DropdownItem>
                        );
                      })}
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
                <strong>{showidx}회차 </strong>
                <strong>
                  {formatKoreanDate(selectedShowtime.showtimeStart)}
                </strong>
                <strong>{selectedOption.ticketOptionName}</strong>
                <strong>{selectedOption.ticketOptionPrice}원</strong>
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
  // padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 18px;
  display: flex;
  border-radius: 20px 20px 0 0;

  h3 {
    color: #000;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;
const Wrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  align-self: stretch;
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
