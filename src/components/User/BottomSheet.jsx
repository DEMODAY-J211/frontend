import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Base from "./Base";
import ShowtimeSelector from "./ShowtimeSelector";

// const MockData = [
//   {
//     showId: 12,
//     showTitle: "제11회 정기공연",
//     showtimeList: [
//       {
//         showtimeId: 1,
//         showtimeStart: "2025-10-28T15:00",
//         availableSeats: 0,
//       },
//       {
//         showtimeId: 2,
//         showtimeStart: "2025-10-28T15:00",
//         availableSeats: 20,
//       },
//     ],
//     ticketOptionList: [
//       {
//         ticketoptionName: "학생할인",
//         ticketoptionPrice: 8000,
//       },
//       {
//         ticketoptionName: "학생할인",
//         ticketoptionPrice: 8000,
//       },
//     ],
//   },
// ];
// const managerId = 1;
const serverUrl = import.meta.env.VITE_API_URL;
// const serverUrl = "http://15.164.218.55:8080";

export default function BottomSheet({
  onClose,
  showData = {},
  onNeedModal,
  managerId,
}) {
  const navigate = useNavigate();
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleNext = async () => {
    if (!selectedShowtime || !selectedOption) {
      onNeedModal?.();
      return;
    }
    // 다음 페이지 이동 로직
    console.log("다음 페이지로 이동", {
      selectedShowtime,
      selectedOption,
      quantity,
    });

    try {
      const payload = {
        showtimeId: selectedShowtime.showtimeId,
        ticketOptionId: selectedOption.ticketOptionId,
        quantity: quantity,
      };
      console.log("payload", payload);
      const response = await fetch(
        `${serverUrl}/user/${managerId}/booking/start`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("서버 응답:", result);
      // 성공 시 다음 페이지 이동
      // navigate(`../selectseat/${showData.showId}`, {
      //   selectedShowtime,
      //   selectedOption,
      //   quantity,
      // });
      navigate(`../payment`, {
        state: {
          managerId: managerId,
          showId: showData.showId,
          selectedShowtime,
          selectedOption,
          quantity,
          showData,
        },
      });
    } catch (error) {
      console.error("예약 요청 실패:", error);
      alert("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
      // 연결하고 지우기
      // navigate(`../payment`, {
      //   state: {
      //     selectedShowtime,
      //     selectedOption,
      //     quantity,
      //     showData,
      //   },
      // });
    }
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
