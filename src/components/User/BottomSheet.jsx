import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function BottomSheet({ onClose, onNeedModal, tempData }) {
  const navigate = useNavigate();
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [showData, setShowData] = useState(tempData);
  const { managerId, showId } = useParams();
  console.log(managerId, showId);
  const fetchOptions = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/user/${managerId}/booking/${showData.showId}/reserveInfo`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("option 조회 Data", result);
      setShowData(result.data);

      if (result.success) {
        return result.data; // 🔥 데이터 return 추가
      }
    } catch (error) {
      console.error("공연 상세정보 조회 실패:", error);
      alert("해당 공연 상세정보를 찾을 수 없습니다.");
    }
    return null;
  };

  const [options, setOptions] = useState(null);
  useEffect(() => {
    const loadOptions = async () => {
      const tmp = await fetchOptions();
      setOptions(tmp);
    };

    loadOptions();
  }, []); // 최초 1회만 실행

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
      // console.log("서버응답 selec", result.data.saleMethod);
      if (tempData.saleMethod === "SELECTBYUSER") {
        navigate(
          `/${managerId}/selectseat/${tempData.showId}/${selectedShowtime.showtimeId}`,
          {
            state: {
              selectedShowtime,
              selectedOption,
              quantity,
              showData,
            },
          }
        );
      } else {
        navigate(`/${managerId}/payment/${showData.showId}`, {
          state: {
            selectedShowtime,
            selectedOption,
            quantity,
            showData,
          },
        });
      }
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
  console.log("showtickeoptionist", showData.ticketOptionList);
  console.log("options", options?.ticketOptionList);
  return (
    <Base onClose={onClose}>
      {options && (
        <ShowtimeSelector
          showtimes={options.showtimeList}
          ticketOptionList={options.ticketOptionList}
          selectedShowtime={selectedShowtime}
          setSelectedShowtime={setSelectedShowtime}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          quantity={quantity}
          setQuantity={setQuantity}
          handlebtn={handleNext}
        />
      )}
      {/* <Footerbtn onClick={handleNext} /> */}
    </Base>
  );
}
