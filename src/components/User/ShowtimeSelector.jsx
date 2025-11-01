import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

export default function ShowtimeSelector() {
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isShowtimeOpen, setIsShowtimeOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const showtimes = [
    { id: 1, time: "2025-11-10 18:00" },
    { id: 2, time: "2025-11-11 19:00" },
    { id: 3, time: "2025-11-12 19:00" },
  ];

  const ticketOptions = [
    { id: 1, name: "일반", price: 20000 },
    { id: 2, name: "중/고등학생", price: 10000 },
    { id: 3, name: "대학생", price: 15000 },
  ];

  const handleSelectShowtime = (show) => {
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

  const totalPrice = selectedOption ? selectedOption.price * quantity : 0;

  return (
    <Wrapper>
      <h3>예매 회차 선택</h3>
      <Container>
        <DropdownButton onClick={() => setIsShowtimeOpen(!isShowtimeOpen)}>
          {selectedShowtime ? selectedShowtime.time : "회차를 선택하세요"}
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
                {showtimes.map((show) => (
                  <DropdownItem
                    key={show.id}
                    onClick={() => handleSelectShowtime(show)}
                    selected={selectedShowtime?.id === show.id}
                  >
                    {show.time}
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
                ? `${
                    selectedOption.name
                  } (${selectedOption.price.toLocaleString()}원)`
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
                    {ticketOptions.map((option) => (
                      <DropdownItem
                        key={option.id}
                        onClick={() => handleSelectOption(option)}
                        selected={selectedOption === option.id}
                      >
                        {option.name} ({option.price.toLocaleString()}원)
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
              <strong>{selectedShowtime.id}회차</strong>
              <strong>{selectedOption.name}</strong>
              <strong>{selectedOption.price.toLocaleString()}원</strong>
            </TotalPrice>
            <QuantityContainer>
              <QtyButton onClick={() => handleQuantityChange(-1)}>-</QtyButton>
              <QuantityText>{quantity}</QuantityText>
              <QtyButton onClick={() => handleQuantityChange(1)}>+</QtyButton>
            </QuantityContainer>
            <AiOutlineClose />
          </TicketContainer>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  padding: 0 10px;
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
