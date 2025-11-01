import react from "react";
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
        ticketOptionId: 1,
        ticketOptionName: "일반예매가",
        ticketOptionPrice: 9000,
      },
      {
        ticketOptionId: 2,
        ticketOptionName: "학생할인가",
        ticketOptionPrice: 8000,
      },
    ],
  },
];
export default function BottomSheet({ onClose }) {
  return (
    <Base onClose={onClose}>
      <ShowtimeSelector />
      <Footerbtn />
    </Base>
  );
}

const SelectedItem = styled.div``;
