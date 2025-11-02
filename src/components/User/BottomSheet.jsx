import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Base from "./Base";
import Footerbtn from "../Save/Footerbtn";
import ShowtimeSelector from "./ShowtimeSelector";

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
export default function BottomSheet({ onClose, showData = {} }) {
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleNext = () => {
    if (!selectedShowtime || !selectedOption) {
      alert("회차와 티켓 옵션을 선택해주세요!");
      return;
    }
    // 다음 페이지 이동 로직
    console.log("다음 페이지로 이동", {
      selectedShowtime,
      selectedOption,
      quantity,
    });
  };
  return (
    <Base onClose={onClose}>
      <ShowtimeSelector
        showtimes={showData.showtimeList}
        ticketOptionList={showData.ticketOptionList}
        selectedShowtime={selectedShowtime}
        setSelectedShowtime={setSelectedShowtime}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        quantity={quantity}
        setQuantity={setQuantity}
        handlebtn={handleNext}
      />
      {/* <Footerbtn onClick={handleNext} /> */}
    </Base>
  );
}

const SelectedItem = styled.div``;
