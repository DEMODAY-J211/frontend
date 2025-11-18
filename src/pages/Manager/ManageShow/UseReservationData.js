import { useEffect, useState } from "react";

export const useReservationData = () => {
  const [reservationData, setReservationData] = useState([]);
  const [initialData, setInitialData] = useState([]);

useEffect(() => {

  const data =[
    {
      reservationId: 101,
      showTimeId: 45,
      kakaoId: 1,
      reservationNumber: "10010010",
      name: "홍길동",
      phone: "010-1234-5678",
      reservationTime: "2025-10-06T14:30:00",
      status: "입금확정",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 2,
      },
    },
    {
      reservationId: 102,
      showTimeId: 45,
      kakaoId: 2,
      reservationNumber: "10010011",
      name: "김철수",
      phone: "010-2345-6789",
      reservationTime: "2025-10-06T14:35:00",
      status: "입금대기",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 3,
      },
    },
    {
      reservationId: 103,
      showTimeId: 45,
      kakaoId: 3,
      reservationNumber: "10010012",
      name: "이영희",
      phone: "010-3456-7890",
      reservationTime: "2025-10-06T14:40:00",
      status: "환불대기",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 1,
      },
    },
    {
      reservationId: 104,
      showTimeId: 45,
      kakaoId: 4,
      reservationNumber: "10010013",
      name: "박민수",
      phone: "010-4567-8901",
      reservationTime: "2025-10-06T14:45:00",
      status: "취소완료",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 4,
      },
    },
    {
      reservationId: 105,
      showTimeId: 45,
      kakaoId: 5,
      reservationNumber: "10010014",
      name: "정수진",
      phone: "010-5678-9012",
      reservationTime: "2025-10-06T14:50:00",
      status: "입금확정",
      isReserved: true,
      detailed: {
        ticketOptionId: 3,
        ticketOptionName: "일반예매",
        ticketPrice: 9000,
        quantity: 2,
      },
    },
  ];
    
   setReservationData(data);
  setInitialData(JSON.parse(JSON.stringify(data))); // 깊은 복사 (원본 보존)
}, []);

  return {
    reservationData,
    setReservationData,
    initialData,
  };
};
